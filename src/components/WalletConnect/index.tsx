import React, { useState, useEffect, useCallback } from "react";
import BigNumber from "bignumber.js";
// import {
//   // useEtherBalance,
//   useSendTransaction,
//   useEthers,
//   // useTokenBalance,
//   ERC20Interface,
//   useContractFunction,
// } from "@usedapp/core";
import { useWeb3React } from "@web3-react/core";
import { formatEther, parseUnits, parseEther } from "@ethersproject/units";
import { useCoingeckoPrice } from "@usedapp/coingecko";
// import { Contract } from "ethers";
import Button from "../Button";
import axios from "axios";
import { formatLargeNumber } from "../../util";
import NetworkModal from "../WalletActions/NetworkModal";
import useAuth from "../../hooks/useAuth";
import { getProviderOrSigner } from "../../util/contract";
import { useTokenBalance, useETHBalance } from '../../hooks/useTokenBalance';
import { useERC20 } from '../../hooks/useContract';

const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const HEADERS = {
  headers: {
    project: "https://bigeyes.space/",
  },
};

import AmountModal from "../WalletActions/AmountModal";
import NumberAnimate from "../NumberAnimate";
import LoaderSkeleton from "../LoaderSkeleton";
import { useMemo } from "react";

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
const WalletConnect = ({
  wallet,
  tokenPrice,
  getNumbers,
  promo,
  disconnect
}: any) => {
  const etherPrice: any = useCoingeckoPrice("ethereum", "usd");
  const [isPending, setPending] = useState(false);

  const [selectedAmount, setAmount] = useState<any>(100);
  const [isModalShown, setModalVisibility] = useState(false);
  const [modalType, setModalType] = useState<any>(null);

  const { account, chainId, library, deactivate } = useWeb3React();
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceLoaded, setBalanceLoaded] = useState(false);

  const etherBalance: any = useETHBalance();
  const usdtBalance: any = useTokenBalance(USDT);

  const [tokenBalance, setTokenBalance] = useState(0);
  const [isChecking, setChecking] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<any>(null);

  const [messageType, setMessageType] = useState<any>(null);
  const [messageContent, setMessageContent] = useState<any>(null);

  const [isNetworkModalShown, setNetworkModalVisibility] = useState(false);
  const [targetChain, setTargetChain] = useState(1);
  const usdtContract = useERC20(USDT);

  useEffect(() => {
    if (modalType == "ETH" || modalType == "BNB") {
      setAmount("");
    } else {
      setAmount(100);
    }
  }, [isModalShown, modalType]);

  useEffect(() => {
    if (
      (modalType == "BNB" && chainId != 56) ||
      ((modalType == "ETH" || modalType == "USDT") && chainId != 1)
    ) {
      setTargetChain(chainId != 56 ? 56 : 1);
      setNetworkModalVisibility(true);
    } else {
      setNetworkModalVisibility(false);
    }
  }, [modalType, chainId]);

  useEffect(() => {
    // setWConnect(account ? true : false);
    if (account) {
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

  const getAccountNonce = (account: any) => {
    setBalanceLoading(true);  
      axios
        .get(`https://presaleapi.bigeyes.space/wallet/${account}`, HEADERS)
        .then((res) => {
          if (res && res.data) {
            setTokenBalance(res.data.tokenBalance);

            setBalanceLoading(false);
            setBalanceLoaded(true);           
          }
        });
  };



  const sendEth = useCallback(async () => {
    setPending(true);
    if (account) {
      try {
        const signer = getProviderOrSigner(library, account!);
        const _value = selectedAmount;        
        setMessageType("waiting");
        setMessageContent({
          title: "Pending Action",
          content: "Approve or reject request using your wallet..",
          image: "/img/flying-clock-2/flying-clock-2.webp",
        });
        let data: any = { to: wallet, value: parseEther(_value.toString().slice(0, 7))._hex };
        let tx = await signer?.sendTransaction(data);
        saveTransaction(selectedAmount, "ETH", tx.hash);
        setMessageType("success");
        setMessageContent({
          title: "Approved",
          content:
            "Thanks for your purchase! Once your transaction has been confirmed your token balance will be updated.",
          image: "/img/lock/lock.webp",
          form: "contact",
        });     
      } catch (err: any) {
        console.log(err);
        if (err.error) {
          if (err.error.code === 4001 || err.error.code === 'ACTION_REJECTED') {
            setMessageType("error");
            setMessageContent({
              title: "Rejected",
              content: "You denied transaction signature!",
            });
          } else if (err.error.data?.code === -32000 || err.error.code === -32000) {
            setMessageType("error");
            setMessageContent({
              title: "Oopps",
              content: "Insufficient ETH to transfer!",
            });
          } else {
            setMessageType("error");
            setMessageContent({
              title: "Oopps",
              content: err.error.data ? err.error.data.message : err.error.message ? err.error.message : 'Something went wrong!'
            });
          }
        } else {
          if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
            setMessageType("error");
            setMessageContent({
              title: "Rejected",
              content: "You denied transaction signature!",
            });
          } else if (err.data?.code === -32000 || err.code === -32000) {
            setMessageType("error");
            setMessageContent({
              title: "Oopps",
              content: "Insufficient ETH to transfer!",
            });
          } else {
            setMessageType("error");
            setMessageContent({
              title: "Oopps",
              content: err.data ? err.data.message : err?.message ? err.message : 'Something went wrong!'
            });
          }
        }
      }
    }
    setPending(false);
    
  }, [library, account, selectedAmount, wallet]);

  const sendBnb = useCallback(async () => {
    setPending(true);
    try {
      const signer = getProviderOrSigner(library, account!);
      const _value = selectedAmount;
      let data: any = { to: wallet, value: parseEther(_value.toString().slice(0, 7))._hex };
      setMessageType("waiting");
      setMessageContent({
        title: "Pending Action",
        content: "Approve or reject request using your wallet..",
        image: "/img/flying-clock-2/flying-clock-2.webp",
      });      
      let tx = await signer.sendTransaction(data);
      console.log(tx);
      saveTransaction(selectedAmount, "BNB", tx.hash);
      // setTransactionStatus(result);

      setMessageType("success");
      setMessageContent({
        title: "Approved",
        content:
          "Thanks for your purchase! Once your transaction has been confirmed your token balance will be updated.",
        image: "/img/lock/lock.webp",
        form: "contact",
      });
      // let receipt = await tx.wait();
      // if (receipt.status === 1) {
      //   setMessageType("success");
      //   setMessageContent({
      //     title: "Approved",
      //     content:
      //       "Thanks for your purchase! Once your transaction has been confirmed your token balance will be updated.",
      //     image: "/img/lock.png",
      //     form: "contact",
      //   });
      //   saveTransaction(selectedAmount, "BNB", receipt.transactionHash);
      // } else {
      //   setMessageType("error");
      //   setMessageContent({
      //     title: "Oopps",
      //     content: "Something went wrong!",
      //   });
      // }
    } catch (err: any) {
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        setMessageType("error");
        setMessageContent({
          title: "Rejected",
          content: "You denied transaction signature!",
        });
      } else if (err.data?.code === -32000) {
        setMessageType("error");
        setMessageContent({
          title: "Oopps",
          content: "Insufficient BNB to transfer!",
        });
      } else {
        setMessageType("error");
        setMessageContent({
          title: "Oopps",
          content: err.data ? err.data.message : err?.message ? err.message : 'Something went wrong!'
        });
      }
    }
    setPending(false);
  }, [library, account, selectedAmount, wallet]);

  const sendUsdt = useCallback(async () => {
    setPending(true);
    try {
      setMessageType("waiting");
      setMessageContent({
        title: "Pending Action",
        content: "Approve or reject request using your wallet..",
        image: "/img/flying-clock-2/flying-clock-2.webp",
      });
      const gasLimit = await usdtContract.estimateGas.transfer(wallet, (selectedAmount * 1000000).toString());
      
      const signer = getProviderOrSigner(library, account!);
      const gasPrice = await signer.getGasPrice();
      let tx = await usdtContract.transfer(wallet, (selectedAmount * 1000000).toString(),
      { gasLimit: gasLimit, gasPrice: gasPrice });
      setMessageType("success");
      setMessageContent({
        title: "Approved",
        content:
          "Thanks for your purchase! Once your transaction has been confirmed your token balance will be updated.",
        image: "/img/lock/lock.webp",
        form: "contact",
      });
      saveTransaction(selectedAmount, "USDT", tx.hash);
      
    } catch (err: any) {
      if (err.error) {
        if (err.error.code === 4001 || err.error.code === 'ACTION_REJECTED') {
          setMessageType("error");
          setMessageContent({
            title: "Rejected",
            content: "You denied transaction signature!",
          });
        } else if (err.error.data?.message === "invalid opcode: INVALID" || err.error.message === "invalid opcode: INVALID") {
          setMessageType("error");
          setMessageContent({
            title: "Oopps",
            content: "Insufficient USDT to transfer!",
          });
        } else if (err.error.data?.code === -32000 || err.error.code === -32000) {
          setMessageType("error");
          setMessageContent({
            title: "Oopps",
            content: "Insufficient ETH to transfer!",
          });
        } else {
          setMessageType("error");
          setMessageContent({
            title: "Oopps",
            content: err.error.data ? err.error.data.message : err.error.message ? err.error.message : 'Something went wrong!'
          });
        }
      } else {
        if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
          setMessageType("error");
          setMessageContent({
            title: "Rejected",
            content: "You denied transaction signature!",
          });
        } else if (err.data?.message === "invalid opcode: INVALID" || err.message === "invalid opcode: INVALID") {
          setMessageType("error");
          setMessageContent({
            title: "Oopps",
            content: "Insufficient USDT to transfer!",
          });
        } else if (err.data?.code === -32000 || err.code === -32000) {
          setMessageType("error");
          setMessageContent({
            title: "Oopps",
            content: "Insufficient ETH to transfer!",
          });
        } else {
          setMessageType("error");
          setMessageContent({
            title: "Oopps",
            content: err.data ? err.data.message : err?.message ? err.message : 'Something went wrong!'
          });
        }
      }
    }
    setPending(false);
  }, [library, account, selectedAmount, wallet]);




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
                // getTokenBalance(account);
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

    // let oldBalance = tokenBalance;
    // let checkInterval = setInterval(() => {
    //   console.log("Checking balance");
    //   getTokenBalance(account).then((newBalance) => {
    //     if (newBalance !== oldBalance) {
    //       clearInterval(checkInterval);
    //       setTokenBalance(newBalance);
    //       setBalanceLoading(true);
    //       setBalanceLoaded(true);
    //       setBalanceLoading(false);
    //     }
    //   });
    // }, 5000);
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
          targetChain={targetChain}
          handleClose={() => {
            setNetworkModalVisibility(false);
            disconnect();
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
                try {
                  disconnect();
                } catch (err) { }
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

export default WalletConnect;
