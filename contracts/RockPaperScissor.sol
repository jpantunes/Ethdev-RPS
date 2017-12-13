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

    mapping(address => PlayerStruct) public player;

    struct GameStruct {
        address player;
        bytes32[] sequence;
    }

    GameStruct[] public games;

    struct CharityStruct {
        bytes32 name;
        bytes32 description;
        bytes32 imageUrl;
        uint256 balance;
    }

    mapping(address => CharityStruct) public charity;

    event LogDonation(address indexed _donor, uint256 _amount);

    event LogNewCharity(
            address indexed _charityAddr,
            bytes32 _charityName,
            bytes32 _description,
            bytes32 _imageUrl);


    event LogWinningCharity(
            bytes32[] _p1seq,
            address _p1addr,
            bytes32[] _p2seq,
            address _p2addr,
            address indexed _charityAddr,
            uint256 _donationAmount);

    modifier onlyOwner() {require(msg.sender == owner); _;}

    modifier onlyCharity() {require(charity[msg.sender].name != 0x00); _;}

    modifier onlyPlayer() {require(player[msg.sender].encryptedSequence != 0x00); _;}

    function () public {

    }

    function RockPaperScissor() public {
        owner = msg.sender;
    }

    function newStickerAddr()
        external
        onlyOwner
        returns(bool)
    {
        stikerAddr = new StickerToken();
        return true;
    }

    // "Test Charity", "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c"
    function addCharity(
        address _wallet,
        bytes32 _name,
        bytes32 _description,
        bytes32 _imageUrl)
        external
        onlyOwner
        returns(bool)
    {
        charity[_wallet].name = _name;
        charity[_wallet].description = _description;
        charity[_wallet].imageUrl = _imageUrl;

        LogNewCharity(
            _wallet,
            _name,
            _description,
            _imageUrl
        );

        return true;
    }

    function withdraw()
        external
        onlyCharity
        returns(bool)
    {
        uint256 charityBalance = charity[msg.sender].balance;
        charity[msg.sender].balance = 0;

        msg.sender.transfer(charityBalance);

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
        require(player[msg.sender].encryptedSequence == 0x00); //this will stop players from doing 2 commits without revealing first
        require(charity[_charityAddr].name != 0x00); //charity must exist on contract

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
        onlyPlayer
        returns(bool)
    {
        require(keccak256(msg.sender, _sequence, _secret) == player[msg.sender].encryptedSequence);
        require(_sequence.length == 5);

        GameStruct memory newGame;
        newGame.player = msg.sender;
        newGame.sequence = _sequence;
        games.push(newGame);

        if (games.length % 2 == 0) {
            var (winningCharity, gameDonation, game1, game2) = scoreGame(games.length);

            /*StickerToken token = StickerToken(stikerAddr);
            if (!token.awardSticker.gas(120000)(msg.sender, player[msg.sender].encryptedSequence)) {
                revert();
            }*/

            charity[winningCharity].balance += gameDonation;

            LogWinningCharity(
                game1.sequence,
                game1.player,
                game2.sequence,
                game2.player,
                winningCharity,
                gameDonation
            );
        }

        player[msg.sender].encryptedSequence = 0x00; //allows for a new commit from player

        return true;
    }

    function scoreGame(uint256 _playNumber)
        private
        constant
        returns(address winningCharity, uint256 gameDonation, GameStruct g1, GameStruct g2)
    {
        //effectively this is should only be callable by player2

        GameStruct memory game2 = games[_playNumber - 2];
        GameStruct memory game1 = games[_playNumber - 1];
        bytes32[] memory playerOne = game2.sequence;
        bytes32[] memory playerTwo = game1.sequence;
        address playerOneAddr = game2.player;
        address playerTwoAddr = game1.player;
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
            return (player[playerOneAddr].charityAddr, gameDonation, game1, game2);
        } else {
            //if there is a tie, player two wins because its tx cost more :-)
            return (player[playerTwoAddr].charityAddr, gameDonation, game1, game2);
        }
    }

    function getEncryptedSequence()
        external
        constant
        returns(bytes32)
    {
        return player[msg.sender].encryptedSequence;
    }

    //to be used in tests bc issue with web3js
    //web3.utils.soliditySha3(['Rock'])
    //soliditySha3.js:176 Uncaught Error: Autodetection of array types is not supported.
    function preHashTest(
        address _playerAddr,
        bytes32[] _sequence,
        bytes32 _secret)
        external
        pure
        returns(bytes32)
     {
        return keccak256(_playerAddr, _sequence, _secret);
     }

}
