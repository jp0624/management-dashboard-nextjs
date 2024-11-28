'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react'
import { FaPlus, FaBook } from 'react-icons/fa'
import useTargets from '@/app/hooks/useTargets'
import useModal from '@/app/hooks/useModal'
import BarChart from '@/app/components/charts/BarChart'
import PieChart from '@/app/components/charts/PieChart'
import TargetTable from '@/app/components/charts/TargetTable'
import AddTarget from '@/app/components/modals/AddTargetModal'
import HistoryModal from '@/app/components/modals/HistoryModal'
import ChartFilters from '../components/filters/ChartFilters'
import DataFilter from '@/app/components/filters/DataFilters'
import { TargetData } from '../types'

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
		activeStatuses,
		pipelineStatusOptions,
		setActiveStatuses,
		addNewTarget,
		savePipelineStatus,
		deleteTarget,
	} = useTargets()

	const { modalType, openModal, closeModal, modalOptions } = useModal()

	const filteredTargets = targets.filter((target) => {
		if (activeStatuses.includes('All')) return true
		return activeStatuses.includes(
			target.pipelineStatus === null ? 'Not Set' : target.pipelineStatus
		)
	})

	const toggleStatus = (status: string) => {
		if (status === 'All') {
			setActiveStatuses(
				activeStatuses.includes('All') ? [] : [...pipelineStatusOptions]
			)
		} else {
			setActiveStatuses((current) =>
				current.includes(status)
					? current.filter((s) => s !== status)
					: [...current, status]
			)
		}
	}

	const toggleActiveComponent = (component: string) => {
		setActiveComponents((current) =>
			current.includes(component)
				? current.filter((c) => c !== component)
				: [...current, component]
		)
	}

	const handleAddTarget = (newTarget: any) => {
		addNewTarget(newTarget)
		closeModal()
	}

	// Open delete confirmation modal
	const handleDeleteTarget = (targetId: number) => {
		openModal('delete', {
			title: 'Confirm Deletion',
			message: 'Are you sure you want to delete this target?',
			onConfirm: () => deleteTarget(+targetId), // Call deleteTarget when confirmed
		})
	}

	return (
		<main className='h-svh flex flex-col min-h-screen items-center justify-center'>
			<header className='h-1/6 flex flex-row items-center justify-between py-5 shadow-btm-mid w-full bg-black text-white'>
				<div className='flex flex-col flex-grow w-full'>
					<h1 className='text-lg lg:text-3xl font-bold w-full mb-0 text-center'>
						Target Management Dashboard
					</h1>
					<DataFilter
						activeStatuses={!dataLoading ? activeStatuses : []}
						pipelineStatusOptions={pipelineStatusOptions}
						toggleStatus={toggleStatus}
					/>
				</div>
				<div className='flex flex-col flex-1 w-full gap-5 lg:px-10 lg:py-5 px-2 py-2 lg:justify-center'>
					<ChartFilters
						activeComponents={activeComponents}
						toggleActiveComponent={toggleActiveComponent}
					/>

					{/* Buttons */}
					<div className='flex flex-row space-x-2 pb-5'>
						<button
							onClick={() =>
								openModal('add', {
									title: 'Add New Target',
									onConfirm: handleAddTarget,
								})
							}
							className='bg-green-500 text-white px-4 py-2 rounded flex flex-row items-center gap-2 whitespace-nowrap'
						>
							<FaPlus />
							<span>Add Target</span>
						</button>
						<button
							onClick={() =>
								openModal('history', {
									title: 'View History',
								})
							}
							className='bg-blue-500 text-white px-4 py-2 rounded flex flex-row items-center gap-2 whitespace-nowrap'
						>
							<FaBook />
							<span>History</span>
						</button>
					</div>
				</div>
			</header>

			{error && <p className='text-red-500'>{error}</p>}
			{dataLoading ? (
				<div className='flex justify-center items-center h-full'>
					<div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500'></div>
				</div>
			) : (
				<section className='h-5/6 flex justify-normal flex-col w-full flex-1 gap-5 lg:px-10 px-2 py-2 lg:py-5 lg:flex-row lg:justify-center'>
					{/* BarChart */}
					{activeComponents.includes('barChart') && (
						<div className='w-full lg:w-1/3 flex flex-1 items-center justify-center rounded shadow-btm-mid border border-gray-300 p-4 bg-white'>
							<BarChart
								targets={filteredTargets}
								activeFilters={activeStatuses}
								setActiveFilters={(hiddenStatuses: string | string[]) =>
									setActiveStatuses((prev) =>
										prev.filter((status) => !hiddenStatuses.includes(status))
									)
								}
							/>
						</div>
					)}

					{/* PieChart */}
					{activeComponents.includes('pieChart') && (
						<div className='w-full lg:w-1/3 flex flex-1 items-center justify-center rounded shadow-btm-mid border border-gray-300 p-4 bg-white'>
							<PieChart
								targets={filteredTargets}
								activeFilters={activeStatuses}
								setActiveFilters={(hiddenStatuses: string | string[]) =>
									setActiveStatuses((prev) =>
										prev.filter((status) => !hiddenStatuses.includes(status))
									)
								}
							/>
						</div>
					)}

					{/* TargetTable */}
					{activeComponents.includes('targetTable') && (
						<div className='w-full lg:w-1/3 flex flex-1 justify-center rounded shadow-btm-mid border border-gray-300 p-4 bg-white overflow-y-auto lg:pr-2 mb-2 scrollbar-targets'>
							<TargetTable
								targets={filteredTargets}
								savePipelineStatus={savePipelineStatus}
								deleteTarget={handleDeleteTarget}
								pipelineStatusOptions={pipelineStatusOptions}
								editingTargetId={null}
								newPipelineStatus={null}
								setEditingTargetId={(id) =>
									console.log('set editing target id', id)
								}
								setNewPipelineStatus={(status) =>
									console.log('set new pipeline status', status)
								}
								handleEditTarget={(target) =>
									console.log('handle edit target', target)
								}
							/>
						</div>
					)}
				</section>
			)}

			{/* Modals */}
			<AddTarget
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
			{/* Delete Confirmation Modal */}
			{modalType === 'delete' && modalOptions?.onConfirm && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-white p-6 rounded'>
						<h2 className='text-lg'>{modalOptions.title}</h2>
						<p>{modalOptions.message}</p>
						<div className='flex space-x-2 mt-4'>
							{modalOptions.onConfirm && (
								<button
									className='bg-red-500 text-white px-4 py-2 rounded'
									onClick={() => {
										if (modalOptions.onConfirm) {
											// Add a null check here
											modalOptions.onConfirm()
										}
										closeModal()
									}}
								>
									Confirm
								</button>
							)}
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
