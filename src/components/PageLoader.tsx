import { Loader2 } from "lucide-react";

const PageLoader = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <Loader2 className="h-5 w-5 animate-spin text-primary/60" />
    <p className="text-xs text-muted-foreground">{message}</p>
  </div>
);

export default PageLoader;
