import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { ZodError } from 'zod';
import { NextRequest } from 'next/server';
import { prisma } from '../../../utils/api/database/client';
import { generateAccessToken } from '../../../utils/api/token';
import { bookingController } from './booking.controller';

let userId: number;
let adultCategoryId: number;
let token: string;

const makeReq = (url: string, init: { method?: string; body?: object }) =>
  new NextRequest(`http://localhost${url}`, {
    method: init.method ?? 'GET',
    ...(init.body ? { body: JSON.stringify(init.body) } : {}),
    headers: {
      'Content-Type': 'application/json',
      cookie: `access_token=${token}`,
    },
  });

const ctx = (bookingId: number) => ({ params: Promise.resolve({ bookingId: String(bookingId) }) });

beforeAll(async () => {
  await prisma.role.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: 'CUSTOMER' } });
  await prisma.configuration.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      entry_price: 25.0,
      capacity: 500,
      status: 'active',
      opening_hours: new Date('1970-01-01T09:00:00Z'),
      closing_hours: new Date('1970-01-01T19:00:00Z'),
    },
  });
});

beforeEach(async () => {
  const user = await prisma.user.create({
    data: {
      first_name: 'Rick',
      last_name: 'Grimes',
      email: 'rick@test.com',
      password: 'hash-bidon',
      role_id: 1,
    },
  });
  userId = user.id;

  const adult = await prisma.ticket_category.create({
    data: { label: 'Adulte', reduction: 0, is_default: true, display_order: 1 },
  });
  adultCategoryId = adult.id;

  token = await generateAccessToken(userId, 1);
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ─── makeBooking ───────────────────────────────────────────────────────────────

describe('bookingController.makeBooking', () => {
  test('it should create a pending booking with one ticket per person and return 201', async () => {
    //ARRANGE
    const req = makeReq('/api/booking', {
      method: 'POST',
      body: {
        from: '2099-06-15',
        to: '2099-06-15',
        tickets: [{ category_id: adultCategoryId, quantity: 2 }],
      },
    });

    //ACT
    const res = await bookingController.makeBooking(req);

    //ASSERT
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.status).toBe('pending');
    expect(body.data.ticket).toHaveLength(2);

    const tickets = await prisma.ticket.findMany({ where: { booking_id: body.data.id } });
    expect(tickets).toHaveLength(2);
    expect(tickets.every((t) => t.status === 'pending')).toBe(true);
  });

  test('it should throw a BadRequestError when the visit date is in the past', async () => {
    //ARRANGE
    const req = makeReq('/api/booking', {
      method: 'POST',
      body: {
        from: '2000-01-01',
        to: '2000-01-01',
        tickets: [{ category_id: adultCategoryId, quantity: 1 }],
      },
    });

    //ACT + ASSERT
    await expect(() => bookingController.makeBooking(req)).rejects.toThrow(/future/i);
  });

  test('it should throw a ZodError when the group exceeds the max people', async () => {
    //ARRANGE
    const req = makeReq('/api/booking', {
      method: 'POST',
      body: {
        from: '2099-06-15',
        to: '2099-06-15',
        tickets: [{ category_id: adultCategoryId, quantity: 20 }],
      },
    });

    //ACT + ASSERT
    await expect(() => bookingController.makeBooking(req)).rejects.toThrow(ZodError);
  });
});

// ─── getMyBookings ───────────────────────────────────────────────────────────────

describe('bookingController.getMyBookings', () => {
  test('it should return the bookings of the current user', async () => {
    //ARRANGE
    await bookingController.makeBooking(
      makeReq('/api/booking', {
        method: 'POST',
        body: {
          from: '2099-06-15',
          to: '2099-06-15',
          tickets: [{ category_id: adultCategoryId, quantity: 1 }],
        },
      })
    );

    //ACT
    const res = await bookingController.getMyBookings(makeReq('/api/booking/me', {}));

    //ASSERT
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].user_id).toBe(userId);
  });
});

// ─── cancelMyBooking ─────────────────────────────────────────────────────────────

describe('bookingController.cancelMyBooking', () => {
  test('it should cancel an unpaid (pending) booking and cascade to its tickets', async () => {
    //ARRANGE
    const created = await bookingController.makeBooking(
      makeReq('/api/booking', {
        method: 'POST',
        body: {
          from: '2099-06-15',
          to: '2099-06-15',
          tickets: [{ category_id: adultCategoryId, quantity: 2 }],
        },
      })
    );
    const { data } = await created.json();

    //ACT
    const res = await bookingController.cancelMyBooking(
      makeReq(`/api/booking/me/${data.id}`, { method: 'PATCH' }),
      ctx(data.id)
    );

    //ASSERT
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe('Booking cancelled');

    // effet en base : booking + tickets passés à "cancelled"
    const booking = await prisma.booking.findUnique({ where: { id: data.id } });
    expect(booking?.status).toBe('cancelled');
    const tickets = await prisma.ticket.findMany({ where: { booking_id: data.id } });
    expect(tickets.every((t) => t.status === 'cancelled')).toBe(true);
  });

  test('it should refuse to cancel a booking already paid (confirmed)', async () => {
    //ARRANGE
    const created = await bookingController.makeBooking(
      makeReq('/api/booking', {
        method: 'POST',
        body: {
          from: '2099-06-15',
          to: '2099-06-15',
          tickets: [{ category_id: adultCategoryId, quantity: 1 }],
        },
      })
    );
    const { data } = await created.json();
    await prisma.booking.update({ where: { id: data.id }, data: { status: 'confirmed' } });

    //ACT
    const res = await bookingController.cancelMyBooking(
      makeReq(`/api/booking/me/${data.id}`, { method: 'PATCH' }),
      ctx(data.id)
    );

    //ASSERT
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe('You cannot cancel a booking already paid');
    const booking = await prisma.booking.findUnique({ where: { id: data.id } });
    expect(booking?.status).toBe('confirmed');
  });
});
