// routes/registration.js
const express = require('express');
const QRCode = require('qrcode');
const BlockchainService = require('../services/blockchainService');
const router = express.Router();

const blockchainService = new BlockchainService();

router.post('/register', async (req, res) => {
    try {
        // Validate input data
        const touristData = req.body;
        
        // Register on blockchain
        const blockchainResult = await blockchainService.registerTourist(touristData);
        
        // Generate QR code with blockchain verification data
        const qrData = {
            touristId: blockchainResult.touristId,
            transactionHash: blockchainResult.transactionHash,
            blockNumber: blockchainResult.blockNumber,
            timestamp: Date.now(),
            verifyUrl: `${process.env.API_URL}/verify/${blockchainResult.touristId}`
        };

        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));

        res.json({
            success: true,
            touristId: blockchainResult.touristId,
            transactionHash: blockchainResult.transactionHash,
            qrCode: qrCodeDataURL,
            digitalId: {
                id: blockchainResult.touristId,
                blockchain: 'Polygon', // or your chosen blockchain
                verified: true,
                createdAt: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/verify/:touristId', async (req, res) => {
    try {
        const { touristId } = req.params;
        
        // Verify on blockchain
        const tourist = await blockchainService.contract.methods
            .tourists(blockchainService.touristIdToAddress[touristId])
            .call();

        if (tourist.isActive) {
            res.json({
                valid: true,
                touristId,
                registrationTime: tourist.registrationTime,
                destinations: tourist.destinations
            });
        } else {
            res.json({ valid: false, error: 'Tourist ID not found or inactive' });
        }
    } catch (error) {
        res.status(500).json({ valid: false, error: error.message });
    }
});

module.exports = router;