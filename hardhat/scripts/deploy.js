const hre = require("hardhat");

async function main() {
    const etherelectContract = await hre.ethers.getContractFactory("etherelect");
    const deployetherElectContract = await etherelectContract.deploy();

    console.log(`The address of the contract: ${deployetherElectContract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// The address of the contract: 0x64288c4483F9056107aa94964977F84e49Bdf218
// https://amoy.polygonscan.com/address/0x64288c4483F9056107aa94964977F84e49Bdf218#code