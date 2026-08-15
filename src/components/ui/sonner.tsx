import { useEffect, useState } from "react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const readTheme = (): NonNullable<ToasterProps["theme"]> =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<ToasterProps["theme"]>(readTheme);

  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setTheme(readTheme());
    const observer = new MutationObserver(sync);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="bottom-right"
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            "group toast glass-card !rounded-2xl !border-border/50 !shadow-[var(--glass-shadow)] group-[.toaster]:text-foreground group-[.toaster]:backdrop-blur-xl",
          title: "group-[.toast]:font-display group-[.toast]:text-sm group-[.toast]:font-semibold group-[.toast]:tracking-tight",
          description: "group-[.toast]:text-muted-foreground/80 group-[.toast]:text-xs",
          success: "group-[.toaster]:!border-stat-green/25",
          error: "group-[.toaster]:!border-destructive/30",
          actionButton:
            "group-[.toast]:!rounded-xl group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground group-[.toast]:!shadow-sm",
          cancelButton:
            "group-[.toast]:!rounded-xl group-[.toast]:!bg-secondary/80 group-[.toast]:!text-muted-foreground",
          closeButton:
            "group-[.toast]:!border-border/50 group-[.toast]:!bg-background/60 group-[.toast]:!text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
