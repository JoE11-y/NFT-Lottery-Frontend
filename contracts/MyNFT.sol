// SPDX-License-Identifier: MIT
// ################################# NFT SMART CONTRACT GOES HERE ######################################
pragma solidity ^0.8.2;

contract MyNFT {
    uint public count;

    // Function to get the current count
    function get() public view returns (uint) {
        return count;
    }

    // Function to increment count by 1
    function inc() public {
        count += 1;
    }

    // Function to decrement count by 1
    function dec() public {
        count -= 1;
    }
}