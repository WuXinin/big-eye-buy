import React from "react"
import { Component } from "../../../../types/Util"
import Button from "../../../Button"
import ResponsiveImage from "../../../ResponsiveImage"

import "./SecureSection.css"

const SecureSection: Component = () => {
	return (
		<div className="secure-container">
      <h1>100<span className="bubblegum">%</span> Secure</h1>
      <p>
        Contract fully audited by Solidity Finance and shown to be 100%
        secure.
        <br />
        Team fully verified by CoinSniper to ensure anti-rug and complete
        project security.
      </p>
      <Button
        component="a"
        download="whitepaper.pdf"
        href="/documents/Whitepaper.pdf"
      >
        Whitepaper
      </Button>
      <div className="img-container">
        <a href="https://solidity.finance/audits/BigEyes/" target="_blank">
          <ResponsiveImage name="solidify-logo" fileType="png" />
        </a>
        <a href="https://coinsniper.net/coin/38388" target="_blank">
          <ResponsiveImage name="coinsniper-logo" fileType="png" />
        </a>
      </div>
    </div>
	)
}

export default SecureSection