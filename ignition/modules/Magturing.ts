import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import hre from "hardhat";
import { ethers } from "ethers";

export default buildModule("Magturing", (m) => {
   
    const initialSupply = ethers.parseUnits("10", 18);
    const  magturing = m.contract("Magturing",[initialSupply]);

    return {magturing};
});