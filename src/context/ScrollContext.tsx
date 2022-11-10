import React, { createContext, useEffect } from "react"
import { Component } from "../types/Util"

export const ScrollContext = createContext<ScrollContextData>({} as ScrollContextData)

const sections = ["buy", "how-to", "new-to-crypto"] as const;

export interface ScrollContextData {
	scrollTo: (dest: typeof sections[number]) => void
}

export const ScrollContextWrapper: Component = ({ children }) => {

	const ScrollData: ScrollContextData = {
		scrollTo: ((dest) => {
			const element = document.getElementById(`${dest}-section`)
			if (!element) return;

			window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: "smooth" })
		}) as ScrollContextData["scrollTo"]
	}
	
	useEffect(() => {
		setTimeout(() => {
			const params = new URLSearchParams(location.search)
			let section = params.get("section")
			if (section !== null) {
				if (sections.includes(section as typeof sections[number])) {
					ScrollData.scrollTo(section as typeof sections[number])
				}
			}
		}, 100);
	}, [])

	return (
		<ScrollContext.Provider value={ScrollData}>
			{children}
		</ScrollContext.Provider>
	)
}