import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Phising attack",function(){

    let fundmanager:any, attacker:any;
    const FUND_DEPOSIT = ethers.parseEther("2000");
    const CHARITY_DONATION = ethers.parseEther("0.1");

    before(async function(){

        [fundmanager,attacker] = await ethers.getSigners();
        this.attackercontract = null;

        this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address);
        const simpleSmartWalletFactory = await ethers.getContractFactory("ISmartContractSecure",fundmanager);
        this.wallet = await simpleSmartWalletFactory.deploy({value:FUND_DEPOSIT});
        await this.wallet.waitForDeployment();

        let smartContractBalance = await ethers.provider.getBalance(this.wallet.target);
        expect(smartContractBalance).to.equal(FUND_DEPOSIT);
    });

    it("Exploit",async function(){
        const maliciousContractFactory = await ethers.getContractFactory("PhisingAttack",attacker);
        this.attackerContract = await maliciousContractFactory.deploy(this.wallet.target);
        await this.attackerContract.waitForDeployment();
    });

    after(async function(){

        await fundmanager.sendTransaction({
            to: this.attackerContract.target,
            value: CHARITY_DONATION
        });

        let walletBalance = await ethers.provider.getBalance(this.wallet.target);
        expect(walletBalance).to.equal(0);

        expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(this.attackerInitialBalance + FUND_DEPOSIT - ethers.parseEther("0.2"));
    })
});