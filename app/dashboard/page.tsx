'use client'

import React, { useState } from 'react'
import useTargets from '@/app/hooks/useTargets'

import BarChart from '@/app/components/charts/BarChart'
import PieChart from '@/app/components/charts/PieChart'
import DonutChart from '@/app/components/charts/DonutChart'
import TargetTable from '@/app/components/charts/TargetTable'

import ChartFilter from '../components/filters/ChartFilters'
import DataFilter from '@/app/components/filters/DataFilters'

import useModal from '@/app/hooks/useModal'
import AddTargetModal from '@/app/components/modals/AddTargetModal'
import HistoryModal from '@/app/components/modals/HistoryModal'
import TargetUtils from '@/app/components/utils/TargetUtils'

import { TargetData } from '@/app/types'
import LineChart from '../components/charts/LineChart'
import { FaCloudversify } from 'react-icons/fa'

const DashboardPage = () => {
	const [activeComponents, setActiveComponents] = useState<string[]>([
		'barChart',
		'pieChart',
		'targetTable',
		// 'donutChart',
		// 'lineChart',
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

	const { modalType, openModal, closeModal, modalOptions, handleConfirm } =
		useModal()

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
		console.log('ACTIVE COMPONENTS: ', activeComponents)
	}

	const handleAddTargetClick = () => {
		openModal('add', {
			title: 'Add New Target',
			onConfirm: (newTarget: TargetData) => {
				addNewTarget(newTarget)
				closeModal()
			},
		})
	}

	// Function to open the delete modal
	const handleDeleteTarget = (id: number) => {
		console.log('DELETE MODAL: ', id)
		openModal('delete', {
			title: 'Confirm Deletion!',
			message: 'Are you sure you want to delete this target?',
			onConfirm: () => {
				deleteTarget(id) // Perform the actual deletion
				closeModal() // Close the modal after deletion
			},
		})
	}

	const handleViewHistoryClick = () => {
		openModal('history', {
			title: 'View History',
		})
	}

	return (
		<main className='lg:h-svh h-full flex flex-col min-h-screen items-center lg:justify-center'>
			<header className='lg:h-1/6 flex flex-col lg:flex-row items-center justify-between py-5 shadow-sm w-full border-b border-b-blue-500 bg-white backdrop-blur-sm bg-opacity-15 text-white'>
				<div className='flex flex-col flex-grow w-full'>
					<h1 className='text-lg lg:text-3xl font-bold w-full mb-0 text-center'>
						{/* <span className='flex items-center display-inline'>
							<FaCloudversify />
						</span> */}
						Target Management Dashboard
					</h1>
					<DataFilter
						activeStatuses={dataLoading ? [] : activeStatuses}
						pipelineStatusOptions={pipelineStatusOptions}
						toggleStatus={toggleStatus}
					/>
				</div>
				<div className='flex flex-col flex-1 w-full gap-2 lg:px-10 lg:py-5 px-2 py-2 lg:justify-center'>
					<TargetUtils
						onAddTarget={handleAddTargetClick}
						onViewHistory={handleViewHistoryClick}
					/>
					<ChartFilter
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
				<section className='lg:h-5/6 h-full min-h-[20rem] flex flex-col min-h-500px w-full gap-5 lg:px-10 px-2 py-2 lg:flex-row lg:justify-center'>
					{activeComponents.includes('donutChart') ||
					activeComponents.includes('barChart') ? (
						<div className='bg-white backdrop-blur-sm border border-blue-500 shadow-sm shadow-black flex-col gap-5 justify-center w-full lg:w-1/3 flex flex-1 rounded p-4 bg-opacity-15'>
							{/* {activeComponents.includes('donutChart') && ( */}
							<DonutChart
								targets={filteredTargets}
								activeFilters={activeStatuses}
								setActiveFilters={setActiveStatuses}
							/>
							{/* )}
							{activeComponents.includes('barChart') && ( */}
							<BarChart
								targets={filteredTargets}
								activeFilters={activeStatuses}
								setActiveFilters={setActiveStatuses}
							/>
							{/* )} */}
						</div>
					) : null}
					{activeComponents.includes('lineChart') ||
					activeComponents.includes('pieChart') ? (
						<div className='bg-white backdrop-blur-sm border border-blue-500 shadow-sm shadow-black flex-col gap-5 justify-center w-full lg:w-1/3 flex flex-1 rounded p-4 bg-opacity-15'>
							{/* {activeComponents.includes('lineChart') && ( */}
							<LineChart
								targets={filteredTargets}
								activeFilters={activeStatuses}
								setActiveFilters={setActiveStatuses}
							/>
							{/* )}
							{activeComponents.includes('pieChart') && ( */}
							<PieChart
								targets={filteredTargets}
								activeFilters={activeStatuses}
								setActiveFilters={setActiveStatuses}
							/>
							{/* )} */}
						</div>
					) : null}
					{activeComponents.includes('targetTable') ? (
						<div className='scrollbar-targets overflow-y-auto py-0 flex-col gap-5 w-full lg:w-1/3 flex flex-1 rounded p-4'>
							<TargetTable
								targets={filteredTargets}
								activeStatuses={activeStatuses}
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
							/>
						</div>
					) : null}
					{/* {['barChart', 'pieChart', 'donutChart', 'targetTable'].map(
						(component) =>
							activeComponents.includes(component) && (
								<div
									key={component}
									className={`${
										component === 'targetTable'
											? 'scrollbar-targets overflow-y-auto py-0'
											: 'items-center'
									} ${
										(component === 'pieChart' || component === 'donutChart') &&
										'bg-white backdrop-blur-sm border border-blue-500 shadow-sm shadow-black flex-col gap-5 justify-center'
									}  w-full lg:w-1/3 flex flex-1 gap-5 flex-col rounded p-4 bg-opacity-15`}
								>
									{component === 'donutChart' ? (
										<>
											<DonutChart
												targets={filteredTargets}
												activeFilters={activeStatuses}
												setActiveFilters={setActiveStatuses}
											/>
											<BarChart
												targets={filteredTargets}
												activeFilters={activeStatuses}
												setActiveFilters={setActiveStatuses}
											/>
										</>
									) : component === 'pieChart' ? (
										<>
											<LineChart
												targets={filteredTargets}
												activeFilters={activeStatuses}
												setActiveFilters={setActiveStatuses}
											/>
											<PieChart
												targets={filteredTargets}
												activeFilters={activeStatuses}
												setActiveFilters={setActiveStatuses}
											/>
										</>
									) : component === 'targetTable' ? (
										<TargetTable
											targets={filteredTargets}
											activeStatuses={activeStatuses}
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
										/>
									) : null}
								</div>
							)
					)} */}
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

			{/* Modal for Confirmation */}
			{modalType === 'delete' && modalOptions && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
					<div className='bg-white p-6 rounded shadow-md text-slate-800'>
						<h2 className='text-lg font-bold'>{modalOptions.title}</h2>
						<p>{modalOptions.message}</p>
						<div className='mt-4 flex justify-end'>
							<button
								onClick={closeModal}
								className='bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2'
							>
								Cancel
							</button>
							<button
								onClick={handleConfirm}
								className='bg-red-500 text-white px-4 py-2 rounded'
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	)
}

export default DashboardPage
