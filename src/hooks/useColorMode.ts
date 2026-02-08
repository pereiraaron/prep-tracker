import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'color-mode'

function getSnapshot(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

function applyColorMode(mode: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

function getInitialMode(): 'light' | 'dark' {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Apply on module load to avoid flash of wrong theme
applyColorMode(getInitialMode())

export function useColorMode() {
  const colorMode = useSyncExternalStore(subscribe, getSnapshot)

  const toggleColorMode = useCallback(() => {
    const next = colorMode === 'light' ? 'dark' : 'light'
    localStorage.setItem(STORAGE_KEY, next)
    applyColorMode(next)
  }, [colorMode])

  return { colorMode, toggleColorMode }
}
