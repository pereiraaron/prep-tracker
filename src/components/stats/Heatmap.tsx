const MOBILE_WEEKS = 16;

const heatmapColor = (count: number): string => {
  if (count === 0) return "hsl(220, 15%, 90%)";
  if (count === 1) return "hsl(155, 50%, 75%)";
  if (count === 2) return "hsl(155, 55%, 58%)";
  if (count <= 4) return "hsl(155, 60%, 42%)";
  return "hsl(155, 65%, 30%)";
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
