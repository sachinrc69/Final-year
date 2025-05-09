module.exports = {
  contracts_build_directory: "../client/src/contracts",
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
  },

  mocha: {},

  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
