import { AbstractModel } from '@server/services/AbstractModel';
import { activityFindUniqueArgs } from '../../../../prisma/generated/models';
export class ActivityModel extends AbstractModel<'activity'> {
  constructor() {
    super('activity');
  }

  async getActivityById(id: number, args?: Partial<activityFindUniqueArgs>) {
    const activity = await this.table.findUnique({
      where: { id },
      ...args,
    });
    return activity;
  }

  async updateById(id: number, data: object) {
    const activity = await this.table.update({ where: { id }, data });
    return activity;
  }

  async deleteById(id: number) {
    await this.table.delete({ where: { id } });
  }
}
