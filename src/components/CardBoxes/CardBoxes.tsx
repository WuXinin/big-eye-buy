import clsx from "clsx"
import React from "react"
import { Component } from "../../types/Util"
import ResponsiveImage from "../ResponsiveImage"

import "./CardBoxes.css"

export type CardBoxesProps = React.HTMLAttributes<HTMLDivElement> & {
}

const CardBoxes: Component<CardBoxesProps> = ({ className, ...others }) => {
	return (
		<div {...others} className={clsx("card-boxes", className)}>
			{others.children}
		</div>
	)
}

export default CardBoxes

export type CardBoxProps = React.HTMLAttributes<HTMLDivElement> & {
	imageFileType: string,
	imageName: string,
	title: string,
	description: string | React.ReactElement
}

export const CardBox: Component<CardBoxProps> = ({
	imageFileType, imageName, title, description
}) => {
	return (
		<div className="card-box">
			<ResponsiveImage loading="lazy" fileType={imageFileType} name={imageName} />
			<div className="text-container">
				<p className="label">{title}</p>
				<p className="description text-hint">{description}</p>
			</div>
		</div>
	)
}