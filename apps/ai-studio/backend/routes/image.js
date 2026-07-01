const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

/**
 * POST /api/image/generate
 * Generate image using Imagen
 */
router.post('/generate', async (req, res) => {
    try {
        const { prompt, aspectRatio } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const imageData = await geminiService.generateImage(prompt, aspectRatio || '1:1');
        res.json({ imageData });
    } catch (error) {
        console.error('Image generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/image/edit
 * Edit image using Gemini
 */
router.post('/edit', async (req, res) => {
    try {
        const { prompt, imageBase64, mimeType } = req.body;

        if (!prompt || !imageBase64 || !mimeType) {
            return res.status(400).json({ error: 'Prompt, imageBase64, and mimeType are required' });
        }

        const imageData = await geminiService.editImage(prompt, imageBase64, mimeType);
        res.json({ imageData });
    } catch (error) {
        console.error('Image editing error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
