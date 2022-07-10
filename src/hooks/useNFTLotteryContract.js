import { useContract } from "./useContract";
import NFTLottery from "../contracts/NFTLottery.json";
import NFTLotteryAddress from "../contracts/NFTLotteryAddress.json";

// export interface for smart contract
export const useNFTLotteryContract = () =>
  useContract(NFTLottery.abi, NFTLotteryAddress.NFTLottery);
