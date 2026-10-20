'use client'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from './ThemeProvider'
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return <button type="button" role="switch" aria-checked={theme === 'dark'} aria-label="Dark mode" onClick={toggleTheme}
    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
    {theme === 'dark' ? <MoonIcon aria-hidden="true" className="h-4 w-4" /> : <SunIcon aria-hidden="true" className="h-4 w-4" />}
    <span>Dark mode</span><span aria-hidden="true" className={`flex h-5 w-9 items-center rounded-full p-0.5 ${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-300'}`}><span className={`h-4 w-4 rounded-full bg-white shadow-sm ${theme === 'dark' ? 'translate-x-4' : ''}`} /></span>
  </button>
}
