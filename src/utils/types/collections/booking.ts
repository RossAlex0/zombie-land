import { booking, ticket, ticket_category } from '@prismaInstance/*';

// Un ticket avec sa catégorie (label + réduction)
export type TicketWithCategory = ticket & {
  category: ticket_category;
};

// Un booking complet : ses tickets, chacun avec sa catégorie.
// Correspond à ce que renvoient BookingModel.getBookingById / getBookingsByUserId.
export type BookingWithTickets = booking & {
  ticket: TicketWithCategory[];
};
