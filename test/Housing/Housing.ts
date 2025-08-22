import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Housing",function(){
    let housing:any,owner:any,user1:any,user2:any,user3:any,mgToken:any;

    before(async function(){
        [owner,user1,user2,user3] = await ethers.getSigners();

        const housingFactory = await ethers.getContractFactory("Housing");

        const mgTokenFactory = await ethers.getContractFactory("Magturing");

        mgToken = await mgTokenFactory.deploy(ethers.parseUnits("10000000",18));
        housing = await housingFactory.deploy(mgToken.target);

        await housing.waitForDeployment();
        await mgToken.waitForDeployment();
    });

    it("House registered on blockchain  --> TestNet", async function () {
        const location = "Bengaluru India";
        const area = 2000;
        const price = await ethers.parseUnits("500",18);

        await housing.connect(user1).registerHouse(location,area,price);

        const house = await housing.houses(1000);

        expect(house.owner).to.equal(user1.address);
        expect(house.location).to.equal(location);
        expect(house.area).to.equal(area);
        expect(house.registered).to.equal(true);
        expect(house.price).to.equal(price);
    });

    it("Getting house owner details ",async function(){

        const id = 1000;
        const owner = await housing.connect(user1).getOwnerShipDetails(id);

        expect(owner).to.equal(user1.address);
    });

    it("Buying the house", async function () {
        const id = 1000;

        const house = await housing.houses(id);
        const price = house.price;
        const oldOwner = house.owner;

        await mgToken.mint(user2.address, ethers.parseUnits("5000", 18));

        await mgToken.connect(user2).approve(housing.target, price);
        await housing.connect(user2).buyHouse(id);

        const updatedHouse = await housing.houses(id);

        expect(house.owner).to.equal(oldOwner);
        expect(updatedHouse.owner).to.equal(user2.address);
        expect(await mgToken.balanceOf(oldOwner)).to.equal(price);
    });
});
