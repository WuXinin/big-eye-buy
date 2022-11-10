import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";

import { 
  getProviderOrSigner, 
  getERC20Contract
 } from "../util/contract";

 export const useERC20 = (address: string, withSignerIfPossible = true) => {
  const { library, account } = useWeb3React()
  const signer = useMemo(
    () => (withSignerIfPossible ? getProviderOrSigner(library, account!) : null),
    [withSignerIfPossible, library, account],
  )
  return useMemo(() => getERC20Contract(address, signer!), [address, signer])
}