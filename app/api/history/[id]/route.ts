import { NextResponse } from 'next/server'
import { readFile, writeFile } from '@/app/utils/fs'
import { HISTORY_JSON_PATH } from '@/app/constants/paths'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params

	try {
		const history = await readFile(HISTORY_JSON_PATH)
		const entry = history.find((h: { id: number }) => h.id === parseInt(id, 10))

		if (!entry) {
			return NextResponse.json(
				{ error: 'History entry not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json(entry)
	} catch (error) {
		console.error('Error reading history:', error)
		return NextResponse.json(
			{ error: 'Failed to read history' },
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
		const history = await readFile(HISTORY_JSON_PATH)
		const entryIndex = history.findIndex(
			(entry: { id: number }) => entry.id === parseInt(id, 10)
		)

		if (entryIndex === -1) {
			return NextResponse.json(
				{ error: 'History entry not found' },
				{ status: 404 }
			)
		}

		history.splice(entryIndex, 1)
		await writeFile(history, HISTORY_JSON_PATH)

		return NextResponse.json({ message: 'History entry deleted successfully' })
	} catch (error) {
		console.error('Error deleting history entry:', error)
		return NextResponse.json(
			{ error: 'Failed to delete history entry' },
			{ status: 500 }
		)
	}
}
