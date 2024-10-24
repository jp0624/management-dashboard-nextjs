'use client'
import { useEffect, useState } from 'react'
import { DB_API_PATH } from '@/app/constants/paths'
import { FaTimesCircle } from 'react-icons/fa'

interface StatusChangeHistory {
	id: number
	targetId: number
	oldStatus: string | null
	newStatus: string | null
	changedAt: string // ISO format date string
}

interface Target {
	id: number
	name: string
}

const HistoryModal = ({
	isOpen,
	onClose,
	historyData,
	targets,
}: {
	isOpen: boolean
	onClose: () => void
	historyData: StatusChangeHistory[]
	targets: Target[]
}) => {
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		if (isOpen) {
			// No need to fetch again; we can use the provided historyData
			setLoading(false)
		}
	}, [isOpen, historyData])

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 z-10'>
			<div className='bg-white rounded shadow-lg p-6 max-w-md w-full h-1/2 flex flex-col '>
				<h2 className='text-xl font-bold mb-4 flex flex-row items-center justify-between'>
					<span>Status Change History</span>
					<button
						onClick={onClose}
						className='bg-red-500 text-white text-sm px-2 py-1 rounded flex items-center justify-center flex-row gap-2'
					>
						<FaTimesCircle /> Close
					</button>
				</h2>
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<p className='text-red-500'>{error}</p>
				) : (
					<>
						<ul className='flex flex-col overflow-y-auto h-full gap-3 scrollbar-targets pr-5 shadow-btm-mid'>
							{historyData.length === 0 && (
								<p className='h-full flex items-center justify-center'>
									<span>Saved status change history is empty.</span>
								</p>
							)}
							{historyData.map((entry) => {
								const target = targets.find((t) => t.id === entry.targetId)
								return (
									<li
										className='border border-gray-300 px-4 py-3 rounded shadow-btm-mid'
										key={entry.id}
									>
										<div className='flex flex-row justify-between'>
											<h2 className='text-sm font-bold text-ellipsis whitespace-nowrap overflow-hidden'>
												{target ? target.name : 'Unknown'}
											</h2>
											{/* <span className='text-gray-500 text-sm'>
												{new Date(entry.changedAt).toLocaleString()}
											</span> */}
										</div>
										<div className='text-gray-500 text-sm flex flex-col justify-between'>
											<span className='text-gray-500 flex-1 text-sm whitespace-nowrap'>
												{new Date(entry.changedAt).toLocaleString()}
											</span>
											<div className='flex flex-1 flex-row justify-between items-center'>
												<span className='text-gray-500 flex-1 text-sm whitespace-nowrap'>
													Status:
												</span>
												<span className='text-red-600 flex-1 text-center whitespace-nowrap'>
													From: <b>{entry.oldStatus}</b>
												</span>{' '}
												<span className='text-green-600 flex-1 text-md whitespace-nowrap text-center'>
													To: <b>{entry.newStatus}</b>
												</span>
											</div>
										</div>
									</li>
								)
							})}
						</ul>
					</>
				)}
			</div>
		</div>
	)
}

export default HistoryModal
