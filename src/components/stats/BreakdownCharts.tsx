import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { DIFF_COLORS, CHART_BLUE, CHART_VIOLET, getGridColor, getTextColor } from "./constants";
import { ChartCard, NoData, chartTooltipStyle } from "./shared";

interface BreakdownChartsProps {
  categoryData: { name: string; short: string; count: number }[];
  diffData: { name: string; count: number }[];
  diffByCatData: { name: string; Easy: number; Medium: number; Hard: number }[];
  topicData: { name: string; count: number }[];
  sourceData: { name: string; count: number }[];
  companyData: { name: string; count: number }[];
}

const BreakdownCharts = ({
  categoryData,
  diffData,
  diffByCatData,
  topicData,
  sourceData,
  companyData,
}: BreakdownChartsProps) => (
  <>
    <div className="mb-6 grid gap-6 md:grid-cols-3">
      <ChartCard title="By Category">
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical">
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} />
              <YAxis type="category" dataKey="short" tick={{ fontSize: 10, fill: getTextColor() }} width={80} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="count" fill={CHART_BLUE} radius={[0, 4, 4, 0]} name="Solved" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <NoData />
        )}
      </ChartCard>

      <ChartCard title="By Difficulty">
        {diffData.some((d) => d.count > 0) ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Tooltip {...chartTooltipStyle} formatter={(value) => value} />
              <Pie data={diffData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} strokeWidth={0}>
                {diffData.map((_, i) => (
                  <Cell key={i} fill={DIFF_COLORS[i]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <NoData />
        )}
      </ChartCard>

      <ChartCard title="Difficulty x Category">
        {diffByCatData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={diffByCatData}>
              <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: getTextColor() }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} width={30} />
              <Tooltip {...chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Easy" stackId="a" fill={DIFF_COLORS[0]} />
              <Bar dataKey="Medium" stackId="a" fill={DIFF_COLORS[1]} />
              <Bar dataKey="Hard" stackId="a" fill={DIFF_COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <NoData />
        )}
      </ChartCard>
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      <ChartCard title="Top Topics">
        {topicData.length > 0 ? (
          <ResponsiveContainer width="100%" height={Math.max(200, topicData.length * 28)}>
            <BarChart data={topicData} layout="vertical">
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: getTextColor() }} width={85} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="count" fill={CHART_BLUE} radius={[0, 4, 4, 0]} name="Solved" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <NoData />
        )}
      </ChartCard>

      <ChartCard title="By Source">
        {sourceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={Math.max(200, sourceData.length * 35)}>
            <BarChart data={sourceData} layout="vertical">
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: getTextColor() }} width={95} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="count" fill={CHART_BLUE} radius={[0, 4, 4, 0]} name="Solved" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <NoData />
        )}
      </ChartCard>

      <ChartCard title="Top Companies">
        {companyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={Math.max(200, companyData.length * 28)}>
            <BarChart data={companyData} layout="vertical">
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: getTextColor() }} width={85} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="count" fill={CHART_VIOLET} radius={[0, 4, 4, 0]} name="Solved" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <NoData />
        )}
      </ChartCard>
    </div>
  </>
);

export default BreakdownCharts;
