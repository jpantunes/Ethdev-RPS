pragma solidity ^0.4.13;

import "./StickerToken.sol";

contract RockPaperScissor {
    address public owner;
    address public stikerAddr;

    struct PlayerStruct {
        bytes32 encryptedSequence;
        address charityAddr;
        uint256 donation;
    }

    mapping(address => PlayerStruct) player;

    struct GameStruct {
        address player;
        bytes32[] sequence;
    }

    GameStruct[] public games;

    struct CharityStruct {
        bytes32 name;
        uint256 balance;
    }

    mapping(address => CharityStruct) charity;

    event LogDonation(address indexed _donor, uint256 _amount);

    event LogNewCharity(address indexed _charityAddr, bytes32 _charityName);

    event LogWinningCharity(
            address indexed _charityAddr,
            bytes32 _charityName,
            uint256 _donationAmount);

    modifier onlyOwner() {require(msg.sender == owner); _;}

    modifier onlyPlayer(address _playerAddr) {
        require(player[_playerAddr].encryptedSequence != 0x00);
        _;
    }

    modifier onlyCharity(address _charityAddr) {
        require(charity[_charityAddr].name != 0x00);
        _;
    }

    function () public {

    }

    function RockPaperScissor() public {
        owner = msg.sender;
    }

    // "Test Charity", "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c"
    function addCharity(bytes32 _name, address _wallet)
        public
        onlyOwner
        returns(bool)
    {
        charity[_wallet].name = _name;

        LogNewCharity(_wallet, _name);

        return true;
    }

    // P1, P2 = account0, account4
    // P1 = "0x6009a4a4ed0f20a8c8114abe1c6b0daadb54335a0c1c9d4ddd14ee4cc404e6a2", "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c"
    // P2 = "0x2f9e3e2deacd6a62476944e482cbde4423338ef8d2f1e9ac67b18b1f6d0b4323", "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c" (ties)
    // P2 = "0x04871a799540604ffd45c18b21f9c89c3de0328ced3a804392214ff5461909c1", "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c" (loses)
    function setupGame(bytes32 _encryptedSequence, address _charityAddr)
        public
        payable
        returns(bool)
    {
        require(msg.value >= 0.01 * 1 ether);
        require(player[msg.sender].encryptedSequence == 0x00);
        require(_charityAddr != 0x00);
        require(charity[_charityAddr].name != 0x00); //checks if charity exists on contract

        player[msg.sender].encryptedSequence = _encryptedSequence;
        player[msg.sender].charityAddr = _charityAddr;
        player[msg.sender].donation = msg.value;

        LogDonation(msg.sender, msg.value);

        return true;

    }

    // P1 = ["Rock", "Paper", "Scissor", "Rock", "Rock"], "secretPass"
    // P2 = ["Rock", "Paper", "Paper", "Rock", "Paper"], "secretPass" //(ties)
    // P2 = ["Paper", "Paper", "Paper", "Rock", "Scissor"], "secretPass" //(loses)
    function playGame(bytes32[] _sequence, bytes32 _secret)
        public
        onlyPlayer(msg.sender)
        returns(bool)
    {
        require(keccak256(msg.sender, _sequence, _secret) == player[msg.sender].encryptedSequence);
        require(_sequence.length == 5);

        GameStruct memory newGame;
        newGame.player = msg.sender;
        newGame.sequence = _sequence;
        games.push(newGame);

        if (games.length % 2 == 0) {
            var (winningCharity, gameDonation) = scoreGame(games.length);

            charity[winningCharity].balance += gameDonation;

            StickerToken token = StickerToken(stikerAddr);
            if (!token.awardSticker.gas(120000)(msg.sender, player[msg.sender].encryptedSequence)) {
                revert();
            }

            LogWinningCharity(
                winningCharity,
                charity[winningCharity].name,
                gameDonation
            );
        }

        player[msg.sender].encryptedSequence = 0x00; //zeroes the donation per sequence

        return true;
    }

    function withdraw()
        external
        onlyCharity(msg.sender)
        returns (bool)
    {
        uint256 charityBalance = charity[msg.sender].balance;
        charity[msg.sender].balance = 0;

        msg.sender.transfer(charityBalance);

        return true;
    }

    function newStickerAddr()
        external
        onlyOwner
        returns(bool)
    {
        stikerAddr = new StickerToken();
        return true;
    }

    function getCharityName(address _charityAddr)
        external
        constant
        returns(bytes32)
    {
        return charity[_charityAddr].name;
    }

    function getCharityBalance(address _charityAddr)
        external
        constant
        returns(uint256)
    {
        return charity[_charityAddr].balance;
    }

    function scoreGame(uint256 _playNumber)
        private
        constant
        returns(address winningCharity, uint256 gameDonation)
    {
        //effectively this is should only be callable by player2
        bytes32[] memory playerOne = games[_playNumber - 2].sequence;
        bytes32[] memory playerTwo = games[_playNumber - 1].sequence;
        address playerOneAddr = games[_playNumber - 2].player;
        address playerTwoAddr = games[_playNumber - 1].player;
        uint8 playerOneScore;
        uint8 playerTwoScore;

        gameDonation = player[playerOneAddr].donation + player[playerTwoAddr].donation;

        for (uint8 i = 0; i < playerOne.length; i ++) {
            if (playerOne[i] == playerTwo[i]) {
                i ++;
            } else if (playerOne[i] == "Rock" && playerTwo[i] == "Scissor") {
                playerOneScore ++;
            } else if (playerOne[i] == "Rock" && playerTwo[i] == "Paper") {
                playerTwoScore ++;
            } else if (playerOne[i] == "Paper" && playerTwo[i] == "Rock") {
                playerOneScore ++;
            } else if (playerOne[i] == "Paper" && playerTwo[i] == "Scissor") {
                playerTwoScore ++;
            } else if (playerOne[i] == "Scissor" && playerTwo[i] == "Paper") {
                playerOneScore ++;
            } else if (playerOne[i] == "Scissor" && playerTwo[i] == "Rock") {
                playerTwoScore ++;
            }
        }

        if (playerOneScore > playerTwoScore) {
            return (player[playerOneAddr].charityAddr, gameDonation);
        } else {
            //if there is a tie, player two wins because its tx cost more :-)
            return (player[playerTwoAddr].charityAddr, gameDonation);
        }
    }

    // function testSecret(bytes32[] _sequence, bytes32 _secret)
    //     constant
    //     public
    //     returns (bytes32)
    // {
    //     return keccak256(msg.sender, _sequence, _secret);
    // }

}
