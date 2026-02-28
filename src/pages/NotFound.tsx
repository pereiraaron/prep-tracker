import usePageTitle from "@hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("Page Not Found");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold text-muted-foreground/30">404</h1>
        <p className="mt-2 font-display text-lg font-semibold">Page not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you're looking for doesn't exist
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
