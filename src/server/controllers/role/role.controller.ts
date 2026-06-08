import { NextRequest, NextResponse } from 'next/server';
import { getTokenAccess } from '../../../utils/api/token';
import { RoleModel } from '@server/services/role/role.service';

export const roleController = {
  getRoleById: async (req: NextRequest) => {
    const token = getTokenAccess(req);

    const roleService = new RoleModel();

    const role = await roleService.findRoleById(token.role);

    if (!role) {
      return NextResponse.json({ error: 'role not found' }, { status: 404 });
    }

    return NextResponse.json(role);
  },
};
