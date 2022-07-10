import { useState, useEffect, useCallback } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useNFTLotteryContract } from "./useNFTLotteryContract";

export const useNFTLottery = () => {
  const { address, kit } = useContractKit();
  const [lottery, setLottery] = useState({});
  const NFTLotteryContract = useNFTLotteryContract();

  const getLottery = useCallback(async () => {
    if (!counterContract) return;
    // fetch a connected wallet token balance
    const ID = await NFTLotteryContract.methods.getLotteryID().call();
    const _lottery = await counterContract.methods.viewLottery(ID).call();
    setLottery(_lottery);
  }, [address, kit, counterContract]);

  useEffect(() => {
    if (address) getLottery();
  }, [address, getLottery()]);

  return {
    lottery,
    getLottery,
  };
};
