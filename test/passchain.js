const { expect } = require("chai");

describe("PassChain", function () {
  it("Should store and retrieve credentials", async function () {
    const PassChain = await ethers.getContractFactory("PassChain");
    const passChain = await PassChain.deploy();
    await passChain.addCredential("google.com", "encrypted123");

    const credentials = await passChain.getCredentials();
    expect(credentials[0].site).to.equal("google.com");
    expect(credentials[0].encryptedPassword).to.equal("encrypted123");
  });
});
