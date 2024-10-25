/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { readFile, writeTargets, writeHistory } from '@/app/lib/db'
import { JSON_PATH, HISTORY_PATH } from '@/app/constants/paths'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params
	try {
		const targets = await readFile(JSON_PATH)
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
		const targets = await readFile(JSON_PATH)
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
			id: Date.now(),
			targetId: parseInt(id, 10),
			oldStatus,
			newStatus: pipelineStatus,
			changedAt: new Date().toISOString(),
		}

		// Update history
		const history = await readFile(HISTORY_PATH)
		history.push(historyEntry)
		await writeHistory(history, HISTORY_PATH) // Save the updated history
		await writeTargets(targets, JSON_PATH) // Save the updated targets

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
		const targets = await readFile(JSON_PATH)
		const targetIndex = targets.findIndex(
			(target: { id: number }) => target.id === parseInt(id, 10)
		)

		if (targetIndex === -1) {
			return NextResponse.json({ error: 'Target not found' }, { status: 404 })
		}

		const oldStatus = targets[targetIndex].pipelineStatus
		targets[targetIndex].pipelineStatus = pipelineStatus

		const historyEntry = {
			id: Date.now(),
			targetId: parseInt(id, 10),
			oldStatus,
			newStatus: pipelineStatus,
			changedAt: new Date().toISOString(),
		}

		const history = await readFile(HISTORY_PATH)
		history.push(historyEntry)
		await writeHistory(history, HISTORY_PATH)
		await writeTargets(targets, JSON_PATH)

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
		const targets = await readFile(JSON_PATH)
		const targetIndex = targets.findIndex(
			(target: { id: number }) => target.id === parseInt(id, 10)
		)

		if (targetIndex === -1) {
			return NextResponse.json({ error: 'Target not found' }, { status: 404 })
		}

		const deletedTarget = targets[targetIndex]
		targets.splice(targetIndex, 1)
		await writeTargets(targets, JSON_PATH)

		const history = await readFile(HISTORY_PATH)
		const updatedHistory = history.filter(
			(entry: { targetId: any }) => entry.targetId !== deletedTarget.id
		)
		await writeHistory(updatedHistory, HISTORY_PATH)

		return NextResponse.json({ message: 'Target deleted successfully' })
	} catch (error) {
		console.log('Error:', error)
		return NextResponse.json(
			{ error: 'Failed to delete target' },
			{ status: 500 }
		)
	}
}
