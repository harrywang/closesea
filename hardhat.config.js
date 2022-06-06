/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");

// read environment variables from .env file during development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: process.env.NEXT_PUBLIC_ALCHEMY_URL_RINKEBY,
      accounts: [process.env.PRIVATE_KEY]
    },
    ethereum: {
      url: process.env.NEXT_PUBLIC_ALCHEMY_URL_ETHEREUM,
      accounts: [process.env.PRIVATE_KEY]
    },
    mumbai: {
      url: process.env.NEXT_PUBLIC_ALCHEMY_URL_MUMBAI,
      accounts: [process.env.PRIVATE_KEY]
    },
    polygon: {
      url: process.env.NEXT_PUBLIC_ALCHEMY_URL_POLYGON,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  etherscan: {
    // Your API key for verifying contract
    // Obtain one at https://polygonscan.com
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  gasReporter: {
    currency: 'USD',
    token: 'ETH',
    //token: 'MATIC',
    gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
    //gasPriceApi: 'https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice',
    coinmarketcap: process.env.CMC_API_KEY,
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

