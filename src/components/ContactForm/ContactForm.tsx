import React, { useContext, useEffect, useState } from "react"
import { AlertContext } from "../../context/AlertContext"
import { Component } from "../../types/Util"
import Button from "../Button"
import countryList from "../../constants/countryMap.json"

import "./ContactForm.css"
import Input from "../Input"
import CountryCodeSelect from "../CountryCodeSelect"
import { useWeb3React } from "@web3-react/core";

const ContactForm: Component<{
	onSubmit?: Function
}> = ({
	onSubmit: propOnSubmit
}) => {
	const { account } = useWeb3React();
	const [ firstName, setFirstName ] = useState("")
	const [ lastName, setLastName ] = useState("")
	const [ contactNumber, setContactNumber ] = useState("")
	const [ termsAccepted, setTermsAccepted ] = useState(false)
	const [ selectedCountry, setSelectedCountry ] = useState("")
	const [ email, setEmail ] = useState("")

	const { addAlert } = useContext(AlertContext)

	useEffect(() => {
		fetch("https://ipapi.co/json").then((res) => {
		if (!res.ok) return;
		res.json().then((json) => {
			const countryCode = json.country_code
			const countryListItem = countryList[countryCode as keyof typeof countryList]
			if (!countryListItem) return;
			setSelectedCountry(countryListItem.code)
		})
		})
	}, [])

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const countryData = countryList[selectedCountry as keyof typeof countryList]
		try {
			if (!firstName) {throw "First name can't be empty"}
			if (!lastName) {throw "Last name can't be empty"}
			if (!countryData) {throw "Invalid phone number"}
			if (!termsAccepted) {throw "Must accept terms and conditions"}
		} catch(e: any) {
			return addAlert({
				label: typeof(e) === "string" ? e : "Error submitting form",
				type: "error"
			})
		}

		fetch("https://register-for-launch.bigeyes.space/buyers", {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({
				first_name: firstName,
				last_name: lastName,
				wallet_address: account,
				email,
				...(contactNumber ? {mobile: `${countryData.dialCode}${contactNumber}`} : {})
			})
		}).then((res) => {

		res.json().then((json: any) => {
			if (!res.ok) {
				return addAlert({
					label: json.message || "Error submitting form",
					type: "error"
				})
			}
			addAlert({
				label: "Successfully submitted form",
				type: "success"
			})
			propOnSubmit?.()
		}).catch((err: any) => {
			addAlert({
				label: "Error submitting form",
				type: "error"
			})
		})
		}).catch((err: any) => {
			addAlert({
				label: "Error submitting form",
				type: "error"
			})
		})
	}

	return (
		<form className="form-inputs tight contact-form" onSubmit={onSubmit}>
			<div className="input-row">
				<Input
					id="first-name"
					placeholder="Enter First Name"
					value={firstName}
					onInput={(e) => setFirstName(e.currentTarget.value)}
				/>
			</div>
			<div className="input-row">
				<Input
					id="last-name"
					placeholder="Enter last name"
					value={lastName}
					onInput={(e) => setLastName(e.currentTarget.value)}
				/>
			</div>
			<div className="input-row">
				<Input
					id="email"
					placeholder="Enter email"
					value={email}
					onInput={(e) => setEmail(e.currentTarget.value)}
				/>
			</div>
			<div className="input-select-row">
				<CountryCodeSelect
					value={selectedCountry}
					onChange={(item) => setSelectedCountry(item.value)}
					id="country-code"
					placeholder="Code"
				/>
				<Input
					id="contact-number"
					placeholder="Enter contact number (optional)"
					value={contactNumber}
					onInput={(e) => setContactNumber(e.currentTarget.value)}
				/>
			</div>
			<div className="terms-container text-hint">
				<input type="checkbox" value={termsAccepted.toString()} onChange={(e) => setTermsAccepted(e.target.checked)} />
				<p>By submitting this form you agree to our <a href="https://bigeyes.space/terms" target="_blank">Terms</a> and <a href="https://bigeyes.space/privacy-policy" target="_blank">Privacy Policy</a></p>
			</div>
			<Button>
				Submit
			</Button>
		</form>
	)
}

export default ContactForm