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
						`rgba(${index * 60}, ${index * 40}, ${150}, 0.5)`
				),
				borderColor: activeFilters.map(
					(_: any, index: number) =>
						`rgba(${index * 60}, ${index * 40}, ${150}, 1)`
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
			<div className='w-full flex flex-stretch flex-row gap-3 mt-5 flex-wrap justify-center items-center text-xs lg:text-md'>
				{activeFilters.map((status: any, index: number) => (
					<>
						<div key={index} className='flex flex-row items-center'>
							<div
								style={{
									backgroundColor: `rgba(${index * 60}, ${
										index * 40
									}, ${150}, 0.5)`,
								}}
								className='w-4 h-4 rounded-full mr-2'
							></div>
							<span className='whitespace-nowrap'>{status}</span>
						</div>
					</>
				))}
			</div>
			<div className='flex w-full items-center'>
				<Doughnut height={300} width={300} data={data} options={options} />
			</div>
		</>
	)
}

export default DonutChart
