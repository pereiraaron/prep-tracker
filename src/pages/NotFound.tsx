import usePageTitle from "@hooks/usePageTitle";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  usePageTitle("Page Not Found");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-125 w-125 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative text-center animate-fade-in">
        <p className="font-display text-[10rem] md:text-[12rem] font-bold leading-none text-primary/[0.06] select-none">404</p>
        <div className="-mt-16 md:-mt-20">
          <p className="font-display text-xl md:text-2xl font-bold">Page not found</p>
          <p className="mt-2 text-sm text-muted-foreground/70 max-w-xs mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved
          </p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <a
            href="/"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
