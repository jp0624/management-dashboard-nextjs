import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './components/theme/ThemeProvider'
export const metadata: Metadata = {
  title: 'Target Management | Pipeline workspace',
  description: 'Explore market opportunities, manage your target pipeline, and track every change.',
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('target-management.theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}})()` }} /></head><body><ThemeProvider>{children}</ThemeProvider></body></html>
}
