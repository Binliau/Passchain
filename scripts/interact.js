const hre = require("hardhat");

async function main() {
  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Ganti dengan alamat kontrak kamu
  const PassChain = await hre.ethers.getContractFactory("PassChain");
  const passChain = await PassChain.attach(contractAddress);

  // Menyimpan credential
  await passChain.addCredential("gmail", "rahasia123");

  // Mengambil semua credential milik akun ini
  const credentials = await passChain.getCredentials();

  // Format output agar lebih rapi
  credentials.forEach((cred, i) => {
    console.log(`Credential #${i + 1}:`);
    console.log(`  Site: ${cred.site}`);
    console.log(`  Password: ${cred.encryptedPassword}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});