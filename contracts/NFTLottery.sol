// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTLottery is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    uint256 private lotteryID;
    Counters.Counter private _tokenIdCounter;

    uint256 public lotteryInterval;
    bool public rolloverStatus;
    uint256 internal ticketPrice;
    address internal operatorAddress;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    enum State {
        IDLE,
        ACTIVE,
        PAYOUT
    }

    struct LotteryStruct {
        uint256 ID; //Lottery ID
        address payable winner; // Winner address
        uint256 noOfTicketsSold; // Tickets sold
        uint256 noOfPlayers;
        uint256 winningTicket;
        uint256 amountInLottery;
        uint256 lotteryStartTime;
        uint256 lotteryEndTime;
        mapping(uint256 => address) ticketOwner; //a mapping that maps the ticketsID to their owners
    }

    mapping(uint256 => LotteryStruct) internal lotteries;

    // mapping that shows the amount of tickets each player has per lottery
    mapping(address => mapping(uint256 => uint256))
        internal playerTicketCountPerLotteryID;

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
    event NewOperator(address operatorAddress);
    event WithdrawalComplete(uint256 amount, address operator);
    event NewLotteryInterval(uint256 interval, string timeUnit);

    //=======================================================================================//

    //Lottery Section

    constructor(
        uint256 _ticketPrice,
        uint256 _decimal,
        uint256 _lotteryInterval,
        string memory _timeUnit
    ) ERC721("LotteryNFT", "lNFT") isValidTUnit(_timeUnit) {
        operatorAddress = msg.sender;
        uint256 decimals = 10**_decimal;
        ticketPrice = (_ticketPrice * 1 ether) / decimals;
        uint256 unit = checkUnit(_timeUnit); //checks for the unit
        lotteryInterval = _lotteryInterval * unit;
        _tokenIdCounter.increment(); // increment token ID to align with ticket ID
    }

    function checkUnit(string memory _unit) internal pure returns (uint256) {
        uint256 unit;
        if (keccak256(bytes(_unit)) == keccak256(bytes("seconds"))) {
            unit = 1 seconds;
        } else if (keccak256(bytes(_unit)) == keccak256(bytes("minutes"))) {
            unit = 1 minutes;
        } else if (keccak256(bytes(_unit)) == keccak256(bytes("hours"))) {
            unit = 1 hours;
        } else if (keccak256(bytes(_unit)) == keccak256(bytes("days"))) {
            unit = 1 days;
        } else if (keccak256(bytes(_unit)) == keccak256(bytes("weeks"))) {
            unit = 1 weeks;
        }
        return unit;
    }

    // Function to set the lottery operator
    function setOperator(address _operatorAddress) external onlyOwner {
        require(_operatorAddress != address(0), "Address must be valid");
        operatorAddress = _operatorAddress;
        emit NewOperator(operatorAddress);
    }

    function getOperator() external view returns (address) {
        return operatorAddress;
    }

    function getLotteryID() external view returns (uint256) {
        return lotteryID;
    }

    // Starts Lottery
    function startLottery() external inState(State.IDLE) onlyOperator {
        // if rollover that particular lotteryID session is restarted
        if (!rolloverStatus) {
            lotteryID++;
        }
        uint256 lotteryStartTime = block.timestamp;
        uint256 lotteryEndTime = lotteryStartTime + lotteryInterval;

        currentState = State.ACTIVE;
        // creating Lottery session
        LotteryStruct storage _lottery = lotteries[lotteryID];
        _lottery.ID = lotteryID;
        _lottery.lotteryStartTime = lotteryStartTime;
        _lottery.lotteryEndTime = lotteryEndTime;

        //set rolloverStatus to false;
        rolloverStatus = false;

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
            uint256 noOfPlayers,
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
            _lottery.noOfPlayers,
            _lottery.winningTicket,
            _lottery.amountInLottery,
            _lottery.lotteryStartTime,
            _lottery.lotteryEndTime
        );
    }

    // BuyTicket Functions
    function buyTicket(uint256 _noOfTickets) external inState(State.ACTIVE) {
        require(
            block.timestamp < lotteries[lotteryID].lotteryEndTime,
            "Lottery has already ended!"
        );
        require(
            IERC20(cUsdTokenAddress).transferFrom(
                msg.sender,
                address(this),
                (ticketPrice * _noOfTickets)
            ),
            "Transfer failed."
        );
        //assign user tickets
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
        if (playerTicketCountPerLotteryID[msg.sender][lotteryID] < 1) {
            _lottery.noOfPlayers++;
        }
        playerTicketCountPerLotteryID[msg.sender][lotteryID] += _noOfTickets;
        _lottery.noOfTicketsSold += _noOfTickets;
        _lottery.amountInLottery += (_noOfTickets * ticketPrice);
    }

    //get no of ticket bought
    function getPlayerTicketCount(address _player, uint256 _lotteryID)
        external
        view
        returns (uint256)
    {
        return playerTicketCountPerLotteryID[_player][_lotteryID];
    }

    // get winning ticket of the lottery
    function getWinningTickets() external onlyOperator inState(State.ACTIVE) {
        require(
            block.timestamp > lotteries[lotteryID].lotteryEndTime,
            "Lottery has not ended"
        );

        LotteryStruct storage _lottery = lotteries[lotteryID];

        //check if the no of Tickets bought and no of players are more than 5 and 2 respectively
        if (_lottery.noOfTicketsSold < 5 || _lottery.noOfPlayers < 2) {
            //set rolloverStatus to true and set lotteryState to idle
            rolloverStatus = true;
            currentState = State.IDLE;
            return;
        }

        //generate pseudo random number between 0 and noOfTicketsSold
        uint256 winningTicketID = random() % _lottery.noOfTicketsSold;
        _lottery.winningTicket = winningTicketID;

        currentState = State.PAYOUT;

        emit LotteryNumberGenerated(lotteryID, winningTicketID);
    }

    // generate a random number using lottery's numberOfTicketSold as seed
    function random() internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.number,
                        block.timestamp,
                        lotteries[lotteryID].noOfTicketsSold
                    )
                )
            );
        // convert hash to integer
    }

    // pay lottery winner
    function payoutWinner() external onlyOperator inState(State.PAYOUT) {
        LotteryStruct storage _lottery = lotteries[lotteryID];
        _lottery.winner = payable(_lottery.ticketOwner[_lottery.winningTicket]);
        //Get 50% of rewards and send to winner
        uint256 reward = (_lottery.amountInLottery * 50) / 100;
        require(
            IERC20(cUsdTokenAddress).transfer(_lottery.winner, reward),
            "payout unsuccessful"
        );
        //Mint NFT to winner
        safeMint(_lottery.winner);
        currentState = State.IDLE;
        emit WinnersAwarded(_lottery.winner, reward);
    }

    // check price per ticket
    function checkTicketPrice() public view returns (uint256) {
        return ticketPrice;
    }

    // check total funds locked in
    function checkConractFunds() public view onlyOperator returns (uint256) {
        uint256 balance = IERC20(cUsdTokenAddress).balanceOf(address(this));
        return balance;
    }

    // withdraw total funds left in contract to operator
    function withdrawContractFunds()
        public
        payable
        onlyOperator
        inState(State.IDLE) /* can only withdraw after paying out winner*/
    {
        uint256 balance = IERC20(cUsdTokenAddress).balanceOf(address(this));
        require(
            IERC20(cUsdTokenAddress).transfer(msg.sender, balance),
            "Unable to withdraw funds"
        );
        emit WithdrawalComplete(balance, msg.sender);
    }

    function updateLotteryInterval(
        uint256 _lotteryInterval,
        string memory _timeUnit
    ) external inState(State.IDLE) onlyOperator isValidTUnit(_timeUnit) {
        uint256 unit = checkUnit(_timeUnit);
        lotteryInterval = _lotteryInterval * unit;
        emit NewLotteryInterval(_lotteryInterval, _timeUnit);
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

    modifier isValidTUnit(string memory _unit) {
        bool isValid = false;
        if (keccak256(bytes(_unit)) == keccak256(bytes("seconds"))) {
            isValid = true;
        } else if (keccak256(bytes(_unit)) == keccak256(bytes("minutes"))) {
            isValid = true;
        } else if (keccak256(bytes(_unit)) == keccak256(bytes("hours"))) {
            isValid = true;
        } else if (keccak256(bytes(_unit)) == keccak256(bytes("days"))) {
            isValid = true;
        } else if (keccak256(bytes(_unit)) == keccak256(bytes("weeks"))) {
            isValid = true;
        }
        require(
            isValid,
            "incorrect timeUnit. Please input one of: seconds, minutes, hours, days or weeks."
        );
        _;
    }
}
