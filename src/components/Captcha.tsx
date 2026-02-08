import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import { useColorMode } from '@hooks/useColorMode'

const SITE_KEY = '1x00000000000000000000AA'
const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function loadScript(): Promise<void> {
  if (document.getElementById(SCRIPT_ID)) {
    return window.turnstile
      ? Promise.resolve()
      : new Promise((resolve) => {
          const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement
          existing.addEventListener('load', () => resolve())
        })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Turnstile script'))
    document.head.appendChild(script)
  })
}

interface CaptchaProps {
  onVerify: (token: string) => void
  onExpire?: () => void
}

const Captcha = ({ onVerify, onExpire }: CaptchaProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const { colorMode } = useColorMode()

  useEffect(() => {
    let cancelled = false

    loadScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return

      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current)
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: onVerify,
        'expired-callback': onExpire,
        theme: colorMode,
        size: 'flexible',
      })
    })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [onVerify, onExpire, colorMode])

  return <Box ref={containerRef} width="full" />
}

export default Captcha
