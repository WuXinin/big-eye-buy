import clsx from "clsx"
import React from "react"
import { Component, ComponentType } from "../../types/Util"

import "./Button.css"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "nav" | "default" | "secondary",
	component?: ComponentType,
	[key: string]: any
}

const Button: Component<ButtonProps> = ({
	className, component = "button", variant = "default", ...others
}) => {
	const Comp = component
	return (
		<Comp
			{...others}
			className={clsx(
				"button", className, `variant-${variant}`
			)}>
			{others.children}
		</Comp>
	)
}

export default Button