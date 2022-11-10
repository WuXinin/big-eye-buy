import { useCallback } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from "@web3-react/walletconnect-connector";
import {
  ConnectorNames,
  connectorLocalStorageKey,
} from 'wallet-bigeye';
import { connectorsByName } from "../util/web3React";
import { setupNetwork } from "../util/wallet";
import toast from 'react-hot-toast';
import {NETWORK_NAME} from "../config/constants";

const useAuth = (network: any) => {
  const { activate, deactivate, setError } = useWeb3React();
  const login = useCallback(
    async (connectorID: ConnectorNames) => {
      const connectorOrGetConnector = connectorsByName[connectorID];
      const connector =
        typeof connectorOrGetConnector !== 'function' ? connectorsByName[connectorID] : await connectorOrGetConnector(network);
      if (typeof connector !== 'function' && connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const provider = await connector.getProvider()
            const hasSetup = await setupNetwork(provider, network)
            if (hasSetup) {
              // activate(provider)
              toast.success('Switched to ' + NETWORK_NAME[String(network)] + '. Please connect again!');

            } else {
              toast.error('Failed to switch networks from the BigEye Interface. In order to use BigEye on the network, you must change the network in your wallet.');
            }
          } else {
            window?.localStorage?.removeItem(connectorLocalStorageKey)
            if (error instanceof NoEthereumProviderError) {
              toast.error('No provider was found.');
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector;
                walletConnector.walletConnectProvider = null as any;
              }
              toast.error('Please authorize to access your account.');
            } else {
              toast.error(error.name + " : " + error.message);
            }
          }
        });
      } else {
        window?.localStorage?.removeItem(connectorLocalStorageKey)
        toast.error("The connector config is wrong");
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activate, setError]);

  const logout = useCallback(() => {
    
    deactivate();
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName.walletconnect.close()
      connectorsByName.walletconnect.walletConnectProvider = null as any;
    }
    window?.localStorage?.removeItem(connectorLocalStorageKey)
  }, [deactivate])

  return { login, logout };
};

export default useAuth;
