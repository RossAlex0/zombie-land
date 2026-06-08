import { AbstractModel } from '@server/services/AbstractModel';
export class CategoryModel extends AbstractModel<'category'> {
  constructor() {
    super('category');
  }

  async getCategoryById(id: number) {
    const category = await this.table.findUnique({
      where: { id },
      include: {
        category_activity: true,
      },
    });
    return category;
  }
}
