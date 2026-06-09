import { AbstractModel } from '@server/services/AbstractModel';

export class CategoryActivityModel extends AbstractModel<'category_activity'> {
  constructor() {
    super('category_activity');
  }

  async deleteByActivityId(activityId: number) {
    await this.prisma.category_activity.deleteMany({ where: { activity_id: activityId } });
  }
}
