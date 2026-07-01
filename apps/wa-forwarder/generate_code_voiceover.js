require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Google AI Studio API key from environment
const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_API_KEY);

async function generateAudioWithGoogleTTS(script, filename = null) {
  try {
    if (!googleAI) {
      console.error('❌ Google AI Studio client not initialized. Check GOOGLE_AI_STUDIO_API_KEY.');
      return null;
    }

    if (!script || script.length === 0) {
      console.warn('No script to convert to audio with Google TTS');
      return null;
    }

    console.log('🎤 Generating audio with Google AI Studio Gemini TTS...');

    // Use Gemini 2.5 Flash TTS model
    const model = googleAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-preview-tts",
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: 'Kore' // Using Kore voice which supports multiple languages including Urdu
            },
          },
        },
      },
    });

    const response = await model.generateContent(script);

    // Debug: Log the response structure
    console.log('🔍 Response structure:', JSON.stringify(response, null, 2));
    
    // Extract audio data from response
    const audioData = response.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioData) {
      console.error('❌ No audio data received from Google TTS');
      console.log('🔍 Response candidates:', response.response?.candidates);
      console.log('🔍 First candidate:', response.response?.candidates?.[0]);
      return null;
    }

    // Convert base64 to buffer and save as WAV file
    const audioBuffer = Buffer.from(audioData, 'base64');
    
    // Ensure output directory exists
    const outputDir = './output/voiceovers';
    await fs.ensureDir(outputDir);
    
    // Create unique filename
    const timestamp = Date.now();
    const finalFilename = filename || `google_tts_awaz_${timestamp}.wav`;
    const outputPath = path.join(outputDir, finalFilename);

    // Save the audio file
    await fs.writeFile(outputPath, audioBuffer);
    
    console.log(`✅ Google TTS audio generated successfully: ${outputPath}`);
    return outputPath;

  } catch (error) {
    console.error('❌ Google AI Studio TTS API error:', error.message);
    
    // Handle specific error types
    if (error.message && error.message.includes('429')) {
      console.error('🚫 Google AI Studio quota exceeded. Please check your billing and rate limits.');
    } else if (error.message && error.message.includes('401')) {
      console.error('🔑 Google AI Studio API key authentication failed.');
    } else if (error.message && error.message.includes('403')) {
      console.error('🚫 Google AI Studio API access forbidden. Check permissions.');
    } else {
      console.error('🔧 General Google TTS error. Full error:', error);
    }
    
    return null;
  }
}

async function generateCodeVoiceover() {
    try {
        const script = `یہ Node.js میں fs-extra library کا استعمال ہے۔ fs-extra ایک powerful library ہے جو Node.js کی built-in fs module کو extend کرتی ہے۔ اس میں تمام fs functionality شامل ہے اور اضافی features بھی ہیں جیسے کہ copy، move، اور ensureDir جیسے methods۔ یہ line fs-extra کو import کر رہی ہے تاکہ ہم file system operations آسانی سے کر سکیں۔`;

        console.log('📝 Script:', script);
        
        const filepath = await generateAudioWithGoogleTTS(script, 'code_explanation_fs_extra.wav');
        
        return filepath;
        
    } catch (error) {
        console.error('❌ Error generating code voice-over:', error.message);
        throw error;
    }
}

// Run the function
generateCodeVoiceover()
    .then((filepath) => {
        console.log('🎉 Voice-over script ready!');
    })
    .catch((error) => {
        console.error('💥 Failed to generate voice-over:', error);
    });