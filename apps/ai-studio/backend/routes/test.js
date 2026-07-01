const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

/**
 * TEST ENDPOINT: Test ModelsLab API
 * POST /api/test/modelslab
 */
router.post('/modelslab', async (req, res) => {
    try {
        console.log('🧪 Testing ModelsLab API...');

        const testPrompt = 'Say "Hello from ModelsLab!" in one sentence.';

        const response = await geminiService.generateTextWithGrounding(testPrompt, false, false);

        console.log('✅ ModelsLab API Response:', response);

        res.json({
            success: true,
            message: 'ModelsLab API is working!',
            response: response
        });
    } catch (error) {
        console.error('❌ ModelsLab API Test Failed:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data || error.toString()
        });
    }
});

/**
 * TEST ENDPOINT: Test Headlines Generation
 * GET /api/test/headlines
 */
router.get('/headlines', async (req, res) => {
    try {
        console.log('🧪 Testing Headlines Generation...');

        const scriptService = require('../services/scriptService');
        const headlines = await scriptService.getHeadlines();

        console.log('✅ Headlines Generated');

        res.json({
            success: true,
            headlines: headlines
        });
    } catch (error) {
        console.error('❌ Headlines Test Failed:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * TEST ENDPOINT: Test Script Generation
 * POST /api/test/script
 */
router.post('/script', async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({
                success: false,
                error: 'Topic is required'
            });
        }

        console.log('🧪 Testing Script Generation for topic:', topic);

        const scriptService = require('../services/scriptService');
        const script = await scriptService.generateScript(topic, false, false);

        console.log('✅ Script Generated');

        res.json({
            success: true,
            script: script
        });
    } catch (error) {
        console.error('❌ Script Test Failed:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
