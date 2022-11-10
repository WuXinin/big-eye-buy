import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {useWeb3React} from "@web3-react/core";
import { getERC20Contract } from "../util/contract";
export const useTokenBalance = (tokenAddress: string) => {
  const { library, account, chainId } = useWeb3React();


  const [balanceState, setBalanceState] = useState({
    balance: 0,
    fetchStatus: "Not fetched",
  });

  useEffect(() => {
    let unmounted = false;
    if (tokenAddress && library && account && Number(chainId)===1) {
      const fetchBalance = async () => {
        const contract = getERC20Contract(tokenAddress, library);
        try {
          const balance = await contract.balanceOf(account);
          const decimals = await contract.decimals();
          console.log(Number(ethers.utils.formatUnits(balance, decimals)));
          if (!unmounted)
            setBalanceState({
              balance: Number(ethers.utils.formatUnits(balance, decimals)),
              fetchStatus: "Success",
            });
        } catch (e) {
          console.error(e);
          setBalanceState((prev) => ({
            ...prev,
            fetchStatus: "Failed",
          }));
        }
      };
      fetchBalance();
    }
    return () => { unmounted = true; }
  }, [account, tokenAddress, library, chainId]);

  return balanceState;
};

export const useETHBalance = () => {
  const [balance, setBalance] = useState(0);
  const { account, library } = useWeb3React();

  useEffect(() => {
    let unmounted = false;
    if (library && account) {
      const fetchBalance = async () => {
        try {
          const walletBalance = await library?.getBalance(account);
          if(!unmounted)
            setBalance(Number(ethers.utils.formatUnits(walletBalance, 18)))
        } catch (err) { console.log(err); }
      };
      fetchBalance();
    }
    return () => { unmounted = true; }
  }, [library, account]);

  return { balance };
};

export default useETHBalance;
