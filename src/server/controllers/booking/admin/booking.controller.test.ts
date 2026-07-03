import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../utils/api/database/client';
import { generateAccessToken } from '../../../../utils/api/token';
import { verifyAdmin } from '@middleware/verifyAdmin';
import { ROLE_NAMES } from '@customTypes/enum/roles';
import { adminBookingController } from './booking.controller';

let customerId: number;
let adultCategoryId: number;
let customerToken: string;
let adminToken: string;

const makeReq = (url: string, init: { method?: string }, authToken: string) =>
  new NextRequest(`http://localhost${url}`, {
    method: init.method ?? 'GET',
    headers: { cookie: `access_token=${authToken}` },
  });

const ctx = (bookingId: number) => ({ params: Promise.resolve({ bookingId: String(bookingId) }) });

const seedBooking = (status: string) =>
  prisma.booking.create({
    data: {
      reference: `ZBL-TEST-${status}`,
      user_id: customerId,
      status,
      start_at: new Date('2099-06-15'),
      end_at: new Date('2099-06-15'),
      duration: 1,
      subtotal: 25,
      discount: 0,
      total_paid: 25,
      ticket: {
        create: [
          {
            reservation_number: `ZBL-TEST-${status}-1`,
            unit_price: 25,
            status: status === 'confirmed' ? 'valid' : 'pending',
            validity_date: new Date('2099-06-15'),
            category_id: adultCategoryId,
          },
        ],
      },
    },
  });

beforeAll(async () => {
  await prisma.role.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: 'CUSTOMER' } });
  await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: ROLE_NAMES.ADMIN },
  });
});

beforeEach(async () => {
  const customer = await prisma.user.create({
    data: {
      first_name: 'Rick',
      last_name: 'Grimes',
      email: 'rick@test.com',
      password: 'x',
      role_id: 1,
    },
  });
  customerId = customer.id;

  const admin = await prisma.user.create({
    data: {
      first_name: 'Admin',
      last_name: 'Zbl',
      email: 'admin@test.com',
      password: 'x',
      role_id: 2,
    },
  });

  const adult = await prisma.ticket_category.create({
    data: { label: 'Adulte', reduction: 0, is_default: true, display_order: 1 },
  });
  adultCategoryId = adult.id;

  customerToken = await generateAccessToken(customerId, 1);
  adminToken = await generateAccessToken(admin.id, 2);
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ─── cancelBooking ───────────────────────────────────────────────────────────────

describe('adminBookingController.cancelBooking', () => {
  test("it should cancel any user's pending booking and cascade to its tickets", async () => {
    //ARRANGE
    const booking = await seedBooking('pending');

    //ACT
    const res = await adminBookingController.cancelBooking(
      makeReq(`/api/booking/${booking.id}`, { method: 'DELETE' }, adminToken),
      ctx(booking.id)
    );

    //ASSERT
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe('Booking cancelled');
    const updated = await prisma.booking.findUnique({ where: { id: booking.id } });
    expect(updated?.status).toBe('cancelled');
    const tickets = await prisma.ticket.findMany({ where: { booking_id: booking.id } });
    expect(tickets.every((t) => t.status === 'cancelled')).toBe(true);
  });

  test('it should ask for a refund (and not cancel) when the booking is already paid', async () => {
    //ARRANGE
    const booking = await seedBooking('confirmed');

    //ACT
    const res = await adminBookingController.cancelBooking(
      makeReq(`/api/booking/${booking.id}`, { method: 'DELETE' }, adminToken),
      ctx(booking.id)
    );

    //ASSERT
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe('Booking already paid, need refund');
    const updated = await prisma.booking.findUnique({ where: { id: booking.id } });
    expect(updated?.status).toBe('confirmed');
  });

  test('it should throw a NotFoundError when the booking does not exist', async () => {
    //ACT + ASSERT
    await expect(() =>
      adminBookingController.cancelBooking(
        makeReq('/api/booking/999999', { method: 'DELETE' }, adminToken),
        ctx(999999)
      )
    ).rejects.toThrow(/not found/i);
  });
});

// ─── garde verifyAdmin ─────────────────────────────────────────────────────────────

describe('verifyAdmin', () => {
  const guarded = verifyAdmin(() => Promise.resolve(NextResponse.json({ ok: true })));

  test('it should block a non-admin (customer) with a Forbidden error', async () => {
    //ACT + ASSERT
    await expect(() =>
      guarded(makeReq('/api/booking/1', { method: 'DELETE' }, customerToken), ctx(1))
    ).rejects.toThrow(/admin/i);
  });

  test('it should let an admin through to the controller', async () => {
    //ACT
    const res = await guarded(makeReq('/api/booking/1', { method: 'DELETE' }, adminToken), ctx(1));

    //ASSERT
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });
});
