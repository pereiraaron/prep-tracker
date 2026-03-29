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
import {
  DIFF_COLORS,
  CATEGORY_CHART_COLORS,
  SOURCE_CHART_COLORS,
  CHART_BLUE,
  CHART_VIOLET,
  getGridColor,
  getTextColor,
} from "./constants";
import { ChartCard, NoData, chartTooltipStyle } from "./shared";

interface BreakdownChartsProps {
  categoryData: { name: string; short: string; count: number; key?: string }[];
  diffData: { name: string; count: number }[];
  diffByCatData: { name: string; Easy: number; Medium: number; Hard: number }[];
  topicData: { name: string; count: number }[];
  sourceData: { name: string; count: number; key?: string }[];
  companyData: { name: string; count: number }[];
}

const ROW2_HEIGHT = 240;

/* ---- Custom compact legend for donut ---- */
const CompactLegend = ({ payload }: any) => (
  <div className="flex items-center justify-center gap-4 mt-2">
    {payload?.map((entry: any, i: number) => (
      <div key={i} className="flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-[11px] text-muted-foreground">{entry.value}</span>
      </div>
    ))}
  </div>
);

/* ---- Horizontal bar with inline value ---- */
const RoundedBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  if (!width || width <= 0) return null;
  const r = Math.min(6, height / 2);
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={r} ry={r} />
    </g>
  );
};

const BreakdownCharts = ({
  categoryData,
  diffData,
  diffByCatData,
  topicData,
  sourceData,
  companyData,
}: BreakdownChartsProps) => {
  const diffTotal = diffData.reduce((s, d) => s + d.count, 0);

  return (
    <>
      {/* Row 1 */}
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        {/* By Category — colored bars */}
        <ChartCard title="By Category">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }} barCategoryGap="20%">
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="short" tick={{ fontSize: 11, fill: getTextColor() }} tickLine={false} axisLine={false} width={76} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="count" shape={<RoundedBar />} name="Solved" animationDuration={600}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={CATEGORY_CHART_COLORS[entry.key ?? ""] || CHART_BLUE} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        {/* By Difficulty — donut with center total */}
        <ChartCard title="By Difficulty">
          {diffData.some((d) => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Tooltip {...chartTooltipStyle} formatter={(value) => value} />
                <Pie
                  data={diffData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  strokeWidth={0}
                  animationDuration={600}
                >
                  {diffData.map((_, i) => (
                    <Cell key={i} fill={DIFF_COLORS[i]} />
                  ))}
                </Pie>
                <text x="50%" y="42%" textAnchor="middle" dominantBaseline="central" style={{ fill: "hsl(var(--foreground))", fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  {diffTotal}
                </text>
                <text x="50%" y="54%" textAnchor="middle" dominantBaseline="central" style={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}>
                  total
                </text>
                <Legend content={<CompactLegend />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        {/* Difficulty x Category — stacked */}
        <ChartCard title="Difficulty x Category">
          {diffByCatData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={diffByCatData} margin={{ top: 0, right: 4, bottom: 0, left: -12 }} barCategoryGap="25%">
                <CartesianGrid vertical={false} stroke={getGridColor()} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: getTextColor() }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} tickLine={false} axisLine={false} width={28} />
                <Tooltip {...chartTooltipStyle} />
                <Legend content={<CompactLegend />} />
                <Bar dataKey="Easy" stackId="a" fill={DIFF_COLORS[0]} animationDuration={600} />
                <Bar dataKey="Medium" stackId="a" fill={DIFF_COLORS[1]} animationDuration={600} />
                <Bar dataKey="Hard" stackId="a" fill={DIFF_COLORS[2]} radius={[4, 4, 0, 0]} animationDuration={600} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>
      </div>

      {/* Row 2 — consistent height */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Topics */}
        <ChartCard title="Top Topics">
          {topicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={ROW2_HEIGHT}>
              <BarChart data={topicData.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }} barCategoryGap="20%">
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: getTextColor() }} tickLine={false} axisLine={false} width={80} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="count" fill={CHART_BLUE} shape={<RoundedBar />} name="Solved" animationDuration={600} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        {/* Sources — colored bars */}
        <ChartCard title="By Source">
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={ROW2_HEIGHT}>
              <BarChart data={sourceData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }} barCategoryGap="20%">
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: getTextColor() }} tickLine={false} axisLine={false} width={90} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="count" shape={<RoundedBar />} name="Solved" animationDuration={600}>
                  {sourceData.map((entry, i) => (
                    <Cell key={i} fill={SOURCE_CHART_COLORS[entry.key ?? ""] || CHART_BLUE} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        {/* Companies */}
        <ChartCard title="Top Companies">
          {companyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={ROW2_HEIGHT}>
              <BarChart data={companyData.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }} barCategoryGap="20%">
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: getTextColor() }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: getTextColor() }} tickLine={false} axisLine={false} width={80} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="count" fill={CHART_VIOLET} shape={<RoundedBar />} name="Solved" animationDuration={600} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>
      </div>
    </>
  );
};

export default BreakdownCharts;
