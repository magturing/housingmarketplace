import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});

async function main() {

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [deployer] = await ethers.getSigners();
  // const MagturingFactory = await ethers.getContractFactory("Magturing");

  //   const initialSupply = ethers.parseEther("10"); // 10 tokens
  // const magturing = await MagturingFactory.deploy(initialSupply);
  // await magturing.waitForDeployment();

  const Magturing = await ethers.getContractFactory("Magturing");
  const magturing = await Magturing.attach(contractAddress);

  const totalSupply = await magturing.totalSupply();
  console.log("Total Supply:", totalSupply.toString());

  const balance = await magturing.balanceOf(deployer.address);
  console.log("Deployer Balance:", balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
