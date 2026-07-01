const express = require('express');
const router = express.Router();
const scriptService = require('../services/scriptService');
const audioService = require('../services/audioService');
const fs = require('fs-extra');

/**
 * POST /api/content/script
 * Generate Urdu script from topic
 */
router.post('/script', async (req, res) => {
    try {
        const { topic, includeAudio, includeVisuals, voiceName } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        console.log('📝 Generating script for topic:', topic);
        const script = await scriptService.generateScript(topic);

        const response = { script };

        // Generate audio if requested
        if (includeAudio && script) {
            console.log('🎤 Generating audio...');
            const audioPath = await audioService.generateAudio(script, voiceName || null);

            if (audioPath && await fs.pathExists(audioPath)) {
                const audioBuffer = await fs.readFile(audioPath);
                response.audioData = audioBuffer.toString('base64');
                response.audioPath = audioPath;
            }
        }

        // Generate visuals if requested
        if (includeVisuals && script) {
            console.log('🎨 Generating visuals...');
            const visuals = await scriptService.generateVisuals(script);
            response.visuals = visuals;
        }

        res.json(response);
    } catch (error) {
        console.error('Script generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/content/visuals
 * Generate visual research for content
 */
router.post('/visuals', async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const visuals = await scriptService.generateVisuals(content);
        res.json({ visuals });
    } catch (error) {
        console.error('Visuals generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/content/voice
 * Generate audio from text
 */
router.post('/voice', async (req, res) => {
    try {
        const { text, voiceName } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const audioPath = await audioService.generateAudio(text, voiceName || null);

        if (audioPath && await fs.pathExists(audioPath)) {
            const audioBuffer = await fs.readFile(audioPath);
            res.json({
                audioData: audioBuffer.toString('base64'),
                audioPath
            });
        } else {
            res.status(500).json({ error: 'Failed to generate audio' });
        }
    } catch (error) {
        console.error('Voice generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/content/headlines
 * Get top 10 headlines
 */
router.get('/headlines', async (req, res) => {
    try {
        const headlines = await scriptService.getHeadlines();
        res.json({ headlines });
    } catch (error) {
        console.error('Headlines fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/content/poster
 * Generate poster with background and text
 */
router.post('/poster', async (req, res) => {
    try {
        const { text, backgroundPrompt } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Generate background image
        const geminiService = require('../services/geminiService');
        const prompt = backgroundPrompt || `Beautiful background for a poster with text: ${text}`;
        const imageData = await geminiService.generateImage(prompt, '1:1');

        res.json({ posterData: imageData, text });
    } catch (error) {
        console.error('Poster generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
