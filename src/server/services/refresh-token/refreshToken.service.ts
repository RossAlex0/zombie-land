import { AbstractModel } from '@server/services/AbstractModel';

export class RefreshTokenModel extends AbstractModel<'refresh_token'> {
  constructor() {
    super('refresh_token');
  }

  async readOneByToken(refreshToken: string) {
    return await this.table.findUnique({ where: { token: refreshToken } });
  }

  async deleteAllForUser(userId: number) {
    return await this.table.deleteMany({ where: { user_id: userId } });
  }

  async deleteAllForUserExceptToken(userId: number, except?: string) {
    return await this.table.deleteMany({ where: { user_id: userId, token: { not: except } } });
  }
}
