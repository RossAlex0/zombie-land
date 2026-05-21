import { prisma } from '@prismaInstance/*';
import { Controller } from '@helpers/withErrorHandler';
import { ROLE_NAMES } from '@customTypes/enum/roles';
import { ForbiddenError } from '../../errors/errors';
import { getTokenAccess } from '../token';
import { verifyAccessToken } from './tokenAccess';

let adminRoleIdPromise: Promise<number> | null = null;

const getAdminRoleId = () => {
  if (!adminRoleIdPromise) {
    adminRoleIdPromise = prisma.role
      .findUnique({ where: { name: ROLE_NAMES.ADMIN }, select: { id: true } })
      .then((r) => {
        if (!r) throw new Error('Admin role not seeded');
        return r.id;
      })
      .catch((err) => {
        adminRoleIdPromise = null;
        throw err;
      });
  }
  return adminRoleIdPromise;
};

export function verifyAdmin<T>(controller: Controller<T>) {
  return verifyAccessToken<T>(async (req, context) => {
    const payload = getTokenAccess(req);
    const adminRoleId = await getAdminRoleId();

    if (payload.role !== adminRoleId) {
      throw new ForbiddenError('Admin access required');
    }

    return controller(req, context);
  });
}
