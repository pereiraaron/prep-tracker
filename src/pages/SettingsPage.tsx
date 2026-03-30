import usePageTitle from "@hooks/usePageTitle";
import Layout from "@components/Layout";
import PageHeader from "@components/PageHeader";
import PasskeySection from "@components/settings/PasskeySection";
import { User, Moon, Sun, Settings as SettingsIcon, Palette, CalendarClock, X } from "lucide-react";
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
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        subtitle="Manage your account and preferences"
      />

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
              className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${isDark ? "bg-primary" : "bg-border"}`}
              aria-label="Toggle theme"
            >
              <div
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow-sm transition-all duration-200 ${isDark ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>

        {/* Interview Countdown */}
        <InterviewCountdownSetting />

        {/* Security – Passkeys */}
        <PasskeySection />
      </div>
    </Layout>
  );
};

const InterviewCountdownSetting = () => {
  const [date, setDate] = useState(() => localStorage.getItem("interviewDate") || "");
  const [label, setLabel] = useState(() => localStorage.getItem("interviewLabel") || "");

  const handleSave = () => {
    if (date) {
      localStorage.setItem("interviewDate", date);
      localStorage.setItem("interviewLabel", label.trim());
    }
  };

  const handleClear = () => {
    setDate("");
    setLabel("");
    localStorage.removeItem("interviewDate");
    localStorage.removeItem("interviewLabel");
  };

  const saved = localStorage.getItem("interviewDate");

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-display text-sm font-semibold">Interview Countdown</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Set an upcoming interview date to see a countdown on your dashboard.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Label (optional)</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Google Round 1"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!date}
            className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
          >
            Save
          </button>
          {saved && (
            <button
              onClick={handleClear}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              aria-label="Clear interview date"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
