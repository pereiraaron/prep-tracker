const MOBILE_WEEKS = 16;

const HEATMAP_LIGHT = ["hsl(220, 15%, 92%)", "hsl(155, 45%, 78%)", "hsl(155, 52%, 60%)", "hsl(155, 58%, 44%)", "hsl(155, 62%, 32%)"];
const HEATMAP_DARK = ["hsl(224, 20%, 16%)", "hsl(155, 35%, 24%)", "hsl(155, 45%, 34%)", "hsl(155, 52%, 44%)", "hsl(155, 58%, 54%)"];

const isDark = () => document.documentElement.classList.contains("dark");

const heatmapColor = (count: number): string => {
  const palette = isDark() ? HEATMAP_DARK : HEATMAP_LIGHT;
  if (count === 0) return palette[0];
  if (count === 1) return palette[1];
  if (count === 2) return palette[2];
  if (count <= 4) return palette[3];
  return palette[4];
};

interface HeatmapDay {
  date: string;
  count: number;
}

export const buildHeatmapWeeks = (data: Record<string, number>): HeatmapDay[][] => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  const weeks: HeatmapDay[][] = [];
  const current = new Date(start);

  while (current <= today) {
    const week: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      if (current > today) {
        week.push({ date: "", count: 0 });
      } else {
        const dateStr = current.toISOString().split("T")[0];
        week.push({ date: dateStr, count: data[dateStr] ?? 0 });
      }
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
};

const HeatmapTooltip = ({ date, count }: { date: string; count: number }) => {
  if (!date) return null;
  const d = new Date(date + "T00:00:00");
  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2.5 py-1 text-[10px] font-medium text-popover-foreground shadow-lg border border-border z-10">
      {count} solved &middot; {label}
    </div>
  );
};

const HeatmapCell = ({ day }: { day: HeatmapDay }) => {
  if (!day.date) return <div className="aspect-square w-full" />;

  return (
    <div className="group relative aspect-square w-full">
      <div
        className="h-full w-full rounded-[3px] transition-transform group-hover:scale-125"
        style={{ backgroundColor: heatmapColor(day.count) }}
      />
      <div className="hidden group-hover:block">
        <HeatmapTooltip date={day.date} count={day.count} />
      </div>
    </div>
  );
};

const HeatmapGridInner = ({ data }: { data: HeatmapDay[][] }) => (
  <>
    <div
      className="grid gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
    >
      {data.map((week, wi) => (
        <div key={wi} className="grid gap-[3px]" style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
          {week.map((day, di) => (
            <HeatmapCell key={di} day={day} />
          ))}
        </div>
      ))}
    </div>
    <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground/70">
      <span>Less</span>
      {[0, 1, 2, 3, 4].map((level) => (
        <div
          key={level}
          className="h-2.5 w-2.5 rounded-[2px]"
          style={{ backgroundColor: heatmapColor(level === 0 ? 0 : level) }}
        />
      ))}
      <span>More</span>
    </div>
  </>
);

const Heatmap = ({ weeks }: { weeks: HeatmapDay[][] }) => {
  const mobileWeeks = weeks.slice(-MOBILE_WEEKS);

  return (
    <>
      <div className="md:hidden"><HeatmapGridInner data={mobileWeeks} /></div>
      <div className="hidden md:block"><HeatmapGridInner data={weeks} /></div>
    </>
  );
};

export default Heatmap;
