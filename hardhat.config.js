require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    besu: {
      url: "http://localhost:8545", // Substitua pela URL do seu endpoint RPC
      accounts: { mnemonic: "teste" }
    }
  },
  solidity: "0.8.18",
};
