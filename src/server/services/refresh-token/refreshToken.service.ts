import { AbstractModel } from '@server/services/AbstractModel';

export class RefreshTokenModel extends AbstractModel<'refresh_token'> {
  constructor() {
    super('refresh_token');
  }

  async readOneByToken(refreshToken: string) {
    return await this.table.findUnique({ where: { token: refreshToken } });
  }
}
