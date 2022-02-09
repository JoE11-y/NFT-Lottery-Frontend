import {useContract} from './useContract';
import MyContract from '../contracts/MyContract.json';
import MyContractAddress from '../contracts/MyContractAddress.json';

// export interface for smart contract
export const useDappContract = () => useContract(MyContract.abi, MyContractAddress.address);