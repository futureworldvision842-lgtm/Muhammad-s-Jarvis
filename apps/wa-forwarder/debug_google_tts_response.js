const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
require('dotenv').config();

async function debugGoogleTTS() {
    try {
        console.log('🔍 Starting Google TTS Debug...');
        
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

        console.log('🔍 Full Response Structure:');
        console.log(JSON.stringify(result, null, 2));

        // Check if response has candidates
        if (result.response && result.response.candidates) {
            console.log('\n📊 Candidates found:', result.response.candidates.length);
            
            result.response.candidates.forEach((candidate, index) => {
                console.log(`\n🎯 Candidate ${index + 1}:`);
                console.log('- Content:', candidate.content);
                console.log('- Parts:', candidate.content?.parts?.length || 0);
                
                if (candidate.content?.parts) {
                    candidate.content.parts.forEach((part, partIndex) => {
                        console.log(`\n📦 Part ${partIndex + 1}:`);
                        console.log('- Keys:', Object.keys(part));
                        
                        if (part.inlineData) {
                            console.log('- Inline Data found!');
                            console.log('- MIME Type:', part.inlineData.mimeType);
                            console.log('- Data length:', part.inlineData.data?.length || 0);
                            
                            // Try to save the audio
                            if (part.inlineData.data) {
                                const audioBuffer = Buffer.from(part.inlineData.data, 'base64');
                                const filename = `debug_google_tts_${Date.now()}.mp3`;
                                fs.writeFileSync(filename, audioBuffer);
                                console.log(`💾 Audio saved as: ${filename}`);
                                console.log(`📊 Buffer size: ${audioBuffer.length} bytes`);
                            }
                        }
                        
                        if (part.text) {
                            console.log('- Text:', part.text);
                        }
                    });
                }
            });
        } else {
            console.log('❌ No candidates found in response');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

debugGoogleTTS();