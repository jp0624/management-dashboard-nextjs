'use client'
import { createContext, useContext, useEffect, useState } from 'react'
type Theme = 'light' | 'dark'
const KEY = 'target-management.theme'
const ThemeContext = createContext({ theme: 'light' as Theme, toggleTheme: () => {} })
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      let preference: string | null = null
      try { preference = localStorage.getItem(KEY) } catch { /* System preference still works without storage. */ }
      const next = preference === 'dark' || preference === 'light' ? preference : media.matches ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', next === 'dark')
      document.documentElement.style.colorScheme = next
      setTheme(next)
    }
    sync()
    const storage = (event: StorageEvent) => { if (event.key === KEY || event.key === null) sync() }
    media.addEventListener('change', sync)
    window.addEventListener('storage', storage)
    return () => { media.removeEventListener('change', sync); window.removeEventListener('storage', storage) }
  }, [])
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    document.documentElement.style.colorScheme = next
    setTheme(next)
    try { localStorage.setItem(KEY, next) } catch { /* Keep the switch usable for this session. */ }
  }
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
export const useTheme = () => useContext(ThemeContext)
