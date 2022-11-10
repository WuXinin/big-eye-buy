import React from "react"
import { Component } from "../../types/Util"
import { useEventListener } from "../../util/hooks"

import "./CSSBaseline.css"

const CSSBaseline: Component = () => {
	const addScreenVariables = () => {
		const vh = window.innerHeight / 100;
		document.documentElement.style.setProperty("--vh", `${vh}px`)
		document.documentElement.style.setProperty("--screen-height", `${vh*100}px`)
	}

	addScreenVariables();
	useEventListener(window, "resize", addScreenVariables)

	return (
		<>
		</>
	)
}

export default CSSBaseline