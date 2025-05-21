const hre = require("hardhat");

async function main() {
  const PassChain = await hre.ethers.getContractFactory("PassChain");
  const passChain = await PassChain.deploy();

  await passChain.waitForDeployment();

  // Cek apakah target atau address yang digunakan
  const deployedAddress = passChain.target || passChain.address;

  console.log(`PassChain deployed to: ${deployedAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
