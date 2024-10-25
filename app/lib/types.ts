export interface Target {
	id: number
	name: string
	description: string
	pipelineStatus: string | null
	markets: string[]
}

export interface StatusChangeHistory {
	id: number
	targetId: number
	oldStatus: string | null
	newStatus: string | null
	changedAt: string // ISO format date string
	action: 'add' | 'delete'
}
