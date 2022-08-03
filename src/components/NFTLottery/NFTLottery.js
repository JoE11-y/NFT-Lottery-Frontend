import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import {
  getLottery,
  getCurrentLotteryID,
  checkTicketPrice,
  getPlayerTicketCount,
} from "../../utils/NFTLottery";
import { useContractKit } from "@celo-tools/use-contractkit";
import { formatBigNumber } from "../../utils";
import PrevRounds from "./prevRounds";
import BuyTicketForm from "./buyTicketForm";
import BigNumber from "bignumber.js";
import Loader from "../ui/Loader";
import { convertTime } from "../../utils";

const NFTLottery = ({ NFTLotteryContract }) => {
  const { kit } = useContractKit();
  const address = kit.defaultAccount;
  const [loading, setLoading] = useState(false);
  const [lottery, setLottery] = useState({});
  const [prevLottery, setPrevLottery] = useState({});
  const [ticketPrice, setTicketPrice] = useState(0);
  const [playerTickets, setPlayerTicket] = useState(0);
  const [previousLotteryPlayerTickets, setPreviousLotteryPlayerTickets] =
    useState(0);
  const [open, openModal] = useState(false);

  const updateLottery = useCallback(async () => {
    try {
      setLoading(true);
      const lotteryID = await getCurrentLotteryID(NFTLotteryContract);
      if (lotteryID > 1) {
        var prevLotteryID = Number(lotteryID) - 1;
        prevLotteryID = prevLotteryID.toString();
        const prevLottery = await getLottery(NFTLotteryContract, {
          lotteryID: prevLotteryID,
        });
        const _playerTickets = await getPlayerTicketCount(NFTLotteryContract, {
          address,
          lotteryID: prevLotteryID,
        });
        setPrevLottery(prevLottery);
        setPreviousLotteryPlayerTickets(_playerTickets);
      }

      const _lottery = await getLottery(NFTLotteryContract, { lotteryID });
      const _ticketPrice = await checkTicketPrice(NFTLotteryContract);
      const _playerTickets = await getPlayerTicketCount(NFTLotteryContract, {
        address,
        lotteryID,
      });

      setPlayerTicket(_playerTickets);
      setLottery(_lottery);
      setTicketPrice(_ticketPrice);
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  }, [NFTLotteryContract, address]);

  useEffect(() => {
    try {
      if (NFTLotteryContract) {
        updateLottery();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [NFTLotteryContract, updateLottery]);

  return (
    <>
      {!loading ? (
        <>
          <div className="container">
            <div className="tabs-container header">
              <div className="tab">Current Lottery</div>
            </div>
            <div className="lottery-container">
              <div className="lottery-header">
                <div>
                  <p>
                    <strong>ID: </strong> {lottery.ID}
                  </p>
                  <p>
                    <strong>Lottery Ends In: </strong>{" "}
                    {convertTime(lottery.lotteryEndTime)}
                  </p>
                </div>
              </div>
              <div className="lottery-body">
                <p>
                  <strong>Price Per Ticket: </strong>{" "}
                  {formatBigNumber(new BigNumber(ticketPrice))} cUSD
                </p>
                <p>
                  <strong>No Of tickets Sold: </strong>
                  {lottery.noOfTicketsSold}
                </p>
                <p>
                  <strong>Participants: </strong>
                  {lottery.noOfPlayers}
                </p>
                <p>
                  <strong>Prize: </strong>{" "}
                  {formatBigNumber(new BigNumber(lottery.amountInLottery / 2))}{" "}
                  cUSD
                </p>
                <p>
                  <strong>Your Tickets: </strong>
                  {playerTickets}
                </p>
              </div>
              <div className="lottery-footer">
                <Button
                  variant="success"
                  className="buy-lottery-btn"
                  onClick={() => openModal(true)}
                >
                  Buy Ticket
                </Button>
              </div>
            </div>
          </div>

          <PrevRounds
            NFTLotteryContract={NFTLotteryContract}
            prevLottery={prevLottery}
            ticketPrice={ticketPrice}
            previousLotteryPlayerTickets={previousLotteryPlayerTickets}
          />
        </>
      ) : (
        <Loader />
      )}
      {open && (
        <BuyTicketForm
          updateLottery={updateLottery}
          NFTLotteryContract={NFTLotteryContract}
          ticketPrice={ticketPrice}
          open={open}
          onClose={() => openModal(false)}
        />
      )}
    </>
  );
};

export default NFTLottery;
