import { ReactNode } from "react";
import { Zap } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/** Shared ambient glass frame for login / register. */
const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => (
  <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-10">
    <div className="app-background" aria-hidden>
      <div className="app-background-orb left-1/2 top-1/4 h-[28rem] w-[28rem] -translate-x-1/2 bg-primary/12 dark:bg-primary/16" />
      <div className="app-background-orb right-[12%] bottom-[18%] h-72 w-72 bg-stat-blue/10 dark:bg-stat-blue/14" />
      <div className="app-background-orb left-[10%] bottom-[12%] h-64 w-64 bg-stat-green/8 dark:bg-stat-green/12" />
    </div>

    <div className="relative w-full max-w-md space-y-7 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/25 mb-1">
          <Zap className="w-7 h-7" />
        </div>
        <div>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60 mb-2">
            PrepTracker
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1.5 text-muted-foreground/75 text-sm">{subtitle}</p>
        </div>
      </div>

      {children}
      {footer}
    </div>
  </div>
);

export default AuthShell;
