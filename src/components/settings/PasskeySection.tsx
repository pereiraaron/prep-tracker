import { useState, useEffect } from "react";
import { passkeyApi, type PasskeyCredential } from "@api/passkey";
import { Button } from "@components/ui/button";
import { Fingerprint, Plus, Trash2, Loader2 } from "lucide-react";
import Skeleton from "@components/Skeleton";

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
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2.5">
              <Skeleton className="h-4 w-4 rounded shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-4 rounded shrink-0" />
            </div>
          ))}
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

export default PasskeySection;
