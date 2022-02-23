# Celo React Boilerplate

## Quick Start

To get this project up running locally, follow these simple example steps:

1. Clone the repository:

```bash
git clone https://github.com/dacadeorg/celo-react-boilerplate.git
```

2. Navigate to the directory:

```bash
cd celo-react-boilerplate
```

3. Install the dependencies:

```bash
npm install
```

4. Run the dapp:

```bash
npm start
```

## Smart-Contract-Deployment

You can use your own smart contract that the dapp will interact with by following the steps below:

1. Update the contracts/MyContract.sol file with your smart contract
2. Compile the smart contract

```bash
npx hardhat compile
```

3. Run tests on smart contract

```bash
npx hardhat test
```

4. Update env file

- Create a file in the root directory called ".env"
- Create a key called MNEMONIC and paste in your mnemonic key. e.g

```js
MNEMONIC = "...";
```

In this case, we are using a mnemonic from an account created on Metamask. You can copy it from your Metamask account settings. An account created on the Celo extension wallet will not work.

You can find more details about the whole process in the Dacade [NFT Contract Development with Hardhat](https://hackmd.io/exuZTH2hTqKytn2vxgDmcg) learning module. It will also show you how to get testnet tokens for your account so you can deploy your smart contract in the next step.

4. Deploy the smart contract to the Celo testnet Aljafores

```sh
   npx hardhat run --network alfajores scripts/deploy.js
```

This command will update the src/contract files with the deployed smart contract ABI and contract address

5. Run the project

If you have a Metamask wallet installed that is connected to the Celo network, Alfajores, and have Celo testnet tokens, you can test the boilerplate now.

```sh
   npm start
```

The boilerplate should now behave like this:
![](https://raw.githubusercontent.com/dacadeorg/celo-development-201/main/content/gifs/boilerplate_demo.gif)