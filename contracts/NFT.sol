// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC1155, Ownable{
    uint public constant buyerReceipt = 0;
    uint public constant sellerReceipt = 1;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor () ERC1155("https://uvoj28qnh9dj.moralishost.com/{id}.json"){
        
       
    }
    //  function _mint(
    //     address account,
    //     uint256 id,
    //     uint256 amount,
    //     bytes memory data
    // )

    function mint(address account, bytes memory description) public{
          _mint(account, buyerReceipt, 1, description);
    }

    function burn(address account, uint id, uint amount) public{
        require(msg.sender==account);
        _burn(account, id, amount);
    }

    // struct Item{
    //     uint id;
    //     address creator;
    //     string uri;
    // }
    // mapping (uint=>Item) public Items;

    // function createItem(string memory uri) public returns(uint){
    //     _tokenIds.increment();
    //     uint newItemId = _tokenIds.current();
    //     _mint(msg.sender, newItemId, 1,"");
    //     Items[newItemId] = Item(newItemId, msg.sender, uri);
    //     return newItemId;
    // }

}