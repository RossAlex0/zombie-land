import { NextRequest, NextResponse } from 'next/server';
import { IUserSignup } from '../../../../utils/types/User';

import argon2 from 'argon2';
import { prisma } from '@prismaInstance/*';

export async function POST(req: NextRequest) {
  try {
    const userData: IUserSignup = await req.json();
    if (!userData) {
      throw new Error('User data missing');
    }
    const { password, confirmPassword, ...userToCreate } = signupSchema.parse(userData);
    if (password !== confirmPassword) throw new Error('Les mots de passes ne correspondent pas');

    const hash = await argon2.hash(password);

    const addedUser = await prisma.user.create({ data: { ...userToCreate, password: hash } });
    console.log('added user to db :', addedUser);

    const response = NextResponse.json({ message: 'Inscription réussie' }, { status: 200 });

    return response;
  } catch (err) {
    console.error(err);
    const response = NextResponse.json(
      { message: "Problème lors de l'inscription" },
      { status: 400 }
    );
    return response;
  }
}
