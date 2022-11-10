import clsx from "clsx"
import React, { useState } from "react"
import { Component, ComponentItem } from "../../types/Util"

import "./Select.css"

export type SelectProps<V extends string | number, T = any> = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
	items: ComponentItem<V, T>[],
	value: V,
	onChange: (item: ComponentItem<V, T>) => void,
	selectClass: string
}

const Select = <V extends string | number, T>({
	items, value, onChange, selectClass, ...others
}: SelectProps<V, T>): React.ReactElement => {
	const selectedItem = items.find((item) => item.value === value)
	const [ open, setOpen ] = useState(false)

	return (
		<div {...others} className={clsx("select-root", others.className, {open})}>
			<select
				value={value}
				className={selectClass}
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
			<button className="select-label" onClick={() => setOpen((open) => !open)}>
				{selectedItem?.label}
			</button>
			<div className="select-items">
				{items.map((item, i) => (
					<button key={i} className="select-item" onClick={() => {
						setOpen(false)
						onChange(item)
					}}>
						{item.label}
					</button>
				))}
			</div>
			{others.children}
		</div>
	)
}

export default Select