var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'stairs lamp animal acoustic donate list magnet pulp denial lawn main ripple';


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!

  
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    /*
    ropsten: {
      /*provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/572747b80e6c4af19084e4912ddcff39")
      },
      host: "localhost",
      port: 8545,
      network_id: 3,
      //gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }*/
    rinkeby: {

      provider: function(){
        return new HDWalletProvider(MNEMONIC,"https://rinkeby.infura.io/v3/cb09ea8652bd4e08b0b63fe27875bf0f");
      },
      network_id: 4
      /*host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0x142be07f5631Ab2a21a34F3287926b26521F049d", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 21000, // Gas limit used for deploys
      gasPrice: 0,
      gasvalue : 0*/
    }
  }
};
