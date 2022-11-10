// Set of helper functions to facilitate wallet setup
import { ExternalProvider } from '@ethersproject/providers'

import {
  SCAN_URL, CURRENCY_NAME, CURRENCY_SYMBOL, NETWORK_NAME
} from "../config/constants";
import { nodes } from "./getRpcUrl";

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (externalProvider: ExternalProvider, network: any) => {
  const provider = externalProvider || window.ethereum;
  if (provider) {
    const chainId = Number(network);
    try {
      await provider?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
      return true
    } catch (switchError) {
      if ((switchError as any)?.code === 4902) {
        try {
          await provider?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: NETWORK_NAME[String(chainId)],
                nativeCurrency: {
                  name: CURRENCY_NAME[String(chainId)],
                  symbol: CURRENCY_SYMBOL[String(chainId)],
                  decimals: 18,
                },
                rpcUrls: nodes[chainId],
                blockExplorerUrls: [`${SCAN_URL[String(chainId)]}/`],
              },
            ],
          })
          return true
        } catch (error) {
          console.error('Failed to setup the network in Metamask:', error)
          return false
        }
      }
      return false
    }       
  } else {
    console.error(
      "Can't setup the network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
