/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

// Register chart.js components
Chart.register(...registerables)

const BarChart = ({ targets, activeFilters }: any) => {
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
		scales: {
			x: {
				title: {
					display: true,
					text: 'Status',
				},
			},
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Count',
				},
			},
		},
		plugins: {
			legend: {
				display: false, // Hide the legend
			},
		},
	}

	return <Bar data={data} options={options} />
}

export default BarChart
