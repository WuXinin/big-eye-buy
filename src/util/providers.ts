import { ethers } from "ethers";
import getRpcUrl from "./getRpcUrl";

export const simpleRpcProvider = (chainID: Number) =>{
  const rpc=getRpcUrl(chainID);
  return rpc ? new ethers.providers.StaticJsonRpcProvider(getRpcUrl(chainID)) : null;
}
