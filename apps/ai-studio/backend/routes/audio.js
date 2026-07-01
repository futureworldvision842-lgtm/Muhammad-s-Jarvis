const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

/**
 * POST /api/audio/generate-speech
 * Generate speech from text
 */
router.post('/generate-speech', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const base64Audio = await geminiService.generateSpeech(text);
        res.json({ audioData: base64Audio });
    } catch (error) {
        console.error('Speech generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/audio/live-session
 * Get Gemini Live session
 */
router.get('/live-session', (req, res) => {
    try {
        const liveSession = geminiService.getLiveSession();
        res.json({ liveSession: 'Ready' });
    } catch (error) {
        console.error('Live session error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
