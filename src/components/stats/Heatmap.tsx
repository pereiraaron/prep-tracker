const MOBILE_WEEKS = 16;

const HEATMAP_LIGHT = ["hsl(220, 15%, 90%)", "hsl(155, 50%, 75%)", "hsl(155, 55%, 58%)", "hsl(155, 60%, 42%)", "hsl(155, 65%, 30%)"];
const HEATMAP_DARK = ["hsl(224, 20%, 18%)", "hsl(155, 40%, 25%)", "hsl(155, 50%, 35%)", "hsl(155, 55%, 45%)", "hsl(155, 60%, 55%)"];

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

const HeatmapGridInner = ({ data }: { data: HeatmapDay[][] }) => (
  <>
    <div
      className="grid gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
    >
      {data.map((week, wi) => (
        <div key={wi} className="grid gap-[3px]" style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
          {week.map((day, di) => (
            <div
              key={di}
              title={day.date ? `${day.date}: ${day.count} solved` : ""}
              className="aspect-square w-full rounded-full"
              style={{ backgroundColor: day.date ? heatmapColor(day.count) : "transparent" }}
            />
          ))}
        </div>
      ))}
    </div>
    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
      <span>Less</span>
      {[0, 1, 2, 3, 4].map((level) => (
        <div
          key={level}
          className="h-3 w-3 rounded-full"
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
