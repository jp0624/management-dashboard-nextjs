/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs/promises'

export const readFile = async (path: string) => {
	const fileBuffer = await fs.readFile(path, 'utf8')
	return JSON.parse(fileBuffer.toString())
}

export const writeFile = async (arr: any[], path: string) => {
	await fs.writeFile(path, JSON.stringify(arr, null, 2))
}
