import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@server/services';
import { getTokenAccess } from '../../../utils/api/token';
import argon2 from 'argon2';
import { updatePasswordSchema, updateUserSchema } from '@server/schemas/user/user.schema';
import { COOKIE_NAMES } from '@customTypes/enum/cookies';

export const userController = {
  me: async (req: NextRequest) => {
    const token = getTokenAccess(req);

    const userService = new UserModel();

    const user = await userService.findUserById(token.userId, {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
      birth_date: true,
      created_at: true,
      deleted_at: true,
    });

    if (!user || user.deleted_at) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(user);
  },

  updateMe: async (req: NextRequest) => {
    const token = getTokenAccess(req);
    const body = await req.json();
    const userService = new UserModel();

    const { first_name, last_name, birth_date } = updateUserSchema.parse(body);

    await userService.update({
      where: { id: token.userId },
      data: { first_name, last_name, birth_date },
    });
    return NextResponse.json({ message: 'Profil mis à jour avec succès' }, { status: 200 });
  },

  updatePassword: async (req: NextRequest) => {
    const token = getTokenAccess(req);
    const body = await req.json();
    const userService = new UserModel();
    const { oldPassword, newPassword, newConfirmPassword } = updatePasswordSchema.parse(body);
    const user = await userService.findUserById(token.userId, { password: true });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (!(await argon2.verify(user.password, oldPassword))) {
      return NextResponse.json({ error: "L'ancien mot de passe est incorrect" }, { status: 401 });
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit être différent de l'ancien" },
        { status: 401 }
      );
    }

    const hash = await argon2.hash(newPassword);

    await userService.update({
      where: { id: token.userId },
      data: {
        password: hash,
        password_changed_at: new Date(),
      },
      select: { id: true },
    });

    return NextResponse.json({ message: 'Mot de passe mis à jour avec succès' });
  },

  deleteMe: async (req: NextRequest) => {
    const token = getTokenAccess(req);
    const userService = new UserModel();
    await userService.anonymizeUser(token.userId);

    const response = NextResponse.json({ message: 'Compte anonymisé avec succès' });
    // Déconnexion immédiate : l'access token (JWT) reste valide sinon jusqu'à expiration
    response.cookies.delete(COOKIE_NAMES.ACCESS_TOKEN);
    response.cookies.delete(COOKIE_NAMES.REFRESH_TOKEN);
    return response;
  },
};
