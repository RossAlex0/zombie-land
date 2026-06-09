import { userFindUniqueArgs } from '../../../../prisma/generated/models';
import { AbstractModel } from '@server/services/AbstractModel';

export class UserModel extends AbstractModel<'user'> {
  constructor() {
    super('user');
  }

  async findUserByEmail(email: string) {
    return await this.table.findUnique({
      where: { email },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        role: true,
        booking: true,
        birth_date: true,
      },
    });
  }

  async findUserById(id: number, fields?: userFindUniqueArgs['select']) {
    const args: userFindUniqueArgs = { where: { id }, select: fields ?? {} };

    return await this.table.findUnique(args);
  }
}
