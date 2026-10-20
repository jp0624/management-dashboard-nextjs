'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ChartBarIcon, ArrowDownTrayIcon, PlusIcon, ClockIcon, MagnifyingGlassIcon, Squares2X2Icon } from '@heroicons/react/24/outline'
import useTargets from '@/app/hooks/useTargets'
import TargetTable from '@/app/components/charts/TargetTable'
import AddTargetModal from '@/app/components/modals/AddTargetModal'
import HistoryModal from '@/app/components/modals/HistoryModal'
import Modal from '@/app/components/modals/Modal'
import type { ChartKind } from '@/app/components/charts/PipelineCharts'
const PipelineCharts = dynamic(() => import('@/app/components/charts/PipelineCharts'), { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-slate-50" /> })
const PAGE_SIZE = 12
const button = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50'
export default function DashboardPage() {
  const data = useTargets()
  const [query, setQuery] = useState('')
  const [market, setMarket] = useState('All markets')
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<'add' | 'history' | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [chartKind, setChartKind] = useState<ChartKind>('bar')
  const [showCharts, setShowCharts] = useState(true)
  const [showTargets, setShowTargets] = useState(true)
  const [deleteError, setDeleteError] = useState(false)
  const markets = Array.from(new Set(data.targets.flatMap(t => t.markets))).sort()
  const filtered = data.targets.filter(t => data.activeStatuses.includes(t.pipelineStatus ?? 'Not Set')
    && (market === 'All markets' || t.markets.includes(market))
    && `${t.name} ${t.description} ${t.markets.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))
  if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'status') filtered.sort((a, b) => data.pipelineStatusOptions.indexOf(a.pipelineStatus ?? 'Not Set') - data.pipelineStatusOptions.indexOf(b.pipelineStatus ?? 'Not Set'))
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages)
  const shown = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const selectedTarget = data.targets.find(t => t.id === deleteId)
  const clear = () => { setQuery(''); setMarket('All markets'); data.setActiveStatuses(data.pipelineStatusOptions); setPage(1) }
  const toggleStatus = (status: string) => { data.setActiveStatuses(previous => previous.includes(status) ? previous.filter(s => s !== status) : [...previous, status]); setPage(1) }
  const exportTargets = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = 'target-management-export.json'; a.click(); URL.revokeObjectURL(url)
  }
  return <div className="min-h-screen">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4">Skip to workspace</a>
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-10">
      <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white" aria-hidden="true">◎</div><div><p className="text-sm font-bold tracking-tight">TARGET MANAGEMENT</p><p className="text-xs text-slate-500">Your opportunity workspace</p></div></div>
      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />Demo workspace · Saved in this browser</span>
    </div></header>
    <main id="main" className="mx-auto max-w-[1440px] px-4 py-7 sm:px-8 sm:py-9 lg:px-10">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Pipeline overview</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Every opportunity. In focus.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Explore your markets, move targets forward, and keep track of what changes.</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={() => setModal('history')} className={button}><ClockIcon className="h-4 w-4" />History</button><button onClick={exportTargets} disabled={data.dataLoading || !filtered.length} className={button}><ArrowDownTrayIcon className="h-4 w-4" />Export</button><button disabled={data.dataLoading} onClick={() => setModal('add')} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"><PlusIcon className="h-4 w-4" />Add target</button></div>
      </div>
      {data.error && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{data.error}</p>}
      {data.dataLoading ? <p role="status" className="py-20 text-center text-slate-500">Loading your workspace…</p> : <>
        <section aria-label="Workspace summary" className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">{[
          ['Total targets', data.targets.length, 'Across your entire workspace'],
          ['Active opportunities', data.targets.filter(t => t.pipelineStatus === 'Active' || t.pipelineStatus === 'Hot').length, 'Active and hot targets'],
          ['Closed targets', data.targets.filter(t => t.pipelineStatus === 'Closed').length, 'Successfully completed'],
          ['Markets covered', markets.length, 'Distinct market segments'],
        ].map(([label, count, note]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"><p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{count}</p><p className="mt-2 text-xs leading-5 text-slate-400">{note}</p></div>)}</section>
        <section aria-label="Filter workspace" className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5"><div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_180px]">
          <label className="relative"><span className="sr-only">Search targets</span><MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" /><input value={query} onChange={e => { setQuery(e.target.value); setPage(1) }} placeholder="Search companies, descriptions, or markets" className="min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm" /></label>
          <label><span className="sr-only">Filter by market</span><select value={market} onChange={e => { setMarket(e.target.value); setPage(1) }} className="min-h-11 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"><option>All markets</option>{markets.map(m => <option key={m}>{m}</option>)}</select></label>
          <label><span className="sr-only">Sort targets</span><select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }} className="min-h-11 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"><option value="default">Default order</option><option value="name">Company A–Z</option><option value="status">Pipeline status</option></select></label>
        </div><div className="mt-4 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-medium text-slate-500">STATUS</span><button aria-pressed={data.activeStatuses.length === data.pipelineStatusOptions.length} onClick={() => { data.setActiveStatuses(data.activeStatuses.length === data.pipelineStatusOptions.length ? [] : data.pipelineStatusOptions); setPage(1) }} className="min-h-11 rounded-lg border border-slate-200 px-3 text-xs font-semibold hover:bg-slate-50">All</button>{data.pipelineStatusOptions.map(s => <button key={s} aria-pressed={data.activeStatuses.includes(s)} onClick={() => toggleStatus(s)} className={`min-h-11 rounded-lg border px-3 text-xs font-medium ${data.activeStatuses.includes(s) ? 'border-indigo-200 bg-indigo-50 text-indigo-800' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>{s} <span className="ml-1 opacity-60">{data.targets.filter(t => (t.pipelineStatus ?? 'Not Set') === s).length}</span></button>)}<button onClick={clear} className="min-h-11 rounded-lg px-3 text-xs font-medium text-slate-500 hover:text-indigo-700">Clear filters</button></div></section>
        <div className="my-5 flex flex-wrap items-center justify-between gap-3"><p aria-live="polite" className="text-sm text-slate-500"><strong className="font-semibold text-slate-900">{filtered.length}</strong> of {data.targets.length} targets match</p><div className="flex gap-2"><button aria-pressed={showCharts} onClick={() => setShowCharts(!showCharts)} className={button}><ChartBarIcon className="h-4 w-4" />{showCharts ? 'Hide charts' : 'Show charts'}</button><button aria-pressed={showTargets} onClick={() => setShowTargets(!showTargets)} className={button}><Squares2X2Icon className="h-4 w-4" />{showTargets ? 'Hide targets' : 'Show targets'}</button></div></div>
        {showCharts && <section aria-label="Pipeline charts" className="mb-7 grid gap-4 lg:grid-cols-2"><div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Pipeline distribution</h2><p className="mt-1 text-xs text-slate-500">Target counts across selected statuses</p></div><label><span className="sr-only">Chart type</span><select value={chartKind} onChange={e => setChartKind(e.target.value as ChartKind)} className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-xs"><option value="bar">Bar chart</option><option value="line">Line chart</option><option value="pie">Pie chart</option><option value="doughnut">Donut chart</option></select></label></div><PipelineCharts targets={filtered} statuses={data.pipelineStatusOptions.filter(s => data.activeStatuses.includes(s))} kind={chartKind} /></div><div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-6"><h2 className="font-semibold">Opportunity mix</h2><p className="mb-5 mt-1 text-xs text-slate-500">Share of the current filtered pipeline</p><PipelineCharts targets={filtered} statuses={data.pipelineStatusOptions.filter(s => data.activeStatuses.includes(s))} kind="doughnut" /></div></section>}
        {showTargets && <section aria-label="Targets"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Your targets</h2><span className="text-xs text-slate-500">{filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}</span></div><TargetTable {...data} targets={shown} handleEditTarget={target => { data.setEditingTargetId(target.id); data.setNewPipelineStatus(target.pipelineStatus ?? 'Not Set') }} deleteTarget={id => { setDeleteId(id); setDeleteError(false) }} />
          {!filtered.length && <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center"><h3 className="font-semibold">No targets match your filters</h3><p className="mt-2 text-sm text-slate-500">Try another search or restore all pipeline statuses.</p><button onClick={clear} className="mt-4 min-h-11 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">Clear filters</button></div>}
          {pages > 1 && <nav aria-label="Target pages" className="mt-6 flex items-center justify-between gap-3"><button disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className={button}>Previous</button><span className="text-sm text-slate-500">Page {currentPage} of {pages}</span><button disabled={currentPage >= pages} onClick={() => setPage(currentPage + 1)} className={button}>Next</button></nav>}
        </section>}
      </>}
      <footer className="mt-10 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-400">Sample companies for demonstration. Changes stay in this browser and aren’t shared between devices. Export your targets to keep a copy.</footer>
    </main>
    {modal === 'add' && <AddTargetModal onAddTarget={target => { const saved = data.addNewTarget(target); if (saved) clear(); return saved }} pipelineStatusOptions={data.pipelineStatusOptions} onClose={() => setModal(null)} />}
    {modal === 'history' && <HistoryModal history={data.history} onClose={() => setModal(null)} />}
    {deleteId !== null && <Modal title="Delete target?" onClose={() => setDeleteId(null)}><p className="break-words text-sm leading-6 text-slate-600">Remove <strong>{selectedTarget?.name ?? 'this target'}</strong> from your workspace? Its activity history will be kept.</p>{deleteError && <p role="alert" className="mt-3 text-sm text-rose-700">Deletion wasn’t saved. Check browser storage and try again.</p>}<div className="mt-6 flex justify-end gap-3"><button className={button} onClick={() => setDeleteId(null)}>Cancel</button><button className="min-h-11 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700" onClick={() => { if (data.deleteTarget(deleteId)) setDeleteId(null); else setDeleteError(true) }}>Delete target</button></div></Modal>}
  </div>
}
