// @ts-nocheck
import React, { useState, useEffect, useContext, useRef } from "react";
import { Component } from "../../types/Util";
import Button from "../Button";
import Card from "../Card";
import Loader from "../Loader";
import useAuth from "../../hooks/useAuth";
import { useWalletModal } from "wallet-bigeye";
import "./PresaleCard.css";
import PromoCode from '../WalletActions/PromoCode'

// import { useEthers } from "@usedapp/core";
// import { useCoingeckoPrice } from "@usedapp/coingecko";

// import toast, { Toaster } from "react-hot-toast";
import { usePrev } from "../../util/hooks"

import { formatLargeNumber, useInterval } from "../../util";

import WalletConnect from "../WalletConnect";
// import WalletConnect from "../WalletActions/WalletConnect";
// import ConnectWallet from "../WalletActions/ConnectWallet";
// import TrustWallet from "../WalletActions/TrustWallet";
import NumberAnimate from "../NumberAnimate";
import { useWeb3React } from "@web3-react/core";
// import { WalletContext } from "../../context/WalletContext";
import LoaderSkeleton from "../LoaderSkeleton";
import Coin, { useCoins } from "../Coin";
import ResponsiveImage from "../ResponsiveImage";
import { ApiContext } from "../../context/ApiContext";

const PresaleCard: Component = () => {
  // const [isWalletModalShown, setModalVisibility] = useState(false);
  const [codeDetails, setCodeDetails] = useState<any>(null);

  const { data, fetching, fetchedAt, getData } = useContext(ApiContext)
  const {
    tokenPrice: currentTokenPrice,
    nextStageTokenPrice: nextStagePrice,
    cumTokenValueUsd,
    totalSoldTokensValueUsd,
    stageSoldTokens,
    stageTokens: _stageTokens,
    projectWalletAddress,
    stage
  } = data || {}

  // const { setConnected, connected: isConnected } = useContext(WalletContext)
  const { account, chainId } = useWeb3React();
  const auth = useAuth(chainId ?? 1);
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(
    auth.login,
    auth.logout,
    (t: any) => t,
    account,
    Number(chainId ?? 1)
  );
  const getNumbers = () => {
    setRemainingLoading(true)
    axios.get(`https://presaleapi.bigeyes.space`, HEADERS).then((res) => {
      if (res && res.data) {
        setRemainingLoading(false)
        setTokenPrice(res.data.tokenPrice);
        setNextStagePrice(res.data.nextStageTokenPrice);
        setCumTokenValueUsd(res.data.cumTokenValueUsd);
        setTotalSoldTokensValueUsd((oldValue) => {
          if (oldValue !== res.data.totalSoldTokensValueUsd) coinBurst()
          return res.data.totalSoldTokensValueUsd
        });
        setStageSoldTokens(res.data.stageSoldTokens);
        setStageTokens(Number.parseInt(res.data.stageTokens) || 0);
        setSiteWallet(res.data.projectWalletAddress);

        if(codeDetails && codeDetails.valid) {
          setSiteWallet(codeDetails.promo.broker_wallet_address);
        }        
      }
    });
  };

  //useInterval(getNumbers, 20 * 1000, true)
  const prevTotalSoldTokensValueUsd = usePrev(totalSoldTokensValueUsd)

  const stageTokens = Number.parseFloat(_stageTokens || 0)
  const siteWallet = codeDetails && codeDetails.valid ? codeDetails.promo.broker_wallet_address : projectWalletAddress

  // const [walletType, setWalletType] = useState<any>(null);


  useEffect(() => {
    if (totalSoldTokensValueUsd !== prevTotalSoldTokensValueUsd) coinBurst()
  }, [totalSoldTokensValueUsd])

  // useInterval(getData, 20 * 1000, true)

  const coinContainerRef = useRef<HTMLDivElement>()
  const { coinBurst, coins } = useCoins(coinContainerRef)

  return (
    <Card className="presale-card" id="buy-section" windowBar>
      {/* <Toaster containerClassName="toaster-container" /> */}
      <img className="stars" src="/img/stars/stars.webp" loading="lazy" />
      <div className="presale-left">
        <h1>
          <span style={{ display: "inline-block" }}>
            Stage {fetching ? "-" : Number.parseInt(data?.stage || 1) - 1} <br /> has started!
          </span>
        </h1>
        <p className="label text-hint notranslate">
          1 USDT = {(1 / currentTokenPrice).toFixed(2)} Big Eyes
        </p>
        <div className="presale-remaining-box">
          <img className="stars" src="/img/stars/stars.webp" loading="lazy" />
          {(!account && nextStagePrice != 0) && (
            <>
              <p className="label">
                <LoaderSkeleton component="span" loading={fetching} length={2} style={{height: "0.9em", lineHeight: "1em", display: "inline-block"}} loadClass="no-margin" className="notranslate">
                  {formatLargeNumber(stageTokens - stageSoldTokens)}
                </LoaderSkeleton>
                <br />
                Big Eyes remaining
              </p>
              <span className="until-label notranslate">
                Until 1 USDT = {(1 / nextStagePrice).toFixed(2)} Big Eyes
              </span>
            </>
          )}
          {!account && (
            <Button
              onClick={onPresentConnectModal}
              className="connect-button"
            >
              Connect Wallet
            </Button>
          )}
          {
            account && (
              <WalletConnect
                wallet={siteWallet}
                tokenPrice={currentTokenPrice}
                getNumbers={() => getNumbers()}
                disconnect={auth.logout}
                promo={codeDetails}
              />
            )}
          {/* {walletType == "w" && (
            <WalletConnect
              wallet={siteWallet}
              setWConnect={(newIsConnected: any) => setConnected(newIsConnected)}
              handleDismiss={() => setWalletType(null)}
              tokenPrice={currentTokenPrice}
              getNumbers={() => getNumbers()}
              promo={codeDetails}
            />
          )}
          {walletType == "t" && (
            <TrustWallet
              wallet={siteWallet}
              setWConnect={(newIsConnected: any) => setConnected(newIsConnected)}
              handleDismiss={() => setWalletType(null)}
              tokenPrice={currentTokenPrice}
              getNumbers={() => getNumbers()}
              promo={codeDetails}
            />
          )} */}
          
          <PromoCode setDetails={(value: any) => setCodeDetails(value)} />
        </div>
      </div>
      <div className="presale-right">
        <div className="cat-container">
          <div className="cat-img-container" onClick={() => coinBurst()}>
            <ResponsiveImage name="lucky-cat" fileType="png" loading="lazy" />
            <img className="live-flash" src="/img/live-flash/live-flash.webp" loading="lazy" />
            <div
              ref={(el) => coinContainerRef.current = el || undefined}
              className="coin-container"
            >
              {coins.map((coin) => <Coin key={coin.id} {...coin} />)}
            </div>
          </div>
          <div className="cat-bar-container">
            <div className="cat-bar" />
            <div className="cat-bar-text-container" style={{ top: "20%" }}>
              <div className="cat-bar-text">
                {/* <p>429,349</p>
								<p>429,349</p>
								<p>429,349</p>
								<p>429,49</p>
								<p>429,349</p>
								<p>429,349</p>
								<p>429,349</p> */}
              </div>
              <div className="cat-bar-dot" />
            </div>
          </div>
        </div>
        <div className="usd-container">
          <p className="label text-hint">
            USDT Raised: <span className="notranslate">
              <NumberAnimate
                value={totalSoldTokensValueUsd || 0}
                formatter={(num) => num.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              /> / {(cumTokenValueUsd || 0).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </p>
          <Loader fraction={(totalSoldTokensValueUsd || 0) / (cumTokenValueUsd || 0)} />
        </div>
      </div>
    </Card>
  );
};

export default PresaleCard;
