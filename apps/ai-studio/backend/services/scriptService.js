const geminiService = require('./geminiService');
const { MASTER_SCRIPT_PROMPT, VISUALS_RESEARCH_PROMPT, HEADLINES_PROMPT } = require('../config/constants');

/**
 * Generate Urdu script from topic using Gemini with Google Search
 */
async function generateScript(topic) {
    try {
        const prompt = `${MASTER_SCRIPT_PROMPT}\n\nBase News Item: ${topic}`;

        // Use Gemini with Google Search for up-to-date information
        const result = await geminiService.generateTextWithGrounding(prompt, true, false, null);

        return result.text;
    } catch (error) {
        console.error('Script generation error:', error.message);
        throw error;
    }
}

/**
 * Generate visual research for script
 */
async function generateVisuals(content) {
    try {
        const prompt = `${VISUALS_RESEARCH_PROMPT}\n\nScript Content: ${content}`;

        // Use Gemini with Google Search for finding links and resources
        const result = await geminiService.generateTextWithGrounding(prompt, true, false, null);

        return result.text;
    } catch (error) {
        console.error('Visuals generation error:', error.message);
        throw error;
    }
}

/**
 * Get top 10 headlines with geographic prioritization
 */
async function getHeadlines() {
    try {
        // Use Gemini with Google Search for latest headlines
        const result = await geminiService.generateTextWithGrounding(HEADLINES_PROMPT, true, false, null);

        return result.text;
    } catch (error) {
        console.error('Headlines fetch error:', error.message);
        throw error;
    }
}

/**
 * Extract script and visuals from response (for compatibility)
 */
function extractScriptAndVisuals(response) {
    try {
        // Try to extract script section
        let scriptMatch = response.match(/📝\s*\*\*Vision Point Script\*\*([\\s\\S]*?)(?:---|$)/i);

        if (!scriptMatch) {
            scriptMatch = response.match(/\*\*Vision Point Script\*\*([\\s\\S]*?)(?:---|$)/i);
        }
        if (!scriptMatch) {
            scriptMatch = response.match(/Vision Point Script([\\s\\S]*?)(?:---|$)/i);
        }
        if (!scriptMatch) {
            // Use entire response as script
            scriptMatch = [null, response];
        }

        let script = scriptMatch ? scriptMatch[1].trim() : '';

        // Clean up script
        if (script) {
            script = script.replace(/^\s*---\s*/gm, '').trim();
        }

        return { script, visuals: '' };
    } catch (error) {
        console.error('Extract error:', error);
        return { script: response, visuals: '' };
    }
}

/**
 * Split script into chunks for TTS (70-90 seconds each)
 */
function splitScriptIntoChunks(script) {
    try {
        if (!script || script.length === 0) {
            return [];
        }

        // Character count for 70-90 seconds of Urdu speech
        // Based on TTS speed: ~180-220 words/min for Urdu
        const minChunkSize = 1050; // ~70 seconds
        const targetChunkSize = 1200; // ~80 seconds
        const maxChunkSize = 1650; // ~90 seconds

        const chunks = [];
        let currentChunk = '';

        // Split by paragraphs first
        const paragraphs = script.split(/\n\s*\n/);

        for (let i = 0; i < paragraphs.length; i++) {
            let paragraph = paragraphs[i].trim();
            if (!paragraph) continue;

            // If adding this paragraph exceeds max, save current chunk
            if (currentChunk.length > 0 && (currentChunk.length + paragraph.length) > maxChunkSize) {
                if (currentChunk.length >= minChunkSize) {
                    chunks.push(currentChunk.trim());
                    currentChunk = paragraph;
                } else {
                    currentChunk += '\n\n' + paragraph;
                }
            } else if (currentChunk.length === 0) {
                currentChunk = paragraph;
            } else {
                currentChunk += '\n\n' + paragraph;
            }

            // Create chunk if we're at target size
            if (currentChunk.length >= targetChunkSize && i < paragraphs.length - 1) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
        }

        // Add remaining content
        if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
        }

        // If no chunks created, return entire script
        if (chunks.length === 0) {
            chunks.push(script);
        }

        return chunks;
    } catch (error) {
        console.error('Script chunking error:', error);
        return [script];
    }
}

module.exports = {
    generateScript,
    generateVisuals,
    getHeadlines,
    extractScriptAndVisuals,
    splitScriptIntoChunks,
};
