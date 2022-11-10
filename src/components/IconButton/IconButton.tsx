import React from "react"
import clsx from "clsx"
import { Component, ComponentType } from "../../types/Util"
import "./IconButton.css"

export type IconButtonProps = {
	component?: ComponentType
	disabled?: boolean,
	[key: string]: any
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const IconButton: Component<IconButtonProps> = ({
	component,
	disabled,
	children,
	loading,
	...others
}) => {
	let Comp = (component || "button") as React.FC<any>
	return (
		<Comp
			{...others}
			component={component || "button"}
			className={clsx("icon-button", others.className, {
				disabled,
				loading
			})}
			disabled={disabled || loading}
		>
			{children}
		</Comp>
	)
}

export default IconButton