const MOBILE_MONTHS = 5;
const RANGE_DAYS = 364;

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
  padding?: boolean;
}

interface MonthCalendar {
  key: string;
  label: string;
  weeks: HeatmapDay[][];
}

const formatDateLocal = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getHeatmapRange = () => {
  const end = startOfDay(new Date());
  const start = startOfDay(new Date(end));
  start.setDate(start.getDate() - RANGE_DAYS);
  return { start, end };
};

export const buildMonthCalendars = (data: Record<string, number>): MonthCalendar[] => {
  const { start, end } = getHeatmapRange();
  const months: MonthCalendar[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

  while (cursor <= endMonth) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDow = new Date(year, month, 1).getDay();
    const numCols = Math.ceil((firstDow + daysInMonth) / 7);

    const weeks: HeatmapDay[][] = Array.from({ length: numCols }, () =>
      Array.from({ length: 7 }, () => ({ date: "", count: 0, padding: true })),
    );

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDateLocal(date);
      const col = Math.floor((firstDow + day - 1) / 7);
      const dow = date.getDay();

      if (date < start) {
        weeks[col][dow] = { date: "", count: 0, padding: false };
      } else {
        weeks[col][dow] = {
          date: dateStr,
          count: date <= end ? (data[dateStr] ?? 0) : 0,
          padding: false,
        };
      }
    }

    months.push({
      key: `${year}-${month + 1}`,
      label: new Date(year, month, 1).toLocaleDateString("en-US", { month: "short" }),
      weeks,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
};

const HeatmapCell = ({ day }: { day: HeatmapDay }) => {
  if (day.padding || !day.date) {
    return <div className="min-h-0 min-w-0" />;
  }

  return (
    <div className="group relative min-h-0 min-w-0 overflow-hidden">
      <div
        className="h-full w-full rounded-[3px] transition-transform [@media(hover:hover)]:group-hover:scale-125"
        style={{ backgroundColor: heatmapColor(day.count) }}
      />
      <div className="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1 text-[10px] font-medium text-popover-foreground shadow-lg [@media(hover:hover)]:group-hover:block">
        {(() => {
          const d = new Date(day.date + "T00:00:00");
          const label = d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
          return day.count === 0 ? `No completions on ${label}` : `${day.count} solved · ${label}`;
        })()}
      </div>
    </div>
  );
};

const MonthBlock = ({ month }: { month: MonthCalendar }) => (
  <div className="flex shrink-0 flex-col md:min-w-0" style={{ flex: month.weeks.length }}>
    <div className="mb-2 text-center text-[10px] leading-none font-medium text-muted-foreground md:mb-3">
      {month.label}
    </div>
    <div className="flex min-w-0 gap-[2px] md:gap-[3px]">
      {month.weeks.map((week, wi) => (
        <div
          key={wi}
          className="grid min-w-[9px] flex-1 gap-[2px] md:min-w-0 md:gap-[3px]"
          style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))", aspectRatio: "1 / 7" }}
        >
          {week.map((day, di) => (
            <HeatmapCell key={di} day={day} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

const HeatmapGridInner = ({ months }: { months: MonthCalendar[] }) => (
  <>
    <div className="w-full min-w-0">
      <div className="flex w-max min-w-full items-start gap-3 md:w-full md:gap-5 lg:gap-6">
        {months.map((month) => (
          <MonthBlock key={month.key} month={month} />
        ))}
      </div>
    </div>
    <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/70 md:justify-end">
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

const Heatmap = ({ data }: { data: Record<string, number> }) => {
  const months = buildMonthCalendars(data);
  const mobileMonths = months.slice(-MOBILE_MONTHS);

  return (
    <>
      <div className="md:hidden"><HeatmapGridInner months={mobileMonths} /></div>
      <div className="hidden md:block"><HeatmapGridInner months={months} /></div>
    </>
  );
};

export default Heatmap;
