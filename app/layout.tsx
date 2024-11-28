import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
})

export const metadata: Metadata = {
	title: 'Target Management Dashboard',
	description: 'Eveluate market target pipeline status data.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<div className='text-center absolute top-2 left-2 px-2 py-1 z-10 block border border-white-900 rounded text-sm text-white bg-slate-900'>
					Mode: {process.env.NEXT_PUBLIC_MODE}
				</div>
				{/* header */}
				{children}
				{/* footer */}
			</body>
		</html>
	)
}
