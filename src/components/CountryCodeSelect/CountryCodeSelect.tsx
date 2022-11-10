import React from "react"
import { Component } from "../../types/Util"
import _countryLIst from "../../constants/countryMap.json"
import InputSelect, { InputSelectProps } from "../InputSelect"

import "./CountryCodeSelect.css"


export type CountryListItem = {
	country: string,
	dialCode: string,
	code: string,
	flag: string
}

const countryList = Object.entries(_countryLIst).map(([key, value]) => value)

export type CountryCodeSelectProps = Omit<InputSelectProps<string, CountryListItem>, "items">

const CountryCodeSelect: Component<CountryCodeSelectProps> = ({
	...props
}) => {
	return (
		<InputSelect<string, CountryListItem>
			{...props}
			searchable
			valueFormatter={(item) => {
				return item.data?.dialCode || ""
			}}
			items={countryList.map((country) => ({
				label: `${country.country} (${country.dialCode})`,
				value: country.code,
				data: country
			}))}
		/>
	)
}

export default CountryCodeSelect