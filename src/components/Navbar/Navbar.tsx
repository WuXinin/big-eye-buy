import React, { useContext, useEffect, useState } from "react"
import { Component, ComponentItem } from "../../types/Util"
import Button from "../Button"

import "./Navbar.css"

import InstagramIcon from "../../svg/instagram.svg"
import TwitterIcon from "../../svg/twitter.svg"
import TelegramIcon from "../../svg/telegram.svg"
import LinkTreeIcon from "../../svg/linktree.svg"
import DiscordIcon from "../../svg/discord.svg"
import { ScrollContext } from "../../context/ScrollContext"
import Select from "../Select"

const defaultTranslations: ComponentItem<string, null>[] = [
	{label: "Arabic", value: "en|ar"},
	{label: "Chinese", value: "en|zh-CN"},
	{label: "Czech", value: "en|cs"},
	{label: "English", value: "en|en"},
	{label: "Estonian", value: "en|et"},
	{label: "Tagalog", value: "en|tl"},
	{label: "French", value: "en|fr"},
	{label: "German", value: "en|de"},
	{label: "Greek", value: "en|el"},
	{label: "Hebrew", value: "en|iw"},
	{label: "Hindi", value: "en|hi"},
	{label: "Indonesian", value: "en|id"},
	{label: "Italian", value: "en|it"},
	{label: "Japanese", value: "en|ja"},
	{label: "Korean", value: "en|ko"},
	{label: "Farsi", value: "en|fa"},
	{label: "Polish", value: "en|pl"},
	{label: "Portuguese", value: "en|pt"},
	{label: "Romanian", value: "en|ro"},
	{label: "Russian", value: "en|ru"},
	{label: "Spanish", value: "en|es"},
	{label: "Turkish", value: "en|tr"},
	{label: "Urdu", value: "en|ur"},
	{label: "Vietnamese", value: "en|vi"},
]

const Navbar: Component = () => {
	const [ translationOptions, setTranslationOptions ] = useState<ComponentItem<string, null>[]>(defaultTranslations)
	const [ translationValue, setTranslationValue ] = useState("en|en")
	const { scrollTo } = useContext(ScrollContext)

	const autoTranslate = () => {
		let lang = navigator.language;
		let value = `en|${lang}`
		let foundOption = translationOptions.find((option) => {
			return option.value.split("-")[0] == value.split("-")[0]
		})
		if (foundOption && !foundOption.value.includes("-")) value = value.split("-")[0]
		if (!foundOption) {
			setTranslationOptions((opts) => [...opts, {label: lang.toUpperCase(), value}])
		}
		changeTranslation({
			value,
			label: lang.toUpperCase()
		})
	}

	useEffect(() => {
		autoTranslate()
	}, [])

	const changeTranslation = (newItem: ComponentItem<string, null>) =>{ 
		setTranslationValue(newItem.value)
		// @ts-ignore
		doGTranslate({value: newItem.value})
	}

	return (
		<nav>
			<div className="socials">
				<a href="https://www.instagram.com/BigEyesCoin" target="_blank">
					<InstagramIcon />
				</a>
				<a href="https://twitter.com/BigEyesCoin" target="_blank">
					<TwitterIcon />
				</a>
				<a href="https://t.me/BIGEYESOFFICIAL" target="_blank">
					<TelegramIcon />
				</a>
				<a href="https://linktr.ee/bigeyescoin" target="_blank">
					<LinkTreeIcon />
				</a>
				<a href="https://discord.gg/4jyTjhgYJN" target="_blank">
					<DiscordIcon />
				</a>
			</div>
			<a href="https://bigeyes.space" className="logo-link">
				<img loading="lazy" src="/img/logo-desktop-header.svg" height="126" width="176" />
			</a>
			<div className="buttons-container">
				<Select<string, null>
					selectClass="goog-te-combo"
					items={translationOptions}
					value={translationValue}
					onChange={changeTranslation}
				>
					<div id="google_translate_element2" />
				</Select>
				<Button variant="nav" onClick={() => scrollTo("buy")}>
					Buy now
				</Button>
			</div>
		</nav>
	)
}

export default Navbar