import React from "react"
import { Toaster } from "react-hot-toast"
import { AlertContextWrapper } from "../../context/AlertContext"
import { ScrollContextWrapper } from "../../context/ScrollContext"
import { WalletContextWrapper } from "../../context/WalletContext"
import { Component } from "../../types/Util"
import Alerts from "../Alerts"
import CSSBaseline from "../CSSBaseline"
import Footer from "../Footer"
import Navbar from "../Navbar"

import "./Layout.css"

const Layout: Component = ({ children }) => {
	return (
			<AlertContextWrapper>
				<ScrollContextWrapper>
					{/* <WalletContextWrapper> */}
						<CSSBaseline />
						<Navbar />
						<Alerts />
						<main className="page-content">
							{children}
						</main>
						<Footer />
					{/* </WalletContextWrapper> */}
				</ScrollContextWrapper>
			</AlertContextWrapper>
	)
}

export default Layout