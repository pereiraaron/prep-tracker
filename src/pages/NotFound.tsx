import usePageTitle from "@hooks/usePageTitle";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  usePageTitle("Page Not Found");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="app-background" aria-hidden>
        <div className="app-background-orb left-1/2 top-1/3 h-[26rem] w-[26rem] -translate-x-1/2 bg-primary/12" />
        <div className="app-background-orb right-[15%] bottom-[20%] h-64 w-64 bg-stat-blue/10" />
      </div>

      <div className="relative text-center animate-fade-in">
        <p className="font-display text-[10rem] md:text-[12rem] font-bold leading-none text-primary/[0.07] select-none">
          404
        </p>
        <div className="-mt-16 md:-mt-20">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/55 mb-2">
            PrepTracker
          </p>
          <p className="font-display text-xl md:text-2xl font-bold tracking-tight">Page not found</p>
          <p className="mt-2 text-sm text-muted-foreground/70 max-w-xs mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved
          </p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-xl border border-border/70 bg-white/40 px-4 py-2.5 text-sm font-medium backdrop-blur-sm hover:bg-white/60 active:scale-[0.98] transition-all dark:bg-white/5 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
