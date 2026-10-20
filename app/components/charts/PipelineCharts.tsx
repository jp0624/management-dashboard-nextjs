'use client'
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import type { TargetData } from '@/app/types'
import { useTheme } from '@/app/components/theme/ThemeProvider'
import { STATUSES } from '@/app/lib/workspace'
Chart.register(...registerables)
const colors = ['#94a3b8', '#60a5fa', '#6366f1', '#f59e0b', '#10b981', '#f87171']
export type ChartKind = 'bar' | 'doughnut' | 'pie' | 'line'
export default function PipelineCharts({ targets, statuses, kind }: { targets: TargetData[]; statuses: string[]; kind: ChartKind }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const ink = dark ? '#cbd5e1' : '#475569'
  const counts = statuses.map(status => targets.filter(t => (t.pipelineStatus ?? 'Not Set') === status).length)
  const data = { labels: statuses, datasets: [{ label: 'Targets', data: counts, backgroundColor: statuses.map(s => colors[STATUSES.indexOf(s)]), borderColor: kind === 'line' ? '#818cf8' : dark ? '#0f172a' : '#ffffff', borderWidth: 2, borderRadius: kind === 'bar' ? 6 : 0 }] }
  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: kind === 'pie' || kind === 'doughnut', position: 'bottom' as const, labels: { boxWidth: 10, padding: 16, color: ink } } } }
  const axes = { ...options, scales: { y: { beginAtZero: true, ticks: { precision: 0, color: ink }, grid: { color: dark ? '#334155' : '#f1f5f9' } }, x: { ticks: { color: ink }, grid: { display: false } } } }
  const label = `Targets by status: ${statuses.map((s, i) => `${s}: ${counts[i]}`).join(', ')}`
  return <div className="relative h-64 min-w-0 sm:h-72" role="img" aria-label={label}>
    {kind === 'bar' ? <Bar data={data} options={axes} /> : kind === 'line' ? <Line data={data} options={axes} /> : kind === 'pie' ? <Pie data={data} options={options} /> : <Doughnut data={data} options={{ ...options, cutout: '72%' }} />}
  </div>
}
