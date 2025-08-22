import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();


describe("MagToken",function(){
    let mgToken:any,owner:any,user1:any,user2:any,user3:any;

    before(async function(){
        [owner,user1,user2,user3] = await ethers.getSigners();

        const mgTokenFactory = await ethers.getContractFactory("Magturing");
        mgToken = await mgTokenFactory.deploy(ethers.parseUnits("100000",18));

        await mgToken.waitForDeployment();
    });

    it("Getting Tokens name and symbol",async function(){
        const tokenName = await mgToken.name();
        const tokenSymbol = await mgToken.symbol();

        expect(await mgToken.name()).to.equal(tokenName);
        expect(await mgToken.symbol()).to.equal(tokenSymbol);
    });

    it("100000 Tokens minted to owner's address", async function(){
        const ownerTokenBalance = await mgToken.balanceOf(owner.address);

        expect(await mgToken.balanceOf(owner.address)).to.equal(ownerTokenBalance);
    });

    it("Minting 5k token to each user",async function(){
        const balance1 = await mgToken.mint(user1.address,ethers.parseUnits("5000",18));
        const balance2 = await mgToken.mint(user2.address,ethers.parseUnits("5000",18));
        const balance3 = await mgToken.mint(user3.address,ethers.parseUnits("5000",18));

        expect(await mgToken.balanceOf(user1.address)).to.equal(ethers.parseUnits("5000",18));
        expect(await mgToken.balanceOf(user2.address)).to.equal(ethers.parseUnits("5000",18));
        expect(await mgToken.balanceOf(user3.address)).to.equal(ethers.parseUnits("5000",18));
    });

    it("Every one has right amount of tokens",async function(){
        expect(await mgToken.balanceOf(owner.address)).to.equal(ethers.parseUnits("100000",18));
        expect(await mgToken.balanceOf(user1.address)).to.equal(ethers.parseUnits("5000",18));
        expect(await mgToken.balanceOf(user2.address)).to.equal(ethers.parseUnits("5000",18));
        expect(await mgToken.balanceOf(user3.address)).to.equal(ethers.parseUnits("5000",18));
    });

    it("Transfer 100 tokens from user2 to user3",async function(){
        await mgToken.connect(user2).transfer(user3.address,ethers.parseUnits("100",18));
        expect(await mgToken.balanceOf(user2.address)).to.equal(ethers.parseUnits("4900",18));
        expect(await mgToken.balanceOf(user3.address)).to.equal(ethers.parseUnits("5100",18));
    });

    it("Approve 1k tokens from user3 to user1",async function(){
        await mgToken.connect(user3).approve(user1.address,ethers.parseUnits("1000",18));
        expect(await mgToken.allowance(user3.address,user1.address)).to.equal(ethers.parseUnits("1000",18));
    });

    it("user1 transfers 1k tokens from user3 to user2 on behalf of user3",async function(){
        await mgToken.connect(user1).transferFrom(user3.address,user2.address,ethers.parseUnits("1000",18));
        expect(await mgToken.balanceOf(user1.address)).to.equal(ethers.parseUnits("5000",18));
        expect(await mgToken.balanceOf(user2.address)).to.equal(ethers.parseUnits("5900",18));
        expect(await mgToken.balanceOf(user3.address)).to.equal(ethers.parseUnits("4100",18));
    });

});