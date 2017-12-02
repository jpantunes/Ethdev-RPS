pragma solidity ^0.4.17;

contract RockPaperScissor {
    address owner;

    mapping(bytes32 => address) charityAddr;

    event LogWinnerDonation(uint256 _amount, bytes32 _charityName);

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
        charityAddr[_name] = _wallet;
        return true;
    }

    function playGame(bytes32[] _plays)
        public
        payable
        returns(address )
    {
        require(msg.value >= 0.01 * 1 ether);
        //input == 5 plays + 1 charity + 1  ethAmount
        //take input from player 1
        //take input from player 2 and scoreGame
        //add both amounts to winning charity balance
        //print LogWinnerDonation event

        //mathing players logic
        //if first (odd) player then set up game
        //if second (event) player then score etc.
        //check if charities are different?
    }

    function scoreGame(bytes32[] _playerOne, bytes32[] _playerTwo)
        private
        constant
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
