const setup = require("./setup");
var parseArgs = require("minimist");

// "node ./operatorScripts/startLottery.js --operatorAddress 0xf3a7050c41c7C8e06Ec82FCAffBE62bfE8D84D96"
async function main() {
  const args = parseArgs(process.argv.slice(2), {
    string: ["operatorAddress"],
  });

  console.log("Initialising................................");
  const contract = setup.getContract();
  const kit = setup.getKit();
  const { defaultAccount } = kit;
  let nonce = await kit.web3.eth.getTransactionCount(defaultAccount);
  console.log(
    "Sending Transaction to Alfajores Testnet................................"
  );
  const tx = await contract.methods.setOperator(args.operatorAddress).send({
    from: defaultAccount,
    gas: 200000, // surplus gas will be returned to the sender
    nonce: nonce,
    chainId: "44787", // Alfajores chainId
    data: "0x0", // data to send for smart contract execution
  });
  const transactionHash = `https://alfajores-blockscout.celo-testnet.org/tx/${tx.transactionHash}/internal-transactions`;
  console.log("Transaction mined");
  console.log("TransactionHash : ", { transactionHash });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
