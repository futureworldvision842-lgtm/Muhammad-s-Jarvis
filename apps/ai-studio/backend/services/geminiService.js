delete process.env.GOOGLE_API_KEY;
const { GoogleGenAI } = require('@google/genai');
const config = require('../config/api.config');

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
const DEFAULT_MODEL = 'gemini-2.5-flash';
const PRO_MODEL = 'gemini-2.5-pro';

/**
 * Helper to query local LLM (Ollama or Odysseus) on connection failure
 */
async function generateLocalFallback(prompt, systemInstruction = '') {
    const messages = [];
    if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    // 1. Try local Ollama first
    try {
        const response = await fetch('http://localhost:11434/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen2.5:1.5b',
                messages: messages,
                temperature: 0.3
            })
        });
        if (response.ok) {
            const data = await response.json();
            return data.choices[0].message.content;
        }
    } catch (error) {
        console.warn('[Local AI] Ollama is unreachable on port 11434, trying Odysseus...');
    }

    // 2. Try local Odysseus chat API
    try {
        const response = await fetch('http://localhost:7000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: prompt,
                session: 'studio_fallback_session'
            })
        });
        if (response.ok) {
            const data = await response.json();
            return data.response;
        }
    } catch (error) {
        console.warn('[Local AI] Odysseus is unreachable on port 7000.');
    }

    throw new Error('Local AI fallback failed. Ensure either Ollama or Odysseus is running.');
}

/**
 * Generate text with optional Google Search grounding
 */
async function generateTextWithGrounding(prompt, useSearch = false, useMaps = false, location = null) {
    try {
        const configOptions = {};
        if (useSearch) {
            configOptions.tools = [{ googleSearch: {} }];
        }
        
        let contents = prompt;
        if (useMaps && location) {
            contents = `[Location Context: ${location}]\n\n${contents}`;
        }

        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: contents,
            config: configOptions
        });

        return {
            text: response.text,
            sources: []
        };
    } catch (error) {
        console.error('Gemini text generation error:', error.message);
        console.log('Attempting local fallback...');
        try {
            const localText = await generateLocalFallback(prompt);
            return {
                text: localText,
                sources: []
            };
        } catch (fallbackError) {
            console.error('Local fallback failed:', fallbackError.message);
            throw error;
        }
    }
}

/**
 * Generate complex reasoning response
 */
async function generateTextComplex(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: PRO_MODEL,
            contents: prompt,
            config: {
                systemInstruction: 'You are an advanced AI assistant with deep analytical and reasoning capabilities. Provide detailed, well-structured, and insightful responses.'
            }
        });
        return response.text;
    } catch (error) {
        console.error('Complex reasoning error:', error.message);
        console.log('Attempting local fallback for complex reasoning...');
        try {
            return await generateLocalFallback(prompt, 'You are an advanced AI assistant with deep analytical and reasoning capabilities. Provide detailed, well-structured, and offline-compatible responses.');
        } catch (fallbackError) {
            console.error('Local fallback failed:', fallbackError.message);
            throw error;
        }
    }
}

/**
 * Analyze content (text and/or images)
 */
async function analyzeContent(textContent, imageUrls = []) {
    try {
        let contents = [textContent];
        if (imageUrls && imageUrls.length > 0) {
            contents.unshift(`Analyze the images at these URLs: ${imageUrls.join(', ')}`);
        }

        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: contents,
            config: {
                systemInstruction: 'You are an expert content analyst. Provide comprehensive analysis of text and visual content.'
            }
        });
        return response.text;
    } catch (error) {
        console.error('Content analysis error:', error.message);
        console.log('Attempting local fallback for content analysis...');
        try {
            return await generateLocalFallback(textContent, 'You are an expert content analyst. Provide comprehensive analysis of text and visual content.');
        } catch (fallbackError) {
            console.error('Local fallback failed:', fallbackError.message);
            throw error;
        }
    }
}

/**
 * Generate image
 */
async function generateImage(prompt, aspectRatio = '1:1') {
    throw new Error('Image generation not supported through Gemini API directly. Please configure Stable Diffusion / Imagen API keys.');
}

/**
 * Edit image
 */
async function editImage(prompt, imageUrl, maskUrl = null) {
    throw new Error('Image editing not supported through Gemini API directly.');
}

/**
 * Generate video
 */
async function generateVideo(prompt, imageUrl = null, videoUrl = null, aspectRatio = '16:9') {
    throw new Error('Video generation not supported through Gemini API directly.');
}

/**
 * Analyze video
 */
async function analyzeVideo(videoUrl, prompt = 'Describe this video in detail') {
    try {
        const fullPrompt = `Analyze this video: ${videoUrl}\n\n${prompt}\n\nNote: Provide analysis based on what would typically be in such a video.`;
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: fullPrompt
        });
        return response.text;
    } catch (error) {
        console.error('Video analysis error:', error.message);
        console.log('Attempting local fallback for video analysis...');
        try {
            return await generateLocalFallback(`${prompt}\n\nVideo URL: ${videoUrl}`);
        } catch (fallbackError) {
            console.error('Local fallback failed:', fallbackError.message);
            throw error;
        }
    }
}

/**
 * Transcribe video/audio
 */
async function transcribeVideoAudio(videoUrl) {
    try {
        const prompt = `Transcribe the audio/speech from this video: ${videoUrl}\n\nProvide a complete transcript of spoken content.`;
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error('Transcription error:', error.message);
        console.log('Attempting local fallback for video transcription...');
        try {
            return await generateLocalFallback(`Transcribe the audio/speech from this video URL: ${videoUrl}`);
        } catch (fallbackError) {
            console.error('Local fallback failed:', fallbackError.message);
            throw error;
        }
    }
}

/**
 * Generate speech
 */
async function generateSpeech(text) {
    throw new Error('Speech generation not supported through Gemini API directly. Use Google TTS service instead.');
}

/**
 * Create live audio session
 */
async function createLiveSession() {
    throw new Error('Live sessions not supported through Gemini API directly.');
}

/**
 * Audit codebase
 */
async function auditCodebase(codeFiles, instructions) {
    try {
        const prompt = `Code Audit Request:

Instructions: ${instructions}

Code Files:
${JSON.stringify(codeFiles, null, 2)}

Please provide a comprehensive code audit with:
1. Security issues
2. Performance problems
3. Best practice violations
4. Recommended fixes`;

        const response = await ai.models.generateContent({
            model: PRO_MODEL,
            contents: prompt,
            config: {
                systemInstruction: 'You are an expert code auditor with deep knowledge of software engineering best practices, security, and performance optimization.'
            }
        });
        return response.text;
    } catch (error) {
        console.error('Code audit error:', error.message);
        console.log('Attempting local fallback for code audit...');
        try {
            const localPrompt = `Perform a codebase audit. Instructions: ${instructions}\n\nFiles: ${JSON.stringify(codeFiles)}`;
            return await generateLocalFallback(localPrompt, 'You are an expert code auditor. Provide security, performance, and best practices analysis.');
        } catch (fallbackError) {
            console.error('Local fallback failed:', fallbackError.message);
            throw error;
        }
    }
}

/**
 * Generate code update
 */
async function generateCodeUpdate(codeContext, updateInstructions) {
    try {
        const prompt = `Code Update Request:

Current Code Context:
${codeContext}

Update Instructions:
${updateInstructions}

Please provide the updated code with explanations of changes made.`;

        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: prompt,
            config: {
                systemInstruction: 'You are an expert software developer. Generate clean, efficient, and well-documented code updates.'
            }
        });
        return response.text;
    } catch (error) {
        console.error('Code generation error:', error.message);
        console.log('Attempting local fallback for code update...');
        try {
            const localPrompt = `Code context: ${codeContext}\n\nInstructions: ${updateInstructions}`;
            return await generateLocalFallback(localPrompt, 'You are an expert software developer. Generate clean, efficient, and well-documented code updates.');
        } catch (fallbackError) {
            console.error('Local fallback failed:', fallbackError.message);
            throw error;
        }
    }
}

module.exports = {
    generateTextWithGrounding,
    generateTextComplex,
    analyzeContent,
    generateImage,
    editImage,
    generateVideo,
    analyzeVideo,
    transcribeVideoAudio,
    generateSpeech,
    createLiveSession,
    auditCodebase,
    generateCodeUpdate
};
