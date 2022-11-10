import React, { useContext } from "react"
import { ScrollContext } from "../../context/ScrollContext"
import { WalletContext } from "../../context/WalletContext"
import { Component } from "../../types/Util"
import BackgroundSlide from "../BackgroundSlide"
import Button from "../Button"
import ResponsiveImage from "../ResponsiveImage"

import "./InfoCardSection.css"

const InfoCardSection: Component = () => {
	const { scrollTo } = useContext(ScrollContext)
	const { connected } = useContext(WalletContext)

	return (
		<BackgroundSlide classes={{card: "info-card"}}>
			<ResponsiveImage loading="lazy" name="presale" fileType="png" />
			<h1>100<span className="bubblegum">%</span> Secure Zone</h1>
			<div className="text-container">
				<p>
				Big Eyes is the ultimate memecoin platform, and it couldn't be easier to
				get your hands on the token in our presale.
				</p>
				<p>
					Contract code fully audited by Solidity Finance and shown to be 100% secure. 
					Team fully verified by CoinSniper to ensure anti-rug and complete project security. 
				</p>
				<p>
					You can buy direct using USDT, ETH or BNB. After the public sale ends, you'll claim your purchased Big Eyes using the claim page.
				</p>
			</div>
			<div className="buttons">
				<Button onClick={() => scrollTo("buy")}>
					Buy
				</Button>
				<Button onClick={() => scrollTo("how-to")}>
					How to Buy
				</Button>
				<Button onClick={() => scrollTo("new-to-crypto")} variant="secondary">
					{connected ? "Contact Us" : "Talk to Us"}
				</Button>
			</div>
		</BackgroundSlide>
	)
}

export default InfoCardSection
