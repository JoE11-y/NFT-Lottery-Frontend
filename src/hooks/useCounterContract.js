import { useContract } from "./useContract";
import Counter from "../contracts/Counter.json";
import CounterAddress from "../contracts/CounterAddress.json";

// export interface for smart contract
export const useCounterContract = () =>
  useContract(Counter.abi, CounterAddress.Counter);
