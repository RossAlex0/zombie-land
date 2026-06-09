import { differenceInCalendarDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const parseDateFr = (date: Date) => format(date, 'EEEE d MMMM', { locale: fr });

export const getNbDays = (from: Date, to: Date) => differenceInCalendarDays(to, from) + 1;
