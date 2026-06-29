import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { ZodError } from 'zod';
import { NextRequest } from 'next/server';
import { prisma } from '../../../utils/api/database/client';
import { authController } from './auth.controller';

const makeReq = (body: object) =>
  new NextRequest('http://localhost/api/auth', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

/**
 * Ceating a "Customer" role that is a necessary  foreign key for a user as DB is not seeded and does not persist
 * */
beforeAll(async () => {
  await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'CUSTOMER' },
  });
});

beforeEach(async () => {
  await prisma.refresh_token.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ─── signup ──────────────────────────────────────────────────────────────────

describe('authController.signup', () => {
  test('it should create the user in the database and return 200 with a hashed password', async () => {
    //ARRANGE
    const req = makeReq({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@test.com',
      password: 'secret123',
      confirmPassword: 'secret123',
    });

    //ACT
    const res = await authController.signup(req);

    //ASSERT
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe('Inscription réussie');

    const createdUser = await prisma.user.findFirst({ where: { email: 'john@test.com' } });
    expect(createdUser).toBeTruthy();
    expect(createdUser?.password).not.toBe('secret123');
    expect(createdUser?.password).toMatch(/^\$argon2/);
  });

  test('it should throw a ZodError when the email is invalid', async () => {
    //ARRANGE
    const req = makeReq({
      first_name: 'John',
      last_name: 'Doe',
      email: 'pas-un-email',
      password: 'secret123',
      confirmPassword: 'secret123',
    });

    //ACT + ASSERT
    await expect(() => authController.signup(req)).rejects.toThrow(ZodError);
  });

  test('it should throw a ZodError when passwords do not match', async () => {
    //ARRANGE
    const req = makeReq({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@test.com',
      password: 'secret123',
      confirmPassword: 'autremdp',
    });

    //ACT + ASSERT
    await expect(() => authController.signup(req)).rejects.toThrow(ZodError);
  });

  test('it should return 400 with a generic message when the email is already taken, without leaking account existence', async () => {
    //ARRANGE
    const payload = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@test.com',
      password: 'secret123',
      confirmPassword: 'secret123',
    };
    await authController.signup(makeReq(payload)); // premier signup OK

    //ACT
    const res = await authController.signup(makeReq(payload)); // doublon

    //ASSERT
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).not.toContain('john@test.com'); // l'email n'est pas exposé
  });
});

// ─── login ───────────────────────────────────────────────────────────────────

describe('authController.login', () => {
  test('it should return 200 with the user data (no password) and set auth cookies on valid credentials', async () => {
    //ARRANGE
    await authController.signup(
      makeReq({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@test.com',
        password: 'secret123',
        confirmPassword: 'secret123',
      })
    );
    const req = makeReq({ email: 'john@test.com', password: 'secret123' });

    //ACT
    const res = await authController.login(req);

    //ASSERT
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe('Logged in successfully');
    expect(body.user).toBeDefined();
    expect(body.user.password).toBeUndefined();
    expect(res.headers.get('set-cookie')).toContain('access_token');
  });

  test('it should return 401 when the email is not found', async () => {
    //ARRANGE
    const req = makeReq({ email: 'inconnu@test.com', password: 'secret123' });

    //ACT
    const res = await authController.login(req);

    //ASSERT
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Invalid email or password');
  });

  test('it should return 401 when the password is incorrect', async () => {
    //ARRANGE
    await authController.signup(
      makeReq({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@test.com',
        password: 'secret123',
        confirmPassword: 'secret123',
      })
    );
    const req = makeReq({ email: 'john@test.com', password: 'mauvais-mdp' });

    //ACT
    const res = await authController.login(req);

    //ASSERT
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('Invalid email or password');
  });

  test('it should throw a ZodError when the request body contains a malformed email', async () => {
    //ARRANGE
    const req = makeReq({ email: 'pas-un-email', password: 'secret123' });

    //ACT + ASSERT
    await expect(() => authController.login(req)).rejects.toThrow(ZodError);
  });
});
