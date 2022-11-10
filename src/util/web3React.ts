import { InjectedConnector } from "@web3-react/injected-connector";
import { ConnectorNames } from "wallet-bigeye";
import getNodeUrl from "./getRpcUrl";
import { CHAIN_IDS } from "../config/constants";
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { Web3Provider } from '@ethersproject/providers'

const POLLING_INTERVAL = 12000;


export const injected = new InjectedConnector({
  supportedChainIds: CHAIN_IDS.map((ele: any) => Number(ele))
});

let rpc : { [key: string]: any } = {};
for (let chainId of CHAIN_IDS) {
  rpc[chainId] = getNodeUrl(Number(chainId));
}

const walletconnect = new WalletConnectConnector({
  rpc:rpc,
  qrcode:true,
  pollingInterval:POLLING_INTERVAL
});

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.Blocto]: async (chainId: any) => {
    const { BloctoConnector } = await import('@blocto/blocto-connector')
    return new BloctoConnector({ chainId, rpc: getNodeUrl(Number(chainId)) })
  },
  [ConnectorNames.WalletLink]: async (chainId: any) => {
    const { WalletLinkConnector } = await import('@web3-react/walletlink-connector')
    return new WalletLinkConnector({
      url: getNodeUrl(Number(chainId)),
      appName: 'BigEye',
      appLogoUrl: 'https://buy.bigeyes.space/icon/favicon-32x32.png',
      supportedChainIds: CHAIN_IDS.map((ele: any) => Number(ele)),
    })
  },
} as const

export const getLibrary = (provider : any): Web3Provider => {
  const library = new Web3Provider(provider)
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};
