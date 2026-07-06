import { DIFFICULTY_COLORS, CATEGORY_COLORS, SOURCE_COLORS } from "@lib/styles";
import { CATEGORY_LABEL, SOURCE_LABEL } from "@api/types";

export const DifficultyBadge = ({ value }: { value: string }) => (
  <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none ${DIFFICULTY_COLORS[value] || ""}`}>
    {value}
  </span>
);

export const CategoryBadge = ({ value }: { value: string }) => (
  <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold leading-none ${CATEGORY_COLORS[value] || ""}`}>
    {CATEGORY_LABEL[value as keyof typeof CATEGORY_LABEL] || value}
  </span>
);

export const SourceBadge = ({ value }: { value: string }) => (
  <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold leading-none ${SOURCE_COLORS[value] || SOURCE_COLORS.other}`}>
    {SOURCE_LABEL[value as keyof typeof SOURCE_LABEL] || value}
  </span>
);
