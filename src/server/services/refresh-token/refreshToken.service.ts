import { AbstractModel } from '@server/services/AbstractModel';

export class RefreshTokenModel extends AbstractModel<'refresh_token'> {
  constructor() {
    super('refresh_token');
  }

  async deleteMany(refreshToken: string) {
    await this.table.deleteMany({
      where: { token: refreshToken },
    });
  }
}
