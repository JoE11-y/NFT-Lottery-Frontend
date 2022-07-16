const setup = require("./setup");

async function main() {
  console.log("Initialising................................");
  const contract = setup.getContract();
  const kit = setup.getKit();
  const { defaultAccount } = kit;
  let nonce = await kit.web3.eth.getTransactionCount(defaultAccount);
  console.log(
    "Sending Transaction to Alfajores Testnet................................"
  );
  const tx = await contract.methods.getWinningTicket().send({
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
