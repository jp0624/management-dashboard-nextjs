import { NextResponse } from 'next/server'
import targets from '@/public/data/targets.json'
// Bundled seed data is read-only. Interactive changes live in the browser workspace.
export function GET() { return NextResponse.json(targets) }
