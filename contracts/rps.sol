pragma solidity ^0.4.17;

contract RockPaperScissor {
    address owner;
    bytes32[] playerOneSequence;
    address playerOneCharity;

    struct charityStruct {
        bytes32 name;
        uint256 balance;
    }

    mapping(address => charityStruct) charity;

    event LogWinnerDonation(address indexed _charityAddr, bytes32 _charityName, uint256 _charityBalance);

    modifier onlyOwner() {require(msg.sender == owner); _;}

    function () public {

    }

    function RockPaperScissor() public {
        owner = msg.sender;
    }

    function addCharity(bytes32 _name, address _wallet)
        public
        onlyOwner
        returns(bool)
    {
        charity[_wallet].name = _name;
        return true;
    }

    // P1 = ["Rock", "Paper", "Scissor", "Rock", "Rock"], "0xdd870fa1b7c4700f2bd7f44238821c26f7392148"
    // P2 = ["Rock", "Paper", "Paper", "Rock", "Paper"], "0x583031d1113ad414f02576bd6afabfb302140225" (ties)
    // P2 = ["Paper", "Paper", "Paper", "Rock", "Scissor"], "0x583031d1113ad414f02576bd6afabfb302140225" (loses)
    function playGame(bytes32[] _sequence, address _charityAddr)
        public
        payable
        returns(bool)
    {
        require(msg.value >= 0.01 * 1 ether);
        require(_charityAddr != 0x00);

        if (playerOneSequence.length == 0) {
            playerOneSequence = _sequence;
            playerOneCharity = _charityAddr;
        } else {
            var (p1Score,p2Score) = scoreGame(playerOneSequence, _sequence);
            if (p1Score > p2Score) {
                charity[playerOneCharity].balance += this.balance;
                LogWinnerDonation(playerOneCharity, charity[playerOneCharity].name, charity[playerOneCharity].balance);
            } else {
                charity[_charityAddr].balance += this.balance;
                LogWinnerDonation(_charityAddr, charity[_charityAddr].name, charity[_charityAddr].balance);
            }
        }

        return true;
    }

    function scoreGame(bytes32[] _playerOne, bytes32[] _playerTwo)
        private
        pure
        returns(uint8 playerOneScore, uint8 playerTwoScore)
    {
        require(_playerOne.length == _playerTwo.length);

        for (uint8 i = 0; i < _playerOne.length; i ++) {
            if (_playerOne[i] == _playerOne[i]) {
                i ++;
            } else if (_playerOne[i] == "Rock" && _playerTwo[i] == "Scissor") {
                playerOneScore ++;
            } else if (_playerOne[i] == "Rock" && _playerTwo[i] == "Paper") {
                playerTwoScore ++;
            } else if (_playerOne[i] == "Paper" && _playerTwo[i] == "Rock") {
                playerOneScore ++;
            } else if (_playerOne[i] == "Paper" && _playerTwo[i] == "Scissor") {
                playerTwoScore ++;
            } else if (_playerOne[i] == "Scissor" && _playerTwo[i] == "Paper") {
                playerOneScore ++;
            } else if (_playerOne[i] == "Scissor" && _playerTwo[i] == "Rock") {
                playerTwoScore ++;
            }
        }

        return (playerOneScore, playerTwoScore);
    }

}
