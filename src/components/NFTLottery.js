import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { getLottery, getCurrentLotteryID } from "../utils/NFTLottery";
import Loader from "./ui/Loader";

const Counter = ({ NFTLotteryContract }) => {
  const [loading, setLoading] = useState(false);
  const [lottery, setLottery] = useState({});
  const { performActions } = useContractKit();

  useEffect(() => {
    try {
      if (NFTLotteryContract) {
        updateLottery();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [NFTLotteryContract, getLottery]);

  const updateLottery = async () => {
    try {
      setLoading(true);
      const lotteryID = await getCurrentLotteryID(NFTLotteryContract);
      const _lottery = await getLottery(NFTLotteryContract, { lotteryID });
      setLottery(_lottery);
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="text-center w-50 m-auto">
      <Card.Header>CELO NFT Lottery</Card.Header>
    </Card>
  );
};

export default Counter;
