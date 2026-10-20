import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'Target Management | Pipeline workspace',
  description: 'Explore market opportunities, manage your target pipeline, and track every change.',
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
