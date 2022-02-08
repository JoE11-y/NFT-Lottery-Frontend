import {useContract} from './useContract';
import MyContract from '../contracts/MyContract.json';
import MyContractAddress from '../contracts/MyContractAddress.json';

console.log("Address "  , MyContractAddress.address )
// export interface for NFT contract
export const useDappContract = () => useContract(MyContract.abi, MyContractAddress.address);