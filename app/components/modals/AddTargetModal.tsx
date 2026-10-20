'use client'
import { useState } from 'react'
import type { TargetInput } from '@/app/lib/workspace'
import Modal from './Modal'
export default function AddTargetModal({ onAddTarget, pipelineStatusOptions, onClose }: {
  onAddTarget: (target: TargetInput) => boolean; pipelineStatusOptions: string[]; onClose: () => void
}) {
  const [markets, setMarkets] = useState([''])
  const [error, setError] = useState('')
  const field = 'mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-3 text-base'
  return <Modal title="Add a target" onClose={onClose}><form className="space-y-5" onSubmit={event => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const description = String(data.get('description') ?? '').trim()
    if (!name || !description) { setError('Enter a name and description.'); return }
    const status = String(data.get('status'))
    if (onAddTarget({ name, description, pipelineStatus: status === 'Not Set' ? null : status, markets })) onClose()
    else setError('Your target wasn’t saved. Check browser storage and try again.')
  }}>
    <label className="block text-sm font-medium">Company name<input autoFocus name="name" required maxLength={120} className={field} placeholder="e.g. Northstar Analytics" /></label>
    <label className="block text-sm font-medium">Description<textarea name="description" required maxLength={1000} rows={3} className={field} placeholder="What makes this opportunity worth pursuing?" /></label>
    <label className="block text-sm font-medium">Pipeline status<select name="status" className={field}>{pipelineStatusOptions.map(s => <option key={s}>{s}</option>)}</select></label>
    <fieldset><legend className="text-sm font-medium">Markets</legend><div className="mt-2 space-y-2">{markets.map((market, index) => <div key={index} className="flex items-center gap-2">
      <input aria-label={`Market ${index + 1}`} maxLength={80} value={market} onChange={e => setMarkets(markets.map((m, i) => i === index ? e.target.value : m))} className="min-w-0 flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-3" placeholder="e.g. Financial Services" />
      <button type="button" aria-label={`Remove market ${index + 1}`} onClick={() => setMarkets(markets.filter((_, i) => i !== index))} className="h-11 w-11 shrink-0 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/15 hover:text-rose-700 dark:hover:text-rose-300">✕</button>
    </div>)}</div><button type="button" onClick={() => setMarkets([...markets, ''])} className="mt-2 min-h-11 rounded-lg px-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50">+ Add market</button></fieldset>
    {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
    <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 dark:border-slate-700 pt-5"><button type="button" onClick={onClose} className="min-h-11 rounded-lg border border-slate-300 dark:border-slate-600 px-5 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button><button className="min-h-11 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700">Save target</button></div>
  </form></Modal>
}
