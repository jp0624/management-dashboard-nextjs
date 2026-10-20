'use client'
import { useState } from 'react'
import type { StatusChangeHistory } from '@/app/types'
import Modal from './Modal'
export default function HistoryModal({ history, onClose }: { history: StatusChangeHistory[]; onClose: () => void }) {
  const [action, setAction] = useState('all')
  const [query, setQuery] = useState('')
  const entries = history.filter(h => (action === 'all' || h.action === action) && (h.name ?? '').toLowerCase().includes(query.toLowerCase()))
  return <Modal title="Activity history" onClose={onClose}>
    <div className="mb-5 grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Find a target<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search history" className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-medium">Action<select value={action} onChange={e => setAction(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3"><option value="all">All actions</option><option value="add">Added</option><option value="status">Status updated</option><option value="delete">Deleted</option></select></label></div>
    <p className="mb-3 text-sm text-slate-500">{entries.length} events · Newest first</p>
    <ul className="space-y-3">{entries.map(h => <li key={h.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="min-w-0 break-words font-semibold">{h.name ?? 'Target'}</h3><span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium">{h.action === 'add' ? 'Added' : h.action === 'delete' ? 'Deleted' : 'Status updated'}</span></div>{h.action === 'status' && <p className="mt-2 text-sm text-slate-600">{h.oldStatus ?? 'Not Set'} → <span className="font-semibold text-indigo-700">{h.newStatus ?? 'Not Set'}</span></p>}<time dateTime={h.changedAt} className="mt-2 block text-xs text-slate-500">{new Date(h.changedAt).toLocaleString()}</time></li>)}</ul>
    {!entries.length && <p className="py-10 text-center text-slate-500">No activity matches these filters.</p>}
  </Modal>
}
