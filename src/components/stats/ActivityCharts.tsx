import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { PRIMARY_COLOR, TEAL_COLOR } from "./constants";
import { ChartCard, NoData } from "./shared";

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
              <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.15} />
                <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={30} />
            <Tooltip />
            <Area type="monotone" dataKey="solved" stroke={PRIMARY_COLOR} fill="url(#colorSolved)" strokeWidth={2} />
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
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
            <XAxis dataKey="week" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={30} />
            <Tooltip />
            <Bar dataKey="solved" fill={PRIMARY_COLOR} radius={[4, 4, 0, 0]} />
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
              <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={TEAL_COLOR} stopOpacity={0.15} />
                <stop offset="95%" stopColor={TEAL_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={30} />
            <Tooltip />
            <Area type="monotone" dataKey="total" stroke={TEAL_COLOR} fill="url(#colorCumulative)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <NoData />
      )}
    </ChartCard>
  </div>
);

export default ActivityCharts;
