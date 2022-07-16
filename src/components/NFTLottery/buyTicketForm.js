import React, { useState } from "react";
import { Modal, Button, Form, FloatingLabel } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { buyTickets, approve } from "../../utils/NFTLottery";
import { useAsync } from "../../hooks";
import { useIERC20Contract } from "../../hooks";
import { formatBigNumber } from "../../utils";
import BigNumber from "bignumber.js";

const BuyTicketForm = ({ NFTLotteryContract, ticketPrice, open, onClose }) => {
  const { performActions } = useContractKit();
  const [amount, setAmount] = useState(0);
  const [noOfTickets, setTicketNumber] = useState(0);
  const IECR20Contract = useIERC20Contract();
  const handleClose = () => {
    onClose();
  };

  async function _buyTicket() {
    let approved = true;

    try {
      await approve(IECR20Contract, performActions, {
        noOfTickets,
        ticketPrice,
      });
    } catch (error) {
      approved = false;
      console.log({ error });
    }
    if (approved) {
      try {
        //after approval
        await buyTickets(NFTLotteryContract, performActions, { noOfTickets });
      } catch (error) {
        console.log({ error });
      }
    }
  }

  const result = useAsync(_buyTicket, false);

  function onChange(e) {
    const noOfTickets = e.target.value;
    const amounts = ticketPrice * noOfTickets;
    setTicketNumber(noOfTickets);
    setAmount(amounts);
  }

  async function onSubmit() {
    if (result.status === "pending") {
      return;
    }
    result.execute();
    handleClose();
  }

  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Buy TIckets</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Ticket Price: {formatBigNumber(new BigNumber(ticketPrice))} cUSD</p>
        <p>You Pay: {formatBigNumber(new BigNumber(amount))} cUSD</p>
        <Form onSubmit={onSubmit}>
          <FloatingLabel
            controlId="floatingNoOfTickets"
            label="Number Of Tickets"
          >
            <Form.Control
              type="number"
              onChange={(e) => onChange(e)}
              placeholder="Number of Tickets"
            />
          </FloatingLabel>
          <Button variant="success" type="submit">
            Pay Now
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BuyTicketForm;
