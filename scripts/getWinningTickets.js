const hre = require("hardhat");
const utils = require("./utils");

async function main() {
  const lotteryAddress = utils.getLotteryAddress();
  const NFTLotteryFactory = await hre.ethers.getContractFactory("NFTLottery");
  const NFTLottery = NFTLotteryFactory.attach(lotteryAddress);
  const txn = await NFTLottery.getWinningTickets();
  await txn.wait();

  const transactionHash = `https://alfajores-blockscout.celo-testnet.org/tx/${txn.hash}/internal-transactions`;

  console.log("Winning Tickets Gotten");

  console.log("Transaction Hash: ", { transactionHash });
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
