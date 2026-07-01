const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function testFixedGoogleTTS() {
    try {
        console.log('🔍 Testing Fixed Google TTS...');
        
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash-preview-tts' 
        });

        const testText = "یہ ایک ٹیسٹ ہے";
        console.log(`📝 Testing text: ${testText}`);

        const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [{
                    text: testText
                }]
            }],
            generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: 'Kore'
                        }
                    }
                }
            }
        });

        // Extract audio data
        const audioData = result.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (!audioData) {
            console.log('❌ No audio data received');
            return;
        }

        // Convert base64 PCM data to buffer
        const pcmBuffer = Buffer.from(audioData, 'base64');
        console.log(`📊 PCM buffer size: ${pcmBuffer.length} bytes`);

        // Create WAV file (same logic as in app.js)
        const timestamp = Date.now();
        const filename = `test_fixed_google_tts_${timestamp}.wav`;
        
        // Convert PCM to WAV format (Google TTS specs: 24kHz, 16-bit, mono)
        const sampleRate = 24000;
        const channels = 1;
        const bitsPerSample = 16;
        const byteRate = sampleRate * channels * (bitsPerSample / 8);
        const blockAlign = channels * (bitsPerSample / 8);
        
        // Create WAV header
        const wavHeader = Buffer.alloc(44);
        wavHeader.write('RIFF', 0);
        wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
        wavHeader.write('WAVE', 8);
        wavHeader.write('fmt ', 12);
        wavHeader.writeUInt32LE(16, 16);
        wavHeader.writeUInt16LE(1, 20);
        wavHeader.writeUInt16LE(channels, 22);
        wavHeader.writeUInt32LE(sampleRate, 24);
        wavHeader.writeUInt32LE(byteRate, 28);
        wavHeader.writeUInt16LE(blockAlign, 32);
        wavHeader.writeUInt16LE(bitsPerSample, 34);
        wavHeader.write('data', 36);
        wavHeader.writeUInt32LE(pcmBuffer.length, 40);
        
        // Combine header and PCM data
        const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
        
        // Save the WAV file
        await fs.writeFile(filename, wavBuffer);
        
        console.log(`💾 WAV file saved: ${filename}`);
        console.log(`📊 WAV file size: ${wavBuffer.length} bytes`);
        
        // Test with ffprobe
        console.log('🔍 Testing with ffprobe...');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testFixedGoogleTTS();