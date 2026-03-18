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
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="gradDaily" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: getTextColor() }} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} width={30} />
            <Tooltip {...chartTooltipStyle} />
            <Area type="monotone" dataKey="solved" stroke={CHART_BLUE} fill="url(#gradDaily)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <NoData />
      )}
    </ChartCard>

    <ChartCard title="Weekly (12 weeks)">
      {weeklyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <defs>
              <linearGradient id="gradWeekly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_VIOLET} stopOpacity={0.9} />
                <stop offset="100%" stopColor={CHART_VIOLET} stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
            <XAxis dataKey="week" tick={{ fontSize: 9, fill: getTextColor() }} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} width={30} />
            <Tooltip {...chartTooltipStyle} />
            <Bar dataKey="solved" fill="url(#gradWeekly)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <NoData />
      )}
    </ChartCard>

    <ChartCard title="Cumulative (90 days)">
      {cumulativeData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={cumulativeData}>
            <defs>
              <linearGradient id="gradCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_TEAL} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_TEAL} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: getTextColor() }} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} width={30} />
            <Tooltip {...chartTooltipStyle} />
            <Area type="monotone" dataKey="total" stroke={CHART_TEAL} fill="url(#gradCumulative)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <NoData />
      )}
    </ChartCard>
  </div>
);

export default ActivityCharts;
