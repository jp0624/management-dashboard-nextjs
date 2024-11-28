'use client'

import React, { useState } from 'react'
import { FaPlus, FaBook } from 'react-icons/fa'
import useTargets from '@/app/hooks/useTargets'
import useModal from '@/app/hooks/useModal'
import BarChart from '@/app/components/charts/BarChart'
import PieChart from '@/app/components/charts/PieChart'
import TargetTable from '@/app/components/charts/TargetTable'
import AddTargetModal from '@/app/components/modals/AddTargetModal'
import HistoryModal from '@/app/components/modals/HistoryModal'
import ChartFilters from '../components/filters/ChartFilters'
import DataFilter from '@/app/components/filters/DataFilters'
import { TargetData } from '@/app/types'

const DashboardPage = () => {
	const [activeComponents, setActiveComponents] = useState<string[]>([
		'barChart',
		'pieChart',
		'targetTable',
	])

	const {
		dataLoading,
		targets,
		error,
		editingTargetId,
		newPipelineStatus,
		activeStatuses,
		pipelineStatusOptions,
		setEditingTargetId,
		setNewPipelineStatus,
		setActiveStatuses,
		addNewTarget,
		savePipelineStatus,
		deleteTarget,
	} = useTargets()

	const { modalType, openModal, closeModal, modalOptions } = useModal()

	const filteredTargets = targets.filter(
		(target) =>
			activeStatuses.includes('All') ||
			activeStatuses.includes(target.pipelineStatus || 'Not Set')
	)

	const toggleStatus = (status: string) => {
		setActiveStatuses((current) =>
			status === 'All'
				? current.includes('All')
					? []
					: [...pipelineStatusOptions]
				: current.includes(status)
				? current.filter((s) => s !== status)
				: [...current, status]
		)
	}

	const toggleActiveComponent = (component: string) => {
		setActiveComponents((current) =>
			current.includes(component)
				? current.filter((c) => c !== component)
				: [...current, component]
		)
	}

	const handleAddTarget = (newTarget: TargetData) => {
		addNewTarget(newTarget)
		closeModal()
	}

	const handleDeleteTarget = (targetId: number) => {
		openModal('delete', {
			title: 'Confirm Deletion',
			message: 'Are you sure you want to delete this target?',
			onConfirm: () => deleteTarget(targetId),
		})
	}

	return (
		<main className='lg:h-svh h-full flex flex-col min-h-screen items-center lg:justify-center'>
			<header className='lg:h-1/6 flex flex-col lg:flex-row items-center justify-between py-5 shadow-btm-mid w-full bg-black text-white'>
				<div className='flex flex-col flex-grow w-full'>
					<h1 className='text-lg lg:text-3xl font-bold w-full mb-0 text-center'>
						Target Management Dashboard
					</h1>
					<DataFilter
						activeStatuses={dataLoading ? [] : activeStatuses}
						pipelineStatusOptions={pipelineStatusOptions}
						toggleStatus={toggleStatus}
					/>
				</div>
				<div className='flex flex-col flex-1 w-full gap-5 lg:px-10 lg:py-5 px-2 py-2 lg:justify-center'>
					<div className='flex flex-row space-x-2'>
						<button
							onClick={() =>
								openModal('add', {
									title: 'Add New Target',
									onConfirm: handleAddTarget,
								})
							}
							className='bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2'
						>
							<FaPlus />
							<span>Add Target</span>
						</button>
						<button
							onClick={() => openModal('history', { title: 'View History' })}
							className='bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2'
						>
							<FaBook />
							<span>History</span>
						</button>
					</div>
					<ChartFilters
						activeComponents={activeComponents}
						toggleActiveComponent={toggleActiveComponent}
					/>
				</div>
			</header>

			{error && <p className='text-red-500'>{error}</p>}

			{dataLoading ? (
				<div className='flex justify-center items-center h-full'>
					<div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500' />
				</div>
			) : (
				<section className='lg:h-5/6 h-full flex flex-col w-full gap-5 lg:px-10 px-2 py-2 lg:flex-row lg:justify-center'>
					{['barChart', 'pieChart'].map(
						(component) =>
							activeComponents.includes(component) && (
								<div
									key={component}
									className='w-full lg:w-1/3 flex items-center justify-center rounded shadow-btm-mid border border-gray-300 p-4 bg-white'
								>
									{component === 'barChart' ? (
										<BarChart
											targets={filteredTargets}
											activeFilters={activeStatuses}
											setActiveFilters={setActiveStatuses}
										/>
									) : (
										<PieChart
											targets={filteredTargets}
											activeFilters={activeStatuses}
											setActiveFilters={setActiveStatuses}
										/>
									)}
								</div>
							)
					)}

					{activeComponents.includes('targetTable') && (
						<div className='w-full lg:w-1/3 flex justify-center rounded shadow-btm-mid border border-gray-300 p-4 bg-white overflow-y-auto mb-2'>
							<TargetTable
								targets={filteredTargets}
								editingTargetId={editingTargetId}
								setEditingTargetId={setEditingTargetId}
								newPipelineStatus={newPipelineStatus}
								setNewPipelineStatus={setNewPipelineStatus}
								pipelineStatusOptions={pipelineStatusOptions}
								handleEditTarget={(target) => {
									setEditingTargetId(target.id)
									setNewPipelineStatus(target.pipelineStatus || 'Not Set')
								}}
								deleteTarget={handleDeleteTarget}
								savePipelineStatus={savePipelineStatus}
								handleAddTarget={() =>
									openModal('add', {
										title: 'Add New Target',
										onConfirm: handleAddTarget,
									})
								}
							/>
						</div>
					)}
				</section>
			)}

			<AddTargetModal
				onAddTarget={addNewTarget}
				pipelineStatusOptions={pipelineStatusOptions}
				isOpen={modalType === 'add'}
				onClose={closeModal}
			/>
			<HistoryModal
				isOpen={modalType === 'history'}
				onClose={closeModal}
				targets={targets}
			/>
			{modalType === 'delete' && modalOptions?.onConfirm && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-white p-6 rounded'>
						<h2 className='text-lg'>{modalOptions.title}</h2>
						<p>{modalOptions.message}</p>
						<div className='flex space-x-2 mt-4'>
							<button
								className='bg-red-500 text-white px-4 py-2 rounded'
								onClick={() => {
									modalOptions.onConfirm?.()
									closeModal()
								}}
							>
								Confirm
							</button>
							<button
								className='bg-gray-500 text-white px-4 py-2 rounded'
								onClick={closeModal}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	)
}

export default DashboardPage
