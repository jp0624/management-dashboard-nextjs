import React from 'react'
import { FaEdit, FaSave, FaTimesCircle } from 'react-icons/fa'
import { TargetTableProps } from '@/app/types'

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
	activeStatuses,
}) => {
	const handleSaveClick = (id: number) => {
		savePipelineStatus(id)
	}

	return (
		<>
			<div className='flex flex-col gap-5 w-full'>
				{targets.length === 0 && (
					<p className='w-full text-center'>No matching targets found.</p>
				)}
				{targets.map((target) => (
					<>
						<div
							key={target.id}
							className='border border-gray-300 p-3 rounded shadow-btm-mid flex flex-col bg-white'
						>
							<div className='flex flex-row justify-between items-center mb-2'>
								<h3 className='text-lg font-bold'>{target.name}</h3>
								<button
									onClick={() => deleteTarget(target.id)} // Ensure target.id is passed as a number
									className=' text-red-500 text-2xl rounded-full flex items-center justify-center flex-row gap-2'
								>
									<FaTimesCircle />
								</button>
							</div>
							<p className='text-gray-500'>{target.description}</p>
							<div className='mt-1 flex flex-row'>
								<strong className='inline-block py-1'>Pipeline Status:</strong>{' '}
								{editingTargetId === target.id ? (
									<select
										value={newPipelineStatus || ''}
										onChange={(e) =>
											setNewPipelineStatus(e.target.value || null)
										}
										className='border border-gray-300 mx-2 px-2 py-1 rounded text-slate-900'
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
									<span className='px-2 mx-2 rounded border-2 flex justify-center items-center'>
										Not Set
									</span>
								) : (
									<>
										{}
										<span
											style={{
												backgroundColor: `rgba(90, 120, 246, ${
													(1 + activeStatuses.indexOf(target.pipelineStatus)) *
													0.15
												}`,
												borderColor: `rgba(90, 120, 246, ${
													(1 +
														(activeStatuses.length -
															activeStatuses.indexOf(target.pipelineStatus))) *
													0.05
												}`,
											}}
											className='px-2 mx-2 rounded border-2 flex justify-center items-center'
										>
											{target.pipelineStatus}
										</span>
									</>
								)}
								<div className='flex space-x-2'>
									{editingTargetId === target.id ? (
										<>
											<button
												onClick={() => setEditingTargetId(null)}
												className='bg-slate-500 text-white px-2 py-1 rounded'
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
											className='bg-slate-900 text-white px-2 py-1 rounded flex items-center justify-center flex-row gap-2'
										>
											<FaEdit /> Edit
										</button>
									)}
								</div>
							</div>
							<div className='mt-1'>
								<strong>Markets:</strong>{' '}
								<span className='text-sm'>{target.markets.join(', ')}</span>
							</div>
						</div>
					</>
				))}
			</div>
		</>
	)
}

export default TargetTable
