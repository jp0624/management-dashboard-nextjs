import { NextResponse } from 'next/server'
import { readFile, writeTargets } from '@/app/lib/db'
import { JSON_PATH } from '@/app/constants/paths'
import { Target } from '@/app/types'

export async function GET() {
	try {
		const targets = await readFile(JSON_PATH)
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
		const targets = await readFile(JSON_PATH)
		const newTarget: Target = {
			id: Date.now(), // Or any other logic to create a unique ID
			...body,
		}

		targets.push(newTarget)
		await writeTargets(targets, JSON_PATH)

		return NextResponse.json(newTarget)
	} catch (error) {
		console.error('Error writing targets:', error)
		return NextResponse.json(
			{ error: 'Failed to add new target' },
			{ status: 500 }
		)
	}
}
