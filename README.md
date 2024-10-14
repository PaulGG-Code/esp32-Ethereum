## IoT ESP32 Blockchain PoC

![esp32](https://raw.githubusercontent.com/PaulGG-Code/esp32-Ethereum/refs/heads/master/img/esp32.jpeg)

Introducing an very simple way to communicate between esp32 and any evm blockchain (Ethereum, BSC, Arbitrum, Optimism, Zkevm, Pol, etc..)

1. Go to remix and deploy the smart contract inside the contract dir.
2. In the root folder install the packages and run the backend with node index.js
  - 2.1. Make sure to set the .env file with QUICKNODE_ENDPOINT  (RPC) and PRIVATE_KEY.
  - 2.2. Make sure your wallet have some ETH or other main token.
3. Open arduino, connect your esp32, and upload the firmware inside firmware dir.
  - 3.1. Make sure to edit the ssid and password with your wifi/hotspot etc..


Enjoy the easiest demo of connecting esp32 to EVM!
