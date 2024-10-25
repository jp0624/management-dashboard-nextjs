/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs/promises'

export const readFile = async (path: string) => {
	const fileBuffer = await fs.readFile(path, 'utf8')
	return JSON.parse(fileBuffer.toString())
}

export const writeTargets = async (targets: any[], path: string) => {
	await fs.writeFile(path, JSON.stringify(targets, null, 2))
}

export const writeHistory = async (history: any[], path: string) => {
	await fs.writeFile(path, JSON.stringify(history, null, 2))
}
