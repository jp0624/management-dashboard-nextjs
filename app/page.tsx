import Link from 'next/link'
import { FaAngleRight } from 'react-icons/fa'

export default function Home() {
	return (
		<>
			<main className='flex min-h-screen flex-col items-center justify-center text-center'>
				<h1 className='text-2xl lg:text-4xl font-bold mb-2'>
					Target Management Dashboard
				</h1>
				<h2 className='text-base lg:text-xl mb-5'>
					Docker + Next.js + Tailwind + chart.js
				</h2>
				<Link href='/dashboard'>
					<button
						className={`py-1 px-3 rounded bg-blue-500 text-white flex flex-row items-center justify-between gap-1`}
					>
						<span>Go to Dashboard</span>
						<FaAngleRight />
					</button>
				</Link>
			</main>
		</>
	)
}
