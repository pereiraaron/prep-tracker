import usePageTitle from "@hooks/usePageTitle";
import Layout from "@components/Layout";
import { User, Moon, Sun, Settings as SettingsIcon, Palette, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@store/useAuthStore";

const SettingsPage = () => {
  usePageTitle("Settings");
  const user = useAuthStore((s) => s.user);
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Profile */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-sm font-semibold">Profile</h2>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl font-display text-lg font-bold text-primary-foreground"
              style={{
                background: "linear-gradient(135deg, hsl(230, 65%, 55%), hsl(170, 70%, 45%))",
              }}
            >
              {(user?.username || user?.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-display text-sm font-semibold">
                {user?.username || user?.email?.split("@")[0] || "User"}
              </p>
              {user?.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-sm font-semibold">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-medium">{isDark ? "Dark" : "Light"} Mode</p>
                <p className="text-xs text-muted-foreground">Toggle your preferred theme</p>
              </div>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`relative h-7 w-12 rounded-full transition-colors ${isDark ? "bg-primary" : "bg-border"}`}
            >
              <div
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-transform ${isDark ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-sm font-semibold">Security</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Passkey and authentication settings will appear here once connected to a backend.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
