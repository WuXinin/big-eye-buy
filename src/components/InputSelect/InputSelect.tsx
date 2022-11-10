import clsx from "clsx"
import React, { useMemo, useRef, useState } from "react"
import { Component, ComponentItem } from "../../types/Util"
import InputBase from "../InputBase"

import UpChevron from "../../svg/up-chevron.svg"

import "./InputSelect.css"
import { useClickAway } from "../../util"

export type InputSelectProps<V extends string | number, T = any> = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "placeholder"> & {
	label?: string,
	valueFormatter?: (item: ComponentItem<V, T>) => string,
	items: ComponentItem<V, T>[],
	value: V,
	onChange: (item: ComponentItem<V, T>) => void,
	placeholder?: string,
	searchable?: boolean
}

const InputSelect = <V extends string | number, T = any>({
	items, value, onChange, label, className,
	placeholder, searchable, valueFormatter, ...others
}: InputSelectProps<V, T>): React.ReactElement => {
	const [ open, setOpen ] = useState(false)
	const [ search, setSearch ] = useState("")
	const rootRef = useRef<HTMLDivElement>()

	const selectedItem = useMemo(() => items.find((item) => item.value === value), [items, value])

	const filteredItems = useMemo(() => {
		if (!searchable) return items;
		return items
			.filter((item) => item.label.toLowerCase()
				.includes(search.toLowerCase())
			)
	}, [items, search])

	useClickAway(rootRef, () => setOpen(false))

	return (
		<InputBase
			{...others}
			ref={(el: HTMLDivElement) => rootRef.current = el}
			className={clsx("input-select", className, {open})}
			label={label}
			onClick={() => {
				setOpen(!open)
				setSearch("")
			}}
		>
			<select
				value={value}
				onChange={(e) => {
					const item = items.find((item) => item.value === e.target.value)
					if (!item) return
					onChange(item)
				}}
			>
				{items.map((item, i) => (
					<option key={i} value={item.value}>{item.label}</option>
				))}
			</select>
			<div className="select-text">
				{(valueFormatter ? (selectedItem ? valueFormatter(selectedItem) : "") : selectedItem?.label) || placeholder}
				<UpChevron />
			</div>
			<div className="dropdown">
				{searchable && (
					<input
						placeholder="Search"
						value={search}
						onInput={(e) => setSearch(e.currentTarget.value)}
						onClick={(e) => e.stopPropagation()}
					/>
				)}
				{filteredItems.map((item) => (
					<button
						key={item.value}
						className={clsx("dropdown-item", {active: value === item.value})}
						onClick={() => onChange(item)}
						type="button"
					>
						{item.label}
					</button>
				))}
			</div>
		</InputBase>
	)
}

export default InputSelect