var lendingBorrowing = artifacts.require("./lendingBorrowing.sol");

module.exports = function(deployer) {
  deployer.deploy(lendingBorrowing, {gas: 7000000});
};
