export const chartTooltipStyle = {
  contentStyle: {
    background: "hsl(var(--glass-bg))",
    border: "1px solid hsl(var(--glass-border-strong))",
    borderRadius: "0.875rem",
    fontSize: "12px",
    boxShadow: "var(--glass-shadow)",
    padding: "10px 14px",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  },
  labelStyle: {
    color: "hsl(var(--foreground))",
    fontWeight: 600,
    marginBottom: "4px",
    fontSize: "12px",
    letterSpacing: "-0.01em",
  },
  itemStyle: {
    color: "hsl(var(--muted-foreground))",
    fontSize: "11px",
    padding: "1px 0",
  },
  cursor: { fill: "hsl(var(--primary) / 0.05)", stroke: "none" },
};

export const NoData = () => (
  <div className="flex items-center justify-center py-12">
    <p className="text-sm text-muted-foreground/60">No data yet</p>
  </div>
);

export const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 mb-5 mt-4">
    <h2 className="font-display text-[15px] md:text-base font-bold tracking-tight">{title}</h2>
    <div className="flex-1 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
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
  <div className={`glass-card rounded-2xl p-5 ${className}`}>
    <h3 className="font-display text-sm font-semibold tracking-tight text-foreground/80 mb-4">{title}</h3>
    {children}
  </div>
);
