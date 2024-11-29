/* eslint-disable @typescript-eslint/no-explicit-any */
import { Line } from 'react-chartjs-2'
import { Chart, registerables, ChartOptions } from 'chart.js'

// Register chart.js components
Chart.register(...registerables)

const LineChart = ({ targets, activeFilters }: any) => {
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
				backgroundColor: 'rgba(255,255,255, 0.2)', // Light fill color
				borderColor: 'rgba(255,255,255, 1)', // Line color
				borderWidth: 2,
				tension: 0.4, // Smooth lines
				fill: true, // Fill area under the line
			},
		],
	}

	// Explicitly type the options object
	const options: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false, // Ensures the chart fits within the container
		scales: {
			x: {
				title: {
					display: true,
					text: 'Status',
					color: '#ffffff', // X-axis title color
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.25)', // Grid lines color
				},
				ticks: {
					color: '#ffffff', // X-axis labels color
				},
			},
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Count',
					color: '#ffffff', // Y-axis title color
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.25)', // Grid lines color
				},
				ticks: {
					color: '#ffffff', // Y-axis labels color
				},
			},
		},
		plugins: {
			legend: {
				labels: {
					color: '#ffffff', // Legend labels color
				},
				display: false, // Hide the legend
			},
			tooltip: {
				titleColor: '#ffffff', // Tooltip title color
				bodyColor: '#ffffff', // Tooltip body text color
				backgroundColor: 'rgba(0, 0, 0, 0.8)', // Tooltip background color
			},
		},
	}

	return (
		<div className='flex flex-1 w-full items-center'>
			<Line height={300} width={300} data={data} options={options} />
		</div>
	)
}

export default LineChart
