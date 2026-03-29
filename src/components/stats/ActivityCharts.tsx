import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { CHART_BLUE, CHART_VIOLET, CHART_TEAL, getGridColor, getTextColor } from "./constants";
import { ChartCard, NoData, chartTooltipStyle } from "./shared";

interface ActivityChartsProps {
  dailyData: { date: string; solved: number }[];
  weeklyData: { week: string; solved: number }[];
  cumulativeData: { date: string; total: number }[];
}

const ActivityCharts = ({ dailyData, weeklyData, cumulativeData }: ActivityChartsProps) => (
  <div className="mb-8 grid gap-6 md:grid-cols-3">
    <ChartCard title="Daily (14 days)">
      {dailyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dailyData} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="gradDaily" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.25} />
                <stop offset="95%" stopColor={CHART_BLUE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={getGridColor()} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: getTextColor() }}
              tickLine={false}
              axisLine={false}
              interval={Math.max(0, Math.floor(dailyData.length / 5) - 1)}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} tickLine={false} axisLine={false} width={28} />
            <Tooltip {...chartTooltipStyle} />
            <Area
              type="monotone"
              dataKey="solved"
              stroke={CHART_BLUE}
              fill="url(#gradDaily)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <NoData />
      )}
    </ChartCard>

    <ChartCard title="Weekly (12 weeks)">
      {weeklyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData} margin={{ top: 4, right: 4, bottom: 0, left: -12 }} barCategoryGap="25%">
            <defs>
              <linearGradient id="gradWeekly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_VIOLET} stopOpacity={0.85} />
                <stop offset="100%" stopColor={CHART_VIOLET} stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={getGridColor()} strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 10, fill: getTextColor() }}
              tickLine={false}
              axisLine={false}
              interval={Math.max(0, Math.floor(weeklyData.length / 5) - 1)}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} tickLine={false} axisLine={false} width={28} />
            <Tooltip {...chartTooltipStyle} />
            <Bar dataKey="solved" fill="url(#gradWeekly)" radius={[6, 6, 0, 0]} animationDuration={600} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <NoData />
      )}
    </ChartCard>

    <ChartCard title="Cumulative (90 days)">
      {cumulativeData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={cumulativeData} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="gradCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_TEAL} stopOpacity={0.25} />
                <stop offset="95%" stopColor={CHART_TEAL} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={getGridColor()} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: getTextColor() }}
              tickLine={false}
              axisLine={false}
              interval={Math.max(0, Math.floor(cumulativeData.length / 5) - 1)}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} tickLine={false} axisLine={false} width={28} />
            <Tooltip {...chartTooltipStyle} />
            <Area
              type="monotone"
              dataKey="total"
              stroke={CHART_TEAL}
              fill="url(#gradCumulative)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--card))" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <NoData />
      )}
    </ChartCard>
  </div>
);

export default ActivityCharts;
