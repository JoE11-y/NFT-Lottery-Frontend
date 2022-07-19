const hre = require("hardhat");
const fs = require("fs");

function getLotteryAddress() {
    const contractsDir = __dirname + "/../src/contracts/NFTLotteryAddress.json";
    let rawdata = fs.readFileSync(contractsDir);
    let data = JSON.parse(rawdata);
    return data.NFTLottery;
}

async function main() {
    const lotteryAddress = getLotteryAddress();
    const NFTLotteryFactory = await hre.ethers.getContractFactory("NFTLottery");
    const NFTLottery = NFTLotteryFactory.attach(lotteryAddress);
    const txn = await NFTLottery.startLottery();
    await txn.wait();
}

main().then(() => {
    process.exit(0);
}).catch((error) => {
    console.log(error);
    process.exit(1);
})