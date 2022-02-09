import { useContract } from "./useContract";
import MyContract from "../contracts/MyContract.json";
import MyContractAddress from "../contracts/MyContractAddress.json";

// export interface for smart contract
export const useCounterContract = () =>
  useContract(MyContract.abi, MyContractAddress.address);
