import { NextResponse } from 'next/server'
import history from '@/public/data/targets-history.json'
export function GET() { return NextResponse.json(history) }
