import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, BarChart3, Archive, Shuffle, Settings, Zap, LogOut, Sun, Moon } from "lucide-react";
import { useState } from "react";
import useAuth from "@hooks/useAuth";
import useKeyboardShortcuts from "@hooks/useKeyboardShortcuts";
import prefetchRoute from "@lib/prefetchRoute";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/questions", icon: BookOpen, label: "Questions" },
  { to: "/backlog", icon: Archive, label: "Backlog" },
  { to: "/revision", icon: Shuffle, label: "Revision" },
  { to: "/stats", icon: BarChart3, label: "Stats" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const Layout = ({ children }: { children: ReactNode }) => {
  useKeyboardShortcuts();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  return (
    <div className="flex min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg">Skip to content</a>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-56 flex-col border-r border-border bg-card md:flex">
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
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-card/95 backdrop-blur-sm safe-area-pb md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Main content */}
      <main id="main-content" className="flex-1 md:ml-56 min-w-0">
        <div className="w-full px-4 py-5 pb-24 md:px-16 md:py-8 md:pb-8 animate-fade-in">{children}</div>
      </main>

      {/* Theme toggle — fixed bottom-right, desktop only */}
      <button
        onClick={toggleTheme}
        className="hidden md:flex fixed bottom-6 right-6 z-40 h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all hover:scale-105 active:scale-95"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default Layout;
