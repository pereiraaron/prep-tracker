export const NoData = () => (
  <div className="py-8 text-center">
    <p className="text-sm text-muted-foreground">Solve some questions and your stats will appear here</p>
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
  <div className={`glass-card rounded-xl p-5 transition-all hover:shadow-sm ${className}`}>
    <h3 className="font-display text-sm font-semibold mb-4">{title}</h3>
    {children}
  </div>
);
