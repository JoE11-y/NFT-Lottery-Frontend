import { useState, useEffect, useCallback } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useCounterContract } from "./useCounterContract";

export const useCount = () => {
  const { address, kit } = useContractKit();
  const [count, setCount] = useState(0);
  const counterContract = useCounterContract();

  const getCount = useCallback(async () => {
    if (!counterContract) return;
    // fetch a connected wallet token balance
    const value = await counterContract.methods.get().call();
    setCount(value);
  }, [address, kit, counterContract]);

  useEffect(() => {
    if (address) getCount();
  }, [address, getCount()]);

  return {
    count,
    getCount,
  };
};
