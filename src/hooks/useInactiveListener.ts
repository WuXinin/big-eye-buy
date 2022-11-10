import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core';
import { connectorLocalStorageKey } from 'wallet-bigeye'
import { connectorsByName } from '../util/web3React'

export const useInactiveListener = () => {
  const { account, chainId, connector } = useWeb3React()

  useEffect(() => {
    if (account && connector) {
      const handleDeactivate = () => {
        // This localStorage key is set by @web3-react/walletconnect-connector
        if (window.localStorage.getItem('walletconnect')) {
          connectorsByName.walletconnect.close()
          connectorsByName.walletconnect.walletConnectProvider = null as any;
        }
        window.localStorage.removeItem(connectorLocalStorageKey)       
      }
      const handleUpdateEvent = () => {
        // This localStorage key is set by @web3-react/walletconnect-connector
        if (window.localStorage.getItem('walletconnect')) {
          connectorsByName.walletconnect.close()
          connectorsByName.walletconnect.walletConnectProvider = null as any;
        }        
      }

      connector.addListener('Web3ReactDeactivate', handleDeactivate)
      connector.addListener('Web3ReactUpdate', handleUpdateEvent)
      return () => {
        connector.removeListener('Web3ReactDeactivate', handleDeactivate)
        connector.removeListener('Web3ReactUpdate', handleUpdateEvent)
      }
    }
    return undefined
  }, [account, chainId, connector])
}
