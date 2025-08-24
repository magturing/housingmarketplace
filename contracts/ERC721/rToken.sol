// SPDX_License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RecieptToken is ERC20 {

    address public owner;
    address public underlyingToken;
    constructor(address _underlyingToken,string memory _name,string memory _symbol)
    ERC20(_name,_symbol)
    {
        require(_underlyingToken != address(0),"Wrong address");
        owner = msg.sender;
        underlyingToken = _underlyingToken;
    }

    function mint(address _to,uint256 _amount) external {
        _mint(_to,_amount);
    }

    function burn(address _from,uint256 _amount) external {
        _burn(_from,_amount);
    }
}