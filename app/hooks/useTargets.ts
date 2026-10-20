'use client'
import { useEffect, useRef, useState } from 'react'
import seedTargets from '@/public/data/targets.json'
import seedHistory from '@/public/data/targets-history.json'
import type { StatusChangeHistory } from '@/app/types'
import { changeWorkspace, isWorkspace, STATUSES, STORAGE_KEY, type Workspace, type WorkspaceAction, type TargetInput } from '@/app/lib/workspace'

const seed: Workspace = { version: 1, targets: seedTargets, history: (seedHistory as StatusChangeHistory[]).slice().sort((a, b) => Date.parse(b.changedAt) - Date.parse(a.changedAt)) }

export default function useTargets() {
  const [workspace, setWorkspace] = useState<Workspace>(seed)
  const current = useRef(seed)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeStatuses, setActiveStatuses] = useState<string[]>(STATUSES)
  const [editingTargetId, setEditingTargetId] = useState<number | null>(null)
  const [newPipelineStatus, setNewPipelineStatus] = useState<string | null>(null)
  useEffect(() => {
    const restore = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        const parsed: unknown = saved ? JSON.parse(saved) : seed
        if (!isWorkspace(parsed)) throw new Error('Saved workspace is invalid. Export or clear this site’s saved data to recover.')
        current.current = parsed
        setWorkspace(parsed)
        setError(null)
      } catch (e) { setError(e instanceof Error ? e.message : 'Browser storage is unavailable.') }
      setDataLoading(false)
    }
    restore()
    const sync = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) restore() }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  const commit = (action: WorkspaceAction) => {
    try {
      // Read the latest snapshot before a write, including changes from another tab.
      const saved = localStorage.getItem(STORAGE_KEY)
      const latest: unknown = saved ? JSON.parse(saved) : current.current
      if (!isWorkspace(latest)) throw new Error('Saved workspace is invalid; changes were not saved.')
      const next = changeWorkspace(latest, action)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      current.current = next
      setWorkspace(next)
      setError(null)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save. Check available browser storage.')
      return false
    }
  }
  const savePipelineStatus = (id: number) => {
    if (commit({ type: 'status', id, status: newPipelineStatus })) setEditingTargetId(null)
  }
  return { targets: workspace.targets, history: workspace.history, dataLoading, error,
    activeStatuses, setActiveStatuses, pipelineStatusOptions: STATUSES,
    editingTargetId, setEditingTargetId, newPipelineStatus, setNewPipelineStatus,
    addNewTarget: (target: TargetInput) => commit({ type: 'add', target }),
    deleteTarget: (id: number) => commit({ type: 'delete', id }), savePipelineStatus }
}
