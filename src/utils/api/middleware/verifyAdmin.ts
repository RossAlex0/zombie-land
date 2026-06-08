import { Controller } from '@helpers/withErrorHandler';
import { ROLE_NAMES } from '@customTypes/enum/roles';
import { ForbiddenError } from '../../errors/errors';
import { getTokenAccess } from '../token';
import { verifyAccessToken } from './tokenAccess';
import { RoleModel } from '@server/services/role/role.service';

const isAdmin = async (roleId: number) => {
  const roleService = new RoleModel();

  const role = await roleService.findRoleById(roleId);

  if (role && role.name === ROLE_NAMES.ADMIN) {
    return true;
  }

  return false;
};

export function verifyAdmin<T>(controller: Controller<T>) {
  return verifyAccessToken<T>(async (req, context) => {
    const payload = getTokenAccess(req);
    const userIsAdmin = await isAdmin(payload.role);

    if (!userIsAdmin) {
      throw new ForbiddenError('Admin access required');
    }

    return controller(req, context);
  });
}
