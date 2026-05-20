import { AbstractModel } from '@server/services/AbstractModel';

export class CategoryActivityModel extends AbstractModel<'category_activity'> {
  constructor() {
    super('category_activity');
  }
}
