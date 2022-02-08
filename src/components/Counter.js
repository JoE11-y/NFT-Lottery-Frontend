import {Card, Button} from "react-bootstrap"
import {useContractKit} from "@celo-tools/use-contractkit"
import Wallet from "./wallet";
import {useBalance, useDappContract} from "../hooks";
import {useCount} from "../hooks/useCount";
import {increaseCount, decreaseCount} from "../utils/dapp";
const Counter =() => {
    const {performActions,address, destroy} = useContractKit()

    //  fetch user's celo balance using hook
    const {balance, getBalance} = useBalance();
    const {count, getCount} = useCount();
    const dappContract = useDappContract();


    const increment = async () =>{
        await performActions(()=>{
            increaseCount(dappContract, performActions)
        })
    }

    const decrement = async () =>{
        await performActions(()=>{
            decreaseCount(dappContract, performActions)
        })
    }
    return(

        <Card bg={"black"} className="text-center" style={{ width: '50%' }}>
            <Card.Header>
                <Wallet
                    address={address}
                    amount={balance.CELO}
                    symbol="CELO"
                    destroy={destroy}
                />

            </Card.Header>
            <Card.Body>
                <Card.Title>Count : {count}</Card.Title>
                {/*<Card.Text>*/}
                {/*    With supporting text below as a natural lead-in to additional content.*/}
                {/*</Card.Text>*/}
                <br/>
                <div className="d-grid gap-2">
                    <Button variant="primary" size="lg" onClick={increment}>
                        Increase Count
                    </Button>
                    <Button variant="outline-danger" disabled={count<1} size="lg" onClick={decrement}>
                       Decrease Count
                    </Button>
                </div>
                {/*<Button variant="primary">Decrease Count</Button>*/}
            </Card.Body>
        </Card>
    )
}

export default Counter