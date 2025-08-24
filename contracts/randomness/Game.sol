// SPDX-License-Identifier : MIT
pragma solidity 0.8.28;

contract Game {
    constructor() payable {}

    function play(uint guess) external {
        uint number = uint(keccak256(abi.encodePacked(block.timestamp,block.number,block.difficulty)));

        if(guess == number){
            (bool sent,) = msg.sender.call{value:address(this).balance}("");
            require(sent,"Failed to send eth");
        }
    }
}