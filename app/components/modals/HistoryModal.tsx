/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { SetStateAction, useEffect, useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import { apiFetch } from '@/app/api/apiClient'
import { HISTORY_FOLDER } from '@/app/constants/paths'
import { StatusChangeHistory } from '../../types'

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
			apiFetch(`${HISTORY_FOLDER}`) // Make sure this endpoint exists
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
					<span>Target History</span>
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
								<span>Target history is empty.</span>
							</p>
						) : (
							historyData.map((entry) => {
								const target = targets.find((t) => t.id === entry.targetId)
								return (
									<li
										key={entry.id + '-' + Math.random()}
										className='border border-gray-300 px-2 py-3 rounded shadow-btm-mid text-sm'
									>
										<h2 className='text-base font-bold text-center border-b border-gray-300'>
											{target ? target.name : entry.name}
										</h2>
										<p className='text-gray-500 text-center pt-2'>
											Changed: {new Date(entry.changedAt).toLocaleString()}
										</p>
										<ul className='text-gray-500 flex flex-row flex-grow border-b pb-2 border-gray-300'>
											<li className='w-full text-center'>
												Action:{' '}
												{entry.action === 'status' && (
													<span className='text-slate-800 font-bold'>
														Status Update
													</span>
												)}
												{entry.action === 'add' && (
													<span className='text-green-500 font-bold'>
														Added
													</span>
												)}
												{entry.action === 'delete' && (
													<span className='text-red-500 font-bold'>
														Deleted
													</span>
												)}
											</li>
										</ul>
										{entry.action === 'status' && (
											<ul className='text-gray-500 flex flex-row flex-grow'>
												<li className='w-1/2 text-center'>
													From:{' '}
													<span className='font-bold'>
														{entry.oldStatus ? entry.oldStatus : 'Not Set'}
													</span>
												</li>
												<li className='w-1/2 text-center'>
													To:{' '}
													<span className='text-blue-500 font-bold'>
														{entry.newStatus ? entry.newStatus : 'Not Set'}
													</span>
												</li>
											</ul>
										)}
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
