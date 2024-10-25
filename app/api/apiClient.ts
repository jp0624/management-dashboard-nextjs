import { API_PATH } from '@/app/constants/paths'

export const apiFetch = async (url: string, options: RequestInit = {}) => {
	const response = await fetch(`${API_PATH}${url}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
	})
	if (!response.ok) throw new Error(await response.text())
	return response.json()
}
