// SPDX-License-Identifier : MIT
pragma solidity ^0.8.28;

contract Game2 {
    mapping(address => uint) public players;
    uint256 lastvalue;
    uint8 constant MIN_WINS_IN_A_ROW = 5;

    constructor() payable {}

    function play(bool _guess) external payable {
        require(msg.value == 1 ether,"Playing cost 1 ether");

        uint256 value = uint256(blockhash(block.number - 1));
        lastvalue = value;

        uint256 random = value % 2;
        bool answer = random == 1 ? true : false;

        if(answer == _guess){
            players[msg.sender]++;

            if(players[msg.sender] == MIN_WINS_IN_A_ROW){
                (bool sent,) = msg.sender.call{value:address(this).balance}("");
                require(sent,"Failed to send ETH");
                players[msg.sender] = 0;
            }
        }else{
            players[msg.sender] = 0;
        }


    }
}