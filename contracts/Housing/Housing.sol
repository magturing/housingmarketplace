// SPDX-License-Identifier:MIT
pragma solidity 0.8.28;

import {Magturing} from "../ERC20/Magturing.sol";


contract Housing{


    Magturing public token;

    constructor(address _tokenAddress){
        token = Magturing(_tokenAddress);
    }

    struct House {
        uint256 id;
        address owner;
        string location;
        bool registered;
        uint256 area;
        uint256 price;
    }

    uint256 public houseId = 1000;


    event HouseRegistered(uint256 houseId, address owner);
    event OwnershipTransferred(uint256 houseId, address oldOwner, address newOwner);
    event HouseSold(uint256 houseId,address owner,address buyer,uint256 price);

    mapping(uint256 => House) public houses;

    /**
     * Function to increment the houseId
     */
    function incrementHouseId() internal {
        houseId++;
    }

    /**
     * 
     * @param _location location of the house
     * @param _area area of house
     * 
     * Function to register house on the blockchain
     */
    function registerHouse(string memory _location,uint256 _area,uint256 _price) public {
        require(!houses[houseId].registered,"House is already registered");

        houses[houseId] = House({
            id:houseId,
            owner:msg.sender,
            location:_location,
            registered:true,
            area:_area,
            price:_price
         });

         incrementHouseId();

         emit HouseRegistered(houseId, msg.sender);
    }

    /**
     * @param _houseId id to get house details.
     * Function returns the house owner address.
     */
    function getOwnerShipDetails(uint256 _houseId) public view returns(address){
        return houses[_houseId].owner;
    }

   
      function buyHouse(uint256 _houseId) public {

        require(houses[_houseId].registered,"House is not registered");
        require(msg.sender != houses[_houseId].owner, "Owner cannot buy their own house");

        address oldOwner = houses[_houseId].owner;
        uint256 price = houses[_houseId].price;

        require(token.balanceOf(msg.sender) >= price, "Not enough funds");
        require(token.allowance(msg.sender, address(this)) >= price, "Approve tokens first");

        token.transferFrom(msg.sender, oldOwner, price);

        houses[_houseId].owner = msg.sender;

        emit HouseSold(_houseId, oldOwner, msg.sender, price);
    }


}
