import clsx from "clsx"
import React from "react"
import { Component } from "../../types/Util"
import Card from "../Card"
import ResponsiveImage from "../ResponsiveImage"

import "./BackgroundSlide.css"

export interface BackgroundSlideClasses {
	root?: string,
	inner?: string,
	card?: string,
}

export type BackgroundSlideProps = React.HTMLAttributes<HTMLDivElement> & {
	classes?: BackgroundSlideClasses
}

const BackgroundSlide: Component<BackgroundSlideProps> = ({
	children, className, classes, ...others
}) => {
	return (
		<div {...others} className={clsx("background-slide", classes?.root)}>
			<div className={clsx("slide-inner", classes?.inner)}>
				<ResponsiveImage
					className="background-image"
					name="games_room"
					fileType="webp"
					alt="Background Image"
					size="xl"
					loading="eager"
				/>
				<Card className={clsx("slide-card", classes?.card, className)}>
					{children}
				</Card>
			</div>
		</div>
	)
}

export default BackgroundSlide