/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

interface ModalOptions {
	title: string
	message?: string
	onConfirm?: (...args: any[]) => void // Allow multiple arguments for onConfirm
	confirmArgs?: any[] // Arguments to pass to onConfirm
}

const useModal = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null)
	const [modalType, setModalType] = useState<string | null>(null)

	const openModal = (type: string, options: ModalOptions) => {
		setModalType(type)
		setModalOptions(options)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setModalOptions(null)
		setModalType(null)
	}

	const handleConfirm = () => {
		if (modalOptions?.onConfirm) {
			modalOptions.onConfirm(...(modalOptions.confirmArgs || [])) // Call onConfirm with arguments
		}
		closeModal() // Close the modal afterwards
	}

	return {
		isModalOpen,
		modalType,
		modalOptions,
		openModal,
		closeModal,
		handleConfirm,
	}
}

export default useModal
