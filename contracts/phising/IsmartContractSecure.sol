// SPDX-License-Identifier : MIT
pragma solidity ^0.8.28;

contract ISmartContractSecure {
    address public owner;

    constructor() payable {
        owner = msg.sender;
    }

    function transfer(address _to,uint _amount) public {
        require(owner == msg.sender, "caller is not owner");
        (bool success,) =  _to.call{value:_amount}("");
        require(success,"Transaction failed"); 
    }
}