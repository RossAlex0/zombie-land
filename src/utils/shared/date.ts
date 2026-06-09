import { differenceInCalendarDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date en français sous la forme « jour mois » (sans l'année).
 *
 * @param date - La date à formater.
 * @returns La date formatée en français, ex. « lundi 22 juillet ».
 *
 * @example
 * parseDateFr(new Date('2026-06-09')); // "mardi 9 juin"
 */
export const parseDateFr = (date: Date) => format(date, 'EEEE d MMMM', { locale: fr });

/**
 * Calcule le nombre de jours entre deux dates, bornes incluses.
 *
 * Utilise une différence en jours calendaires (insensible aux heures et au
 * changement d'heure été/hiver), puis ajoute 1 pour compter les deux extrémités.
 *
 * @param from - La date de début.
 * @param to - La date de fin.
 * @returns Le nombre de jours incluant le jour de début et le jour de fin.
 *
 * @example
 * getNbDays(new Date('2026-06-10'), new Date('2026-06-12')); // 3
 */
export const getNbDays = (from: Date, to: Date) => differenceInCalendarDays(to, from) + 1;

/**
 * Formate une date au format ISO court « yyyy-MM-dd », sans la partie horaire.
 *
 * Le formatage s'appuie sur le fuseau horaire local de la machine.
 *
 * @param date - La date à formater (objet Date ou valeur convertible en Date).
 * @returns La date au format « yyyy-MM-dd », ex. « 2026-06-09 ».
 *
 * @example
 * parseDateWithoutTime(new Date('2026-06-09T10:01:31.110Z')); // "2026-06-09"
 */
export const parseDateWithoutTime = (date: Date) => format(new Date(date), 'yyyy-MM-dd');
