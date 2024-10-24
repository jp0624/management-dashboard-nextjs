import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import { useEffect } from 'react'

// Register chart.js components
Chart.register(...registerables)

const BarChart = ({ targets, activeFilters, setActiveFilters }) => {
	// Prepare data for the chart
	const data = {
		labels: activeFilters.sort(), // Use active filters as labels
		datasets: [
			{
				label: 'Count', // Single dataset for counts
				data: activeFilters.map((status) => {
					// Count how many targets belong to this status
					return targets.filter(
						(target) =>
							(target.pipelineStatus === null
								? 'Not Set'
								: target.pipelineStatus) === status
					).length
				}),
				backgroundColor: activeFilters.map(
					(_, index) => `rgba(${index * 50}, ${100 + index * 30}, ${150}, 0.5)`
				),
				borderColor: activeFilters.map(
					(_, index) => `rgba(${index * 50}, ${100 + index * 30}, ${150}, 1)`
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
