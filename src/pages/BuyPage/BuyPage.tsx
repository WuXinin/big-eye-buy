import React from "react"
import BackgroundSlide from "../../components/BackgroundSlide"
import HowToBuyCard from "../../components/HowToBuyCard"
import InfoCardSection from "../../components/InfoCardSection"
import PageContainer from "../../components/PageContainer"
import PresaleCard from "../../components/PresaleCard"
import { Component } from "../../types/Util"

import "./BuyPage.css"

const BuyPage: Component = () => {
	return (
		<div className="buy-page">
			<PageContainer>
				<InfoCardSection />
				<PresaleCard />
			</PageContainer>
			<PageContainer style={{backgroundColor: "#d6f4fb"}} id="how-to-section">
				<HowToBuyCard />
			</PageContainer>
		</div>
	)
}

export default BuyPage