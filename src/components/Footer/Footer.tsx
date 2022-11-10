import React from "react"
import { Component } from "../../types/Util"

import "./Footer.css"

const Footer: Component = () => {
	return (
		<footer>
			<div className="footer-inner">
				<a href="https://bigeyes.space" className="logo-link">
					<img loading="lazy" src="/img/logo-desktop-header.svg" width="120" height="88" />
				</a>
				<div className="links">
					<div className="link-group">
						<p className="link-title">About us</p>
						<a href="https://bigeyes.space/?page=2">Tokenomics</a>
						<a href="https://bigeyes.space/?page=3">Roadmap</a>
						<a href="https://bigeyes.space/?page=4">Charity</a>
					</div>
					<div className="link-group">
						<p className="link-title">Documents</p>
						<a href="https://buy.bigeyes.space/documents/Whitepaper.pdf" download="whitepaper.pdf">Whitepaper</a>
						<a href="https://solidity.finance/audits/BigEyes/" target="_blank">Audit</a>
					</div>
					<div className="link-group">
						<p className="link-title">Coming Soon</p>
						<span className="disabled">NFT</span>
						<span className="disabled">Influencers</span>
					</div>
					<div className="link-group">
						<p className="link-title">Social</p>
						<a href="https://www.instagram.com/BigEyesCoin" target="_blank">Instagram</a>
						<a href="https://twitter.com/BigEyesCoin" target="_blank">Twitter</a>
						<a href="https://t.me/BIGEYESOFFICIAL" target="_blank">Telegram</a>
						<a href="https://linktr.ee/bigeyescoin" target="_blank">Linktree</a>
						<a href="https://discord.gg/4jyTjhgYJN" target="_blank">Discord</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer