import React, { useMemo } from "react"
import { Component } from "../../types/Util"

import "./ResponsiveImage.css"

export type Size = "original" | "xl" | "lg" | "md" | "sm" | "none";

export type ResponsiveImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
	name: string,
	fileType: string,
	size?: Size
}

const getSizeArr = (size: Size): Size[] => {
	let sizes: Size[] = ["xl", "lg", "md", "sm"]
	const index = sizes.indexOf(size)
	return ["original", ...(index >= 0 ? sizes.slice(index) : [])]
}

const sizeMap = {
	original: {media: 2100, width: 2000, height: 1125},
	xl: {media: 1600, width: 1920, height: 1080},
	lg: {media: 600, width: 1400, height: 788},
	md: {media: 300, width: 800, height: 450},
	sm: {media: 1, width: 500, height: 281},
	none: {media: 1, width: 0, height: 0}
} as const;

const ResponsiveImage: Component<ResponsiveImageProps> = ({
	className, name, fileType, size, ...others
}) => {

	const sizeArr: Size[] = useMemo(() => getSizeArr(size || "none"), [size]);

	return (
		<picture className={className}>
			{sizeArr.filter((currSize) => !["none"].includes(currSize)).map((currSize, i) => {
				const sizeItem = sizeMap[currSize]
				const media = i === sizeArr.length - 1 ? 1 : sizeItem.media

				return (
					<source
						key={currSize}
						srcSet={`/img/${name}/${name}${currSize !== "original" ? `-${currSize}` : ""}.webp`}
						media={`(min-width: ${media}px)`}
						width={sizeItem.width}
						height={sizeItem.height}
					/>
				)
			})}
			<img width="2000" height="1125" loading="lazy" {...others} src={`/img/${name}/${name}.webp`} />
		</picture>
	)
}

export default ResponsiveImage