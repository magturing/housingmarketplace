// SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;

contract Ismart {
    address public owner;

    constructor() payable {
        owner = msg.sender;
    }

    function transfer(address _to,uint _amount) public {
        require(tx.origin == owner, "caller is not owner");
        require(_to != address(0),"Can not send to address 0");

        (bool sent,) = _to.call{value:_amount}("");
        require(sent,"transaction Failed");
    }
}