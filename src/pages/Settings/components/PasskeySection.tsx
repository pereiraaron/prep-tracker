import { useCallback, useEffect, useState } from 'react'
import { LuCheck, LuFingerprint, LuPencil, LuPlus, LuRefreshCw, LuTrash2, LuX } from 'react-icons/lu'
import { startRegistration } from '@simplewebauthn/browser'
import { passkeyApi } from '@api/passkey'
import type { PasskeyCredential } from '@api/passkey'

const PasskeySection = () => {
  const [credentials, setCredentials] = useState<PasskeyCredential[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [error, setError] = useState('')
  const [registering, setRegistering] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchCredentials = useCallback(async () => {
    setLoading(true)
    setFetchError(false)
    try {
      const { credentials } = await passkeyApi.listCredentials()
      setCredentials(credentials)
    } catch {
      setFetchError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCredentials()
  }, [fetchCredentials])

  const handleRegister = async () => {
    setRegistering(true)
    setError('')
    try {
      const { options, challengeId } = await passkeyApi.getRegisterOptions()
      const credential = await startRegistration({ optionsJSON: options })
      await passkeyApi.verifyRegister(challengeId, credential)
      await fetchCredentials()
    } catch (err) {
      if (err instanceof Error && err.name === 'NotAllowedError') return
      setError(err instanceof Error ? err.message : 'Failed to register passkey')
    } finally {
      setRegistering(false)
    }
  }

  const handleRename = async (id: string) => {
    if (!editName.trim()) return
    setError('')
    try {
      const { credential } = await passkeyApi.renameCredential(id, editName.trim())
      setCredentials((prev) => prev.map((c) => (c.id === id ? credential : c)))
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename')
    }
  }

  const handleDelete = async (id: string) => {
    setError('')
    try {
      await passkeyApi.deleteCredential(id)
      setCredentials((prev) => prev.filter((c) => c.id !== id))
      setDeletingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <div>
      <h2 className="text-sm font-bold mb-3">Passkeys</h2>
      <div className="glass-card rounded-xl p-4 md:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-3">
          <div className="flex items-center gap-2 text-(--muted-foreground)">
            <span className="shrink-0"><LuFingerprint size={18} /></span>
            <p className="text-sm">
              Sign in without a password using biometrics or a security key.
            </p>
          </div>
          <button
            className="btn-primary text-sm w-full sm:w-auto shrink-0"
            onClick={handleRegister}
            disabled={registering}
          >
            {registering ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <LuPlus />
            )}
            Register New Passkey
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-(--muted) border-t-(--color-primary)" />
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <p className="text-sm text-(--muted-foreground)">Failed to load passkeys</p>
            <button className="btn-outline text-xs" onClick={fetchCredentials}>
              <LuRefreshCw size={14} /> Retry
            </button>
          </div>
        ) : credentials.length === 0 ? (
          <p className="text-sm text-(--muted-foreground) text-center py-4">
            No passkeys registered yet.
          </p>
        ) : (
          <div className="flex flex-col">
            {credentials.map((cred) => (
              <div
                key={cred.id}
                className="flex items-center py-3 border-t border-(--border) gap-3"
              >
                <div className="flex-1 min-w-0">
                  {editingId === cred.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="input-base text-sm"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(cred.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        autoFocus
                      />
                      <button
                        aria-label="Save"
                        className="p-1.5 rounded-lg hover:bg-(--secondary) transition-colors text-green-500"
                        onClick={() => handleRename(cred.id)}
                      >
                        <LuCheck size={16} />
                      </button>
                      <button
                        aria-label="Cancel"
                        className="p-1.5 rounded-lg hover:bg-(--secondary) transition-colors"
                        onClick={() => setEditingId(null)}
                      >
                        <LuX size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium truncate">
                        {cred.name || 'Unnamed passkey'}
                      </p>
                      <p className="text-xs text-(--muted-foreground)">
                        {cred.deviceType === 'multiDevice' ? 'Synced' : 'Device-bound'}
                        {cred.backedUp && ' \u00b7 Backed up'}
                        {' \u00b7 '}
                        {new Date(cred.createdAt).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>

                {editingId !== cred.id && (
                  <div className="flex items-center gap-1">
                    {deletingId === cred.id ? (
                      <>
                        <button
                          className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-medium"
                          onClick={() => handleDelete(cred.id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn-ghost text-xs py-1"
                          onClick={() => setDeletingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          aria-label="Rename"
                          className="p-1.5 rounded-lg hover:bg-(--secondary) transition-colors"
                          onClick={() => {
                            setEditingId(cred.id)
                            setEditName(cred.name || '')
                          }}
                        >
                          <LuPencil size={14} />
                        </button>
                        <button
                          aria-label="Delete"
                          className="p-1.5 rounded-lg hover:bg-(--secondary) transition-colors text-red-500"
                          onClick={() => setDeletingId(cred.id)}
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PasskeySection
