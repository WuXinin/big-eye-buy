import React from "react"
import { Component } from "../../../../types/Util"
import Input from "../../../Input"

import "./ContractSection.css"

const ContractSection: Component = () => {
	return (
		<div className="form-container">
      <h1>Big Eyes Contract</h1>
      <div className="label">
        Use the contract information below to add Big Eyes to your
        wallet.
      </div>
      <div className="form-inputs">
        <Input
          id="contract-address"
          label="Address"
          copyable
          readOnly
          value="0xc8De43Bfe33FF496Fa14c270D9CB29Bda196B9B5"
        />
        <div className="input-row">
          <Input
            id="decimals"
            label="Decimals"
            copyable
            readOnly
            value="18"
          />
          <Input
            id="token-symbol"
            label="Token Symbol"
            copyable
            readOnly
            value="BIG"
          />
        </div>
      </div>
    </div>
	)
}

export default ContractSection