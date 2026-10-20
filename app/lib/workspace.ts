import type { StatusChangeHistory, TargetData } from '@/app/types'

export const STORAGE_KEY = 'target-management.workspace.v1'
export const STATUSES = ['Not Set', 'Cold', 'Active', 'Hot', 'Closed', 'Passed']
export interface Workspace { version: 1; targets: TargetData[]; history: StatusChangeHistory[] }
export type TargetInput = Omit<TargetData, 'id'>
export type WorkspaceAction =
  | { type: 'add'; target: TargetInput }
  | { type: 'status'; id: number; status: string | null }
  | { type: 'delete'; id: number }

export function isWorkspace(value: unknown): value is Workspace {
  if (!value || typeof value !== 'object') return false
  const data = value as Workspace
  return data.version === 1 && Array.isArray(data.targets) && Array.isArray(data.history)
    && data.targets.every(t => t && Number.isSafeInteger(t.id) && typeof t.name === 'string'
      && typeof t.description === 'string' && STATUSES.includes(t.pipelineStatus ?? 'Not Set')
      && Array.isArray(t.markets) && t.markets.every(m => typeof m === 'string'))
    && new Set(data.targets.map(t => t.id)).size === data.targets.length
    && data.history.every(h => h && Number.isSafeInteger(h.id) && typeof h.changedAt === 'string'
      && Number.isFinite(Date.parse(h.changedAt)) && ['add', 'delete', 'status'].includes(h.action ?? ''))
}

// One snapshot contains both records and their audit trail, so saving cannot split them.
export function changeWorkspace(workspace: Workspace, action: WorkspaceAction, now = Date.now()): Workspace {
  const nextId = Math.max(now, ...workspace.targets.map(t => t.id), ...workspace.history.map(h => h.id)) + 1
  let targets = workspace.targets
  let entry: StatusChangeHistory
  const changedAt = new Date(now).toISOString()
  if (action.type === 'add') {
    const name = action.target.name.trim()
    const description = action.target.description.trim()
    const status = action.target.pipelineStatus === 'Not Set' ? null : action.target.pipelineStatus
    if (!name || !description || !STATUSES.includes(status ?? 'Not Set')) throw new Error('Enter a name, description, and valid status.')
    const target = { id: nextId, name, description, pipelineStatus: status, markets: [...new Set(action.target.markets.map(m => m.trim()).filter(Boolean))] }
    targets = [target, ...targets]
    entry = { id: nextId + 1, targetId: target.id, name, action: 'add', changedAt }
  } else {
    const target = targets.find(t => t.id === action.id)
    if (!target) throw new Error('This target no longer exists. Refresh the page and try again.')
    if (action.type === 'delete') {
      targets = targets.filter(t => t.id !== action.id)
      entry = { id: nextId, targetId: target.id, name: target.name, action: 'delete', changedAt }
    } else {
      const status = action.status === 'Not Set' ? null : action.status
      if (!STATUSES.includes(status ?? 'Not Set')) throw new Error('Choose a valid pipeline status.')
      if (target.pipelineStatus === status) return workspace
      targets = targets.map(t => t.id === action.id ? { ...t, pipelineStatus: status } : t)
      entry = { id: nextId, targetId: target.id, name: target.name, action: 'status', oldStatus: target.pipelineStatus, newStatus: status, changedAt }
    }
  }
  return { version: 1, targets, history: [entry, ...workspace.history] }
}
