const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');

/**
 * POST /api/whatsapp/connect
 * Connect to WhatsApp
 */
router.post('/connect', async (req, res) => {
    try {
        await whatsappService.connectToWhatsApp();
        res.json({ message: 'Connecting to WhatsApp...' });
    } catch (error) {
        console.error('WhatsApp connection error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/whatsapp/status
 * Get current WhatsApp connection status
 */
router.get('/status', (req, res) => {
    try {
        const status = whatsappService.getStatus();
        res.json(status);
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/whatsapp/send
 * Send message via WhatsApp
 */
router.post('/send', async (req, res) => {
    try {
        const { to, message } = req.body;

        if (!to || !message) {
            return res.status(400).json({ error: 'to and message are required' });
        }

        await whatsappService.sendMessage(to, message);
        res.json({ success: true });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/whatsapp/groups
 * Get available WhatsApp groups
 */
router.get('/groups', (req, res) => {
    try {
        const groups = whatsappService.groupIds;
        res.json({ groups });
    } catch (error) {
        console.error('Get groups error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
