import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DeleteTargetModal = ({ modalOptions, onClose }: any) => {
	return (
		<>
			<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
				<div className='bg-white p-6 rounded'>
					<h2 className='text-lg'>{modalOptions?.title}</h2>
					<p>{modalOptions?.message}</p>
					<div className='flex space-x-2 mt-4'>
						<button
							className='bg-red-500 text-white px-4 py-2 rounded'
							onClick={() => {
								if (modalOptions?.onConfirm) {
									modalOptions.onConfirm() // Run the confirm action (deletion)
								}
								onClose() // Close the modal after confirmation
							}}
						>
							Confirm
						</button>
						<button
							className='bg-gray-500 text-white px-4 py-2 rounded'
							onClick={onClose} // Close modal when clicking cancel
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default DeleteTargetModal
