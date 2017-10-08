var Voting = artifacts.require("./Voting.sol");
module.exports = function (deployer) {
  deployer.deploy(Voting, 1000000, web3.toWei('4', 'ether'), ['We saved money on inauguration thanks to the dam\'s collapse: Nitish Kumar',
    'Mortified Tampax CEO Bursts Into Tears And Runs Out Of Boardroom After Tampon Falls Out Of Briefcase',
    'BJP asks next election be held on Twitter after Congress loses series of Twitter polls',
    'Anti-Nuclear Weapons Organization Awarded Nobel Peace Prize',
    'Why is Google News still running fake news sources like CNN and WaPo while banning REAL news from the new media?'
  ]);
};