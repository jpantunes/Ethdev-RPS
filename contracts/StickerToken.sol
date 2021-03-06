pragma solidity ^0.4.13;


contract StickerToken {
    address public owner;

    struct StickerStruct {
        uint256 creationDate;
        bytes32 stickerDNA;
    }

    StickerStruct[] public stickers;
    mapping(uint => address) public indexAddr;

    modifier onlyOwner() {require(msg.sender == owner); _;}

    event LogNewSticker(address indexed _owner, uint256 _stickerID);

    function() public {

    }

    function StickerToken() public {
        owner = msg.sender;
    }

    function awardSticker(address _winner, bytes32 _stickerDNA)
        public
        onlyOwner
        returns (bool)
    {
        StickerStruct memory _sticker = StickerStruct({
            creationDate : block.timestamp,
            stickerDNA : _stickerDNA
        });

        uint256 stickerId = stickers.push(_sticker) - 1;

        indexAddr[stickerId] = _winner;

        LogNewSticker(_winner, stickerId);
        return true;
    }

}
