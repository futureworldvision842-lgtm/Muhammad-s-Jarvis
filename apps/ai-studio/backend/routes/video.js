const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

/**
 * POST /api/video/generate
 * Generate video using VEO
 */
router.post('/generate', async (req, res) => {
    try {
        const { prompt, imageBase64, mimeType, aspectRatio } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const videoUrl = await geminiService.generateVideo(
            prompt,
            imageBase64 || null,
            mimeType || null,
            aspectRatio || '16:9'
        );

        res.json({ videoUrl });
    } catch (error) {
        console.error('Video generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/video/analyze
 * Analyze video frames
 */
router.post('/analyze', async (req, res) => {
    try {
        const { prompt, frames } = req.body;

        if (!prompt || !frames || !Array.isArray(frames)) {
            return res.status(400).json({ error: 'Prompt and frames array are required' });
        }

        const analysis = await geminiService.analyzeVideo(prompt, frames);
        res.json({ analysis });
    } catch (error) {
        console.error('Video analysis error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/video/transcribe
 * Transcribe video audio
 */
router.post('/transcribe', async (req, res) => {
    try {
        const { videoBase64, mimeType } = req.body;

        if (!videoBase64 || !mimeType) {
            return res.status(400).json({ error: 'videoBase64 and mimeType are required' });
        }

        const transcript = await geminiService.transcribeVideoAudio(videoBase64, mimeType);
        res.json({ transcript });
    } catch (error) {
        console.error('Video transcription error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
