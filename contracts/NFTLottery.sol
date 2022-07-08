// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTLottery is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    uint256 public lotteryID;
    Counters.Counter private _tokenIdCounter;

    uint256 internal immutable lotteryInterval = 2 * 1 days;
    uint256 internal ticketPrice;
    address public operatorAddress;

    enum State {
        IDLE,
        ACTIVE,
        PAYOUT
    }

    struct LotteryStruct {
        uint256 ID; //Lottery ID
        address payable winner; // Winner address
        uint256 noOfTicketsSold; // Tickets sold
        uint256 winningTicket;
        uint256 amountInLottery;
        uint256 lotteryStartTime;
        uint256 lotteryEndTime;
        mapping(uint256 => address) ticketOwner; //a mapping that maps the ticketsID to their owners
    }

    mapping(uint256 => LotteryStruct) internal lotteries;

    // Governs the contract flow, as the three lotteries are ran parallel to each other.
    State public currentState = State.IDLE;

    //=======================================================================================//

    //Events Section
    event LotteryStarted(
        uint256 lotteryID,
        uint256 lotteryStartTime,
        uint256 lotteryEndTime
    );
    event TicketsPurchase(
        address indexed buyer,
        uint256 indexed lotteryId,
        uint256 numberTicket
    );
    event LotteryNumberGenerated(
        uint256 indexed lotteryId,
        uint256 finalNumber
    );
    event WinnersAwarded(address winner, uint256 amount);

    //=======================================================================================//

    //Lottery Section

    constructor(uint256 _ticketPrice) ERC721("LotteryNFT", "lNFT") {
        ticketPrice = _ticketPrice * 1 ether;
    }

    // Function to set the lottery operator
    function setOperator(address _operatorAddress) external onlyOwner {
        require(_operatorAddress != address(0), "Address must be valid");
        operatorAddress = _operatorAddress;
    }

    // Starts Lottery
    function startLottery() external inState(State.IDLE) onlyOperator {
        lotteryID++;
        uint256 lotteryStartTime = block.timestamp;
        uint256 lotteryEndTime = lotteryStartTime + lotteryInterval;

        currentState = State.ACTIVE;
        // creating Lottery session
        LotteryStruct storage _lottery = lotteries[lotteryID];
        _lottery.ID = lotteryID;
        _lottery.lotteryStartTime = lotteryStartTime;
        _lottery.lotteryEndTime = lotteryEndTime;

        emit LotteryStarted(lotteryID, lotteryStartTime, lotteryEndTime);
    }

    //Function to view lottery
    function viewLottery(uint256 _lotteryID)
        external
        view
        returns (
            uint256 ID,
            address payable winner,
            uint256 noOfTicketsSold,
            uint256 winningTicket,
            uint256 amountInLottery,
            uint256 lotteryStartTime,
            uint256 lotteryEndTime
        )
    {
        LotteryStruct storage _lottery = lotteries[_lotteryID];
        return (
            _lottery.ID,
            _lottery.winner,
            _lottery.noOfTicketsSold,
            _lottery.winningTicket,
            _lottery.amountInLottery,
            _lottery.lotteryStartTime,
            _lottery.lotteryEndTime
        );
    }

    // BuyTicket Functions
    function buyTicket(uint256 _noOfTickets)
        external
        payable
        inState(State.ACTIVE)
    {
        require(
            ticketPrice == (msg.value / _noOfTickets),
            "Insufficient balance"
        );
        assignTickets(_noOfTickets);

        emit TicketsPurchase(msg.sender, lotteryID, _noOfTickets);
    }

    // Assign tickets to their ticket IDS.s
    function assignTickets(uint256 _noOfTickets) internal {
        LotteryStruct storage _lottery = lotteries[lotteryID];
        uint256 oldTotal = _lottery.noOfTicketsSold;
        uint256 newTotal = oldTotal + _noOfTickets;

        for (uint256 n = oldTotal; n < newTotal; n++) {
            _lottery.ticketOwner[n] = msg.sender;
        }
        _lottery.noOfTicketsSold += _noOfTickets;
        _lottery.amountInLottery += (_noOfTickets * ticketPrice);
    }

    function getWinningTickets() external onlyOperator inState(State.ACTIVE) {
        require(
            block.timestamp > lotteries[lotteryID].lotteryEndTime,
            "Lottery has not ended"
        );

        LotteryStruct storage _lottery = lotteries[lotteryID];
        //generate pseudo random number between 0 and noOfTicketsSold
        uint256 winningTicketID = random() % _lottery.noOfTicketsSold;
        _lottery.winningTicket = winningTicketID;

        emit LotteryNumberGenerated(lotteryID, winningTicketID);
    }

    function random() internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        lotteries[lotteryID].noOfTicketsSold
                    )
                )
            );
        // convert hash to integer
    }

    function payoutWinner() external onlyOperator inState(State.PAYOUT) {
        LotteryStruct storage _lottery = lotteries[lotteryID];
        _lottery.winner = payable(_lottery.ticketOwner[_lottery.winningTicket]);

        //Get 50% of rewards and send to winner
        uint256 reward = (_lottery.amountInLottery * 50) / 100;
        (bool sent, ) = payable(_lottery.winner).call{value: reward}("");
        require(sent, "Payout unsuccessful");

        //Mint NFT to winner
        safeMint(_lottery.winner);

        currentState = State.IDLE;

        emit WinnersAwarded(_lottery.winner, reward);
    }

    //=======================================================================================//

    // NFT Section
    // mint an NFT
    function safeMint(address to) internal onlyOperator {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    //    destroy an NFT
    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //=======================================================================================//

    //Modifiers Section
    modifier onlyOperator() {
        require(msg.sender == operatorAddress, "Not Operator");
        _;
    }
    modifier inState(State state) {
        require(state == currentState, "current state does not allow this");
        _;
    }
}
