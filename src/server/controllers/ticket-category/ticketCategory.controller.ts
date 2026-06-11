import { TicketCategoryModel } from '@server/services';
import { NextResponse } from 'next/server';

export const ticketCategoryController = {
  readAllTicketCategories: async () => {
    const service = new TicketCategoryModel();
    const categories = await service.readAll({ orderBy: { display_order: 'asc' } });
    return NextResponse.json({ data: categories }, { status: 200 });
  },
};
