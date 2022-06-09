# About

CloseSea, the smallest NFT marketplace.

Play with the demo at https://closesea-one.vercel.app/, which uses the contract deployed on [Rinkeby](https://rinkeby.etherscan.io/address/0xf8b580081eC9b00d6A43e29747BE3D19898a1961) - you need to connect your wallet, switch to Rinkeby network, and use test Rinkeby eth to list and trade.

The listed/minted NFTs can be seen at https://testnets.opensea.io/collection/closesea-collection

Check the [Code Repo](https://github.com/harrywang/closesea)

This demo is developed based on [How to Build a Full Stack NFT Marketplace](https://dev.to/edge-and-node/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb).

The followings are used in this project:

- Solidity
- Hardhat
- Alchemy
- Mumbai/Polygon
- OpenZeppelin
- Ethers.js
- Next.js
- TailwindCSS

Key points:

Frontend `/pages/create-nft.js` does the following:
- the image file to IPFS, 
- generate the metadata (name, description, image file IPFS path, hardcoded traits) json file
- upload the metadata json file to IPFS and generate the metadata URL
- return the url

Contract (`createToken` function in `contracts/CloseSea.sol`) does the following:

- get the metadata URL
- increase the token id by 1 `_tokenIds.increment();`
- mint the NFT/Token `uint256 newTokenId = _tokenIds.current(); _mint(msg.sender, newTokenId);`
- set the TokenURI to the metadata IPFS URL `_setTokenURI(newTokenId, tokenURI);`


OpenSea related:

- contract is at https://rinkeby.etherscan.io/address/0xc0d76419fdc4b8dFfcDF9Ae5b82967de89ff3D8F
- the listing fee 0.025 is paid to the contract address, which can be transferred by the contract owner
- `constructor() ERC721("CloseSea Collection", "CSC")` defines the Collection name shown on Opensea: https://testnets.opensea.io/collection/closesea-collection, use the same name and deploy again - V2, V3 will be added by OpenSea
- it may take a while for the minted NFT to fully show on OpenSea. If the image won't show, click the Refresh Metadata button. You can use https://testnets-api.opensea.io/asset/{contract address}/{token id}/validate/ to validate the metadata for OpenSea, 200 means OK
- text traits rarity (percentage) is calculated based on (the number of NFT having this trait)/(the total NFTs in this collection)
- number traits is presented as the current NFT's value out of the largest value of all NFTs

The following shows the traits are all 100% when only one NFT is minted:

<img width="540" src="https://user-images.githubusercontent.com/595772/172514918-52b0278f-825d-4bd2-bf2b-76744edbc9eb.png">

Then the second NFT is minted, the percentage changed: 

<img width="544" src="https://user-images.githubusercontent.com/595772/172515715-e404becb-cbc4-495d-b706-1d63414f9d0f.png">


## Local Setup

```
git clone https://github.com/harrywang/closesea.git
cd closesea

npm install next react react-dom ethers hardhat @nomiclabs/hardhat-waffle \
ethereum-waffle chai @nomiclabs/hardhat-ethers \
web3modal ipfs-http-client \
axios @walletconnect/web3-provider @openzeppelin/contracts \
tailwindcss@latest postcss@latest autoprefixer@latest dotenv

npm install @nomiclabs/hardhat-etherscan --save-dev

npm install hardhat-gas-reporter --save-dev

```

You can run the tests in `/test/test.js` as follows:

```
npx hardhat test
```

## Environment Variables

Create `.env` file in the root folder with the following environment variables - MAKE SURE to gitignore this file. 

Note: you have to use `NEXT_PUBLIC_` prefix if you want to expose the environment variables to the browser: see [docs](https://nextjs.org/docs/basic-features/environment-variables).

```
# private key for deploying the contract
PRIVATE_KEY='xxxxcaf3'

# API Key for verifying contract on PolygonScan.com
POLYGONSCAN_API_KEY='xxxx1D5K'

# API Key for estimate gas using CoinMarketCap
CMC_API_KEY='55578fe5-bf03xxxx'

# local | mumbai | polygon | rinkeby | ethereum 
NEXT_PUBLIC_ENVIRONMENT='rinkeby'
NEXT_PUBLIC_ALCHEMY_URL_MUMBAI='https://polygon-mumbai.g.alchemy.com/v2/p0Cxxxx'
NEXT_PUBLIC_ALCHEMY_URL_POLYGON='https://polygon-mainnet.g.alchemy.com/v2/ixxxx'
NEXT_PUBLIC_ALCHEMY_URL_RINKEBY='https://eth-rinkeby.alchemyapi.io/v2/Iwj1xxxxx'
NEXT_PUBLIC_ALCHEMY_URL_ETHEREUM='https://eth-mainnet.alchemyapi.io/v2/2Y8xxxxx'
```

## Test on Local Testnet


Start a local test node (record the first account and the private key):

```
npx hardhat node
```

For local deployment, change the following in `.env`:

- use the first local account's private key above in `.env` 
- change to `NEXT_PUBLIC_ENVIRONMENT='local'`

```
npx hardhat run scripts/deploy.js --network local
npm run dev
```

Setup the test account in MetaMask and switch to local network.

Visit http://localhost:3000 to try.

## Test on Rinkeby

Deploy the contract on the rinkeby testnet. change the following in `.env`:

- use the deployment account's private key in `.env` 
- change to `NEXT_PUBLIC_ENVIRONMENT='rinkeby'`


```
npx hardhat run scripts/deploy.js --network rinkeby

CloseSea deployed to: 0xF7993dDad8d1D06d31xxx

```
change teh RPC provider to rinkeby in `/pages/index.js`

```
const provider = new ethers.providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/Iwj1GhXx-MAyhOcGPkgXIcV5toMhfBIB")
```

Start the server:

```
npm run dev
```

Setup the test account in MetaMask and switch to Rinkeby network.

Visit http://localhost:3000 to try.


## Ethereum

Deploy on Ethereum mainnet: change `NEXT_PUBLIC_ENVIRONMENT='ethereum'` and use some real ether:

```
npx hardhat run scripts/deploy.js --network ethereum
```

## App Deployment

I have to remove `.eslintrc.json` to pass `npm run build`.

App is deployed using https://vercel.com/ with the following settings:

<img width="779" src="https://user-images.githubusercontent.com/595772/161360129-aa51bd43-73f4-49d1-bef8-a649397dcbf2.png">
<img width="778" src="https://user-images.githubusercontent.com/595772/161360131-244249c5-75f4-4c22-ac3d-ef0001322bdf.png">

## Contract Verification

[Related Hardhat Docs](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html)

Install the plugin first:

```
npm install --save-dev @nomiclabs/hardhat-etherscan

```

add the following to `hardhat.config.js`, get the API key from https://polygonscan.com and set the environment variable.

```
require("@nomiclabs/hardhat-etherscan");

...

  etherscan: {
    // Your API key for verifying contract
    // Obtain one at https://polygonscan.com
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
...

```

Then run the following with the DEPLOYED_CONTRACT_ADDRESS and "Constructor argument 1":

```
npx hardhat verify --network polygon 0xa8578e0e64bbf0c27bf8a0dd3211889d34c31faf "weiwei"

...
Nothing to compile
Successfully submitted source code for contract
contracts/WrittenInStone.sol:WrittenInStone at 0xa8578e0e64bbf0c27bf8a0dd3211889d34c31faf
for verification on the block explorer. Waiting for verification result...

Successfully verified contract WrittenInStone on Etherscan.
https://polygonscan.com/address/0xa8578e0e64bbf0c27bf8a0dd3211889d34c31faf#code

```

Visit https://polygonscan.com/address/0xa8578e0e64bbf0c27bf8a0dd3211889d34c31faf#code to see the check mark:

<img width="605" src="https://user-images.githubusercontent.com/595772/162581606-780a94e9-b70f-4411-a3ba-a67390429fe2.png">


## Gas Estimation

Install the plugin:

```
npm install hardhat-gas-reporter --save-dev
```
Get a free API key from https://coinmarketcap.com/api/pricing/:

<img width="2552" src="https://user-images.githubusercontent.com/595772/165367163-5dd98362-c35a-4ea2-8bbd-873038ec87ae.png">

Add the API key in `.env` file:

```
# API Key for estimate gas using CoinMarketCap
CMC_API_KEY='55578fxxxx'
```

Add the following to `hardhat.config.js`:

```
require("hardhat-gas-reporter");
...

module.exports = {
  ...
  gasReporter: {
    currency: 'USD',
    token: 'ETH',
    //token: 'MATIC',
    gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
    //gasPriceApi: 'https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice',
    coinmarketcap: process.env.CMC_API_KEY,
  },
  ...
}

```

run: `npx hardhat test` to see the result - this also runs other hardhat tests. 

Note that the gas price (such as `69 gwei/gas` and `64 gwei/gas` below) is the price when you run the test and the following shows the different gas estimations (I paid $175 while the estimated gas fees are $140 and $130):

<img width="770" src="https://user-images.githubusercontent.com/595772/165368872-af422981-d999-4de0-831e-9093cca37257.png">

--

<img width="760" src="https://user-images.githubusercontent.com/595772/165368882-e7cab064-b9ae-4591-9124-c29075bd5324.png">

The default network is Ethereum. To test for other networks, use different `token` and `gasPriceApi` options in `hardhat.config.js`:

| Network            | token | gasPriceApi                                                            |
| ------------------ | ----- | ---------------------------------------------------------------------- |
| Ethereum (default) | ETH   | https://api.etherscan.io/api?module=proxy&action=eth_gasPrice          |
| Binance            | BNB   | https://api.bscscan.com/api?module=proxy&action=eth_gasPrice           |
| Polygon            | MATIC | https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice       |
| Avalanche          | AVAX  | https://api.snowtrace.io/api?module=proxy&action=eth_gasPrice          |
| Heco               | HT    | https://api.hecoinfo.com/api?module=proxy&action=eth_gasPrice          |
| Moonriver          | MOVR  | https://api-moonriver.moonscan.io/api?module=proxy&action=eth_gasPrice |

The following is an example result for Polygon:

<img width="765" src="https://user-images.githubusercontent.com/595772/165370912-92bbdb36-8a6a-44ca-b71a-ac69cbef4fa7.png">

## Documentations

[docsify](https://docsify.js.org) is used and documentations are stored in the `/docs` folder. To view the docs locally, run the following:

```
npm i docsify-cli -g
docsify serve docs
```