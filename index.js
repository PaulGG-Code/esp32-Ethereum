require('dotenv').config()
const express = require('express')
const ethers = require('ethers')

const app = express()
app.use(express.json())  // Middleware to parse JSON

// Configuration for QuickNode endpoint and user's private key
const QUICKNODE_ENDPOINT = process.env.QUICKNODE_ENDPOINT
const PRIVATE_KEY = process.env.PRIVATE_KEY

// Setting up the provider and signer to connect to the Ethereum network via QuickNode
const provider = new ethers.JsonRpcProvider(QUICKNODE_ENDPOINT)
const signer = new ethers.Wallet(PRIVATE_KEY, provider)

const contractAddress = '0xC07002dCE359b54d70BBEDBCF08134b0814e0762'  // Your deployed contract address
const contractABI = [
    // ABI definition of your smart contract
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "temperature",
                "type": "uint256"
            }
        ],
        "name": "CpuDataLogged",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "temperature",
                "type": "uint256"
            }
        ],
        "name": "logCpuData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "cpuDataHistory",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "temperature",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "getCpuData",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "temperature",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct CpuDataContract.CpuData[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Instantiating the contract object for interacting with the contract
const contract = new ethers.Contract(contractAddress, contractABI, provider)
const contractWithSigner = contract.connect(signer)

// Function to write to the contract (log CPU data)
async function logCpuDataToContract(cpuTemperature) {
    console.log('Received temperature:', cpuTemperature)

    // Convert the temperature by multiplying by 100 to maintain precision, and round it
    const uintTemperature = Math.round(cpuTemperature * 100)  // Correct: Rounding temperature to nearest integer
    console.log('Converted temperature (uint256):', uintTemperature)

    // Fetch current gas price using provider.getFeeData()
    const feeData = await provider.getFeeData()
    const gasPrice = feeData.gasPrice  // Extract gas price from feeData
    console.log('Current gas price (gwei):', ethers.formatUnits(gasPrice, 'gwei'))  // Corrected usage of formatUnits

    // Check wallet balance
    const balance = await provider.getBalance(signer.address)
    console.log('Wallet balance (ETH):', ethers.formatUnits(balance, 'ether'))  // Corrected usage of formatUnits

    try {
        // Send transaction to contract
        const transactionResponse = await contractWithSigner.logCpuData(uintTemperature, {
            gasPrice: gasPrice,  // Include the fetched gas price
            gasLimit: 100000  // Increased gas limit to 100,000
        })
        await transactionResponse.wait()  // Wait for the transaction to be mined
        console.log(`Transaction hash: ${transactionResponse.hash}`)
    } catch (error) {
        console.error('Error sending transaction:', error)
    }
}

// POST route to receive CPU temperature data dynamically from ESP32
app.post('/cpu-data', async (req, res) => {
    const { cpuTemperature } = req.body  // Receive temperature data from ESP32

    if (cpuTemperature === undefined) {
        return res.status(400).json({ error: 'No temperature provided' })
    }

    try {
        // Call function to write the dynamic temperature to the blockchain
        await logCpuDataToContract(cpuTemperature)

        res.status(200).json({ message: 'Temperature logged to blockchain' })
    } catch (error) {
        console.error('Error logging data to blockchain:', error)
        res.status(500).json({ error: 'Failed to log temperature to blockchain' })
    }
})

// Start the Express server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Backend server running on port ${port}`)
})