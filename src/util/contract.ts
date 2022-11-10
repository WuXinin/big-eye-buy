//@ts-ignore
import type { Signer } from '@ethersproject/abstract-signer'
//@ts-ignore
import type { Provider } from '@ethersproject/providers'
//@ts-ignore
import { Contract } from '@ethersproject/contracts'
import { simpleRpcProvider } from './providers'
import type { Erc20 } from '../config/abi/types'
//@ts-ignore
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import {CHAIN_IDS} from "../config/constants";

// ABI
import ERC20_ABI from "../config/abi/erc20.json";

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}
export const getContract = (abi: any, address: string, signer?: Signer | Provider, chainId=Number(CHAIN_IDS[0])) => {
  const signerOrProvider = signer ?? simpleRpcProvider(chainId);
  return new Contract(address, abi, signerOrProvider! as any)
}

export const getERC20Contract = (address: string, signer?: Signer | Provider) => {
  return getContract(ERC20_ABI, address, signer) as unknown as Erc20
}