const RockPaperScissor = artifacts.require("./RockPaperScissor.sol");
const StickerToken = artifacts.require("./StickerToken.sol");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

contract('RockPaperScissor', function(accounts) {
  let player1 = accounts[ 1 ];
  let player2 = accounts[ 2 ];
  let charity = accounts[ 3 ];
  let rpsContract;

  it ("should be possible to deploy RockPaperScissor", async function() {
      rpsContract = await RockPaperScissor.new({ from: accounts[ 0 ], gas: 3000000 });

      let owner = await rpsContract.owner.call();
      assert.strictEqual(owner, accounts[0]);
  });

  it ("should be possible to deploy StickerToken from RockPaperScissor", async function() {
      let stickerToken = await rpsContract.newStickerAddr();
      let stickerAddr = await rpsContract.stikerAddr.call();
      assert.notEqual(stickerAddr, 0, "the stickerToken contract was not deployed correclty ");
  });

  it ("should be possible for the contract owner to add a new charity", async function() {
      await rpsContract.addCharity(
              charity,
              "Test Charity",
              "Test Description",
              "Test URL",
              { from: accounts[ 0 ], gas: 3000000 })
      .then(txObject => {
        const eventArgs = txObject.logs[ 0 ].args;
        assert.strictEqual(eventArgs._charityAddr, charity, "new charity address was not logged or incorrect");
      })
  });

  it ("should not be possible to add a new charity if not contract owner", async function() {
      try {
        await rpsContract.addCharity(
                charity,
                "Test Charity",
                "Test Description",
                "Test URL",
                { from: player1, gas: 3000000 })
        .then(function(result) {
          assert.strictEqual(result, true, "New charity was created when it shouldn't have");
        })
      } catch (err) {
        return true;
      }
      throw new Error("I should never see this!");
  });

  it ("should be possible to commit a sequence for player 1", async function() {
      let preHash = await rpsContract.preHashTest(
                              player1,
                              ["Rock", "Paper", "Scissor", "Rock", "Rock"],
                              "secretPass",
                              { from: player1, gas: 3000000 })

      await rpsContract.setupGame(
                          preHash,
                          charity,
                          { from: player1, value: web3.utils.toWei('1', 'ether'), gas: 3000000 } )
      .then(txObject => {
        const eventArgs = txObject.logs[ 0 ].args;
        assert.strictEqual(eventArgs._donor, player1, "sequence was not logger correctly for player 1");
      })
  });
//done from here up
  it ("should be possible to commit a sequence for player 2", async function() {
    let preHash = await rpsContract.preHashTest(
                                      player2,
                                      ["Paper", "Paper", "Paper", "Rock", "Scissor"],
                                      "secretPass",
                                      { from: player2, gas: 3000000 })
    await rpsContract.setupGame(
                        preHash,
                        charity,
                        { from: player2, value: web3.utils.toWei('1', 'ether'), gas: 3000000 })
    .then(txObject => {
      const eventArgs = txObject.logs[ 0 ].args;
      assert.strictEqual(eventArgs._donor, player2, "sequence was not logger correctly for player 2");
    })
  });

  it ("should not be possible to reveal a commited a sequence for another player", async function() {
      try {
        await rpsContract.playGame(
                            ["Paper", "Paper", "Paper", "Rock", "Scissor"],
                            "secretPass", { from: player1, gas: 3000000 })
        .then(function(result) {
          assert.strictEqual(result, true, "Reveal was successfull when it shouldn't have");
        })
      } catch (err) {
        return true;
      }
      throw new Error("I should never see this!");
  });

  it ("should be possible to reveal a previously commited a sequence for the same player", async function() {
      await rpsContract.playGame(
                          ["Rock", "Paper", "Scissor", "Rock", "Rock"],
                          "secretPass",
                          { from: player1, gas: 3000000 })
      .then(function(result) {
        assert.strictEqual(result, true, "Reveal was not successfull for player 1");
    })
  });

  it ("should be possible to score a game after second player reveals sequence", async function() {
      await rpsContract.playGame(
                          ["Paper", "Paper", "Paper", "Rock", "Scissor"],
                          "secretPass",
                          { from: player2, gas: 3000000 })
      .then(txObject => {
        const eventArgs = txObject.logs[ 0 ].args;
        assert.strictEqual(eventArgs._winningCharity, charity, "Winner was not logged means game was not scored");
      })
  });

  it ("should not be possible for an unregistered charity to withdraw funds form contract", async function() {
      try {
        await rpsContract.withdraw({ from: accounts[ 0 ], gas: 3000000 })
        .then(function(result) {
          assert.strictEqual(result, true, "Withdrawal was successful when it shouldn't have");
        })
      } catch (err) {
        return true;
      }
      throw new Error("I should never see this!");

  });

  it ("should be possible for a winning charity to withdraw funds form contract", async function() {
      await rpsContract.withdraw({ from: charity, gas: 3000000 })
      .then(function(result) {
        assert.strictEqual(result, true, "withdrawal was not successful for chairty");
      })
  });

});
