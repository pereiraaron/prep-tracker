interface FormSectionHeaderProps {
  icon: React.ElementType;
  title: string;
}

const FormSectionHeader = ({ icon: Icon, title }: FormSectionHeaderProps) => (
  <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-border/60">
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="h-3.5 w-3.5" />
    </div>
    <h2 className="font-display text-sm font-semibold tracking-tight">{title}</h2>
  </div>
);

export default FormSectionHeader;
