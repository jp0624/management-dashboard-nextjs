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
	const {
		dataLoading,
		targets,
		error,
		editingTargetId,
		newPipelineStatus,
		pipelineStatusOptions,
		activeStatuses,
		setEditingTargetId,
		setNewPipelineStatus,
		setActiveStatuses,
		addNewTarget,
		savePipelineStatus,
		deleteTarget,
	} = useTargets()

	const {
		isModalOpen,
		modalType,
		modalOptions,
		openModal,
		closeModal,
		handleConfirm,
	} = useModal()

	const openDeleteModal = (id: number) => {
		openModal('delete', {
			title: 'Confirm Delete',
			message: 'Are you sure you want to delete this target?',
			onConfirm: () => confirmDelete(id),
		})
	}

	const confirmDelete = (id: number) => {
		if (id !== null) {
			deleteTarget(id)
			closeModal()
		}
	}

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
			setActiveStatuses((current) => {
				const newStatuses = current.includes(status)
					? current.filter((s) => s !== status)
					: [...current, status]
				if (current.includes('All')) {
					return newStatuses.filter((s) => s !== 'All')
				}
				return newStatuses
			})
		}
	}

	const updateActiveStatuses = (hiddenStatuses: string[]) => {
		setActiveStatuses((prev) =>
			prev.filter((status) => !hiddenStatuses.includes(status))
		)
	}

	const handleAddTarget = (newTarget: any) => {
		addNewTarget(newTarget)
		closeModal()
	}

	return (
		<main className='h-svh flex flex-col min-h-screen items-center justify-center'>
			<header className='h-1/6 min-h-[100px] gap-1 flex flex-col items-center justify-center py-5 shadow-btm-mid w-full bg-black text-white'>
				<h1 className='text-lg lg:text-3xl font-bold mb-0'>
					Target Management Dashboard
				</h1>
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
				<section className='h-5/6 flex justify-normal flex-col w-full flex-1 gap-5 lg:px-10 lg:py-5 px-2 py-2 lg:flex-row lg:justify-center'>
					<div className='w-full lg:w-1/2 flex-1 items-center flex justify-center rounded shadow-btm-mid border border-gray-300 p-4 bg-white'>
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
								editingTargetId={editingTargetId}
								setEditingTargetId={setEditingTargetId}
								newPipelineStatus={newPipelineStatus}
								setNewPipelineStatus={setNewPipelineStatus}
								pipelineStatusOptions={pipelineStatusOptions}
								handleEditTarget={(target) => {
									setEditingTargetId(target.id)
									setNewPipelineStatus(target.pipelineStatus || 'Not Set')
								}}
								deleteTarget={openDeleteModal} // Use the generic modal opening
								savePipelineStatus={savePipelineStatus}
								handleAddTarget={() =>
									openModal('add', {
										title: 'Add New Target',
										onConfirm: handleAddTarget,
										confirmArgs: [
											/* Any specific arguments for add here, if needed */
										],
									})
								} // Passing handleAddTarget prop
							/>
						</div>
						<div className='flex space-x-2 pb-5 lg:pb-0'>
							<button
								onClick={() =>
									openModal('add', {
										title: 'Add New Target',
										onConfirm: handleAddTarget,
										confirmArgs: [],
									})
								}
								className='bg-blue-500 text-white px-4 py-2 rounded mt-2 flex items-center justify-center flex-row gap-2'
							>
								<FaPlus /> Add New Target
							</button>
							<button
								onClick={() =>
									openModal('history', {
										title: 'View History',
									})
								}
								className='bg-green-500 text-white px-4 py-2 rounded mt-2 flex items-center justify-center flex-row gap-2'
							>
								View History
							</button>
						</div>
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
						{/* Confirmation Modal */}
						{modalType === 'delete' && isModalOpen && (
							<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
								<div className='bg-white p-6 rounded shadow-md text-slate-800'>
									<h2 className='text-lg font-bold'>{modalOptions?.title}</h2>
									<p>{modalOptions?.message}</p>
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
					</div>
				</section>
			)}
		</main>
	)
}

export default DashboardPage
