import BigNumber from "bignumber.js";
import NFTLotteryAddress from "../contracts/NFTLotteryAddress.json";
import {
  NotificationSuccess,
  NotificationError,
} from "../components/ui/Notifications";
import { toast } from "react-toastify";

export const setOperator = async (
  NFTLotteryContract,
  performActions,
  { operatorAddress }
) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await NFTLotteryContract.methods
        .setOperator(operatorAddress)
        .send({ from: defaultAccount });
    });
  } catch (e) {
    console.log({ e });
  }
};

export const startLottery = async (NFTLotteryContract, performActions) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await NFTLotteryContract.methods
        .startLottery()
        .send({ from: defaultAccount });
    });
  } catch (e) {
    console.log({ e });
  }
};

export const approve = async (
  IECR20Contract,
  performActions,
  { noOfTickets, ticketPrice }
) => {
  try {
    const amount = noOfTickets * ticketPrice;
    const amountToApprove = new BigNumber(amount);
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await IECR20Contract.methods
        .approve(NFTLotteryAddress.NFTLottery, amountToApprove)
        .send({ from: defaultAccount });
      toast(<NotificationSuccess text="Contract Approved...." />);
    });
    return true;
  } catch (e) {
    toast(<NotificationError text="Please Approve Contract to continue." />);
    console.log({ e });
    return false;
  }
};

//call approve function before calling this function
export const buyTickets = async (
  NFTLotteryContract,
  performActions,
  { noOfTickets }
) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await NFTLotteryContract.methods
        .buyTicket(noOfTickets)
        .send({ from: defaultAccount });
    });
    toast(<NotificationSuccess text="Ticket(s) Bought successfully" />);
  } catch (e) {
    toast(<NotificationError text="Ticket(s) Purchase failed." />);
    console.log({ e });
  }
};

export const getWinningTickets = async (NFTLotteryContract, performActions) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await NFTLotteryContract.methods
        .getWinningTickets()
        .send({ from: defaultAccount });
    });
  } catch (e) {
    console.log({ e });
  }
};

export const payoutWinner = async (NFTLotteryContract, performActions) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await NFTLotteryContract.methods
        .payoutWinner()
        .send({ from: defaultAccount });
    });
  } catch (e) {
    console.log({ e });
  }
};

export const withdrawContractFunds = async (
  NFTLotteryContract,
  performActions
) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await NFTLotteryContract.methods
        .withdrawContractFunds()
        .send({ from: defaultAccount });
    });
  } catch (e) {
    console.log({ e });
  }
};

export const updateLotteryInterval = async (
  NFTLotteryContract,
  performActions,
  { lotteryInterval, timeUnit }
) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await NFTLotteryContract.methods
        .updateLotteryInterval(lotteryInterval, timeUnit)
        .send({ from: defaultAccount });
    });
  } catch (e) {
    console.log({ e });
  }
};

export const getCurrentLotteryID = async (NFTLotteryContract) => {
  try {
    const ID = await NFTLotteryContract.methods.getLotteryID().call();
    return ID;
  } catch (e) {
    console.log({ e });
  }
};

export const getLottery = async (NFTLotteryContract, { lotteryID }) => {
  try {
    const _lottery = await NFTLotteryContract.methods
      .viewLottery(lotteryID)
      .call();
    return _lottery;
  } catch (e) {
    console.log({ e });
  }
};

export const checkTicketPrice = async (NFTLotteryContract) => {
  try {
    const ticketPrice = await NFTLotteryContract.methods
      .checkTicketPrice()
      .call();
    return ticketPrice;
  } catch (e) {
    console.log({ e });
  }
};

export const checkContractBalance = async (NFTLotteryContract) => {
  try {
    const contractBalance = await NFTLotteryContract.methods
      .checkContractFunds()
      .call();
    return contractBalance;
  } catch (e) {
    console.log({ e });
  }
};

export const getLotteryOperator = async (NFTLotteryContract) => {
  try {
    const operatorAddress = await NFTLotteryContract.methods
      .getOperator()
      .call();
    return operatorAddress;
  } catch (e) {
    console.log({ e });
  }
};

export const getPlayerTicketCount = async (
  NFTLotteryContract,
  { address, lotteryID }
) => {
  try {
    const ticketCount = await NFTLotteryContract.methods
      .getPlayerTicketCount(address, lotteryID)
      .call();

    return ticketCount;
  } catch (e) {
    console.log({ e });
  }
};
