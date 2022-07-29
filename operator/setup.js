const Web3 = require("web3");
const fs = require("fs");
const ContractKit = require("@celo/contractkit");
require("dotenv").config({ path: ".env" });

let kit;

const getEnv = (variable, optional = false) => {
  if (!process.env[variable]) {
    if (optional) {
      console.warn(
        `[@env]: Environmental variable for ${variable} is not supplied.`
      );
    } else {
      throw new Error(
        `You must create an environment variable for ${variable}`
      );
    }
  }

  return process.env[variable]?.replace(/\\n/gm, "\n");
};

function initialise() {
  const web3 = new Web3(`https://alfajores-forno.celo-testnet.org`);
  kit = ContractKit.newKitFromWeb3(web3);
  // get PRIVATE_KEY variable from .env file
  //   kit = contractkit.newKit(`https://alfajores-forno.celo-testnet.org`);
  const ACCOUNT_KEY = getEnv("ACCOUNT_KEY");
  const account = web3.eth.accounts.privateKeyToAccount(ACCOUNT_KEY);
  kit.connection.addAccount(account.privateKey);
  kit.defaultAccount = account.address;
}

function getLotteryAddress() {
  const contractsDir = __dirname + "/../src/contracts/NFTLotteryAddress.json";
  let rawdata = fs.readFileSync(contractsDir);
  let data = JSON.parse(rawdata);
  return data.NFTLottery;
}

function getABI() {
  const contractsDir = __dirname + "/../src/contracts/NFTLottery.json";
  let rawdata = fs.readFileSync(contractsDir);
  let data = JSON.parse(rawdata);
  return data.abi;
}

function getContract() {
  initialise();
  const NFTLotteryAddress = getLotteryAddress();
  const NFTLotteryABI = getABI();
  const contract = new kit.web3.eth.Contract(NFTLotteryABI, NFTLotteryAddress);
  return contract;
}

function getKit() {
  return kit;
}

module.exports = {
  getContract,
  getKit,
};
