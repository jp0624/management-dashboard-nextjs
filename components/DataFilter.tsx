import React from 'react'

interface DataFilterProps {
	activeStatuses: string[]
	pipelineStatusOptions: string[]
	toggleStatus: (status: string) => void
}

const DataFilter: React.FC<DataFilterProps> = ({
	activeStatuses,
	pipelineStatusOptions,
	toggleStatus,
}) => (
	<div className='flex flex-row flex-wrap px-5 gap-1 lg:gap-2 items-center justify-center pt-2 whitespace-nowrap text-sm lg:text-base'>
		{pipelineStatusOptions.length > 0 &&
			['All', ...pipelineStatusOptions.sort()].map((status) => (
				<button
					key={status}
					className={`py-1 px-3 rounded ${
						activeStatuses.includes(status)
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-800'
					}`}
					onClick={() => toggleStatus(status)}
				>
					{status}
				</button>
			))}
	</div>
)

export default DataFilter
