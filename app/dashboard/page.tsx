/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import { DB_API_PATH } from '../constants/paths'
import TargetTable from '@/components/TargetTable'
import BarChart from '@/components/BarChart'
import DataFilter from '@/components/DataFilter'
import AddTarget from '@/components/AddTarget'
import HistoryModal from '@/components/HistoryModal'
import { FaPlus } from 'react-icons/fa'

interface TargetData {
	id: number
	name: string
	description: string
	pipelineStatus: string | null
	markets: string[]
}

const DashboardPage = () => {
	const [dataLoading, setDataLoading] = useState<boolean>(true)
	const [targets, setTargets] = useState<TargetData[]>([])
	const [error, setError] = useState<string | null>(null)
	const [editingTargetId, setEditingTargetId] = useState<number | null>(null)
	const [newPipelineStatus, setNewPipelineStatus] = useState<string | null>(
		null
	)
	const [activeStatuses, setActiveStatuses] = useState<string[]>([])
	const [pipelineStatusOptions, setPipelineStatusOptions] = useState<string[]>(
		[]
	)
	const [isAddModalOpen, setIsAddModalOpen] = useState(false)
	const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

	// Fetch targets on component mount
	useEffect(() => {
		const fetchTargets = async () => {
			try {
				const response = await fetch(`${DB_API_PATH}/targets`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				})

				if (!response.ok) throw new Error('Failed to fetch targets')
				const data: TargetData[] = await response.json()
				setTargets(data)

				const statuses = Array.from(
					new Set(
						data.map((target) =>
							target.pipelineStatus === null ? 'Not Set' : target.pipelineStatus
						)
					)
				)

				setPipelineStatusOptions(statuses)
				setActiveStatuses(statuses)
			} catch (error: any) {
				console.error('Error fetching targets:', error)
				setError(error.message || 'An unknown error occurred')
			} finally {
				setDataLoading(false)
			}
		}

		fetchTargets()
	}, [])

	// Add a new target
	const addNewTarget = async (newTarget: {
		name: string
		description: string
		pipelineStatus: string | null
		markets: string[]
	}) => {
		try {
			const response = await fetch(`${DB_API_PATH}/targets`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newTarget),
			})

			if (!response.ok) throw new Error('Failed to add new target')

			const createdTarget: TargetData = await response.json()
			setTargets((prev) => [...prev, createdTarget])
		} catch (error: any) {
			console.error('Error adding new target:', error)
			setError(error.message || 'An unknown error occurred')
		}
	}

	// Save pipeline status
	const savePipelineStatus = async (id: number) => {
		if (newPipelineStatus === null) return

		try {
			const response = await fetch(`${DB_API_PATH}/targets/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					pipelineStatus:
						newPipelineStatus === 'Not Set' ? null : newPipelineStatus,
				}),
			})

			if (!response.ok) throw new Error('Failed to update pipeline status')

			const updatedTarget = await response.json()
			setTargets((prev) =>
				prev.map((target) => (target.id === id ? updatedTarget : target))
			)
			setEditingTargetId(null)
			setNewPipelineStatus(null)
		} catch (error: any) {
			console.error('Error updating pipeline status:', error)
			setError(error.message || 'An unknown error occurred')
		}
	}

	// Delete target
	const deleteTarget = async (id: number) => {
		try {
			const response = await fetch(`${DB_API_PATH}/targets/${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			})

			if (!response.ok) throw new Error('Failed to delete target')

			setTargets((prev) => prev.filter((target) => target.id !== id))
		} catch (error: any) {
			console.error('Error deleting target:', error)
			setError(error.message || 'An unknown error occurred')
		}
	}

	// Handle editing target
	const handleEditTarget = (target: TargetData) => {
		setEditingTargetId(target.id)
		setNewPipelineStatus(
			target.pipelineStatus === null ? 'Not Set' : target.pipelineStatus
		)
	}

	// Filter targets based on active statuses
	const filteredTargets = targets.filter((target) => {
		if (activeStatuses.includes('All')) return true
		return activeStatuses.includes(
			target.pipelineStatus === null ? 'Not Set' : target.pipelineStatus
		)
	})

	const toggleStatus = (status: string) => {
		if (status === 'All') {
			if (activeStatuses.includes('All')) {
				setActiveStatuses([])
			} else {
				setActiveStatuses(pipelineStatusOptions)
			}
		} else {
			const currentFilters = [...activeStatuses]
			if (currentFilters.includes(status)) {
				setActiveStatuses(currentFilters.filter((s) => s !== status))
			} else {
				setActiveStatuses([...currentFilters, status])
			}

			if (currentFilters.includes('All')) {
				setActiveStatuses(currentFilters.filter((s) => s !== 'All'))
			}
		}
	}

	const updateActiveStatuses = (hiddenStatuses: string[]) => {
		setActiveStatuses((prev) =>
			prev.filter((status) => !hiddenStatuses.includes(status))
		)
	}

	const handleViewHistory = () => {
		setIsHistoryModalOpen(true)
	}

	return (
		<main className='h-svh flex flex-col min-h-screen items-center justify-center'>
			<header className='h-1/5 min-h-[125px] gap-1 flex flex-col items-center justify-center py-5 shadow-btm-mid w-full bg-gray-900 text-white'>
				<h1 className='text-lg lg:text-4xl font-bold mb-0 lg:mb-2'>
					Target Management Dashboard
				</h1>
				<p className='text-center px-5'>
					Filter the market targets data displayed by status in the bar chart
					and table:
				</p>
				<DataFilter
					activeStatuses={!dataLoading ? activeStatuses : []}
					pipelineStatusOptions={pipelineStatusOptions}
					toggleStatus={toggleStatus}
				/>
			</header>

			{error && <p className='text-red-500'>{error}</p>}
			{dataLoading ? (
				<div className='flex justify-center items-center h-full'>
					<div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500'></div>
				</div>
			) : (
				<section className='h-4/5 flex justify-normal flex-col w-full flex-1 gap-5 lg:px-10 lg:py-5 px-2 py-2 lg:flex-row lg:justify-center'>
					<div className='w-full lg:w-1/2 flex-1 items-center flex justify-center rounded shadow-btm-mid border border-gray-300 p-4'>
						<BarChart
							targets={filteredTargets}
							activeFilters={activeStatuses}
							setActiveFilters={updateActiveStatuses}
						/>
					</div>
					<div className='flex-1 items-center flex flex-col-reverse lg:flex-col justify-center rounded pb-5 lg:pb-0'>
						<div className='overflow-y-auto lg:pr-2 mb-2 scrollbar-targets w-full shadow-btm-mid'>
							<TargetTable
								targets={filteredTargets}
								// setTargets={setTargets}
								editingTargetId={editingTargetId}
								setEditingTargetId={setEditingTargetId}
								newPipelineStatus={newPipelineStatus}
								setNewPipelineStatus={setNewPipelineStatus}
								pipelineStatusOptions={pipelineStatusOptions}
								handleEditTarget={handleEditTarget}
								deleteTarget={deleteTarget}
								savePipelineStatus={savePipelineStatus}
							/>
						</div>
						<div className='flex space-x-2 pb-5 lg:pb-0'>
							<button
								onClick={() => setIsAddModalOpen(true)}
								className='bg-blue-500 text-white px-4 py-2 rounded mt-2 flex items-center justify-center flex-row gap-2'
							>
								<FaPlus /> Add New Target
							</button>
							<button
								onClick={handleViewHistory}
								className='bg-green-500 text-white px-4 py-2 rounded mt-2 flex items-center justify-center flex-row gap-2'
							>
								View History
							</button>
						</div>
						<AddTarget
							onAddTarget={addNewTarget}
							pipelineStatusOptions={pipelineStatusOptions}
							isOpen={isAddModalOpen}
							onClose={() => setIsAddModalOpen(false)}
						/>
						<HistoryModal
							isOpen={isHistoryModalOpen}
							onClose={() => setIsHistoryModalOpen(false)}
							// historyData={historyData}
							targets={targets}
						/>
					</div>
				</section>
			)}
		</main>
	)
}

export default DashboardPage
