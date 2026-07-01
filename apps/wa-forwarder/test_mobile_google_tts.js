require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

// Initialize Google AI Studio client
const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_API_KEY);

/**
 * Test the updated Google TTS function with mobile-friendly MP3 output
 */
async function testMobileGoogleTTS() {
  try {
    console.log('🔍 Testing Mobile-Friendly Google TTS (MP3 output)...');
    
    // Test script in Urdu
    const testScript = 'یہ ایک ٹیسٹ ہے موبائل کے لیے۔ اگر آپ یہ آواز سن رہے ہیں تو MP3 فارمیٹ ٹھیک سے کام کر رہا ہے۔';
    console.log(`📝 Test script: ${testScript}`);

    if (!googleAI) {
      console.error('❌ Google AI Studio client not initialized. Check GOOGLE_AI_STUDIO_API_KEY.');
      return;
    }

    // Use Gemini 2.5 Flash TTS model
    const model = googleAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-preview-tts"
    });

    console.log('🎤 Generating audio with Google TTS...');
    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: testScript
        }]
      }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: 'Kore'
            },
          },
        },
      },
    });

    // Extract audio data
    const audioData = response.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioData) {
      console.error('❌ No audio data received from Google TTS');
      return;
    }

    console.log('✅ Audio data received');
    console.log(`📊 Base64 audio data length: ${audioData.length}`);

    // Convert base64 PCM data to buffer
    const pcmBuffer = Buffer.from(audioData, 'base64');
    console.log(`📊 PCM buffer size: ${pcmBuffer.length} bytes`);

    // Create output directory
    await fs.ensureDir('./output/voiceovers');

    // Create unique filename with timestamp (MP3 format for mobile compatibility)
    const timestamp = Date.now();
    const tempWavFilename = `test_mobile_temp_${timestamp}.wav`;
    const finalMp3Filename = `test_mobile_google_tts_${timestamp}.mp3`;
    const tempWavPath = path.join('./output/voiceovers', tempWavFilename);
    const outputPath = path.join('./output/voiceovers', finalMp3Filename);

    // Convert PCM to WAV format first (Google TTS specs: 24kHz, 16-bit, mono)
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
    
    // Save the temporary WAV file
    await fs.writeFile(tempWavPath, wavBuffer);
    console.log('✅ Temporary WAV file created');

    // Convert WAV to MP3 using ffmpeg for mobile compatibility
    console.log('🔄 Converting WAV to MP3 for mobile compatibility...');
    const ffmpegPath = path.join(__dirname, 'ffmpeg');
    
    try {
      await new Promise((resolve, reject) => {
        const ffmpeg = spawn(ffmpegPath, [
          '-i', tempWavPath,           // Input WAV file
          '-codec:a', 'mp3',           // Audio codec: MP3
          '-b:a', '128k',              // Audio bitrate: 128kbps (good quality, mobile-friendly)
          '-ar', '44100',              // Sample rate: 44.1kHz (standard for mobile)
          '-ac', '1',                  // Audio channels: mono (smaller file size)
          '-y',                        // Overwrite output file if exists
          outputPath                   // Output MP3 file
        ]);

        ffmpeg.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`FFmpeg process exited with code ${code}`));
          }
        });

        ffmpeg.on('error', (error) => {
          reject(error);
        });
      });

      // Clean up temporary WAV file
      await fs.unlink(tempWavPath);
      console.log('🗑️ Temporary WAV file cleaned up');

      // Validate final MP3 file
      const stats = await fs.stat(outputPath);
      console.log(`✅ MP3 file created successfully: ${outputPath}`);
      console.log(`📊 MP3 file size: ${stats.size} bytes (mobile-friendly format)`);
      
      // Test file properties
      console.log('\n📱 Mobile Compatibility Features:');
      console.log('✅ Format: MP3 (widely supported on all mobile devices)');
      console.log('✅ Bitrate: 128kbps (good quality, reasonable file size)');
      console.log('✅ Sample Rate: 44.1kHz (standard for mobile audio)');
      console.log('✅ Channels: Mono (smaller file size, perfect for voice)');
      
      console.log('\n🎉 Mobile-friendly Google TTS test completed successfully!');

    } catch (ffmpegError) {
      console.error('❌ FFmpeg conversion failed:', ffmpegError.message);
      // Clean up temporary WAV file
      try {
        await fs.unlink(tempWavPath);
      } catch (cleanupError) {
        console.warn('⚠️ Failed to clean up temporary WAV file:', cleanupError.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testMobileGoogleTTS();