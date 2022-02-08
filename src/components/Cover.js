import logo from "../logo.svg";
import {Button} from "react-bootstrap";
import {useContractKit} from "@celo-tools/use-contractkit";

const Cover = () => {
    const {connect} = useContractKit()

    const connectWallet = async () => {

        try {
            await connect()
        } catch (e) {
            console.log({e})
        }

    }
    return (
        <>
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
                Celo React Boilerplate
            </p>

            <p>
                Lets get started!
            </p>

            <Button variant="primary" onClick={connectWallet}>Connect Wallet</Button>
        </>

    )
}

export default Cover