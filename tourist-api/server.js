const express = require('express');
const QRCode = require('qrcode');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const registrations = new Map();

function generateTouristId() {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex');
    return `NE-${timestamp}-${random}`.toUpperCase();
}

app.post('/api/register', async (req, res) => {
    console.log('Registration request received:', req.body);
    
    try {
        const touristId = generateTouristId();
        
        // Simulate blockchain processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const qrData = {
            touristId,
            verified: true,
            timestamp: Date.now(),
            blockchain: 'Polygon Testnet'
        };
        
        const qrCodeBase64 = await QRCode.toDataURL(JSON.stringify(qrData));
        
        const response = {
            success: true,
            touristId,
            qrCode: qrCodeBase64,
            transactionHash: '0x' + crypto.randomBytes(32).toString('hex'),
            digitalId: {
                id: touristId,
                blockchain: 'Polygon',
                verified: true,
                createdAt: new Date().toISOString()
            }
        };
        
        registrations.set(touristId, { ...req.body, ...response });
        
        console.log('Registration successful:', touristId);
        res.json(response);
        
    } catch (error) {
        console.error('Registration failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3001, '192.168.0.100', () => {
    console.log('Server running on http://192.168.0.100:3001');
    console.log('Test endpoint: http://localhost:3001/api/register');
});