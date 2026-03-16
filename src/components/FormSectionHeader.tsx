interface FormSectionHeaderProps {
  icon: React.ElementType;
  title: string;
}

const FormSectionHeader = ({ icon: Icon, title }: FormSectionHeaderProps) => (
  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border">
    <Icon className="h-4 w-4 text-primary" />
    <h2 className="font-display text-sm font-semibold">{title}</h2>
  </div>
);

export default FormSectionHeader;
