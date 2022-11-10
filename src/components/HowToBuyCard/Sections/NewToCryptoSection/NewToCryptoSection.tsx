import React, { useContext, useEffect, useState } from "react"
import { AlertContext } from "../../../../context/AlertContext"
import { Component, ComponentItem } from "../../../../types/Util"
import Button from "../../../Button"
import CountryCodeSelect from "../../../CountryCodeSelect"
import Input from "../../../Input"
import InputSelect from "../../../InputSelect"

import countryList from "../../../../constants/countryMap.json"

import "./NewToCryptoSection.css"
import { useWeb3React } from "@web3-react/core";
import ContactForm from "../../../ContactForm"
import { WalletContext } from "../../../../context/WalletContext"

export const NewToCryptoSection = () => {
  const { account } = useWeb3React();
  const { connected } = useContext(WalletContext)
  const [ firstName, setFirstName ] = useState("")
  const [ lastName, setLastName ] = useState("")
  const [ contactNumber, setContactNumber ] = useState("")
  const [ timeToContact, setTimeToContact ] = useState("")
  const [ investmentBudget, setInvestmentBudget ] = useState("")
  const [ termsAccepted, setTermsAccepted ] = useState(false)
  const [ selectedCountry, setSelectedCountry ] = useState("")

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
      if (!contactNumber) {throw "Contact number can't be empty"}
      if (!timeToContact) {throw "Best time to contact can't be empty"}
      if (!investmentBudget) {throw "Investment budget can't be empty"}
      if (!countryData) {throw "Invalid phone number"}
      if (!termsAccepted) {throw "Must accept terms and conditions"}
    } catch(e: any) {
      return addAlert({
        label: typeof(e) === "string" ? e : "Error submitting form",
        type: "error"
      })
    }

    fetch("https://register-for-launch.bigeyes.space/leads", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        mobile: `${countryData.dialCode}${contactNumber}`,
        budget: investmentBudget,
        preferred_contact_time: timeToContact,
        ...(connected ? {wallet_address: account} : {})
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
	  <div className="new-crypto-container form-container" id="new-to-crypto-section">
      <h1>{connected ? "Contact us" : "Talk to us"}</h1>
      <div className="label">
        Leave your details below and we’ll contact you to discuss purchasing Big Eyes.
      </div>
      <form className="form-inputs tight" onSubmit={onSubmit}>
        <div className="input-row">
          <Input
            id="first-name"
            label="First name"
            placeholder="Enter first name"
            value={firstName}
            onInput={(e) => setFirstName(e.currentTarget.value)}
          />
          <Input
            id="last-name"
            label="Last name"
            placeholder="Enter last name"
            value={lastName}
            onInput={(e) => setLastName(e.currentTarget.value)}
          />
        </div>
        <div className="input-row">
          <div className="input-select-row">
            <CountryCodeSelect
              value={selectedCountry}
              onChange={(item) => setSelectedCountry(item.value)}
              id="country-code"
              label="Country Code"
              placeholder="Code"
            />
            <Input
              id="contact-number"
              label="Contact number"
              placeholder="Enter contact number"
              value={contactNumber}
              onInput={(e) => setContactNumber(e.currentTarget.value)}
            />
          </div>
          <InputSelect<string, null>
            items={[
              {label: "Morning", value: "morning"},
              {label: "Afternoon", value: "afternoon"},
              {label: "Evening", value: "evening"},
            ]}
            value={timeToContact}
            onChange={(item) => setTimeToContact(item.value)}
            id="time-to-contact"
            label="Best time to contact"
            placeholder="Select a time to contact"
          />
        </div>
        <div className="input-row">
          <InputSelect<string, null>
            items={[
              {label: "$0-$5k", value: "0-5k"},
              {label: "$5k-$10k", value: "5k-10k"},
              {label: "$10k-$25k", value: "10k-25k"},
              {label: "$25k-$50k", value: "25k-50k"},
              {label: "$50k+", value:"50k+"}
            ]}
            className="input-half"
            value={investmentBudget}
            id="investment-budget"
            label="Investment budget"
            placeholder="Enter investment budget"
            onChange={(item) => setInvestmentBudget(item.value)}
          />
          <Button>
            Submit
          </Button>
        </div>
        <div className="terms-container text-hint">
          <input type="checkbox" value={termsAccepted.toString()} onChange={(e) => setTermsAccepted(e.target.checked)} />
          <p>By submitting this form you agree to our <a href="https://bigeyes.space/terms" target="_blank">Terms</a> and <a href="https://bigeyes.space/privacy-policy" target="_blank">Privacy Policy</a></p>
        </div>
      </form>
	  </div>
	)
}

export default NewToCryptoSection
