// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

 contract Stakable{
     
      address payable Burn = payable(0x000000000000000000000000000000000000dEaD);
      
      address payable public Admin;
   
    constructor() {
        stakeHolders.push(stake(Burn, 0, block.timestamp ));
        Admin= payable(msg.sender);
    }
    /**
     * @notice
     * A stake struct is used to represent the way we store stakes, 
     * A Stake will contain the users address, the amount staked and a timestamp, 
     * Since which is when the stake was made
     */
    struct stake{
        address user;
        uint256 amount;
        uint256 since;
    }
    
    stake[] private stakeHolders;
   
    mapping(address => uint256) internal stakes;
    modifier minAmount(){
        require(msg.value>=0.05 ether, "Please stake more than or equal to 0.05 ether");
        _;
    }
     
    modifier onlyStakers(){
        require (stakes[msg.sender]!=0, "You have to stake minimum 0.05 ether");
        _;
    }
   

    /**
    * @notice Staked event is triggered whenever a user stakes tokens, address is indexed to make it filterable
     */
    event Staked(address indexed user, uint256 amount, uint256 index, uint256 timestamp);
   
    function Stake() external payable minAmount {
        address staker;
        stakeHolders.push(stake(msg.sender, msg.value, block.timestamp));
        // Calculate the index of the last item in the array by Len-1
        uint256 userIndex = stakeHolders.length - 1;
        // Assign the address to the new index
        stakeHolders[userIndex].user = staker;
        // Add index to the stakeHolders
        stakes[staker] = userIndex;
        emit Staked(msg.sender, msg.value, userIndex, block.timestamp); 
        Admin.transfer(msg.value);
    }
    
 }