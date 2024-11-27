import { NextResponse } from 'next/server'
import { readFile, writeFile } from '@/app/utils/db'
import { HISTORY_JSON_PATH } from '@/app/constants/paths'
import { StatusChangeHistory } from '@/app/types'

export async function GET() {
	try {
		const history = await readFile(HISTORY_JSON_PATH)
		return NextResponse.json(history)
	} catch (error) {
		console.error('Error reading history:', error)
		return NextResponse.json(
			{ error: 'Failed to read history' },
			{ status: 500 }
		)
	}
}

export async function POST(request: Request) {
	const body = await request.json()

	try {
		const newEntry = body as StatusChangeHistory
		const history = await readFile(HISTORY_JSON_PATH)
		history.push(newEntry)
		await writeFile(history, HISTORY_JSON_PATH)
		return NextResponse.json(newEntry, { status: 201 })
	} catch (error) {
		console.error('Error writing history:', error)
		return NextResponse.json(
			{ error: 'Failed to create history entry' },
			{ status: 500 }
		)
	}
}
