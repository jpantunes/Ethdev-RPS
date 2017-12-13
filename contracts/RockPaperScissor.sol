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

    event LogReveal(address indexed _playerAddr);

    event LogWithdrawal(address indexed _charityAddr);

    event LogNewCharity(
            address indexed _charityAddr,
            bytes32 _charityName,
            bytes32 _description,
            bytes32 _imageUrl);


    event LogWinningCharity(
           address indexed _charityAddr,
           address indexed _p1addr,
           address indexed _p2addr,
           bytes32[] _p1seq,
           bytes32[] _p2seq,
           uint256 _donationAmount);

    modifier onlyOwner() {require(msg.sender == owner); _;}

    modifier onlyCharity() {require(charity[msg.sender].name != 0x00); _;}

    modifier onlyPlayer() {require(player[msg.sender].encryptedSequence != 0x00); _;}

    function () public {

    }

    function RockPaperScissor() public {
        owner = msg.sender;
    }

    //create a new sticker Token address. must be run once after deployed
    function newStickerAddr()
        external
        onlyOwner
        returns(bool)
    {
        stikerAddr = new StickerToken();
        return true;
    }

    // add a new charity record
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

    // allows registered charities to withdraw donation funds
    function withdraw()
        external
        onlyCharity
        returns(bool)
    {
        uint256 charityBalance = charity[msg.sender].balance;
        charity[msg.sender].balance = 0;

        msg.sender.transfer(charityBalance);

        LogWithdrawal(msg.sender);

        return true;
    }

    // gets the name of a registered charity or 0x00 if non-existant
    function getCharityName(address _charityAddr)
        external
        constant
        returns(bytes32)
    {
        return charity[_charityAddr].name;
    }

    // gets the balance of a registered charity or 0x00 if non-existant
    function getCharityBalance(address _charityAddr)
        external
        constant
        returns(uint256)
    {
        return charity[_charityAddr].balance;
    }

    /*
    commit phase. player submits an encrypted value and the address of the charityAddr
    msg.value must be higher than 0.01 Eth
    player must not have an on-going game
    charity must exist
    */
    function setupGame(bytes32 _encryptedSequence, address _charityAddr)
        public
        payable
        returns(bool)
    {
        require(msg.value >= 0.01 * 1 ether);
        require(player[msg.sender].encryptedSequence == 0x00); //this will stop players from doing 2 commits without revealing first
        require(charity[_charityAddr].name != 0x00);

        player[msg.sender].encryptedSequence = _encryptedSequence;
        player[msg.sender].charityAddr = _charityAddr;
        player[msg.sender].donation = msg.value;

        LogDonation(msg.sender, msg.value);

        return true;

    }

    /*
    reveal phase. player submits sequence and secret
    players address + sequence + secret must match the commited encrypted sequence
    sequence array must have 5 elements
    */
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

            StickerToken token = StickerToken(stikerAddr);
            if (!token.awardSticker.gas(120000)(msg.sender, player[msg.sender].encryptedSequence)) {
                revert();
            }

            charity[winningCharity].balance += gameDonation;

            LogWinningCharity(
                winningCharity,
                game1.player,
                game2.player,
                game1.sequence,
                game2.sequence,
                gameDonation
            );
        } else {
            LogReveal(msg.sender);
        }

        player[msg.sender].encryptedSequence = 0x00; //allows for a new commit from player

        return true;
    }

    // gets players current commit or 0x00 if non-existant
    function getEncryptedSequence()
        external
        constant
        returns(bytes32)
    {
        return player[msg.sender].encryptedSequence;
    }

    /*
    to be used in tests bc issue with web3js
    web3.utils.soliditySha3(['Rock'])
    soliditySha3.js:176 Uncaught Error: Autodetection of array types is not supported.
    */
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

    //internal function to find winner. moved to private constant for gas cost
    function scoreGame(uint256 _playNumber)
        private
        constant
        returns(address winningCharity, uint256 gameDonation, GameStruct g1, GameStruct g2)
    {
        //effectively this function is only callable by player2
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

}
