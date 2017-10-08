var Voting = artifacts.require("../contracts/Voting.sol");
module.exports = function (deployer) {
  deployer.deploy(Voting, 100000, web3.toWei('1', 'ether'), ['1', '2', '3', '4', '5']);
};