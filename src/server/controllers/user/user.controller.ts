import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@server/services';
import { getTokenAccess } from '../../../utils/api/token';

export const userController = {
  me: async (req: NextRequest) => {
    const token = getTokenAccess(req);

    const userService = new UserModel();

    const user = await userService.findUserById(token.userId, [
      'id',
      'email',
      'first_name',
      'last_name',
      'role_id',
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  },
};
