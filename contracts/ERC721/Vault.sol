// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {RecieptToken} from "./rToken.sol";


contract Vault {
    mapping(address => IERC20) public tokens;
    mapping(address => RecieptToken) public recieptTokens;

    modifier isSupported(address _token){
        require(address(tokens[_token]) != address(0),"token is not supported");
        _;
    }

    constructor(address _aave,address _uni, address _weth){

        tokens[_aave] = IERC20(_aave);
        tokens[_uni] = IERC20(_uni);
        tokens[_weth] = IERC20(_weth);

        recieptTokens[_aave] = new RecieptToken(_aave,"Recipet AAVE","raave");
        recieptTokens[_uni] = new RecieptToken(_uni,"Reciept UNI","runi");
        recieptTokens[_weth] = new RecieptToken(_weth,"Reciept WETH","rweth");
    }

    function deposit(address _token,uint256 _amount) external isSupported(_token) {
        bool success = tokens[_token].transferFrom(msg.sender,address(this),_amount);
        require(success,"Transfer failed");
        recieptTokens[_token].mint(msg.sender,_amount);
    }

    function withdraw(address _token,uint256 _amount) external isSupported(_token) {
        recieptTokens[_token].burn(msg.sender,_amount);
        bool success = tokens[_token].transfer(msg.sender,_amount);
        require(success,"Transfer Failed");
    } 
}