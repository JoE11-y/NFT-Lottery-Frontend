import React from "react";
import { Container, Nav } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Notification } from "./components/ui/Notifications";
import Wallet from "./components/Wallet";
import Cover from "./components/Cover";
import NFTLottery from "./components/NFTLottery";
import { useBalance, useNFTLotteryContract } from "./hooks";
import "./App.css";

const App = function AppWrapper() {
  const { address, destroy, connect } = useContractKit();
  const { balance } = useBalance();
  const NFTLotteryContract = useNFTLotteryContract();

  return (
    <>
      <Notification />
      {address ? (
        <>
          <Container fluid="md" className="hero">
            <Nav className="justify-content-end pt-3 pb-5">
              <Nav.Item>
                {/*display user wallet*/}
                <Wallet
                  address={address}
                  amount={balance.cUSD}
                  symbol="cUSD"
                  destroy={destroy}
                />
              </Nav.Item>
            </Nav>
            <div className="header">
              <p className="title light">CELO NFT Lottery</p>
              <p className="subtitle light">
                A lottery platform built on top of Celo Blockchain 🔦
              </p>
            </div>
            {/* display cover */}
          </Container>
          <NFTLottery NFTLotteryContract={NFTLotteryContract} />
        </>
      ) : (
        // display cover if user is not connected
        <div className="App">
          <header className="App-header">
            <Cover connect={connect} />
          </header>
        </div>
      )}
    </>
  );
};

export default App;
