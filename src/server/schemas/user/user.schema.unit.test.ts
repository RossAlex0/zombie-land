import { describe, expect, test } from 'vitest';
import { signupSchema } from './user.schema';

const validSignup = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@test.com',
  password: 'Secret123456!',
  confirmPassword: 'Secret123456!',
};

describe('signupSchema', () => {
  test('it should reject a password shorter than the 12 characters recommended by the CNIL', () => {
    //ARRANGE
    const payload = { ...validSignup, password: 'Secret12!', confirmPassword: 'Secret12!' };

    //ACT
    const result = signupSchema.safeParse(payload);

    //ASSERT
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path.includes('password'))).toBe(true);
  });

  test('it should reject a mismatched confirmation on the confirmation field', () => {
    //ARRANGE
    const payload = { ...validSignup, confirmPassword: 'AnotherOne12!' };

    //ACT
    const result = signupSchema.safeParse(payload);

    //ASSERT
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain('confirmPassword');
  });
});
