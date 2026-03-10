export const NoData = () => (
  <p className="py-8 text-center text-sm text-muted-foreground">Solve some questions and your stats will appear here</p>
);

export const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="font-display text-base font-bold mb-4 mt-2">{title}</h2>
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
    <h3 className="font-display text-sm font-semibold mb-4">{title}</h3>
    {children}
  </div>
);
