import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@server/services';
import { getTokenAccess } from '../../../utils/api/token';

export const userController = {
  me: async (req: NextRequest) => {
    const token = getTokenAccess(req);

    const userService = new UserModel();

    const user = await userService.findUserById(token.userId, {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      birth_date: true,
      role: true,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  },
};
