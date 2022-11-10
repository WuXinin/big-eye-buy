import React, { useEffect, useRef, useState } from "react"
import { Component } from "../../types/Util"

import "./NumberAnimate.css"

const easeOutCubic = (time: number, beginning: number, change: number, duration: number): number => {
    return change * ((time = time / duration - 1) * time * time + 1) + beginning;
}

export type NumberAnimateProps = {
	value: number,
	formatter?: (num: number) => string,
	onlyFirst?: boolean
	animate?: boolean
}

const numSteps = 70

const animateTo = (
	startValue: number,
	newValue: number,
	callback: (currValue: number) => void
) => {
	let current = startValue
	let diff = newValue - startValue
	let i = 0;
	const func = () => {
		current = easeOutCubic(i / numSteps, startValue, diff, 1)
		callback(current)
		i++;
		if (current >= newValue || i === numSteps) {
			current = newValue
			callback(current)
			return;
		}
		requestAnimationFrame(func)
	}
	requestAnimationFrame(func)
}

const NumberAnimate: Component<NumberAnimateProps> = ({
	value, formatter, onlyFirst, animate = true
}) => {
	const [ shownValue, setShownValue ] = useState(0)
	const changedRef = useRef(false)

	useEffect(() => {
		if (!animate || (onlyFirst && changedRef.current)) {
			setShownValue(value)
			return;
		};
		changedRef.current = true
		animateTo(shownValue, value, (curr) => {
			setShownValue(curr)
		})
	}, [value])

	return (
		<>
			{formatter ? formatter(shownValue) : shownValue}
		</>
	)
}

export default NumberAnimate