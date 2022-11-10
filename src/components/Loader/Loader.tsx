import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { Component } from "../../types/Util";
import { roundToNearest } from "../../util";
import { useEventListener } from "../../util/hooks";

import "./Loader.css";

export type LoaderProps = React.HTMLAttributes<HTMLDivElement> & {
	fraction: number
}

const Loader: Component<LoaderProps> = ({
	fraction, className, ...others
}) => {
	const [ barNumber, setBarNumber ] = useState(22)
	const [ innerWidth, setInnerWidth ] = useState(0)
	const ref = useRef<HTMLDivElement | null>(null)
	

	const onResize = () => {
		let fontSize: number;
		const fontSizeStr = getComputedStyle(document.documentElement).fontSize
		const fontSizeMatch = /^\d+(\.\d+)?/.exec(fontSizeStr)

		if (!fontSizeMatch) fontSize = 16
		else fontSize = Number.parseInt(fontSizeMatch[0])

		const div = ref.current
		if (!div) return;

		const { width } = div.getBoundingClientRect()

		setInnerWidth(width * fraction)
		setBarNumber(Math.floor((width - 24) / (fontSize * 1.75)))
	}

	useEffect(onResize, [fraction])
	useEventListener(window, "resize", onResize)

	return (
		<div {...others} className={clsx("loader-root", className)} ref={(el) => ref.current = el}>
			<div
				className={clsx("loader-inner", {"full": fraction === 1})}
				style={{width: `max(min(calc(${roundToNearest(innerWidth / 16, 1.5)}rem), calc(100% - 0.75rem)), 3.375rem)`}}
			>
				<div className="loader-bar-container">
					{new Array(Math.max(barNumber, 0)).fill(0).map((_, i) => {
						const last = (i+1 > (barNumber * (fraction || 0)) - 1) && !(i > (barNumber * (fraction || 0)) - 1 && i !== 0)
						return (
							<div
								key={i}
								className={clsx("loader-bar", {last})}
								style={{display: (i > (barNumber * (fraction || 0)) - 1 && i !== 0) ? "none" : "block"}}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default Loader