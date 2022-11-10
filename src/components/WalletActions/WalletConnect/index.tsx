import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import { ethers, providers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useCoingeckoPrice } from "@usedapp/coingecko";
import axios from "axios";
import { formatLargeNumber } from "../../../util";
import {
  apiGetAccountAssets,
  apiGetGasPrices,
  apiGetAccountNonce,
} from "./api";

import { formatEther, formatUnits, parseEther } from "@ethersproject/units";

import {
  ERC20Interface,
  useEtherBalance,
  useTokenBalance,
} from "@usedapp/core";

import Button from "../../Button";
import AmountModal from "../AmountModal";
import NetworkModal from "../NetworkModal";
import NumberAnimate from "../../NumberAnimate";
import LoaderSkeleton from "../../LoaderSkeleton";

const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const HEADERS = {
  headers: {
    project: "https://bigeyes.space/",
  },
};

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
  handleDismiss,
  setWConnect,
  tokenPrice,
  getNumbers,
  promo,
}: any) => {
  const etherPrice: any = useCoingeckoPrice("ethereum", "usd");

  const [walletProvider, setProvider] = useState<any>(null);
  const [w3Provider, setw3Provider] = useState<any>(null);
  const [isConnected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [chainId, setChainId] = useState(0);
  const [isPending, setPending] = useState(false);

  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceLoaded, setBalanceLoaded] = useState(false);

  const [selectedAmount, setAmount] = useState<any>(100);
  const [isModalShown, setModalVisibility] = useState(false);
  const [modalType, setModalType] = useState<any>(null);
  const [tokenBalance, setTokenBalance] = useState(0);

  const [etherBalance, setEtherBalance] = useState<any>(0);
  const [usdtBalance, setUsdtBalance] = useState<any>(0);

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
    const setProviderAsync = async () => {
      const provider: any = new WalletConnectProvider({
        infuraId: import.meta.env.VITE_INFURA_ID,
        rpc: {
          56: "https://bsc-dataseed1.binance.org",
        },
      });
      setProvider(provider);
    };

    setProviderAsync();
  }, []);

  useEffect(() => {
    if (messageType == "error") {
      setTimeout(() => {
        setMessageType(null);
        setMessageContent(null);
      }, 3000);
    }
  }, [messageType]);

  useEffect(() => {
    if (
      (modalType == "BNB" && chainId != 56) ||
      ((modalType == "ETH" || modalType == "USDT") && chainId != 1)
    ) {
      setNetworkModalVisibility(true);
    }
  }, [modalType, isConnected]);

  useEffect(() => {
    const getBalance = async () => {
      if (accounts && w3Provider) {
        let ethBalance = await w3Provider.getBalance(accounts[0]);
        setEtherBalance(formatEther(ethBalance));

        const usdtContract = new ethers.Contract(
          USDT,
          ERC20Interface,
          w3Provider.getSigner(accounts[0])
        );

        let usdtBalanceR = await usdtContract.balanceOf(accounts[0]);
        setUsdtBalance(formatUnits(usdtBalanceR, 6));
      }

      if (accounts && accounts.length > 0) {
        setBalanceLoading(true);
        axios
          .get(
            `https://presaleapi.bigeyes.space/wallet/${accounts[0]}`,
            HEADERS
          )
          .then((res) => {
            if (res && res.data) {
              setAccountNonce(res.data.nonce);
              setTokenBalance(res.data.tokenBalance);

              setBalanceLoaded(true);
              setBalanceLoading(false);
            }
          });
      }
    };

    getBalance();
  }, [w3Provider]);

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
    if (walletProvider) {
      const web3Provider = new providers.Web3Provider(walletProvider);
      setw3Provider(web3Provider);

      setAccounts(walletProvider.accounts);
      setChainId(walletProvider.chainId);

      walletProvider.on("accountsChanged", (accounts: any) => {
        setAccounts(accounts);
        setConnected(walletProvider.connected);
      });

      // Subscribe to chainId changesetBalanceLoaded
      walletProvider.on("chainChanged", (chainId: any) => {
        setChainId(chainId);
      });

      // Subscribe to session disconnection
      walletProvider.on("disconnect", (code: any, reason: any) => {
        setConnected(false);
        setWConnect(false);
        resetValues();
        handleDismiss();
      });
    }
  }, [modalType, chainId, walletProvider]);

  useEffect(() => {
    if (walletProvider) {
      if (walletProvider.connected) {
        setConnected(true);
      } else {
        connect();
      }
    }
  }, [walletProvider]);

  useEffect(() => {
    setWConnect(isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (accounts.length > 0) {
      if (accounts && accounts.length > 0) {
        setBalanceLoading(true);
        axios
          .get(
            `https://presaleapi.bigeyes.space/wallet/${accounts[0]}`,
            HEADERS
          )
          .then((res) => {
            if (res && res.data) {
              setAccountNonce(res.data.nonce);
              setTokenBalance(res.data.tokenBalance);

              setBalanceLoaded(true);
              setBalanceLoading(false);
            }
          });
      }
    }
  }, [accounts, chainId]);

  let intervalID: any;
  useEffect(() => {
    if (isChecking) {
      setPending(true);
      setMessageType("waiting");
      setMessageContent({
        title: "Please Wait",
        content: "Please wait, your transaction is checking..",
      });

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

  /*const getTokenBalance = (account: any): Promise<number> => {
    /*return new Promise((resolve, reject) => {
      axios
        .get(`https://presaleapi.bigeyes.space/${account}`, HEADERS)
        .then((res) => {
          if (res && res.data) {
            setTokenBalance(res.data);
            setBalanceLoaded(true)
            resolve(res.data)
          }
        });
    })
  };*/

  const connect = async () => {
    try {
      await walletProvider.enable();
    } catch {
      handleDismiss();
    }
  };

  const disconnect = () => {
    walletProvider.disconnect();
    resetValues();
  };

  const resetValues = () => {
    setProvider(null);
    setw3Provider(null);
    setConnected(false);
  };

  const saveTransaction = (amount: any, type: any, hash: any) => {
    let payload = {
      network: type == "BNB" ? "BSC" : "ETH",
      pay_hash: hash,
      promo_code: promo && promo.valid ? promo.cCode : "",
    };

    /*
    setTimeout(() => {
      setChecking(true);
    }, 1000);*/

    axios.post("https://presaleapi.bigeyes.space/Payment", payload, HEADERS);

    /*
    getTokenBalance(accounts[0]).then((newBalance) => {
      setTokenBalance(newBalance)
      setBalanceLoaded(true)
      setBalanceLoading(true)
      setTimeout(() => {
        setBalanceLoading(false)
      }, 300)
    })*/
    /*
    let oldBalance = tokenBalance;
    let checkInterval = setInterval(() => {
      console.log("Checking balance")
      getTokenBalance(accounts[0]).then((newBalance) => {
        if (newBalance !== oldBalance) {
          clearInterval(checkInterval)
          setTokenBalance(newBalance)
          setBalanceLoaded(true)
          setBalanceLoading(true)
          setTimeout(() => {
            setBalanceLoading(false)
          }, 300)
        }
      })
    }, 5000)*/
  };

  const sendTransactionEth = async () => {
    if (!w3Provider) {
      return;
    }
    setPending(true);
    setMessageType("waiting");
    setMessageContent({
      title: "Pending Action",
      content: "Approve or reject request using your wallet..",
      image: "/img/flying-clock-2/flying-clock-2.webp",
    });

    // from
    const from = accounts[0];

    // to
    const to = wallet;

    // nonce
    //const _nonce = await apiGetAccountNonce(accounts[0], chainId);
    const nonce = sanitizeHex(convertStringToHex(accountNonce));

    // gasPrice
    const gasPrices = await apiGetGasPrices();
    const _gasPrice = gasPrices.fast.price;
    const gasPrice = sanitizeHex(
      convertStringToHex(convertAmountToRawNumber(_gasPrice, 9))
    );

    // gasLimit
    const _gasLimit = 21000;
    const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

    // value
    const _value = selectedAmount;
    const value = parseEther(_value.toString().slice(0, 7))._hex;

    // data
    const data = "0x";

    // test transaction
    const tx = {
      from,
      to,
      nonce,
      gasPrice,
      gasLimit,
      value,
      data,
    };

    try {
      const result = await walletProvider.connector.sendTransaction(tx);

      const formattedResult = {
        method: "eth_sendTransaction",
        txHash: result,
        from: accounts[0],
        to: accounts[0],
        value: `${_value} ETH`,
      };

      saveTransaction(selectedAmount, "ETH", result);
      setTransactionStatus(result);

      setMessageType("success");
      setMessageContent({
        title: "Approved",
        content:
          "Thanks for your purchase! Once your transaction has been confirmed your token balance will be updated.",
        image: "/img/lock/lock.webp",
        form: "contact",
      });
    } catch (error) {
      console.error(error);
      setPending(false);
      setMessageType("error");
      setMessageContent({
        title: "Rejected",
        content: "Call Request Rejected.",
      });
    }
  };

  const sendTransactionBnb = async () => {
    if (!w3Provider) {
      return;
    }
    setPending(true);
    setMessageType("waiting");
    setMessageContent({
      title: "Pending Action",
      content: "Approve or reject request using your wallet..",
      image: "/img/flying-clock-2/flying-clock-2.webp",
    });

    // from
    const from = accounts[0];

    // to
    const to = wallet;

    // value
    const _value = selectedAmount;
    const value = parseEther(_value.toString().slice(0, 7))._hex;

    // data
    const data = "0x";

    // test transaction
    const tx = {
      from,
      to,
      value,
      data,
    };

    try {
      const result = await walletProvider.connector.sendTransaction(tx);

      const formattedResult = {
        method: "eth_sendTransaction",
        txHash: result,
        from: accounts[0],
        to: accounts[0],
        value: `${_value} BNB`,
      };

      saveTransaction(selectedAmount, "BNB", result);
      setTransactionStatus(result);

      setMessageType("success");
      setMessageContent({
        title: "Approved",
        content:
          "Thanks for your purchase! Once your transaction has been confirmed your token balance will be updated.",
        image: "/img/lock/lock.webp",
        form: "contact",
      });
    } catch (error) {
      console.error(error);
      setPending(false);
      setMessageType("error");
      setMessageContent({
        title: "Rejected",
        content: "Call Request Rejected.",
      });
    }
  };

  const sendTransactionUsdt = async () => {
    if (!w3Provider) {
      return;
    }
    setPending(true);
    setMessageType("waiting");
    setMessageContent({
      title: "Pending Action",
      content: "Approve or reject request using your wallet..",
      image: "/img/flying-clock-2/flying-clock-2.webp",
    });

    // from
    const from = accounts[0];

    // to
    const to = wallet;

    // nonce
    //const _nonce = await apiGetAccountNonce(accounts[0], 1);
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

    // value
    const _value = selectedAmount;
    const value = (_value * 1000000).toString();

    // data
    const data = "0x";

    // test transaction
    const tx = {
      from,
      to,
      nonce,
      gasPrice,
      gasLimit,
      value,
      data,
      chainId: 1,
    };

    const usdtContract = new ethers.Contract(
      USDT,
      ERC20Interface,
      w3Provider.getSigner(accounts[0])
    );

    try {
      const result = await usdtContract.transfer(to, value, {
        from: accounts[0],
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        nonce: nonce,
      });

      const formattedResult = {
        method: "eth_sendTransaction",
        txHash: result,
        from: accounts[0],
        to: accounts[0],
        value: `${_value} USDT`,
      };

      saveTransaction(selectedAmount, "USDT", result.hash);
      setTransactionStatus(result.hash);

      setMessageType("success");
      setMessageContent({
        title: "Approved",
        content:
          "Thanks for your purchase! Once your transaction has been confirmed your token balance will be updated.",
        image: "/img/lock/lock.webp",
        form: "contact",
      });
    } catch (error: any) {
      console.error(error);
      setPending(false);

      if (error && error.message == "invalid opcode: INVALID") {
        setMessageType("error");
        setMessageContent({
          title: "Oopps",
          content: "You do not have enough USDT in your wallet.",
        });
      } else {
        setMessageType("error");
        setMessageContent({
          title: "Rejected",
          content: "Call Request Rejected.",
        });
      }
    }
  };

  const submitMap: Record<string, Function> = {
    USDT: sendTransactionUsdt,
    BNB: sendTransactionBnb,
    ETH: sendTransactionEth,
  };

  return (
    <div className="buy-buttons">
      {isNetworkModalShown && (
        <NetworkModal
          modalType={modalType}
          chain={chainId}
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
          usdtB={usdtBalance}
          ethB={etherBalance}
          etherPrice={1}
          type={modalType}
          handleSubmit={() => submitMap[modalType]?.()}
          handleInputChange={(e: any) => setAmount(e)}
          isLoading={isPending}
          messageContent={messageContent}
          messageType={messageType}
        />
      )}
      {isConnected && (
        <>
          <div className="connected-text">
            <strong>Connected Wallet</strong>
            <span>{accounts[0]}</span>
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
            <Button onClick={() => disconnect()}>Disconnect</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletConnect;
