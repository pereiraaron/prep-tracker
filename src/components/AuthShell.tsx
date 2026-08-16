import { ReactNode } from "react";
import BrandLogo from "@components/BrandLogo";

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
      <div className="app-background-orb left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 bg-primary/10 dark:bg-primary/14" />
    </div>

    <div className="relative w-full max-w-md space-y-7 animate-fade-in">
      <div className="text-center space-y-3">
        <BrandLogo size="lg" showWordmark={false} to={null} className="justify-center mb-1" />
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
