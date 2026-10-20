import { NextResponse } from 'next/server'
import targets from '@/public/data/targets.json'
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const target = targets.find(t => t.id === Number(id))
  return target ? NextResponse.json(target) : NextResponse.json({ error: 'Target not found' }, { status: 404 })
}
