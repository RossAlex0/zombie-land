'use client';

import TextZbl from '@components/ui/text-zbl/TextZbl';
import useFetch from '@hooks/api-request/useFetch';
import './occupancyChart.scss';

type DayOccupancy = { date: string; tickets: number; fillRate: number };
type DashboardData = { occupancy: DayOccupancy[]; upcomingOccupancy: DayOccupancy[] };

type OccupancyChartProps = {
  title: string;
  /** Quelle série afficher : occupation passée ou prévisionnel à venir. */
  field: 'occupancy' | 'upcomingOccupancy';
};

const getLevel = (rate: number) => (rate >= 75 ? 'high' : rate >= 40 ? 'medium' : 'low');

const formatDay = (iso: string) => {
  const [month, day] = iso.split('-');
  return `${day}/${month}`;
};

export default function OccupancyChart({ title, field }: OccupancyChartProps) {
  // Fenêtres fixes (30 jours), décorrélées du sélecteur de période du dashboard.
  const { data, loading, error } = useFetch<DashboardData>('/api/dashboard?period=last-month');

  const occupancy = data?.[field] ?? [];
  const peak = occupancy.reduce<DayOccupancy>(
    (max, day) => (day.fillRate > max.fillRate ? day : max),
    { date: '', tickets: 0, fillRate: 0 }
  );

  return (
    <section className="occupancy_chart">
      <header className="occupancy_chart_header">
        <TextZbl jetbrains className="occupancy_chart_title">
          {title}
        </TextZbl>
        {!loading && !error && peak.fillRate > 0 && (
          <TextZbl jetbrains color="yellow" className="occupancy_chart_peak">
            Pic : {peak.fillRate}% le {formatDay(peak.date)}
          </TextZbl>
        )}
      </header>

      {loading && <TextZbl jetbrains>Chargement…</TextZbl>}
      {error && (
        <TextZbl jetbrains color="red">
          Erreur de chargement
        </TextZbl>
      )}

      {!loading && !error && (
        <div className="occupancy_chart_bars">
          {occupancy.map((day) => (
            <div
              key={day.date}
              className="occupancy_chart_bar"
              title={`${formatDay(day.date)} — ${day.fillRate}% (${day.tickets} billets)`}
            >
              <div
                className={`occupancy_chart_bar_fill ${getLevel(day.fillRate)}`}
                style={{ height: `${day.fillRate}%` }}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
