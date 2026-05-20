import { user } from '@prismaInstance/*';
import { userFindUniqueArgs } from '../../../../prisma/generated/models';
import { AbstractModel } from '@server/services/AbstractModel';

export class UserModel extends AbstractModel<'user'> {
  constructor() {
    super('user');
  }

  async findUserByEmail(email: string) {
    return await this.table.findUnique({ where: { email } });
  }

  async findUserById(id: number, fields?: (keyof user)[]) {
    const args: userFindUniqueArgs = { where: { id } };

    if (fields) {
      args.select = {};

      fields.forEach((f) => (args.select![f] = true));
    }

    return await this.table.findUnique(args);
  }
}
