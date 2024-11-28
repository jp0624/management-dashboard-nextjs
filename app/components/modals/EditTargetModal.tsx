// app/components/modals/EditTargetModal.tsx
import React, { useState } from 'react'
import { TargetData } from '@/app/types'

type EditTargetModalProps = {
	target: TargetData
	isOpen: boolean
	onClose: () => void
	pipelineStatusOptions: string[]
	onConfirm: (newStatus: string) => void
}

const EditTargetModal = ({
	target,
	isOpen,
	onClose,
	pipelineStatusOptions,
	onConfirm,
}: EditTargetModalProps) => {
	const [newStatus, setNewStatus] = useState(target.pipelineStatus || 'Not Set')

	const handleSubmit = () => {
		onConfirm(newStatus)
		onClose()
	}

	return isOpen ? (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-white p-6 rounded'>
				<h2 className='text-lg'>Edit Target Status</h2>
				<div className='my-4'>
					<label className='block mb-2'>Target: {target.name}</label>
					<select
						value={newStatus}
						onChange={(e) => setNewStatus(e.target.value)}
						className='border p-1 rounded'
					>
						<option value='Not Set'>Not Set</option>
						{pipelineStatusOptions.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</div>
				<div className='flex space-x-2 mt-4'>
					<button
						onClick={handleSubmit}
						className='bg-green-500 text-white px-4 py-2 rounded'
					>
						Save
					</button>
					<button
						onClick={onClose}
						className='bg-gray-500 text-white px-4 py-2 rounded'
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	) : null
}

export default EditTargetModal
