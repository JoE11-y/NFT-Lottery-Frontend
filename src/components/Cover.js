import logo from "../logo.svg";
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
      <img src={logo} className="App-logo" alt="logo" />
      <p>Celo NFT Lottery</p>
      <Button variant="primary" onClick={connectWallet}>
        Connect Wallet
      </Button>
    </>
  );
};

export default Cover;
