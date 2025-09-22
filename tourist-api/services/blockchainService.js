// services/blockchainService.js
const Web3 = require('web3');
const crypto = require('crypto');

class BlockchainService {
    constructor() {
        // Connect to your chosen blockchain network
        this.web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL);
        this.contractAddress = process.env.CONTRACT_ADDRESS;
        this.contractABI = [...]; // Your contract ABI
        this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
        this.privateKey = process.env.ADMIN_PRIVATE_KEY;
    }

    async registerTourist(touristData) {
        try {
            // Generate unique tourist ID
            const touristId = this.generateTouristId();
            
            // Create hashes of sensitive data (don't store raw data on blockchain)
            const personalDataHash = this.createHash(JSON.stringify({
                name: touristData.fullName,
                email: touristData.emailAddress,
                phone: touristData.phoneNumber
            }));
            
            const documentHash = this.createHash(JSON.stringify({
                type: touristData.documentType,
                number: touristData.documentNumber
            }));

            // Prepare transaction
            const account = this.web3.eth.accounts.privateKeyToAccount(this.privateKey);
            const tx = {
                from: account.address,
                to: this.contractAddress,
                gas: 500000,
                data: this.contract.methods.registerTourist(
                    touristId,
                    personalDataHash,
                    documentHash,
                    touristData.selectedDestinations
                ).encodeABI()
            };

            // Sign and send transaction
            const signedTx = await account.signTransaction(tx);
            const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);

            return {
                touristId,
                transactionHash: receipt.transactionHash,
                blockNumber: receipt.blockNumber
            };
        } catch (error) {
            throw new Error(`Blockchain registration failed: ${error.message}`);
        }
    }

    generateTouristId() {
        const timestamp = Date.now().toString(36);
        const random = crypto.randomBytes(4).toString('hex');
        return `NE-${timestamp}-${random}`.toUpperCase();
    }

    createHash(data) {
        return '0x' + crypto.createHash('sha256').update(data).digest('hex');
    }
}

module.exports = BlockchainService;