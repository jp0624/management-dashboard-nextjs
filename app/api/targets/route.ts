import { NextResponse } from 'next/server'
import { readFile, writeFile } from '@/app/utils/fs'
import { HISTORY_JSON_PATH, TARGETS_JSON_PATH } from '@/app/constants/paths'
import { Target } from '@/app/types'

export async function GET() {
	try {
		const targets = await readFile(TARGETS_JSON_PATH)
		return NextResponse.json(targets)
	} catch (error) {
		console.error('Error reading targets:', error)
		return NextResponse.json(
			{ error: 'Failed to read targets' },
			{ status: 500 }
		)
	}
}

export async function POST(request: Request) {
	const body = await request.json()

	// Example validation
	if (!body.name || !body.description || !Array.isArray(body.markets)) {
		return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
	}

	try {
		const targets = await readFile(TARGETS_JSON_PATH)
		const newTarget: Target = {
			id: parseInt(Date.now() + '' + Math.floor(Math.random() * 100000 + 1)), // Or any other logic to create a unique ID
			...body,
		}

		targets.push(newTarget)

		const history = await readFile(HISTORY_JSON_PATH)
		// Create a history entry
		const historyEntry = {
			id: parseInt(Date.now() + '' + Math.floor(Math.random() * 100000 + 1)),
			name: newTarget.name,
			action: 'add',
			changedAt: new Date().toISOString(),
		}
		history.push(historyEntry)

		await writeFile(history, HISTORY_JSON_PATH)
		await writeFile(targets, TARGETS_JSON_PATH)

		return NextResponse.json(newTarget)
	} catch (error) {
		console.error('Error writing targets:', error)
		return NextResponse.json(
			{ error: 'Failed to add new target' },
			{ status: 500 }
		)
	}
}
