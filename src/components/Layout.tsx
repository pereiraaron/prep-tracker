import { ReactNode, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, BarChart3, Archive, Shuffle, Settings, Zap, LogOut, Sun, Moon, MoreHorizontal, X } from "lucide-react";
import useAuth from "@hooks/useAuth";
import useKeyboardShortcuts from "@hooks/useKeyboardShortcuts";
import prefetchRoute from "@lib/prefetchRoute";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/questions", icon: BookOpen, label: "Questions" },
  { to: "/backlog", icon: Archive, label: "Backlog" },
  { to: "/revision", icon: Shuffle, label: "Revision" },
  { to: "/stats", icon: BarChart3, label: "Stats" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const mobilePrimary = navItems.slice(0, 4);
const mobileMore = navItems.slice(4);

const Layout = ({ children }: { children: ReactNode }) => {
  useKeyboardShortcuts();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return document.documentElement.classList.contains("dark");
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const userInitial = (user?.username || user?.email || "U")[0].toUpperCase();
  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const moreActive = mobileMore.some((item) =>
    item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to),
  );

  return (
    <div className="relative flex min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg">Skip to content</a>

      {/* Ambient background */}
      <div className="app-background" aria-hidden>
        <div className="app-background-orb -left-32 -top-32 h-96 w-96 bg-primary/8 dark:bg-primary/12" />
        <div className="app-background-orb -right-24 top-1/4 h-80 w-80 bg-stat-purple/6 dark:bg-stat-purple/10" />
        <div className="app-background-orb bottom-0 left-1/3 h-72 w-72 bg-stat-green/5 dark:bg-stat-green/8" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-56 flex-col border-r border-border bg-card/80 backdrop-blur-md md:flex">
        <div className="flex h-14 items-center gap-2.5 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm shadow-primary/20">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-display text-base font-bold tracking-tight">PrepTracker</span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onMouseEnter={() => prefetchRoute(item.to)}
              onFocus={() => prefetchRoute(item.to)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-4 w-4 transition-transform ${isActive ? "" : "group-hover:scale-110"}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-bold text-primary font-display ring-1 ring-primary/10">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{displayName}</p>
              {displayEmail && <p className="text-[11px] text-muted-foreground truncate">{displayEmail}</p>}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-md safe-area-pb md:hidden">
        {moreOpen && (
          <div className="border-b border-border px-3 py-2">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">More</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
                aria-label="Close menu"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {mobileMore.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/70",
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
        <div className="flex">
          {mobilePrimary.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMoreOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn("rounded-xl p-1.5 transition-colors", isActive && "bg-primary/10")}>
                    <item.icon className="h-5 w-5" />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen((o) => !o)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors",
              moreOpen || moreActive ? "text-primary" : "text-muted-foreground",
            )}
            aria-expanded={moreOpen}
            aria-label="More navigation"
          >
            <span className={cn("rounded-xl p-1.5 transition-colors", (moreOpen || moreActive) && "bg-primary/10")}>
              <MoreHorizontal className="h-5 w-5" />
            </span>
            More
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main id="main-content" className="relative z-10 flex-1 md:ml-56 min-w-0">
        <div className="w-full px-4 py-5 pb-28 md:px-16 md:py-8 md:pb-8 animate-fade-in">{children}</div>
      </main>

      {/* Theme toggle — fixed bottom-right, desktop only */}
      <Button
        variant="outline"
        size="iconSm"
        onClick={toggleTheme}
        className="hidden md:flex fixed bottom-6 right-6 z-40 rounded-full shadow-lg hover:scale-105"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default Layout;
