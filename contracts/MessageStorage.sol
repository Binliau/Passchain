// filepath: c:\Users\kevin\OneDrive\Documents\02_Kuliah\06\Blockchain\passchain-hardhat\contracts\MessageStorage.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageStorage {
    string private message;

    function setMessage(string memory newMessage) public {
        message = newMessage;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}