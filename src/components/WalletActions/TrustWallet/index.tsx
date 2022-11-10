import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import {
  useEtherBalance,
  useSendTransaction,
  useEthers,
  useTokenBalance,
  ERC20Interface,
  useContractFunction,
} from "@usedapp/core";
import {
  apiGetAccountAssets,
  apiGetGasPrices,
  apiGetAccountNonce,
} from "../WalletConnect/api";
import { formatEther, formatUnits, parseEther } from "@ethersproject/units";
import Button from "../../Button";
import axios from "axios";
import { formatLargeNumber } from "../../../util";

import NetworkModal from "../NetworkModal";

const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const HEADERS = {
  headers: {
    project: "https://bigeyes.space/",
  },
};

import AmountModal from "../AmountModal";
import NumberAnimate from "../../NumberAnimate";
import LoaderSkeleton from "../../LoaderSkeleton";
import { useCoingeckoPrice } from "@usedapp/coingecko";
import { Contract } from "ethers";

const sanitizeHex = (hex: string): string => {
  hex = hex.substring(0, 2) === "0x" ? hex.substring(2) : hex;
  if (hex === "") {
    return "";
  }
  hex = hex.length % 2 !== 0 ? "0" + hex : hex;
  return "0x" + hex;
};

const convertStringToHex = (value: string | number): string => {
  return new BigNumber(`${value}`).toString(16);
};

const convertAmountToRawNumber = (
  value: string | number,
  decimals = 18
): string => {
  return new BigNumber(`${value}`)
    .times(new BigNumber("10").pow(decimals))
    .toString();
};

const TrustWallet = ({
  wallet,
  handleDismiss,
  setWConnect,
  tokenPrice,
  getNumbers,
  promo,
}: any) => {
  const etherPrice: any = useCoingeckoPrice("ethereum", "usd");
  const [isPending, setPending] = useState(false);

  const [selectedAmount, setAmount] = useState<any>(100);
  const [isModalShown, setModalVisibility] = useState(false);
  const [modalType, setModalType] = useState<any>(null);

  const contract = new Contract(USDT, ERC20Interface);
  const { state, send } = useContractFunction(contract, "transfer");

  const { active, account, activateBrowserWallet, deactivate, chainId } =
    useEthers();

  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceLoaded, setBalanceLoaded] = useState(false);

  const etherBalance: any = useEtherBalance(account);
  const usdtBalance: any = useTokenBalance(USDT, account);
  const { sendTransaction, state: ethState } = useSendTransaction();
  const { sendTransaction: sendBnbTransaction, state: bnbState } =
    useSendTransaction();

  const [tokenBalance, setTokenBalance] = useState(0);
  const [isChecking, setChecking] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<any>(null);

  const [messageType, setMessageType] = useState<any>(null);
  const [messageContent, setMessageContent] = useState<any>(null);

  const [isNetworkModalShown, setNetworkModalVisibility] = useState(false);

  const [accountNonce, setAccountNonce] = useState(0);

  useEffect(() => {
    if (modalType == "ETH" || modalType == "BNB") {
      setAmount("");
    } else {
      setAmount(100);
    }
  }, [isModalShown, modalType]);

  useEffect(() => {
    if (!account) {
      activateBrowserWallet();
    }
  }, []);

  useEffect(() => {
    if (
      (modalType == "BNB" && chainId != 56) ||
      ((modalType == "ETH" || modalType == "USDT") && chainId != 1)
    ) {
      setNetworkModalVisibility(true);
    }
  }, [modalType, active]);

  useEffect(() => {
    if (
      (modalType == "BNB" && chainId != 56) ||
      ((modalType == "ETH" || modalType == "USDT") && chainId != 1)
    ) {
      setNetworkModalVisibility(true);
    } else {
      setNetworkModalVisibility(false);
    }
  }, [modalType, chainId]);

  useEffect(() => {
    setWConnect(account ? true : false);
    if (account) {
      //getTokenBalance(account);
      getAccountNonce(account);
    }
  }, [account]);

  useEffect(() => {
    if (messageType == "error") {
      setTimeout(() => {
        setMessageType(null);
        setMessageContent(null);
      }, 3000);
    }
  }, [messageType]);

  /*const getTokenBalance = (account: any): Promise<number> => {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://presaleapi.bigeyes.space/${account}`, HEADERS)
        .then((res) => {
          if (res && res.data) {
            setTokenBalance(res.data);
            setTimeout(() => {
              setBalanceLoaded(true);
            }, 500);
            resolve(res.data);
          }
        });
    });
  };*/

  const getAccountNonce = (account: any) => {
    setBalanceLoading(true);
    axios
      .get(`https://presaleapi.bigeyes.space/wallet/${account}`, HEADERS)
      .then((res) => {
        if (res && res.data) {
          setAccountNonce(res.data.nonce);
          setTokenBalance(res.data.tokenBalance);

          setBalanceLoading(false);
          setBalanceLoaded(true);
        }
      });
  };

  const sendEth = async () => {
    // nonce
    // @ts-ignore
    //const _nonce = await apiGetAccountNonce(account, 1);
    const nonce = sanitizeHex(convertStringToHex(accountNonce));

    // gasPrice
    const gasPrices = await apiGetGasPrices();
    const _gasPrice = gasPrices.fast.price;
    const gasPrice = sanitizeHex(
      convertStringToHex(convertAmountToRawNumber(_gasPrice, 9))
    );

    // gasLimit
    const _gasLimit = 70000;
    const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

    const _value = selectedAmount;
    const value = parseEther(_value.toString().slice(0, 7))._hex;

    sendTransaction({
      to: wallet,
      value: value,
      from: account,
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
    });
  };

  const sendBnb = async () => {
    const _value = selectedAmount;
    const value = parseEther(_value.toString().slice(0, 7))._hex;

    sendTransaction({
      to: wallet,
      value: value,
      from: account,
    });
  };

  const sendUsdt = () => {
    const usdtAmount = selectedAmount * 1000000;
    send(wallet, usdtAmount.toString());
  };

  useEffect(() => {
    var lToast;
    if (state.status && state.status == "PendingSignature") {
      setPending(true);
      setMessageType("waiting");
      setMessageContent({
        title: "Pending Action",
        content: "Approve or reject request using your wallet..",
        image: "/img/flying-clock-2/flying-clock-2.webp",
      });
    }
    if (state.status && state.status == "Exception") {
      setPending(false);
      if (state && state.errorMessage == "invalid opcode: INVALID") {
        setMessageType("error");
        setMessageContent({
          title: "Oopps",
          content: "You do not have enough USDT in your wallet.",
        });
      } else {
        setMessageType("error");
        setMessageContent({
          title: "Rejected",
          content: state.errorMessage,
        });
      }
    }
    if (state.status && state.status == "Mining" && state.transaction) {
      setPending(false);
      setMessageType("success");
      setMessageContent({
        title: "Approved",
        content:
          "Thanks for your purchase! Once your transaction has been confirmed your token balance will be updated.",
        image: "/img/lock/lock.webp",
        form: "contact",
      });
      saveTransaction(selectedAmount, "USDT", state.transaction.hash);
    }
  }, [state]);

  useEffect(() => {
    if (ethState.status && ethState.status == "PendingSignature") {
      setPending(true);
      setMessageType("waiting");
      setMessageContent({
        title: "Pending Action",
        content: "Approve or reject request using your wallet..",
        image: "/img/flying-clock-2/flying-clock-2.webp",
      });
    }
    if (ethState.status && ethState.status == "Exception") {
      setPending(false);
      if (ethState && ethState.errorMessage == "invalid opcode: INVALID") {
        setMessageType("error");
        setMessageContent({
          title: "Oopps",
          content: "You do not have enough Crypto in your wallet.",
        });
      } else {
        setMessageType("error");
        setMessageContent({
          title: "Rejected",
          content: ethState.errorMessage,
        });
      }
    }
    if (
      ethState.status &&
      ethState.status == "Mining" &&
      ethState.transaction
    ) {
      setPending(false);
      setMessageType("success");
      setMessageContent({
        title: "Approved",
        content:
          "Thanks for your purchase! Once your transaction has been confirmed your token balance will be updated.",
        image: "/img/lock/lock.webp",
        form: "contact",
      });
      saveTransaction(selectedAmount, modalType, ethState.transaction.hash);
    }
  }, [ethState]);

  let intervalID: any;
  useEffect(() => {
    if (isChecking) {
      setMessageType("waiting");
      setMessageContent({
        title: "Please Wait",
        content: "Please wait, your transaction is checking..",
      });

      setPending(true);
      intervalID = setInterval(() => {
        checkTransactionStatus();
      }, 1000 * 5);
    }
    return () => clearInterval(intervalID);
  }, [isChecking]);

  const checkTransactionStatus = () => {
    if (typeof transactionStatus != "undefined" && transactionStatus) {
      axios
        .get(
          `https://presaleapi.bigeyes.space/Payment/${transactionStatus}`,
          HEADERS
        )
        .then((res: any) => {
          if (res.data && res.data.status) {
            if (res.data.status == "confirmed") {
              setMessageType("success");
              setMessageContent({
                title: "Completed",
                content: "Transaction completed.",
              });
              setTimeout(() => {
                getNumbers();
                setModalVisibility(false);
                setChecking(false);
                setPending(false);
                setMessageType(null);
                setMessageContent(null);
              }, 1000);
            }
            if (res.data.status == "failed") {
              setChecking(false);
              setPending(false);
              setMessageType("error");
              setMessageContent({
                title: "Failed",
                content: "Your transaction has been failed, please try again.",
              });
            }
          }
        });
    }
  };

  const saveTransaction = (amount: any, type: any, hash: any) => {
    let payload = {
      network: type == "ETH" || type == "USDT" ? "ETH" : "BSC",
      pay_hash: hash,
      promo_code: promo && promo.valid ? promo.cCode : "",
    };

    setTimeout(() => {
      setTransactionStatus(hash);
      //setChecking(true);
    }, 1000);

    axios.post("https://presaleapi.bigeyes.space/Payment", payload, HEADERS);

    /*getTokenBalance(account).then((newBalance) => {
      setTokenBalance(newBalance);
      setBalanceLoading(true);
      setTimeout(() => {
        setBalanceLoaded(true);
        setBalanceLoading(false);
      }, 300);
    });*/

    /*
    let oldBalance = tokenBalance;
    let checkInterval = setInterval(() => {
      console.log("Checking balance");
      getTokenBalance(account).then((newBalance) => {
        if (newBalance !== oldBalance) {
          clearInterval(checkInterval);
          setTokenBalance(newBalance);
          setBalanceLoading(true);
          setTimeout(() => {
            setBalanceLoaded(true);
            setBalanceLoading(false);
          }, 300);
        }
      });
    }, 5000);*/
  };

  const submitMap: Record<string, Function> = {
    USDT: sendUsdt,
    BNB: sendBnb,
    ETH: sendEth,
  };

  return (
    <div className="buy-buttons">
      {isNetworkModalShown && (
        <NetworkModal
          modalType={modalType}
          chain={chainId}
          handleClose={() => {
            setNetworkModalVisibility(false);
            deactivate();
            handleDismiss();
            setWConnect(false);
          }}
        />
      )}
      <div className="label">
        You have
        <LoaderSkeleton
          component="span"
          loading={balanceLoading}
          style={{ marginInline: "0.25rem" }}
          length={2}
        >
          <span className="notranslate">
            <NumberAnimate
              onlyFirst
              value={tokenBalance}
              formatter={formatLargeNumber}
              animate={!balanceLoaded}
            />
          </span>
        </LoaderSkeleton>
        Big Eyes tokens.
      </div>
      {isModalShown && (
        <AmountModal
          promo={promo}
          handleClose={() => {
            setModalVisibility(false);
            setChecking(false);
            setMessageType(null);
            setMessageContent(null);
            setPending(false);
          }}
          amount={selectedAmount}
          currentTokenPrice={tokenPrice}
          usdtB={0}
          ethB={0}
          type={modalType}
          handleSubmit={() => submitMap[modalType]?.()}
          handleInputChange={(e: any) => setAmount(e)}
          isLoading={isPending}
          messageContent={messageContent}
          messageType={messageType}
        />
      )}
      {account && (
        <>
          <div className="connected-text">
            <strong>Connected Wallet</strong>
            <span>{account}</span>
          </div>
          <div className="buttons-container">
            <Button
              onClick={() => {
                setModalType("ETH");
                setModalVisibility(true);
              }}
            >
              Buy With ETH
            </Button>
            <Button
              onClick={() => {
                setModalType("USDT");
                setModalVisibility(true);
              }}
            >
              Buy With USDT
            </Button>

              <Button
                onClick={() => {
                  setModalType("BNB");
                  setModalVisibility(true);
                }}
              >
                Buy With BNB
              </Button>

            <Button
              onClick={() => {
                deactivate();
                handleDismiss();
                setWConnect(false);
              }}
            >
              Disconnect
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TrustWallet;
