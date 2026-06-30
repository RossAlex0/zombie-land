import { NextRequest, NextResponse } from 'next/server';
import { FilterPeriod } from '@customTypes/enum/filterPeriod';
import { DashboardModel } from '@server/services/dashboard/dashboard.service';
import { ConfigurationModel } from '@server/services/configuration/configuration.service';
import { startOfUtcDay, addUtcDays } from '@shared/date';

const isFilterPeriod = (value: string | null): value is FilterPeriod =>
  value !== null && (Object.values(FilterPeriod) as string[]).includes(value);

/** nb of days for each period */
const PERIOD_DAYS: Record<FilterPeriod, number> = {
  [FilterPeriod.TODAY]: 1,
  [FilterPeriod.LAST_WEEK]: 7,
  [FilterPeriod.LAST_MONTH]: 30,
};

/** Fixed window for the occupancy chart : last 30 days, independent of the period selector. */
const OCCUPANCY_DAYS = 30;

/**
 * Commercial period for the dashboard stats, based on the `period` query param.
 * Start and end are at midnight (UTC), `end` is EXCLUDED = midnight of the next day.
 */
const getPeriodRange = (period: FilterPeriod) => {
  const now = new Date();
  const nbDays = PERIOD_DAYS[period];
  const start = startOfUtcDay(addUtcDays(now, -(nbDays - 1)));
  const end = startOfUtcDay(addUtcDays(now, 1)); // minuit du lendemain, borne exclue
  return { start, end, nbDays };
};

const getPastOccupancyRange = () => {
  const now = new Date();
  const start = startOfUtcDay(addUtcDays(now, -(OCCUPANCY_DAYS - 1)));
  const end = startOfUtcDay(addUtcDays(now, 1));
  return { start, end };
};

const getUpcomingOccupancyRange = () => {
  const now = new Date();
  const start = startOfUtcDay(addUtcDays(now, 1));
  const end = startOfUtcDay(addUtcDays(now, OCCUPANCY_DAYS + 1));
  return { start, end };
};

const toDayKey = (date: Date) => date.toISOString().slice(0, 10);

type DailyCount = { validity_date: Date; _count: { _all: number } };

/** Builds the occupancy series for the chart, filling in missing days with 0. */
const buildOccupancySeries = (dailyRaw: DailyCount[], start: Date, capacity: number) => {
  const countByDate = new Map(dailyRaw.map((d) => [toDayKey(d.validity_date), d._count._all]));
  return Array.from({ length: OCCUPANCY_DAYS }, (_, i) => {
    const date = toDayKey(addUtcDays(start, i));
    const tickets = countByDate.get(date) ?? 0;
    return { date, tickets, fillRate: capacity > 0 ? Math.round((tickets / capacity) * 100) : 0 };
  });
};

export const dashboardController = {
  getStats: async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const periodParam = searchParams.get('period');
    const period = isFilterPeriod(periodParam) ? periodParam : FilterPeriod.TODAY;

    const { start, end, nbDays } = getPeriodRange(period);
    const past = getPastOccupancyRange();
    const upcoming = getUpcomingOccupancyRange();

    const config = await new ConfigurationModel().readSingleton();
    const entryPrice = config ? Number(config.entry_price) : 0;
    const capacity = config?.capacity ?? 0;

    const dashboard = new DashboardModel();
    const [stats, pastRaw, upcomingRaw] = await Promise.all([
      dashboard.getStats(start, end, entryPrice),
      dashboard.getDailyOccupancy(past.start, past.end),
      dashboard.getDailyOccupancy(upcoming.start, upcoming.end),
    ]);

    // Day-by-day series (daily rate = tickets of the day / capacity).
    const occupancy = buildOccupancySeries(pastRaw, past.start, capacity);
    const upcomingOccupancy = buildOccupancySeries(upcomingRaw, upcoming.start, capacity);

    return NextResponse.json(
      {
        data: {
          period,
          bookings: stats.bookings,
          ticketsSold: stats.ticketsSold,
          revenue: stats.revenue,
          occupancy,
          upcomingOccupancy,
        },
      },
      { status: 200 }
    );
  },
};
