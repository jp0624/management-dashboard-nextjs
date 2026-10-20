import { NextResponse } from 'next/server'
import history from '@/public/data/targets-history.json'
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const entry = history.find(h => h.id === Number(id))
  return entry ? NextResponse.json(entry) : NextResponse.json({ error: 'History entry not found' }, { status: 404 })
}
