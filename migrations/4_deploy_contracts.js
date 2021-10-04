const Buy = artifacts.require("Buy");

module.exports = function (deployer) {
  deployer.deploy(Buy, 1000000);
};

const Stakable = artifacts.require("Stakable");

module.exports = function (deployer) {
  deployer.deploy( Stakable);
};