/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { readFile, writeFile } from '@/app/utils/fs'
import { TARGETS_JSON_PATH, HISTORY_JSON_PATH } from '@/app/constants/paths'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params
	try {
		const targets = await readFile(TARGETS_JSON_PATH)
		const target = targets.find(
			(t: { id: number }) => t.id === parseInt(id, 10)
		)

		if (!target) {
			return NextResponse.json({ error: 'Target not found' }, { status: 404 })
		}

		return NextResponse.json(target)
	} catch (error) {
		console.error('Error reading targets:', error)
		return NextResponse.json(
			{ error: 'Failed to read targets' },
			{ status: 500 }
		)
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params
	const body = await request.json()

	try {
		const { pipelineStatus } = body
		const targets = await readFile(TARGETS_JSON_PATH)
		const targetIndex = targets.findIndex(
			(target: { id: number }) => target.id === parseInt(id, 10)
		)

		if (targetIndex === -1) {
			return NextResponse.json({ error: 'Target not found' }, { status: 404 })
		}

		// Store the old status for history logging
		const oldStatus = targets[targetIndex].pipelineStatus

		// Update the target's pipeline status
		targets[targetIndex].pipelineStatus = pipelineStatus

		// Create a history entry
		const historyEntry = {
			id: parseInt(Date.now() + '' + Math.floor(Math.random() * 100000 + 1)),
			targetId: parseInt(id, 10),
			oldStatus,
			newStatus: pipelineStatus,
			changedAt: new Date().toISOString(),
			action: 'status',
		}

		// Update history
		const history = await readFile(HISTORY_JSON_PATH)
		history.push(historyEntry)
		await writeFile(history, HISTORY_JSON_PATH) // Save the updated history
		await writeFile(targets, TARGETS_JSON_PATH) // Save the updated targets

		return NextResponse.json(targets[targetIndex])
	} catch (error) {
		console.error('Error updating target:', error)
		return NextResponse.json(
			{ error: 'Failed to update target' },
			{ status: 500 }
		)
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params
	const body = await request.json()

	try {
		const pipelineStatus = body.pipelineStatus // Adjust to how the client sends data
		const targets = await readFile(TARGETS_JSON_PATH)
		const targetIndex = targets.findIndex(
			(target: { id: number }) => target.id === parseInt(id, 10)
		)

		if (targetIndex === -1) {
			return NextResponse.json({ error: 'Target not found' }, { status: 404 })
		}

		const oldStatus = targets[targetIndex].pipelineStatus
		targets[targetIndex].pipelineStatus = pipelineStatus

		const historyEntry = {
			id: parseInt(Date.now() + '' + Math.floor(Math.random() * 100000 + 1)),
			targetId: parseInt(id, 10),
			oldStatus,
			newStatus: pipelineStatus,
			changedAt: new Date().toISOString(),
			action: 'status',
		}

		const history = await readFile(HISTORY_JSON_PATH)
		history.push(historyEntry)
		await writeFile(history, HISTORY_JSON_PATH)
		await writeFile(targets, TARGETS_JSON_PATH)

		return NextResponse.json(targets[targetIndex])
	} catch (error) {
		console.log('Error:', error)
		return NextResponse.json(
			{ error: 'Failed to update target' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params

	try {
		const targets = await readFile(TARGETS_JSON_PATH)
		const targetIndex = targets.findIndex(
			(target: { id: number }) => target.id === parseInt(id, 10)
		)

		if (targetIndex === -1) {
			return NextResponse.json({ error: 'Target not found' }, { status: 404 })
		}

		// Create a history entry
		const deletedTarget = targets[targetIndex]
		const historyEntry = {
			id: parseInt(Date.now() + '' + Math.floor(Math.random() * 100000 + 1)),
			name: deletedTarget.name,
			action: 'delete',
			changedAt: new Date().toISOString(),
		}

		// Delete the target
		targets.splice(targetIndex, 1)

		const history = await readFile(HISTORY_JSON_PATH)
		history.push(historyEntry)

		await writeFile(targets, TARGETS_JSON_PATH)
		await writeFile(history, HISTORY_JSON_PATH)

		return NextResponse.json({ message: 'Target deleted successfully' })
	} catch (error) {
		console.log('Error:', error)
		return NextResponse.json(
			{ error: 'Failed to delete target' },
			{ status: 500 }
		)
	}
}
