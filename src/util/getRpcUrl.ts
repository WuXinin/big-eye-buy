import random from 'lodash/random'
import {NODE_URL, CHAIN_IDS} from "../config/constants";
// Array of available nodes to connect to

const tmp_nodes : { [key: string]: any }={};
for(let item of CHAIN_IDS){
  tmp_nodes[String(item)]=NODE_URL[String(item)];
}
export const nodes=tmp_nodes;

const getNodeUrl = (network: string | number | Number) => {
    if(nodes[String(network)]){
      const randomIndex = random(0, nodes[String(network)].length - 1)
      return nodes[String(network)][randomIndex];
    }else return null;
      
}

export default getNodeUrl
