/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pie } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

// Register chart.js components
Chart.register(...registerables)

const PieChart = ({ targets, activeFilters }: any) => {
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
		<div style={{ height: '400px', width: '100%' }}>
			<Pie data={data} options={options} />
		</div>
	)
}

export default PieChart
