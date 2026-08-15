import { Tooltip, TooltipTrigger, TooltipContent } from "@components/ui/tooltip";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: React.ReactNode;
}

const IconButton = ({ label, children, ...props }: IconButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button aria-label={label} {...props}>
        {children}
      </button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

export default IconButton;
