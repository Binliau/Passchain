// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PassChain {
    struct Credential {
        string site;
        string encryptedPassword;
    }

    mapping(address => Credential[]) private userCredentials;

    function addCredential(string memory site, string memory encryptedPassword) public {
        userCredentials[msg.sender].push(Credential(site, encryptedPassword));
    }

    function getCredentials() public view returns (Credential[] memory) {
        return userCredentials[msg.sender];
    }

    function updateCredential(uint index, string memory newEncryptedPassword) public {
        require(index < userCredentials[msg.sender].length, "Invalid index");
        userCredentials[msg.sender][index].encryptedPassword = newEncryptedPassword;
    }
}
