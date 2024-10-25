import { NextResponse } from 'next/server'
import targetsData from '../../../data/targets.json'

export async function GET() {
	return NextResponse.json(targetsData)
}
