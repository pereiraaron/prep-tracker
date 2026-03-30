export const chartTooltipStyle = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.625rem",
    fontSize: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    padding: "8px 12px",
  },
  labelStyle: {
    color: "hsl(var(--foreground))",
    fontWeight: 600,
    marginBottom: "4px",
    fontSize: "12px",
  },
  itemStyle: {
    color: "hsl(var(--muted-foreground))",
    fontSize: "11px",
    padding: "1px 0",
  },
  cursor: { fill: "hsl(var(--foreground) / 0.04)", stroke: "none" },
};

export const NoData = () => (
  <div className="flex items-center justify-center py-12">
    <p className="text-sm text-muted-foreground/60">No data yet</p>
  </div>
);

export const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 mb-5 mt-4">
    <h2 className="font-display text-base font-bold">{title}</h2>
    <div className="flex-1 h-px bg-border" />
  </div>
);

export const ChartCard = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`glass-card rounded-xl p-5 ${className}`}>
    <h3 className="font-display text-[13px] font-semibold text-muted-foreground mb-4">{title}</h3>
    {children}
  </div>
);
