export interface DataFilterProps {
	activeStatuses: string[]
	pipelineStatusOptions: string[]
	toggleStatus: (status: string) => void
}

export interface TargetData {
	id: number
	name: string
	description: string
	pipelineStatus: string | null
	markets: string[]
}

export interface TargetTableProps {
	targets: TargetData[]
	editingTargetId: number | null
	newPipelineStatus: string | null
	setEditingTargetId: (id: number | null) => void
	setNewPipelineStatus: (status: string | null) => void
	savePipelineStatus: (id: number) => void
	deleteTarget: (id: number) => void
	pipelineStatusOptions: string[]
	handleEditTarget: (target: TargetData) => void
	handleAddTarget: () => void // Add this prop for adding new target
}

export interface StatusChangeHistory {
	id: number
	targetId?: number
	oldStatus?: string | null
	newStatus?: string | null
	changedAt: string
	action?: 'add' | 'delete' | 'status'
	name?: string
}

interface AddTargetProps {
	onAddTarget: (newTarget: {
		name: string
		description: string
		pipelineStatus: string | null
		markets: string[]
	}) => void
	pipelineStatusOptions: string[]
	isOpen: boolean
	onClose: () => void
}

interface Target {
	id: number
	name: string
}
