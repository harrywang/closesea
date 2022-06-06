const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const CloseSea = await hre.ethers.getContractFactory("CloseSea");
  const closesea = await CloseSea.deploy();
  await closesea.deployed();
  console.log("CloseSea deployed to:", closesea.address);

  fs.writeFileSync('./config.js', `
  export const marketplaceAddress = "${closesea.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });