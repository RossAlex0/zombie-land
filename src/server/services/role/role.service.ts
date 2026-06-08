import { AbstractModel } from '@server/services/AbstractModel';

export class RoleModel extends AbstractModel<'role'> {
  constructor() {
    super('role');
  }

  async findRoleById(id: number) {
    return await this.table.findUnique({ where: { id } });
  }
}
