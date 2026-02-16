import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
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
      setCredentials((prev) => prev.map((c) => (c._id === id ? credential : c)))
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename')
    }
  }

  const handleDelete = async (id: string) => {
    setError('')
    try {
      await passkeyApi.deleteCredential(id)
      setCredentials((prev) => prev.filter((c) => c._id !== id))
      setDeletingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <Box>
      <Heading size="sm" mb={3}>Passkeys</Heading>
      <Box
        bg="bg.card"
        borderWidth="1px"
        borderColor="border.card"
        borderRadius="xl"
        p={{ base: 4, md: 5 }}
      >
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', sm: 'center' }}
          gap={3}
          mb={3}
        >
          <HStack gap={2} color="fg.muted">
            <Box flexShrink={0}><LuFingerprint size={18} /></Box>
            <Text fontSize="sm">
              Sign in without a password using biometrics or a security key.
            </Text>
          </HStack>
          <Button
            size="sm"
            colorPalette="purple"
            onClick={handleRegister}
            loading={registering}
            flexShrink={0}
            w={{ base: 'full', sm: 'auto' }}
          >
            <LuPlus /> Register New Passkey
          </Button>
        </Flex>

        {error && (
          <Text color="red.500" fontSize="sm" mb={3}>
            {error}
          </Text>
        )}

        {loading ? (
          <Flex justify="center" py={6}>
            <Spinner size="sm" />
          </Flex>
        ) : fetchError ? (
          <VStack gap={2} py={4}>
            <Text fontSize="sm" color="fg.muted">Failed to load passkeys</Text>
            <Button variant="outline" size="xs" onClick={fetchCredentials}>
              <LuRefreshCw /> Retry
            </Button>
          </VStack>
        ) : credentials.length === 0 ? (
          <Text fontSize="sm" color="fg.muted" textAlign="center" py={4}>
            No passkeys registered yet.
          </Text>
        ) : (
          <VStack gap={0} align="stretch">
            {credentials.map((cred) => (
              <Flex
                key={cred._id}
                align="center"
                py={3}
                borderTopWidth="1px"
                borderColor="border.card"
                gap={3}
              >
                <Box flex="1" minW={0}>
                  {editingId === cred._id ? (
                    <HStack gap={2}>
                      <Input
                        size="sm"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(cred._id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        autoFocus
                      />
                      <IconButton
                        aria-label="Save"
                        size="xs"
                        variant="ghost"
                        colorPalette="green"
                        onClick={() => handleRename(cred._id)}
                      >
                        <LuCheck />
                      </IconButton>
                      <IconButton
                        aria-label="Cancel"
                        size="xs"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        <LuX />
                      </IconButton>
                    </HStack>
                  ) : (
                    <>
                      <Text fontSize="sm" fontWeight="medium" truncate>
                        {cred.name || 'Unnamed passkey'}
                      </Text>
                      <Text fontSize="xs" color="fg.muted">
                        {cred.deviceType === 'multiDevice' ? 'Synced' : 'Device-bound'}
                        {cred.backedUp && ' \u00b7 Backed up'}
                        {' \u00b7 '}
                        {new Date(cred.createdAt).toLocaleDateString()}
                      </Text>
                    </>
                  )}
                </Box>

                {editingId !== cred._id && (
                  <HStack gap={1}>
                    {deletingId === cred._id ? (
                      <>
                        <Button
                          size="xs"
                          colorPalette="red"
                          onClick={() => handleDelete(cred._id)}
                        >
                          Confirm
                        </Button>
                        <Button size="xs" variant="ghost" onClick={() => setDeletingId(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                          aria-label="Rename"
                          size="xs"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(cred._id)
                            setEditName(cred.name || '')
                          }}
                        >
                          <LuPencil />
                        </IconButton>
                        <IconButton
                          aria-label="Delete"
                          size="xs"
                          variant="ghost"
                          colorPalette="red"
                          onClick={() => setDeletingId(cred._id)}
                        >
                          <LuTrash2 />
                        </IconButton>
                      </>
                    )}
                  </HStack>
                )}
              </Flex>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  )
}

export default PasskeySection
