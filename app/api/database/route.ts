import fs from 'fs/promises' // Using promises version of fs
import { NextResponse } from 'next/server'
import { JSON_PATH, HISTORY_PATH } from '@/app/constants/paths' // Ensure these paths are defined

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
}

const readTargets = async (): Promise<Target[]> => {
	const fileBuffer = await fs.readFile(JSON_PATH)
	return JSON.parse(fileBuffer.toString()) as Target[]
}

const readHistory = async (): Promise<StatusChangeHistory[]> => {
	const fileBuffer = await fs.readFile(HISTORY_PATH)
	return JSON.parse(fileBuffer.toString()) as StatusChangeHistory[]
}

const writeTargets = async (targets: Target[]) => {
	await fs.writeFile(JSON_PATH, JSON.stringify(targets, null, 2))
}

const writeHistory = async (history: StatusChangeHistory[]) => {
	await fs.writeFile(HISTORY_PATH, JSON.stringify(history, null, 2))
}

// Handle POST requests
export async function POST(request: Request) {
	const body = await request.json()
	const { action } = body

	if (action === 'fetchTargets') {
		try {
			const targets = await readTargets()
			return NextResponse.json(targets)
		} catch (error) {
			return NextResponse.json(
				{ error: 'Failed to read targets' },
				{ status: 500 }
			)
		}
	}

	if (action === 'fetchHistory') {
		try {
			const history = await readHistory()
			return NextResponse.json(history)
		} catch (error) {
			return NextResponse.json(
				{ error: 'Failed to read history' },
				{ status: 500 }
			)
		}
	}

	if (action === 'updateTarget') {
		try {
			const { id, pipelineStatus } = body.data as Pick<
				Target,
				'id' | 'pipelineStatus'
			>
			const targets = await readTargets()

			const targetIndex = targets.findIndex((target) => target.id === id)
			if (targetIndex === -1) {
				return NextResponse.json({ error: 'Target not found' }, { status: 404 })
			}

			const oldStatus = targets[targetIndex].pipelineStatus
			targets[targetIndex].pipelineStatus = pipelineStatus

			const historyEntry: StatusChangeHistory = {
				id: Date.now(),
				targetId: id,
				oldStatus,
				newStatus: pipelineStatus,
				changedAt: new Date().toISOString(),
			}

			const history = await readHistory()
			history.push(historyEntry)
			await writeHistory(history)
			await writeTargets(targets)

			return NextResponse.json(targets[targetIndex])
		} catch (error) {
			return NextResponse.json(
				{ error: 'Failed to update target' },
				{ status: 500 }
			)
		}
	}

	if (action === 'createTarget') {
		try {
			const newTarget = body.data as Omit<Target, 'id'> // Ensure this matches your Target structure
			const targets = await readTargets()

			const newId =
				targets.reduce((maxId, target) => Math.max(maxId, target.id), 0) + 1 // Ensure you get a unique ID
			const newTargetWithId = { id: newId, ...newTarget }

			targets.push(newTargetWithId)
			await writeTargets(targets) // Write the updated targets array to the file

			return NextResponse.json(newTargetWithId, { status: 201 }) // Return the created target
		} catch (error) {
			return NextResponse.json(
				{ error: 'Failed to create target' },
				{ status: 500 }
			)
		}
	}
	if (action === 'deleteTarget') {
		try {
			const { id } = body.data as { id: number }

			if (isNaN(id)) {
				return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
			}

			const targets = await readTargets()
			const targetIndex = targets.findIndex((target) => target.id === id)

			if (targetIndex === -1) {
				return NextResponse.json({ error: 'Target not found' }, { status: 404 })
			}

			const deletedTarget = targets[targetIndex] // Get the target to log history
			targets.splice(targetIndex, 1) // Remove the target
			await writeTargets(targets) // Update the targets file

			// Now, handle the history entries
			const history = await readHistory()

			// Remove all history entries related to the deleted target
			const updatedHistory = history.filter(
				(entry) => entry.targetId !== deletedTarget.id
			)
			await writeHistory(updatedHistory) // Write updated history back to file

			// Return a success message without logging the deletion in history
			return NextResponse.json({ message: 'Target deleted successfully' })
		} catch (error) {
			return NextResponse.json(
				{ error: 'Failed to delete target' },
				{ status: 500 }
			)
		}
	}

	return NextResponse.json({ error: 'Action not recognized' }, { status: 400 })
}

// Handle PUT requests
export async function PUT(request: Request) {
	const body = await request.json()
	const { id, pipelineStatus } = body.data as Pick<
		Target,
		'id' | 'pipelineStatus'
	>

	try {
		const targets = await readTargets()
		const targetIndex = targets.findIndex((target) => target.id === id)

		if (targetIndex === -1) {
			return NextResponse.json({ error: 'Target not found' }, { status: 404 })
		}

		const oldStatus = targets[targetIndex].pipelineStatus
		targets[targetIndex].pipelineStatus = pipelineStatus

		const historyEntry: StatusChangeHistory = {
			id: Date.now(),
			targetId: id,
			oldStatus,
			newStatus: pipelineStatus,
			changedAt: new Date().toISOString(),
		}

		const history = await readHistory()
		history.push(historyEntry)
		await writeHistory(history)
		await writeTargets(targets)

		return NextResponse.json(targets[targetIndex])
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to update target' },
			{ status: 500 }
		)
	}
}
