import React, { useState, useEffect, useMemo } from "react";
import Input from "../../Input";
import { formatLargeNumber } from "../../../util";
import { useCoingeckoPrice } from "@usedapp/coingecko";
import clsx from "clsx";
import ContactForm from "../../ContactForm";


const formMap: Record<string, {title: string, content: string}> = {
  contact : {
    title: "Register",
    content: "Leave your details below and we'll keep you up to date on all the latest big eyes news"
  }
}

const AmountModal = ({
  handleClose: _handleClose, amount, currentTokenPrice,
  usdtB, ethB, type,
  handleSubmit, handleInputChange,
  isLoading, messageType, promo,
  messageContent: _messageContent,
}: any) => {
  const [ formVisible, setFormVisible ] = useState(false)

  const increaseNumber = (amount: any, cryptoPrice: any, percent: any) => {
    let paidUsd = amount * (cryptoPrice || 1)
    let anUsdTokenAmount = 1 / currentTokenPrice
    let promotionRate = (1+(percent/100))
    let totalToken = paidUsd * anUsdTokenAmount * promotionRate

    return formatLargeNumber(
      totalToken,
      1000,
      0,
      2
    )
  }  

  const messageContent = useMemo<any>(() => {
    if (_messageContent?.form) {
      if (formVisible) return formMap[_messageContent.form]
      return _messageContent
    } else {
      return _messageContent
    }
  }, [_messageContent, formVisible, messageType])
  
  const [isDisabled, setDisable] = useState(false);
  const etherPrice: any = useCoingeckoPrice("ethereum", "usd");
  const bnbPrice: any = useCoingeckoPrice("binancecoin", "usd");

  const onInputChange = (e: any) => {
    if (type != "ETH" && type != "BNB") {
      let value = parseInt(e.target.value.replace(/^0+/, ""));
      //let value = parseInt(e.target.value);
      handleInputChange(value ? Number(value) : value);
    } else {
      handleInputChange(e.target.value);
    }
  };

  const minUsdMap: Record<string, number> = {
    USDT: 0,//15,
    ETH: 0,//15,
    BNB: 0
  }

  const priceMap: Record<string, number> = {
    USDT: 1,
    BNB: bnbPrice,
    ETH: etherPrice
  }

  useEffect(() => {
    if (isNaN(amount)  || isLoading || amount <= (minUsdMap[type] || 0)) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [amount, usdtB, ethB, isLoading, type]);

  const handleClose = (): void => {
    if (_messageContent?.form) {
      if (formVisible) return _handleClose()
      setFormVisible(true)
    } else {
      _handleClose()
    }
  }

  return (
    <div className={clsx("wallet-modal", messageType, {form: formVisible})}>
      <div
        className={`backdrop ${messageType ? "disabled" : ""}`}
        onClick={() => {
          handleClose();
          handleInputChange(100);
        }}
      />
      {messageType ? (
        <div className={clsx("content", "content-message")}>
          <img className="stars-1" src="/img/stars/stars.webp" />
          <img className="stars-2" src="/img/stars/stars.webp" />
          {messageType != "success" && (
            <div className="loader-container">
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
          {messageContent.image && <img src={messageContent.image} alt="" />}
          <h1 className="hero">{messageContent.title}</h1>
          {messageType == "success" && (
            <div
              className="close"
              onClick={() => {
                handleClose();
                handleInputChange(100);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
              </svg>
            </div>
          )}
          <div className="message-content">
            <p className={messageType == "error" ? "error" : ""}>
              {messageContent.content}
            </p>
          </div>
          {_messageContent?.form && formVisible && (
            _messageContent.form === "contact" && <ContactForm onSubmit={() => handleClose()} />
          )}
        </div>
      ) : (
        <div className="content">
          <h1 className="hero">Buy With {type}</h1>
          <div
            className="close"
            onClick={() => {
              handleClose();
              handleInputChange(100);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
            </svg>
          </div>
          <div className="form-area">
            <div className="field">
              <Input
                id="usd-amount"
                label={`${type} Amount`}
                type="number"
                value={amount}
                onChange={onInputChange}
                min={0}
                autoFocus
              />

              <div className="hint-container">
                {(isNaN(amount) || (amount * priceMap[type]) < minUsdMap[type]) && (
                    <div className="field-notice">Min amount {minUsdMap[type]} USD.</div>
                  )}
              </div>
            </div>
            <div className="field">
              <Input
                id="token-amount"
                label="BIG EYES Token"
                type="text"
                value={
                  isNaN(amount) ? 0 : increaseNumber(amount, priceMap[type], (promo && promo.valid ? promo.promo.bonus_percentage : 0))
                }
                min={0}
                readOnly={true}
              />
            </div>
            <button
              className="button"
              onClick={() => handleSubmit()}
              disabled={isDisabled}
            >
              Buy
            </button>
            {isLoading && <div className="overlay"></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AmountModal;
