import { test, mock, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { ZodError } from 'zod';
import { NextRequest } from 'next/server';
import { UserModel } from '@server/services';
import argon2 from 'argon2';
import { prisma } from '../../../utils/api/database/client';
import { authController } from './auth.controller';

process.env.JWT_SECRET = 'test-secret-jwt';

const makeReq = (body: object) =>
  new NextRequest('http://localhost/api/auth', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

const MOCK_USER = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@test.com',
  password: '$argon2id$hashed',
  role: { id: 2, name: 'CUSTOMER' },
  booking: [],
  birth_date: null,
};

// prisma.refresh_token est un Proxy Prisma : mock.method() échoue sur les Proxy delegates.
// On remplace le delegate entier via defineProperty et on restaure le descriptor original après chaque test.
const _originalRefreshTokenDescriptor = Object.getOwnPropertyDescriptor(prisma, 'refresh_token')!;

const mockRefreshTokenDelegate = (createImpl = async () => ({ id: 1 })) => {
  Object.defineProperty(prisma, 'refresh_token', {
    value: { create: createImpl },
    configurable: true,
    writable: true,
  });
};

const restoreRefreshTokenDelegate = () => {
  Object.defineProperty(prisma, 'refresh_token', _originalRefreshTokenDescriptor);
};

afterEach(() => {
  mock.restoreAll();
  restoreRefreshTokenDelegate();
});

// ─── signup ──────────────────────────────────────────────────────────────────

describe('authController.signup', () => {
  test('it should return 200 with a success message on valid signup data', async () => {
    //ARRANGE
    mock.method(UserModel.prototype, 'create', async () => ({ id: 1, role_id: 2 }));
    mock.method(argon2, 'hash', async () => '$argon2id$mocked');
    mockRefreshTokenDelegate();
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
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.message, 'Inscription réussie');
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
    await assert.rejects(
      () => authController.signup(req),
      (err) => err instanceof ZodError
    );
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
    await assert.rejects(
      () => authController.signup(req),
      (err) => err instanceof ZodError
    );
  });

  test('it should return 400 with a generic message when the database throws on create', async () => {
    //ARRANGE
    mock.method(UserModel.prototype, 'create', async () => {
      throw new Error('Unique constraint violation');
    });
    mock.method(argon2, 'hash', async () => '$argon2id$mocked');
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
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.message.toLowerCase().includes('inscription'));
  });
});

// ─── login ───────────────────────────────────────────────────────────────────

describe('authController.login', () => {
  test('it should return 200 with the user data (no password) on valid credentials', async () => {
    //ARRANGE
    mock.method(UserModel.prototype, 'findUserByEmail', async () => MOCK_USER);
    mock.method(argon2, 'verify', async () => true);
    mockRefreshTokenDelegate();
    const req = makeReq({ email: 'john@test.com', password: 'secret123' });

    //ACT
    const res = await authController.login(req);

    //ASSERT
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.message, 'Logged in successfully');
    assert.ok(!('password' in body.user), 'Le mot de passe ne doit pas être exposé');
  });

  test('it should return 401 when the email is not found', async () => {
    //ARRANGE
    mock.method(UserModel.prototype, 'findUserByEmail', async () => null);
    const req = makeReq({ email: 'inconnu@test.com', password: 'secret123' });

    //ACT
    const res = await authController.login(req);

    //ASSERT
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.ok(body.error);
  });

  test('it should return 401 when the password is incorrect', async () => {
    //ARRANGE
    mock.method(UserModel.prototype, 'findUserByEmail', async () => MOCK_USER);
    mock.method(argon2, 'verify', async () => false);
    const req = makeReq({ email: 'john@test.com', password: 'mauvais-mdp' });

    //ACT
    const res = await authController.login(req);

    //ASSERT
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.error, 'Invalid email or password');
  });

  test('it should throw a ZodError when the request body contains a malformed email', async () => {
    //ARRANGE
    const req = makeReq({ email: 'pas-un-email', password: 'secret123' });

    //ACT + ASSERT
    await assert.rejects(
      () => authController.login(req),
      (err) => err instanceof ZodError
    );
  });
});
