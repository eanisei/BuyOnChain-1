const Buy = artifacts.require("Buy");

module.exports = function (deployer) {
  deployer.deploy(Buy, 1000000);
};