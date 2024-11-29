import React from 'react'
import {
	FaChartBar,
	FaChartLine,
	FaChartPie,
	FaDigitalOcean,
	FaTable,
} from 'react-icons/fa'

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
		// { label: 'Donut Chart', value: 'donutChart', icon: 'FaDigitalOcean' },
		// { label: 'Line Chart', value: 'lineChart', icon: 'FaChartLine' },
	]

	return (
		<div className='flex justify-center space-x-4 bg-gray-200 p-2 rounded shadow-md'>
			{filters.map((filter) => (
				<button
					key={filter.value}
					onClick={() => toggleActiveComponent(filter.value)}
					className={`px-4 py-2 rounded ${
						activeComponents.includes(filter.value)
							? 'bg-slate-900 text-white'
							: 'bg-gray-300 text-gray-400 hover:bg-gray-200'
					}`}
				>
					{
						<>
							{filter.icon === 'FaChartBar' && <FaChartBar />}
							{filter.icon === 'FaTable' && <FaTable />}
							{filter.icon === 'FaChartPie' && <FaChartPie />}
							{/* {filter.icon === 'FaDigitalOcean' && <FaDigitalOcean />}
							{filter.icon === 'FaChartLine' && <FaChartLine />} */}
						</>
					}
				</button>
			))}
		</div>
	)
}

export default ChartFilter
