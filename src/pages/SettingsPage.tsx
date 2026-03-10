import usePageTitle from "@hooks/usePageTitle";
import Layout from "@components/Layout";
import { User, Moon, Sun, Settings as SettingsIcon, Palette, Fingerprint, Plus, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@store/useAuthStore";
import { passkeyApi, type PasskeyCredential } from "@api/passkey";
import { Button } from "@components/ui/button";

const PasskeySection = () => {
  const [credentials, setCredentials] = useState<PasskeyCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCredentials = async () => {
    setLoading(true);
    setError(null);
    try {
      const { credentials: creds } = await passkeyApi.listCredentials();
      setCredentials(creds);
    } catch {
      setError("Could not load passkeys.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  const handleRegister = async () => {
    setRegistering(true);
    setError(null);
    try {
      const { options, challengeId } = await passkeyApi.getRegisterOptions();
      const { startRegistration } = await import("@simplewebauthn/browser");
      const credential = await startRegistration({ optionsJSON: options });
      await passkeyApi.verifyRegister(challengeId, credential);
      await loadCredentials();
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        setRegistering(false);
        return;
      }
      setError("Failed to register passkey. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await passkeyApi.deleteCredential(id);
      setCredentials((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Failed to remove passkey.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-display text-sm font-semibold">Passkeys</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          disabled={registering}
          onClick={handleRegister}
        >
          {registering ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Add Passkey
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive mb-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : credentials.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No passkeys registered yet. Add one to enable passwordless sign-in.
        </p>
      ) : (
        <div className="space-y-2">
          {credentials.map((cred) => (
            <div
              key={cred.id}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 px-3 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Fingerprint className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{cred.name || "Passkey"}</p>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(cred.createdAt).toLocaleDateString()}
                    {cred.backedUp && " · Synced"}
                  </p>
                </div>
              </div>
              <button
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                disabled={deletingId === cred.id}
                onClick={() => handleDelete(cred.id)}
                title="Remove passkey"
              >
                {deletingId === cred.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
            <h1 className="font-display text-lg md:text-xl font-bold">Settings</h1>
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

        {/* Security – Passkeys */}
        <PasskeySection />
      </div>
    </Layout>
  );
};

export default SettingsPage;
