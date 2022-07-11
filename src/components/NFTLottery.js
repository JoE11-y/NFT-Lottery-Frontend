import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { getLottery, getCurrentLotteryID } from "../utils/NFTLottery";
import Loader from "./ui/Loader";

const NFTLottery = ({ NFTLotteryContract }) => {
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
    <>
      <div className="container">
        <div className="tabs-container header">
          <button className="button tab">Current Lottery</button>
        </div>
        <div className="lottery-container">
          <div className="lottery-header">
            <div>
              <p>
                <strong>ID: </strong> 0
              </p>
              <p>
                <strong>Lottery Ends In: </strong>
              </p>
            </div>
          </div>
          <div class="lottery-body">
            <p>
              <strong>Price Per Ticket: </strong> 0 cUSD
            </p>
            <p>
              <strong>Participants: </strong>
            </p>
            <p>
              <strong>Prize: </strong> 0 cUSD
            </p>
          </div>
          <div class="lottery-footer">
            <button class="buy-lottery-btn">Buy Ticket</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="tabs-container header">
          <button className="button tab">Lottery History</button>
        </div>
        <div className="lottery-container">
          <div className="lottery-header">
            <div className="details">
              <p>
                <strong>ID: </strong> 0
              </p>
              <p>
                <strong>Winner: </strong>
              </p>
            </div>
            <div className="rounds-nav">
              <a href="/#" className="prev">
                &#8592;
              </a>
              <a href="/#" className="next">
                &#8594;
              </a>
            </div>
          </div>
          <div class="lottery-body">
            <p>
              <strong>Price Per Ticket: </strong> 0 cUSD
            </p>
            <p>
              <strong>Participants: </strong>
            </p>
            <p>
              <strong>Prize: </strong> 0 cUSD
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTLottery;
