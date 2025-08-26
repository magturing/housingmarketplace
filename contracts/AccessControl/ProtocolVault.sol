// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

contract ProtocolVault {
    address public owner;

    constructor(){
        owner = msg.sender;
    }

    function withDrawEth() external{
        require(msg.sender == owner,"Not owner");
        this._sendETH(msg.sender);
    }

    function _sendETH(address _to) {
        _to.transfer(address(this).balance);
    }

    function() external payable{}
}