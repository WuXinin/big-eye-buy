import React, { createContext, useEffect, useState } from "react"
import { Component } from "../types/Util"

export const WalletContext = createContext<WalletContextData>({} as WalletContextData)

export interface WalletContextData {
	connected: boolean,
	setConnected: (newConnected: boolean) => void;
}

export const WalletContextWrapper: Component = ({ children }) => {
	const [ connected, setConnected ] = useState(false)

	const WalletData: WalletContextData = {
		connected,
		setConnected
	}

	return (
		<WalletContext.Provider value={WalletData}>
			{children}
		</WalletContext.Provider>
	)
}