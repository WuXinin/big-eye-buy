import clsx from "clsx"
import React, { useContext } from "react"
import { ScrollContext } from "../../../../context/ScrollContext"
import { Component } from "../../../../types/Util"
import Button from "../../../Button"
import CardBoxes, { CardBox } from "../../../CardBoxes"
import ResponsiveImage from "../../../ResponsiveImage"

import "./HowToBuySection.css"

const HowToBuySection: Component = () => {
  const { scrollTo } = useContext(ScrollContext);
  
	return (
		<div className="step-container">
      <HowToStep step={1} imageFileType="png" imageName="cat_room_2">
        <p>
          To begin, make sure you have a MetaMask wallet installed on your
          browser, or use one of the wallets supported by Wallet Connect (we
          recommend Trust Wallet).
        </p>
        <p>
          Purchasing on a desktop browser will give you a smoother purchasing
          experience. For this we recommend Metamask.
        </p>
        <p>
          If you are purchasing on mobile, we recommend using Trust Wallet and
          connecting through the in built browser.
        </p>
      </HowToStep>
      <div className="divider" />
      <HowToStep
        step={2}
        outside={
          <CardBoxes>
            <CardBox
              imageFileType="png"
              imageName="wallet-coins"
              title="Buy ETH or BNB with card"
              description={
                <>
                  Visit{" "}
                  <a href="https://www.moonpay.com/buy" rel="nofollow" target="_blank">
                    https://www.moonpay.com/buy
                  </a>{" "}
                  this will allow you to purchase ETH or BNB that will be sent
                  to your wallet. You will then be able to use this ETH or BNB
                  to purchase Big Eyes. Visit{" "}
                  <a href="https://www.moonpay.com/buy" rel="nofollow" target="_blank">
                    https://www.moonpay.com/buy
                  </a>{" "}
                  to begin and follow the on screen steps. We recommend
                  purchasing a minimum of $20 worth of ETH or $5 worth of BNB
                  to cover the minimum Big Eyes purchase.
                </>
              }
            />
            <CardBox
              imageFileType="png"
              imageName="paw-diamond"
              title="Buy Big Eyes with ETH or BNB"
              description="Once you have sufficient ETH or BNB in your wallet (if you do not have ETH, USDT or BNB, please read option 1 first), you can now swap your ETH or BNB for Big Eyes. Type in the amount of Big Eyes you wish to purchase ($15 minimum ) and then click “Buy with ETH” or “Buy with BNB”. Your wallet provider will ask you to confirm the transaction and will also show you the cost of gas.				"
            />
            <CardBox
              imageFileType="png"
              imageName="phone"
              title="Buy Big Eyes with USDT"
              description="Please ensure you have at least $20 of USDT in your wallet before commencing the transaction. Type in the amount of Big Eyes you wish to purchase ($15 minimum). Click “Convert USDT”. You will then be asked to approve the purchase TWICE. The first approval is for the USDT contract and the second is for the transaction amount. Please ensure you go through both approval steps in order to complete the transaction."
            />
          </CardBoxes>
        }
      >
        <p>
          Once you have your preferred wallet provider ready, click “Connect
          Wallet” and select the appropriate option. For mobile wallet apps
          you will need to select “Wallet Connect”.
        </p>
        <p>You will then have 3 options:</p>
      </HowToStep>
      <div className="divider" />
      <HowToStep step={3} imageFileType="png" imageName="cat_room_3">
        <p>
          Once the presale has concluded, you will be able to claim your Big
          Eyes tokens. We will release details closer to the time, however you
          will need to visit the main site:{" "}
          <a href="https://bigeyes.space/">https://bigeyes.space/</a> and
          click on the pink ‘claim’ button.
        </p>
        <Button onClick={() => scrollTo("buy")}>Buy now</Button>
      </HowToStep>
    </div>
	)
}

export default HowToBuySection


export type HowToStepProps = React.HTMLAttributes<HTMLDivElement> & {
  step: number;
  imageFileType?: string;
  imageName?: string;
  outside?: React.ReactElement;
};

export const HowToStep: Component<HowToStepProps> = ({
  step,
  imageFileType,
  imageName,
  children,
  outside,
  ...others
}) => {
  return (
    <div {...others} className={clsx("how-step", others.className)}>
      <div className="step-wrapper">
        <div className="step-left">
          <p className="step-label label">
            <img loading="lazy" src="/img/paw-red.svg" />
            Step {step}
            <span className="text-muted">/ 3</span>
          </p>
          {children}
        </div>
        <div className="step-right">
          {imageFileType && imageName && (
            <ResponsiveImage fileType={imageFileType} name={imageName} loading="lazy" alt="Undescriptive image" />
          )}
        </div>
      </div>
      {outside && outside}
    </div>
  );
};