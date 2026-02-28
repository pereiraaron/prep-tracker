import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Archive,
  Settings,
  Zap,
  LogOut,
} from "lucide-react";
import useAuth from "@hooks/useAuth";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/questions", icon: BookOpen, label: "Questions" },
  { to: "/backlog", icon: Archive, label: "Backlog" },
  { to: "/stats", icon: BarChart3, label: "Stats" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const userInitial = (user?.username || user?.email || "U")[0].toUpperCase();
  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-56 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-14 items-center gap-2.5 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-display text-base font-bold tracking-tight">
            PrepTracker
          </span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary font-display">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{displayName}</p>
              {displayEmail && (
                <p className="text-xs text-muted-foreground truncate">
                  {displayEmail}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-card safe-area-pb md:hidden">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 md:ml-56">
        <div className="w-full px-4 py-5 pb-24 md:px-16 md:py-8 md:pb-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
