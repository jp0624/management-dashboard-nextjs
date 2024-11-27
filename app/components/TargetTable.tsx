import React from 'react'
import { FaEdit, FaSave, FaTimesCircle } from 'react-icons/fa'
import useModal from '@/app/hooks/useModal'
import { TargetTableProps } from '../types'

const TargetTable: React.FC<TargetTableProps> = ({
	targets,
	editingTargetId,
	newPipelineStatus,
	setEditingTargetId,
	setNewPipelineStatus,
	savePipelineStatus,
	deleteTarget,
	pipelineStatusOptions,
	handleEditTarget,
}) => {
	const { isModalOpen, closeModal, handleConfirm, modalOptions } = useModal()

	const handleDeleteClick = (id: number) => {
		deleteTarget(id)
	}

	const handleSaveClick = (id: number) => {
		savePipelineStatus(id)
	}

	return (
		<div className='flex-1'>
			<div className='grid grid-cols-1 gap-5'>
				{targets.length === 0 && (
					<p className='w-full text-center'>No matching targets found.</p>
				)}
				{targets.map((target) => (
					<div
						key={target.id}
						className='border border-gray-300 p-4 rounded shadow-btm-mid flex flex-col bg-white'
					>
						<div className='flex flex-row justify-between items-center'>
							<h3 className='text-lg font-bold'>{target.name}</h3>
							<button
								onClick={() => handleDeleteClick(target.id)}
								className='bg-red-500 text-white px-2 py-1 rounded flex items-center justify-center flex-row gap-2'
							>
								<FaTimesCircle /> Delete
							</button>
						</div>
						<p className='text-gray-500'>{target.description}</p>
						<div className='mt-1'>
							<strong className='inline-block py-1'>Pipeline Status:</strong>{' '}
							{editingTargetId === target.id ? (
								<select
									value={newPipelineStatus || ''}
									onChange={(e) => setNewPipelineStatus(e.target.value || null)}
									className='border border-gray-300 px-2 py-1 rounded text-slate-900'
								>
									{!pipelineStatusOptions.includes('Not Set') && (
										<option value=''>Not Set</option>
									)}
									{pipelineStatusOptions.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							) : target.pipelineStatus === null ? (
								'Not Set'
							) : (
								target.pipelineStatus
							)}
						</div>
						<div className='mt-1'>
							<strong>Markets:</strong> {target.markets.join(', ')}
						</div>
						<div className='mt-4 flex space-x-2'>
							{editingTargetId === target.id ? (
								<>
									<button
										onClick={() => setEditingTargetId(null)}
										className='bg-slate-600 text-white px-2 py-1 rounded'
									>
										Cancel
									</button>
									<button
										onClick={() => handleSaveClick(target.id)}
										className='bg-green-500 text-white px-2 py-1 rounded flex items-center justify-center flex-row gap-2'
									>
										<FaSave /> Save
									</button>
								</>
							) : (
								<button
									onClick={() => handleEditTarget(target)}
									className='bg-blue-500 text-white px-2 py-1 rounded flex items-center justify-center flex-row gap-2'
								>
									<FaEdit /> Edit
								</button>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Modal for Confirmation */}
			{isModalOpen && modalOptions && (
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
								onClick={handleConfirm} // Calls the handleConfirm which in turn calls onConfirm
								className='bg-red-500 text-white px-4 py-2 rounded'
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default TargetTable
