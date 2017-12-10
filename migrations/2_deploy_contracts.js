var RockPaperScissor = artifacts.require("./RockPaperScissor.sol");


module.exports = function(deployer) {
  deployer.deploy(RockPaperScissor);
};
