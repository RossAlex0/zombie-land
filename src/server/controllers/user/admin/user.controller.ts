import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@server/services';
import { updateRoleSchema, userSearchSchema } from '@server/schemas/user/admin/user.schema';
import { NextContext } from '@customTypes/nextApi';
import { getTokenAccess } from '../../../../utils/api/token';
import { ROLE_NAMES } from '@customTypes/enum/roles';

export const adminUserController = {
  readAllUsers: async (req: NextRequest) => {
    const userService = new UserModel();
    const params = userSearchSchema.parse(Object.fromEntries(req.nextUrl.searchParams));

    const result = await userService.searchAndCount(params);

    return NextResponse.json(result);
  },

  getUserById: async (req: NextRequest, context: NextContext<{ userId: string }>) => {
    const { userId } = await context.params;
    const userService = new UserModel();

    const user = await userService.findUserById(Number(userId), {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role_id: true,
      role: true,
      birth_date: true,
      created_at: true,
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  },

  updateRole: async (req: NextRequest, context: NextContext<{ userId: string }>) => {
    const { userId } = await context.params;
    const { role } = updateRoleSchema.parse(await req.json());
    const token = getTokenAccess(req);
    const userService = new UserModel();
    const targetUser = await userService.findUserWithRole(Number(userId));

    if (!targetUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (targetUser.id === token.userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas modifier votre propre rôle' },
        { status: 400 }
      );
    }

    const adminCount = await userService.countByRole(ROLE_NAMES.ADMIN);

    if (targetUser.role.name === ROLE_NAMES.ADMIN && role !== ROLE_NAMES.ADMIN && adminCount <= 1) {
      return NextResponse.json(
        { error: 'Il doit y avoir au moins un administrateur' },
        { status: 400 }
      );
    }

    const updatedUser = await userService.update({
      where: { id: Number(userId) },
      data: { role: { connect: { name: role } } },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role_id: true,
        role: true,
        birth_date: true,
        created_at: true,
      },
    });

    return NextResponse.json(updatedUser);
  },
  deleteUser: async (req: NextRequest, context: NextContext<{ userId: string }>) => {
    const { userId } = await context.params;
    const token = getTokenAccess(req);
    const userService = new UserModel();
    const targetUser = await userService.findUserWithRole(Number(userId));

    if (!targetUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    if (targetUser.id === token.userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte administrateur' },
        { status: 400 }
      );
    }
    await userService.anonymizeUser(Number(userId));
    return NextResponse.json({ message: 'Utilisateur anonymisé avec succès' });
  },
};
