import { AbstractModel } from '@server/services/AbstractModel';
export class ActivityModel extends AbstractModel<'activity'> {
  constructor() {
    super('activity');
  }

  async getActivityById(id: number) {
    const activity = await this.table.findUnique({
      where: { id },
      include: {
        category_activity: true,
      },
    });
    return activity;
  }
}
