/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { SetStateAction, useEffect, useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import { apiFetch } from '@/app/api/apiClient'

interface StatusChangeHistory {
	id: number
	targetId: number
	oldStatus: string | null
	newStatus: string | null
	changedAt: string
}

interface Target {
	id: number
	name: string
}

const HistoryModal = ({
	isOpen,
	onClose,
	targets,
}: {
	isOpen: boolean
	onClose: () => void
	targets: Target[]
}) => {
	const [historyData, setHistoryData] = useState<StatusChangeHistory[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (isOpen) {
			setLoading(true)
			apiFetch('/history') // Make sure this endpoint exists
				.then((data: SetStateAction<StatusChangeHistory[]>) =>
					setHistoryData(data)
				)
				.catch((error: any) => console.error('Failed to fetch history:', error))
				.finally(() => setLoading(false))
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 z-10'>
			<div className='bg-white rounded shadow-lg p-6 max-w-md w-full h-1/2 flex flex-col'>
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
					<p className='h-full flex items-center justify-center'>
						<span>Loading...</span>
					</p>
				) : (
					<ul className='flex flex-col overflow-y-auto h-full gap-3 scrollbar-targets pr-5 shadow-btm-mid'>
						{historyData.length === 0 ? (
							<p className='h-full flex items-center justify-center'>
								<span>Saved status change history is empty.</span>
							</p>
						) : (
							historyData.map((entry) => {
								const target = targets.find((t) => t.id === entry.targetId)
								return (
									<li
										key={entry.id}
										className='border border-gray-300 px-4 py-3 rounded shadow-btm-mid'
									>
										<h2 className='text-sm font-bold'>
											{target ? target.name : 'Unknown'}
										</h2>
										<p className='text-gray-500'>
											Changed on: {new Date(entry.changedAt).toLocaleString()}
										</p>
										<p>
											Status: From <b>{entry.oldStatus}</b> to{' '}
											<b>{entry.newStatus}</b>
										</p>
									</li>
								)
							})
						)}
					</ul>
				)}
			</div>
		</div>
	)
}

export default HistoryModal
