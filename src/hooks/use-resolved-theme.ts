import { useEffect, useState } from 'react'
import { useTheme } from '@/components/ThemeProvider'

export function useResolvedTheme(): 'light' | 'dark' {
  const { theme } = useTheme()
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    if (theme === 'light' || theme === 'dark') {
      setResolvedTheme(theme)
      return
    }

    // system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateTheme = () => {
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
    }

    updateTheme() // initial
    mediaQuery.addEventListener('change', updateTheme)

    return () => mediaQuery.removeEventListener('change', updateTheme)
  }, [theme])

  return resolvedTheme
}
