const fs = require("fs");

function getLotteryAddress() {
    const contractsDir = __dirname + "/../src/contracts/NFTLotteryAddress.json";
    let rawdata = fs.readFileSync(contractsDir);
    let data = JSON.parse(rawdata);
    return data.NFTLottery;
}

exports.getLotteryAddress = getLotteryAddress;