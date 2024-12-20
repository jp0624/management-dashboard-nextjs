'use client'

import React from 'react'
import { TargetUtilsProps } from '@/app/types'
import { FaPlus, FaBook } from 'react-icons/fa'

const TargetUtils: React.FC<TargetUtilsProps> = ({
	onAddTarget,
	onViewHistory,
}) => {
	return (
		<div className='flex flex-row space-x-2 justify-center'>
			<button
				onClick={onAddTarget}
				className='bg-green-500 text-white px-2 py-1 lg:px-4 lg:py-2 rounded flex sm:flex-0 lg:flex-1 flex-row items-center gap-2 whitespace-nowrap'
			>
				<FaPlus />
				<span>Add Target</span>
			</button>
			<button
				onClick={onViewHistory}
				className='bg-blue-500 text-white px-2 py-1 lg:px-4 lg:py-2 rounded flex sm:flex-0 flex-shrink flex-row items-center gap-2 whitespace-nowrap'
			>
				<FaBook />
				<span>History</span>
			</button>
		</div>
	)
}

export default TargetUtils
