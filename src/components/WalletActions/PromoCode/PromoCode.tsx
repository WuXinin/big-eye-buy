// @ts-ignore
import React, { useState, useEffect, useContext, useRef } from "react";
import { Component } from "../../../types/Util";
import OutsideClickHandler from "react-outside-click-handler";
import Input from "../../Input";
import "./PromoCode.css";

import axios from "axios";

const HEADERS = {
  headers: {
    project: "https://bigeyes.space/",
  },
};

const PromoCode: Component = ({ setDetails }: any) => {
  const [promoCode, setCode] = useState<any>(null);
  const [isRequested, setRequested] = useState<any>(null);
  const [isFieldShown, setFieldVisibility] = useState(false);
  const [codeResponse, setCodeResponse] = useState<any>(null);

  useEffect(() => {
    if(typeof window !== 'undefined') {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());

      if(params && params.offercode) {
        setCode(params.offercode)
        checkCode(params.offercode)
        setFieldVisibility(true)
      }
    }
  }, [])

  const checkCode = (code: any) => {
    setRequested(true);
    axios
      .get(
        `https://presaleapi.bigeyes.space/checkPromoCode/${code ? code : promoCode}`,
        HEADERS
      )
      .then((res) => {
        setCodeResponse(res.data);
        setDetails({ ...res.data, cCode: code ? code : promoCode });
        setTimeout(() => {
          setRequested(false);
        }, 1000);
      });
  };

  return (
    <div style={{ width: '100%'}}>
      <OutsideClickHandler
        onOutsideClick={() => {
          if(promoCode === null || promoCode == "") {
            setFieldVisibility(false)
          }
        }}
      >
        <div className="promo-code-area">
          {!isFieldShown && (
            <div className="toggle" onClick={() => setFieldVisibility(true)}>
              Offer Code?
            </div>
          )}
          {isFieldShown && (
            <>
              <div className="field">
                <Input
                  id="code"
                  placeholder={`Offer Code`}
                  type="text"
                  size="compact"
                  value={promoCode}
                  onChange={(e: any) => setCode(e.target.value)}
                />

                <span
                  className={`apply ${isRequested ? "disabled" : ""}`}
                  onClick={() => checkCode(null)}
                >
                  Apply
                </span>
              </div>

              {codeResponse && (
                <>
                  {codeResponse.valid ? (
                    <p className="code-desc">
                      With this offer code, you will receive{" "}
                      {codeResponse.promo.bonus_percentage}% extra tokens.
                    </p>
                  ) : (
                    <p className="code-desc">This offer code is not valid.</p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default PromoCode;
