const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      gas: 7000000,
      network_id: "*" // Match any network id
    },
    solc: {
      optimizer: {
          enabled: true,
          runs: 200
      }
  }
  },
};
