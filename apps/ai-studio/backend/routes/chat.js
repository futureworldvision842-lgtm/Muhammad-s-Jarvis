const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

/**
 * POST /api/chat/generate
 * Generate text response
 */
router.post('/generate', async (req, res) => {
    try {
        const { prompt, useSearch, useMaps, location } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const result = await geminiService.generateTextWithGrounding(
            prompt,
            useSearch || false,
            useMaps || false,
            location || null
        );

        res.json(result);
    } catch (error) {
        console.error('Chat generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/chat/complex
 * Generate complex reasoning response
 */
router.post('/complex', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const text = await geminiService.generateTextComplex(prompt);
        res.json({ text });
    } catch (error) {
        console.error('Complex reasoning error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/chat/analyze
 * Analyze content (text + optional image)
 */
router.post('/analyze', async (req, res) => {
    try {
        const { prompt, imageBase64, imageMimeType } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const text = await geminiService.analyzeContent(prompt, imageBase64, imageMimeType);
        res.json({ text });
    } catch (error) {
        console.error('Content analysis error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
