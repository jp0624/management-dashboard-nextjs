import React from 'react'
import { FaChartBar, FaChartPie, FaTable } from 'react-icons/fa'

interface ChartFiltersProps {
	activeComponents: string[]
	toggleActiveComponent: (component: string) => void
}

const ChartFilter: React.FC<ChartFiltersProps> = ({
	activeComponents,
	toggleActiveComponent,
}) => {
	const filters = [
		{ label: 'Bar Chart', value: 'barChart', icon: 'FaChartBar' },
		{ label: 'Pie Chart', value: 'pieChart', icon: 'FaChartPie' },
		{ label: 'Target Table', value: 'targetTable', icon: 'FaTable' },
	]

	return (
		<div className='flex justify-center space-x-4 bg-gray-200 p-2 rounded shadow-md'>
			{filters.map((filter) => (
				<button
					key={filter.value}
					onClick={() => toggleActiveComponent(filter.value)}
					className={`px-4 py-2 rounded ${
						activeComponents.includes(filter.value)
							? 'bg-blue-500 text-white'
							: 'bg-gray-300 text-gray-800 hover:bg-gray-400'
					}`}
				>
					{
						<>
							{filter.icon === 'FaChartBar' && <FaChartBar />}
							{filter.icon === 'FaTable' && <FaTable />}
							{filter.icon === 'FaChartPie' && <FaChartPie />}
						</>
					}
				</button>
			))}
		</div>
	)
}

export default ChartFilter
