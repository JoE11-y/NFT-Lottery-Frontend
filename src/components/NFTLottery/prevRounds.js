import React, { useState } from "react";
import { getLottery, getPlayerTicketCount } from "../../utils/NFTLottery";
import { useContractKit } from "@celo-tools/use-contractkit";
import { formatBigNumber, convertTime, truncateAddress } from "../../utils";
import BigNumber from "bignumber.js";

const PrevRounds = ({ NFTLotteryContract, prevLottery, ticketPrice }) => {
  const { kit } = useContractKit();
  const init = {
    ID: 0,
    winner: "0x000000000000000000000000000000000000dEaD",
    noOfTicketsSold: 0,
    noOfPlayers: 0,
    winningTicket: 0,
    amountInLottery: 0,
    lotteryStartTime: 0,
    lotteryEndTime: 0,
  };

  const _lottery = prevLottery.ID ? prevLottery : init;

  const [lotteryId, setLotteryID] = useState(_lottery.ID);

  const [lottery, setLottery] = useState(_lottery);

  const [playerTickets, setPlayerTicket] = useState(0);

  const previousLottery = async (e) => {
    e.preventDefault();
    const lotteryID = lotteryId - 1;
    if (lotteryID < 1) {
      return;
    }
    const address = kit.defaultAccount;
    const result = await getLottery(NFTLotteryContract, { lotteryID });
    const _playerTickets = await getPlayerTicketCount(NFTLotteryContract, {
      address,
      lotteryID,
    });
    setLottery(result);
    setPlayerTicket(_playerTickets);
    setLotteryID(lotteryID);
  };

  const nextLottery = async (e) => {
    e.preventDefault();
    const lotteryID = lotteryId + 1;
    if (lotteryID > _lottery.ID) {
      return;
    }
    const address = kit.defaultAccount;
    const result = await getLottery(NFTLotteryContract, { lotteryID });
    const _playerTickets = await getPlayerTicketCount(NFTLotteryContract, {
      address,
      lotteryID,
    });
    setPlayerTicket(_playerTickets);
    setLottery(result);
    setLotteryID(lotteryID);
  };

  return (
    <>
      <div className="container">
        <div className="tabs-container header">
          <div className="tab">Lottery History</div>
        </div>
        <div className="lottery-container">
          <div className="lottery-header">
            <div className="round-details">
              <p>
                <strong>ID: </strong>{" "}
                <span className="round-num">{lotteryId}</span>
              </p>
              <div className="rounds-nav">
                <a href="/#" onClick={previousLottery} className="prev">
                  &#8592;
                </a>
                <a href="/#" onClick={nextLottery} className="next">
                  &#8594;
                </a>
              </div>
            </div>
            <p>
              <strong>Drawn: </strong> {convertTime(lottery.lotteryEndTime)}
            </p>
            <p>
              <strong>Winner: </strong>
              <a
                href={`https://alfajores-blockscout.celo-testnet.org/address/${lottery.winner}/transactions`}
                target="_blank"
                rel="noreferrer"
              >
                {truncateAddress(lottery.winner)}
              </a>
            </p>
          </div>
          <div className="lottery-body">
            <p>
              <strong>Price Per Ticket: </strong>{" "}
              {formatBigNumber(new BigNumber(ticketPrice))} cUSD
            </p>
            <p>
              <strong>No of Tickets Sold: </strong> {lottery.noOfTicketsSold}
            </p>
            <p>
              <strong>Participants: </strong>
              {lottery.noOfPlayers}
            </p>
            <p>
              <strong>Prize: </strong>{" "}
              {formatBigNumber(new BigNumber(lottery.amountInLottery / 2))} cUSD
            </p>
            <p>
              <strong>Your Tickets: </strong>
              {playerTickets}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrevRounds;
