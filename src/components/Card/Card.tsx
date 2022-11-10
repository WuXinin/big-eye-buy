import clsx from "clsx"
import React from "react"
import { Component } from "../../types/Util"

import "./Card.css"

export interface CardClasses {
	root?: string,
	inner?: string
}

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
	classes?: CardClasses,
	windowBar?: boolean,
	variant?: "default" | "small"
}

const Card: Component<CardProps> = ({
	className, classes, windowBar,
	variant = "default", ...others	
}) => {
	return (
		<div {...others} className={clsx(
			className,
			"card", classes?.root,
			`card-${variant}`,
			{"card-window": windowBar}
		)}>
			{windowBar && (
				<div className="card-window-bar">
					<div className="card-win-button btn-1" />
					<div className="card-win-button btn-2" />
					<div className="card-win-button btn-3" />
				</div>
			)}
			<div className={clsx("card-inner", classes?.inner)}>
				{others.children}
			</div>
		</div>
	)
}

export default Card