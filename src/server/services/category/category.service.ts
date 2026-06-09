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

  async updateById(id: number, data: object) {
    const category = await this.table.update({ where: { id }, data });
    return category;
  }

  async deleteById(id: number) {
    await this.table.delete({ where: { id } });
  }
}
