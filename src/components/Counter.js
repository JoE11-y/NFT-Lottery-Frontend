import { Card, Button } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useCount } from "../hooks/useCount";
import { increaseCount, decreaseCount } from "../utils/counter";

const Counter = ({ counterContract }) => {
  const { performActions } = useContractKit();
  const { count } = useCount();

  const increment = async () => {
    await performActions(() => {
      increaseCount(counterContract, performActions);
    });
  };

  const decrement = async () => {
    await performActions(() => {
      decreaseCount(counterContract, performActions);
    });
  };
  return (
    <Card className="text-center w-50 m-auto">
      <Card.Header>Counter</Card.Header>
      <Card.Body className="mt-4">
        <Card.Title>Count: {count}</Card.Title>
        <br />
        <div className="d-grid gap-2 d-md-block">
          <Button className="m-2" variant="dark" size="lg" onClick={increment}>
            Increase Count
          </Button>
          <Button
            className="m-2"
            variant="outline-dark"
            disabled={count < 1}
            size="lg"
            onClick={decrement}
          >
            Decrease Count
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Counter;
