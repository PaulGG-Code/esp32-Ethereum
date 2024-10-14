// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CpuDataContract {
    struct CpuData {
        uint256 timestamp;
        uint256 temperature;
    }

    // Mapping to store CPU data for each device (by sender address)
    mapping(address => CpuData[]) public cpuDataHistory;

    event CpuDataLogged(address indexed sender, uint256 timestamp, uint256 temperature);

    // Function to store CPU data
    function logCpuData(uint256 temperature) public {
        CpuData memory newEntry = CpuData({
            timestamp: block.timestamp,
            temperature: temperature
        });

        cpuDataHistory[msg.sender].push(newEntry);
        emit CpuDataLogged(msg.sender, block.timestamp, temperature);
    }

    // Function to retrieve CPU data by sender address
    function getCpuData(address sender) public view returns (CpuData[] memory) {
        return cpuDataHistory[sender];
    }
}
