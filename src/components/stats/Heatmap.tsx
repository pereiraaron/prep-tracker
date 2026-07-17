import { Fragment } from "react";
import useIsMobile from "@hooks/useIsMobile";

const MOBILE_WEEKS = 16;

const HEATMAP_LIGHT = ["hsl(220, 15%, 92%)", "hsl(155, 45%, 78%)", "hsl(155, 52%, 60%)", "hsl(155, 58%, 44%)", "hsl(155, 62%, 32%)"];
const HEATMAP_DARK = ["hsl(224, 20%, 16%)", "hsl(155, 35%, 24%)", "hsl(155, 45%, 34%)", "hsl(155, 52%, 44%)", "hsl(155, 58%, 54%)"];

/** Streak lengths worth highlighting on the heatmap */
const STREAK_MILESTONES = [7, 14, 30, 50, 100] as const;

type MilestoneKind = "best" | "first" | "streak";

interface DayMilestone {
  kind: MilestoneKind;
  label: string;
}

const dayDiff = (a: string, b: string) =>
  Math.round((new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime()) / 86_400_000);

const addMilestone = (map: Map<string, DayMilestone[]>, date: string, milestone: DayMilestone) => {
  const list = map.get(date) ?? [];
  if (!list.some((m) => m.kind === milestone.kind && m.label === milestone.label)) {
    list.push(milestone);
    map.set(date, list);
  }
};

const buildDayMilestones = (weeks: HeatmapDay[][], bestDay: number): Map<string, DayMilestone[]> => {
  const map = new Map<string, DayMilestone[]>();
  const days: HeatmapDay[] = [];

  for (const week of weeks) {
    for (const day of week) {
      if (day.date) days.push(day);
    }
  }

  const firstActive = days.find((d) => d.count > 0);
  if (firstActive) {
    addMilestone(map, firstActive.date, { kind: "first", label: "First solve in this period" });
  }

  if (bestDay >= 2) {
    for (const d of days) {
      if (d.count === bestDay) {
        addMilestone(map, d.date, { kind: "best", label: `Personal best — ${bestDay} solved` });
      }
    }
  }

  let streak = 0;
  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    if (d.count > 0) {
      const prev = i > 0 ? days[i - 1] : null;
      if (prev && prev.count > 0 && dayDiff(prev.date, d.date) === 1) streak += 1;
      else streak = 1;

      if ((STREAK_MILESTONES as readonly number[]).includes(streak)) {
        addMilestone(map, d.date, { kind: "streak", label: `${streak}-day streak` });
      }
    } else {
      streak = 0;
    }
  }

  return map;
};

const primaryMilestone = (milestones: DayMilestone[] | undefined): DayMilestone | undefined => {
  if (!milestones?.length) return undefined;
  const order: MilestoneKind[] = ["streak", "best", "first"];
  for (const kind of order) {
    const found = milestones.find((m) => m.kind === kind);
    if (found) return found;
  }
  return milestones[0];
};

const milestoneRingClass = (kind: MilestoneKind) => {
  switch (kind) {
    case "streak":
      return "ring-2 ring-stat-orange/80 ring-offset-1 ring-offset-background animate-heatmap-milestone";
    case "best":
      return "ring-2 ring-stat-yellow/90 ring-offset-1 ring-offset-background";
    case "first":
      return "ring-2 ring-stat-purple/70 ring-offset-1 ring-offset-background";
  }
};

/** Row labels — weeks start on Sunday; show Mon / Wed / Fri like GitHub */
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;

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

interface HeatmapSummary {
  totalQuestions: number;
  activeDays: number;
  bestDay: number;
}

const formatDateLocal = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const monthShort = (dateStr: string) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "short" });

export const buildHeatmapSummary = (weeks: HeatmapDay[][]): HeatmapSummary => {
  let totalQuestions = 0;
  let activeDays = 0;
  let bestDay = 0;

  for (const week of weeks) {
    for (const day of week) {
      if (!day.date) continue;
      totalQuestions += day.count;
      if (day.count > 0) activeDays++;
      if (day.count > bestDay) bestDay = day.count;
    }
  }

  return { totalQuestions, activeDays, bestDay };
};

/** GitHub-style: label the week column where each month starts (or the first week). */
const buildMonthLabels = (weeks: HeatmapDay[][]): (string | null)[] => {
  const labels: (string | null)[] = weeks.map(() => null);
  const labeled = new Set<string>();

  weeks.forEach((week, wi) => {
    for (const day of week) {
      if (!day.date) continue;
      const d = new Date(day.date + "T00:00:00");
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      if (d.getDate() === 1 && !labeled.has(monthKey)) {
        labels[wi] = monthShort(day.date);
        labeled.add(monthKey);
        return;
      }
    }
  });

  if (!labels[0]) {
    const first = weeks[0]?.find((d) => d.date)?.date;
    if (first) labels[0] = monthShort(first);
  }

  return labels;
};

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
        const dateStr = formatDateLocal(current);
        week.push({ date: dateStr, count: data[dateStr] ?? 0 });
      }
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
};

export const HeatmapSummaryLine = ({ summary, className = "" }: { summary: HeatmapSummary; className?: string }) => {
  const { totalQuestions, activeDays, bestDay } = summary;
  const qLabel = totalQuestions === 1 ? "question" : "questions";
  const dLabel = activeDays === 1 ? "active day" : "active days";

  return (
    <p className={`animate-heatmap-fade-in text-xs text-muted-foreground tabular-nums ${className}`}>
      <span className="font-medium text-foreground">{totalQuestions}</span> {qLabel}
      <span className="mx-1.5 text-border">·</span>
      <span className="font-medium text-foreground">{activeDays}</span> {dLabel}
      <span className="mx-1.5 text-border">·</span>
      Best day: <span className="font-medium text-foreground">{bestDay}</span>
    </p>
  );
};

const HeatmapTooltip = ({
  date,
  count,
  milestones,
}: {
  date: string;
  count: number;
  milestones?: DayMilestone[];
}) => {
  if (!date) return null;
  const d = new Date(date + "T00:00:00");
  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <div className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-10 invisible -translate-x-1/2 scale-95 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1.5 text-[10px] font-medium text-popover-foreground opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
      <div>{count === 0 ? `No completions on ${label}` : `${count} solved · ${label}`}</div>
      {milestones?.map((m) => (
        <div
          key={m.label}
          className={`mt-0.5 text-[9px] font-semibold ${
            m.kind === "streak"
              ? "text-stat-orange"
              : m.kind === "best"
                ? "text-stat-yellow"
                : "text-stat-purple"
          }`}
        >
          {m.label}
        </div>
      ))}
    </div>
  );
};

const HeatmapCell = ({
  day,
  delayMs = 0,
  milestones,
}: {
  day: HeatmapDay;
  delayMs?: number;
  milestones?: DayMilestone[];
}) => {
  if (!day.date) return <div className="aspect-square w-full min-w-0" />;

  const primary = primaryMilestone(milestones);

  return (
    <div
      className="group relative aspect-square w-full min-w-0 animate-heatmap-cell"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div
        className={`relative h-full w-full rounded-[3px] transition-all duration-200 ease-out [@media(hover:hover)]:group-hover:scale-125 [@media(hover:hover)]:group-hover:shadow-sm ${
          primary ? milestoneRingClass(primary.kind) : ""
        }`}
        style={{ backgroundColor: heatmapColor(day.count) }}
      />
      {primary && (
        <span
          className={`pointer-events-none absolute -right-px -top-px h-1.5 w-1.5 rounded-full ${
            primary.kind === "streak"
              ? "bg-stat-orange"
              : primary.kind === "best"
                ? "bg-stat-yellow"
                : "bg-stat-purple"
          }`}
          aria-hidden
        />
      )}
      <HeatmapTooltip date={day.date} count={day.count} milestones={milestones} />
    </div>
  );
};

const HeatmapGridInner = ({ data }: { data: HeatmapDay[][] }) => {
  const monthLabels = buildMonthLabels(data);
  const summary = buildHeatmapSummary(data);
  const dayMilestones = buildDayMilestones(data, summary.bestDay);
  const colTemplate = `auto repeat(${data.length}, minmax(0, 1fr))`;
  const hasMilestones = dayMilestones.size > 0;

  return (
    <>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: colTemplate }}>
        {/* Month label row */}
        <div aria-hidden className="h-3" />
        {monthLabels.map((label, i) => (
          <div
            key={`m-${i}`}
            className="animate-heatmap-fade-in truncate pb-0.5 text-center text-[10px] font-medium leading-none text-muted-foreground"
            style={{ animationDelay: `${80 + i * 10}ms` }}
          >
            {label ?? ""}
          </div>
        ))}

        {/* Day rows: weekday gutter + cells */}
        {WEEKDAY_LABELS.map((weekday, row) => (
          <Fragment key={row}>
            <div className="flex items-center pr-1 text-[10px] font-medium leading-none text-muted-foreground">
              {weekday}
            </div>
            {data.map((week, wi) => {
              const day = week[row];
              return (
                <HeatmapCell
                  key={wi}
                  day={day}
                  delayMs={100 + wi * 12 + row * 2}
                  milestones={day.date ? dayMilestones.get(day.date) : undefined}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
      <div
        className="mt-3 flex animate-heatmap-fade-in flex-wrap items-center justify-end gap-x-4 gap-y-1.5 pl-7 text-[10px] text-muted-foreground/70"
        style={{ animationDelay: "500ms" }}
      >
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="h-2.5 w-2.5 rounded-[2px] transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: heatmapColor(level === 0 ? 0 : level) }}
            />
          ))}
          <span>More</span>
        </div>
        {hasMilestones && (
          <div className="flex flex-wrap items-center gap-3 text-[9px]">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-stat-orange ring-2 ring-stat-orange/50 ring-offset-1 ring-offset-background" />
              Streak
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-stat-yellow ring-2 ring-stat-yellow/50 ring-offset-1 ring-offset-background" />
              Best day
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-stat-purple ring-2 ring-stat-purple/50 ring-offset-1 ring-offset-background" />
              First solve
            </span>
          </div>
        )}
      </div>
    </>
  );
};

const Heatmap = ({ weeks }: { weeks: HeatmapDay[][] }) => {
  const isMobile = useIsMobile();
  const data = isMobile ? weeks.slice(-MOBILE_WEEKS) : weeks;
  return <HeatmapGridInner data={data} />;
};

export default Heatmap;
