import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Attacking Game 2 (randomness vulnerability)", function () {

  let deployer: any, attacker: any;
  const GAME_POT = ethers.parseEther("20");
  const ATTACK_FEE = ethers.parseEther("1");

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address);

    const gameFactory = await ethers.getContractFactory("Game2", deployer);
    this.game = await gameFactory.deploy({ value: GAME_POT });
    await this.game.waitForDeployment();

    const iniGame = await ethers.provider.getBalance(this.game.target); 
    expect(iniGame).to.equal(GAME_POT);

  });

  it("Exploiting the game", async function () {
    const attackerGameFactory = await ethers.getContractFactory("AttackGame2", attacker);
    this.attackerContract = await attackerGameFactory.deploy(await this.game.getAddress());
    await this.attackerContract.waitForDeployment();

    for (let i = 0; i < 5; i++) {
      await (await this.attackerContract.attack({ value: ATTACK_FEE })).wait();
    }

  });

  after(async function () {

    expect(await ethers.provider.getBalance(this.game.target)).to.equal(0);
    expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(
      this.attackerInitialBalance + GAME_POT - ethers.parseEther("0.2")
    );
    
  });
});