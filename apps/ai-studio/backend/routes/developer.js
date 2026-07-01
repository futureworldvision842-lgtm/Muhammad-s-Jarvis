const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

/**
 * POST /api/developer/audit
 * Audit codebase
 */
router.post('/audit', async (req, res) => {
    try {
        const { files } = req.body;

        if (!files || !Array.isArray(files)) {
            return res.status(400).json({ error: 'Files array is required' });
        }

        const auditResults = await geminiService.auditCodebase(files);
        res.json({ auditResults });
    } catch (error) {
        console.error('Code audit error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/developer/generate-update
 * Generate code updates
 */
router.post('/generate-update', async (req, res) => {
    try {
        const { files, userRequest } = req.body;

        if (!files || !Array.isArray(files) || !userRequest) {
            return res.status(400).json({ error: 'Files array and userRequest are required' });
        }

        const updateCode = await geminiService.generateCodeUpdate(files, userRequest);
        res.json({ updateCode });
    } catch (error) {
        console.error('Code generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
