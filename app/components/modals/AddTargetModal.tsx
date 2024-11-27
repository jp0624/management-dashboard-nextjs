import { AddTargetProps } from '@/app/types'
import React, { useState } from 'react'
import { FaPlus, FaMinus, FaTimesCircle } from 'react-icons/fa'

const AddTarget: React.FC<AddTargetProps> = ({
	onAddTarget,
	pipelineStatusOptions,
	isOpen,
	onClose,
}) => {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [pipelineStatus, setPipelineStatus] = useState<string | null>(null)
	const [markets, setMarkets] = useState<string[]>([''])

	const handleAddMarket = () => {
		setMarkets((prevMarkets) => [...prevMarkets, ''])
	}

	const handleMarketChange = (index: number, value: string) => {
		const newMarkets = [...markets]
		newMarkets[index] = value
		setMarkets(newMarkets)
	}

	const handleRemoveMarket = (index: number) => {
		setMarkets((prevMarkets) => prevMarkets.filter((_, i) => i !== index))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const filteredMarkets = markets.filter((market) => market.trim() !== '')
		onAddTarget({ name, description, pipelineStatus, markets: filteredMarkets })
		setName('')
		setDescription('')
		setPipelineStatus(null)
		setMarkets([''])
		onClose()
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 z-10'>
			<form
				onSubmit={handleSubmit}
				className='bg-white w-full max-w-md p-6 rounded shadow-md text-slate-800 flex flex-col gap-2'
			>
				<h2 className='text-xl font-bold mb-4 flex flex-row items-center justify-between'>
					Add New Target
					<button
						onClick={onClose}
						className='bg-red-500 text-white text-sm px-2 py-1 rounded flex items-center justify-center flex-row gap-2'
					>
						<FaTimesCircle /> Close
					</button>
				</h2>

				<label>
					Name:
					<input
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						className='border border-gray-300 p-2 rounded w-full text-slate-800'
						required
					/>
				</label>

				<label>
					Description:
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className='border border-gray-300 p-2 rounded w-full text-slate-800 m-0'
						required
					/>
				</label>

				<label>
					Pipeline Status:
					<select
						value={pipelineStatus || ''}
						onChange={(e) => setPipelineStatus(e.target.value || null)}
						className='border border-gray-300 p-2 rounded w-full text-slate-800'
					>
						<option value=''>Select Status</option>
						{pipelineStatusOptions
							.filter((status, index, self) => self.indexOf(status) === index)
							.map((status) => (
								<option key={status} value={status}>
									{status}
								</option>
							))}
					</select>
				</label>

				<label>
					Markets:
					<div className='flex flex-col gap-2'>
						{markets.map((market, index) => (
							<div key={index} className='flex items-center'>
								<input
									type='text'
									value={market}
									onChange={(e) => handleMarketChange(index, e.target.value)}
									className='border border-gray-300 p-2 rounded w-full mr-2 text-slate-800'
									placeholder='Market name'
								/>
								{index === markets.length - 1 ? (
									<button
										type='button'
										onClick={handleAddMarket}
										className='bg-blue-500 text-white p-2 rounded'
									>
										<FaPlus />
									</button>
								) : (
									<button
										type='button'
										onClick={() => handleRemoveMarket(index)}
										className='bg-red-500 text-white p-2 rounded'
									>
										<FaMinus />
									</button>
								)}
							</div>
						))}
					</div>
				</label>
				<nav className='flex justify-end flex-row gap-5'>
					<button
						type='submit'
						className='mt-4 bg-green-500 text-white py-1 px-4 rounded'
					>
						Save Target
					</button>
					{/* <button
						type='button'
						onClick={onClose}
						className='mt-4 bg-gray-300 text-gray-800 py-2 px-4 rounded'
					>
						Cancel
					</button> */}
				</nav>
			</form>
		</div>
	)
}

export default AddTarget
