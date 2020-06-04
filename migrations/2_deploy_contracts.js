var Land = artifacts.require("./LandRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(Land);
};
