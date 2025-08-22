// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Magturing is ERC20 {
    address public owner;

    constructor(uint256 _initialSupply) ERC20("Magturing","MGT"){
        owner = msg.sender;
        _mint(owner,_initialSupply);
    }

    modifier onlyOwner(){
        require(msg.sender == owner,"Caller is not owner");
        _;
    }

    function mint(address _to,uint256 _amount) external returns(uint256){
        require(_amount > 0 ,"can not mint 0 tokens");
        _mint(_to,_amount);
        return _amount;
    }

}