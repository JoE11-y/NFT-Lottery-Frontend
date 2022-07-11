import logo from "./images/celo-logo.png";
import { Button } from "react-bootstrap";

const Cover = ({ connect }) => {
  const connectWallet = async () => {
    try {
      await connect();
    } catch (e) {
      console.log({ e });
    }
  };
  return (
    <>
      <div className="cover">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Celo NFT Lottery</p>
        <Button variant="primary" onClick={connectWallet}>
          Connect Wallet
        </Button>
      </div>
    </>
  );
};

export default Cover;
