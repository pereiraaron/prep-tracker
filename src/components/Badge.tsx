import { DIFFICULTY_COLORS, CATEGORY_COLORS } from "@lib/styles";
import { CATEGORY_LABEL } from "@api/types";

export const DifficultyBadge = ({ value }: { value: string }) => (
  <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase ${DIFFICULTY_COLORS[value] || ""}`}>
    {value}
  </span>
);

export const CategoryBadge = ({ value }: { value: string }) => (
  <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[value] || ""}`}>
    {CATEGORY_LABEL[value as keyof typeof CATEGORY_LABEL] || value}
  </span>
);

export const TopicBadge = ({ value }: { value: string }) => (
  <span className="rounded-md bg-secondary border border-border px-2 py-0.5 text-[10px] font-medium text-foreground">
    {value}
  </span>
);

export const SourceBadge = ({ value }: { value: string }) => (
  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
    {value}
  </span>
);

export const TagBadge = ({ value }: { value: string }) => (
  <span className="rounded-md bg-primary/5 border border-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary/80">
    {value}
  </span>
);

export const CompanyTagBadge = ({ value }: { value: string }) => (
  <span className="rounded-md bg-stat-blue/5 border border-stat-blue/10 px-2 py-0.5 text-[10px] font-medium text-stat-blue/80">
    {value}
  </span>
);
