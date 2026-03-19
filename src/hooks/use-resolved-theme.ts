// hooks/use-resolved-theme.ts
import { useEffect, useState } from 'react'
import { useTheme } from '@/components/ThemeProvider'

export function useResolvedTheme() {
  const { theme } = useTheme()
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (theme === 'light' || theme === 'dark') {
      setResolvedTheme(theme)
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateTheme = () => {
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
    }

    updateTheme()
    mediaQuery.addEventListener('change', updateTheme)

    return () => mediaQuery.removeEventListener('change', updateTheme)
  }, [theme])

  return { resolvedTheme, mounted }
}
