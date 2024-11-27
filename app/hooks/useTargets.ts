/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useTargets.ts
import { useEffect, useState } from 'react'
import { API_PATH, TARGETS_FOLDER } from '@/app/constants/paths'

export interface TargetData {
	id: number
	name: string
	description: string
	pipelineStatus: string | null
	markets: string[]
}

const useTargets = () => {
	const [dataLoading, setDataLoading] = useState<boolean>(true)
	const [targets, setTargets] = useState<TargetData[]>([])
	const [error, setError] = useState<string | null>(null)
	const [editingTargetId, setEditingTargetId] = useState<number | null>(null)
	const [newPipelineStatus, setNewPipelineStatus] = useState<string | null>(
		null
	)
	const [activeStatuses, setActiveStatuses] = useState<string[]>([])
	const [pipelineStatusOptions, setPipelineStatusOptions] = useState<string[]>(
		[]
	)

	useEffect(() => {
		const fetchTargets = async () => {
			try {
				const response = await fetch(`${API_PATH}${TARGETS_FOLDER}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				})
				if (!response.ok) throw new Error('Failed to fetch targets')
				const data: TargetData[] = await response.json()
				setTargets(data)

				const statuses = Array.from(
					new Set(
						data.map((target) =>
							target.pipelineStatus === null ? 'Not Set' : target.pipelineStatus
						)
					)
				)

				setPipelineStatusOptions(statuses)
				setActiveStatuses(statuses)
			} catch (error: any) {
				console.error('Error fetching targets:', error)
				setError(error.message || 'An unknown error occurred')
			} finally {
				setDataLoading(false)
			}
		}

		fetchTargets()
	}, [])

	const addNewTarget = async (newTarget: {
		name: string
		description: string
		pipelineStatus: string | null
		markets: string[]
	}) => {
		try {
			const response = await fetch(`${API_PATH}${TARGETS_FOLDER}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newTarget),
			})

			if (!response.ok) throw new Error('Failed to add new target')
			const createdTarget: TargetData = await response.json()
			setTargets((prev) => [...prev, createdTarget])
		} catch (error: any) {
			console.error('Error adding new target:', error)
			setError(error.message || 'An unknown error occurred')
		}
	}

	const savePipelineStatus = async (id: number) => {
		if (newPipelineStatus === null) return

		try {
			const response = await fetch(`${API_PATH}${TARGETS_FOLDER}/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					pipelineStatus:
						newPipelineStatus === 'Not Set' ? null : newPipelineStatus,
				}),
			})

			if (!response.ok) throw new Error('Failed to update pipeline status')

			const updatedTarget = await response.json()
			setTargets((prev) =>
				prev.map((target) => (target.id === id ? updatedTarget : target))
			)
			setEditingTargetId(null)
			setNewPipelineStatus(null)
		} catch (error: any) {
			console.error('Error updating pipeline status:', error)
			setError(error.message || 'An unknown error occurred')
		}
	}

	const deleteTarget = async (id: number) => {
		try {
			const response = await fetch(`${API_PATH}${TARGETS_FOLDER}/${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			})

			if (!response.ok) throw new Error('Failed to delete target')

			setTargets((prev) => prev.filter((target) => target.id !== id))
		} catch (error: any) {
			console.error('Error deleting target:', error)
			setError(error.message || 'An unknown error occurred')
		}
	}

	return {
		dataLoading,
		targets,
		error,
		editingTargetId,
		newPipelineStatus,
		pipelineStatusOptions,
		activeStatuses,
		setEditingTargetId,
		setNewPipelineStatus,
		setActiveStatuses,
		addNewTarget,
		savePipelineStatus,
		deleteTarget,
	}
}

export default useTargets
