import { AbstractModel } from '@server/services/AbstractModel';

export class TicketCategoryModel extends AbstractModel<'ticket_category'> {
  constructor() {
    super('ticket_category');
  }
}
