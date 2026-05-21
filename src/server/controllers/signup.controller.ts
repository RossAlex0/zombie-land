import { NextRequest, NextResponse } from 'next/server';
import { IUserSignup } from '../../utils/types/User';

import argon2 from 'argon2';
import { prisma } from '@prismaInstance/*';

import { signupSchema } from '../schemas/user/user.schema';

export const signup = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedSchema = signupSchema.parse(body);

    const { password, confirmPassword, ...userToCreate } = validatedSchema;

    if (password !== confirmPassword) throw new Error('Les mots de passes ne correspondent pas');

    const hash = await argon2.hash(password);

    const addedUser = prisma.user.create({ data: { ...userToCreate, password: hash } });
    console.log('added user in DB : ', addedUser);

    const response = NextResponse.json({ message: 'Inscription réussie' }, { status: 201 });

    return response;
  } catch (err) {
    console.error(err);
    const response = NextResponse.json(
      { message: "Problème lors de l'inscription" },
      { status: 400 }
    );
    return response;
  }
};
