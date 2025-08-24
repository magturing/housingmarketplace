// SPDX-License-Identifier : MIT
pragma solidity 0.7.0;

contract TimeLock {
    mapping(address => uint) public getBalance;
    mapping(address => uint) public getLockTime;

    constructor(){}

    function depositEth() public payable {
        getBalance[msg.sender] += msg.value;
        getLockTime[msg.sender] += block.timestamp + 30 days;
    }

    function increaseLockTime(uint _secondsToIncrease) public {
        getLockTime[msg.sender] += _secondsToIncrease;
    }

    function withdrawEth() public {
        require(getBalance[msg.sender] > 0);
        require(block.timestamp > getLockTime[msg.sender]);

        uint transferValue = getBalance[msg.sender];
        getBalance[msg.sender] = 0;

        (bool sent,) = msg.sender.call{value:transferValue}("");
        require(sent,"Failed to send ETH");
    }
}