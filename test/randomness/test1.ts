import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Attacking Game (randomness vulnerability)", function () {

  let deployer: any, attacker: any;
  const GAME_POT = ethers.parseEther("10");

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address);

    const gameFactory = await ethers.getContractFactory("Game", deployer);
    this.game = await gameFactory.deploy({ value: GAME_POT });
    await this.game.waitForDeployment();

    const inGame = await ethers.provider.getBalance(this.game.target);
    expect(inGame).to.equal(GAME_POT);
  });

  it("Exploiting the game", async function () {
    const attackerGameFactory = await ethers.getContractFactory("AttackGame", attacker);
    this.attackerContract = await attackerGameFactory.deploy(this.game.target);
    await this.attackerContract.waitForDeployment();

    await this.attackerContract.attack();
  });

  after(async function () {
    expect(await ethers.provider.getBalance(this.game.target)).to.equal(0);

    expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(
      this.attackerInitialBalance + GAME_POT - ethers.parseEther("0.2")
    );
  });
});