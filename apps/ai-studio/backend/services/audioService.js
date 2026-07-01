const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config/api.config');
const { VOICE_MAPPINGS } = require('../config/constants');
const scriptService = require('./scriptService');

/**
 * Generate audio using Google Cloud Text-to-Speech API
 */
async function generateAudio(text, voiceName = null) {
    try {
        if (!text || text.length === 0) {
            throw new Error('No text provided for audio generation');
        }

        // Split into chunks if needed
        const chunks = scriptService.splitScriptIntoChunks(text);

        if (chunks.length === 1 && chunks[0].length <= 5000) {
            // Single chunk
            return await generateSingleAudioChunk(chunks[0], voiceName);
        }

        // Multiple chunks - generate and combine
        const audioChunkPaths = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunkPath = await generateSingleAudioChunk(chunks[i], voiceName, i + 1);
            if (chunkPath) {
                audioChunkPaths.push(chunkPath);
            }

            // Small delay to avoid rate limiting
            if (i < chunks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (audioChunkPaths.length === 0) {
            throw new Error('Failed to generate any audio chunks');
        }

        // Combine chunks
        const combinedPath = await combineAudioChunks(audioChunkPaths);

        // Clean up individual chunks
        for (const chunkPath of audioChunkPaths) {
            try {
                await fs.unlink(chunkPath);
            } catch (err) {
                console.warn('Failed to delete chunk:', chunkPath);
            }
        }

        return combinedPath;
    } catch (error) {
        console.error('Audio generation error:', error.message);
        throw error;
    }
}

/**
 * Generate single audio chunk using Google TTS
 */
async function generateSingleAudioChunk(text, voiceName = null, chunkNumber = null) {
    try {
        // Truncate if too long
        let textToConvert = text;
        if (text.length > 5000) {
            textToConvert = text.substring(0, 5000);
        }

        // Resolve voice name
        const voice = resolveVoiceName(voiceName);

        const response = await axios.post(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${config.GEMINI_API_KEY}`,
            {
                input: { text: textToConvert },
                voice: {
                    languageCode: config.GOOGLE_TTS_LANGUAGE_CODE,
                    name: voice
                },
                audioConfig: {
                    audioEncoding: 'MP3',
                    speakingRate: 1.0,
                    pitch: 0.0
                }
            }
        );

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const chunkSuffix = chunkNumber ? `_chunk${chunkNumber}` : '';
        const outputDir = path.join(__dirname, '../output/voiceovers');
        await fs.ensureDir(outputDir);

        const audioPath = path.join(outputDir, `${timestamp}${chunkSuffix}.mp3`);

        const audioContentBase64 = response.data.audioContent;
        if (!audioContentBase64) {
            throw new Error('No audioContent in Google TTS response');
        }

        const audioBuffer = Buffer.from(audioContentBase64, 'base64');
        await fs.writeFile(audioPath, audioBuffer);

        console.log(`✅ Audio chunk ${chunkNumber || 1} generated: ${audioPath}`);
        return audioPath;
    } catch (error) {
        console.error(`❌ Google TTS error for chunk ${chunkNumber || 1}:`, error.message);
        throw error;
    }
}

/**
 * Combine multiple audio chunks
 */
async function combineAudioChunks(audioChunkPaths) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputDir = path.join(__dirname, '../output/voiceovers');
        const combinedPath = path.join(outputDir, `${timestamp}_combined.mp3`);

        // Read and concatenate all chunks
        const audioBuffers = [];
        for (const chunkPath of audioChunkPaths) {
            const buffer = await fs.readFile(chunkPath);
            audioBuffers.push(buffer);
        }

        const combinedBuffer = Buffer.concat(audioBuffers);
        await fs.writeFile(combinedPath, combinedBuffer);

        console.log(`🎵 Combined ${audioChunkPaths.length} chunks into: ${combinedPath}`);
        return combinedPath;
    } catch (error) {
        console.error('Audio combination error:', error);
        // Return first chunk as fallback
        return audioChunkPaths.length > 0 ? audioChunkPaths[0] : null;
    }
}

/**
 * Resolve voice name to Google TTS voice ID
 */
function resolveVoiceName(voiceName) {
    if (!voiceName) {
        return config.GOOGLE_TTS_VOICE_NAME;
    }

    const normalized = voiceName.toLowerCase().trim();
    return VOICE_MAPPINGS[normalized] || config.GOOGLE_TTS_VOICE_NAME;
}

module.exports = {
    generateAudio,
    generateSingleAudioChunk,
    combineAudioChunks,
    resolveVoiceName,
};
