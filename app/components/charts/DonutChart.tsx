/* eslint-disable @typescript-eslint/no-explicit-any */
import { Doughnut } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

// Register chart.js components
Chart.register(...registerables)

const DonutChart = ({ targets, activeFilters }: any) => {
	// Prepare data for the chart
	const data = {
		labels: activeFilters.sort(), // Use active filters as labels
		datasets: [
			{
				label: 'Count', // Single dataset for counts
				data: activeFilters.map((status: any) => {
					// Count how many targets belong to this status
					return targets.filter(
						(target: any) =>
							(target.pipelineStatus === null
								? 'Not Set'
								: target.pipelineStatus) === status
					).length
				}),
				backgroundColor: activeFilters.map(
					(_: any, index: number) =>
						`rgba(255,255,255, ${(1 + (activeFilters.length - index)) * 0.15})`
				),
				borderColor: activeFilters.map(
					(_: any, index: number) =>
						`rgba(255,255,255, ${(1 + (activeFilters.length - index)) * 0.25})`
				),
				borderWidth: 3,
			},
		],
	}

	const options = {
		responsive: true,
		maintainAspectRatio: false, // Ensures the chart fits within the container
		plugins: {
			legend: {
				display: false, // Hide the legend
			},
			tooltip: {
				callbacks: {
					label: (tooltipItem: any) => {
						const count = data.datasets[0].data[tooltipItem.dataIndex]
						const label = data.labels[tooltipItem.dataIndex]
						return `${label}: ${count}`
					},
				},
			},
		},
	}

	return (
		<>
			<div className='flex flex-1 flex-row w-full items-center justify-center'>
				<div className='mr-5 flex flex-col flex-wrap gap-3 mt-2 justify-left items-left text-xs lg:text-md border border-gray-300  py-2 px-5 rounded shadow-btm-mid bg-white'>
					{activeFilters.map((status: any, index: number) => (
						<>
							<div key={index} className='flex flex-row items-left'>
								<div
									style={{
										backgroundColor: `rgba(90, 120, 246, ${(1 + index) * 0.15}`,
										borderColor: `rgba(90, 120, 246, ${
											(1 + (activeFilters.length - index)) * 0.05
										}`,
									}}
									className='w-4 h-4 rounded-full mr-2 border-2'
								></div>
								<span className='whitespace-nowrap'>{status}</span>
							</div>
						</>
					))}
				</div>
				<div className='w-2/4'>
					<Doughnut height={300} width={300} data={data} options={options} />
				</div>
			</div>
		</>
	)
}

export default DonutChart
