import clsx from "clsx"
import React from "react"
import { Component } from "../../types/Util"

import "./InputBase.css"

export type InputBaseProps = React.HTMLAttributes<HTMLDivElement> & {
	label?: string
}

const InputBase = React.forwardRef<HTMLDivElement, InputBaseProps>(({
	label, style, id, className, children, ...others
}, ref) => {
	return (
		<div
			{...others}
			className={clsx("input-root", {"has-label": !!label}, className)}
			style={style}
			ref={ref}
		>
			<label htmlFor={id}>{label}</label>
			{children}
		</div>
	)
})

export default InputBase