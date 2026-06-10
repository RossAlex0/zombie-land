import { withErrorHandler } from '@helpers/withErrorHandler';
import { ticketCategoryController } from '@server/controllers';

export const GET = withErrorHandler(ticketCategoryController.readAllTicketCategories);
