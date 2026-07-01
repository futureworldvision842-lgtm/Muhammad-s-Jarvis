require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'; // Default voice

async function testAudioGeneration() {
  try {
    console.log('🎵 Testing audio generation...');
    
    const testText = 'یہ ایک ٹیسٹ آڈیو ہے۔ اگر آپ یہ سن رہے ہیں تو آڈیو ٹھیک سے کام کر رہا ہے۔';
    
    console.log(`📝 Text to convert: ${testText}`);
    console.log(`🎤 Using voice ID: ${ELEVENLABS_VOICE_ID}`);
    
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        text: testText,
        model_id: 'eleven_v3',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true
        }
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );
    
    // Create output directory if it doesn't exist
    const outputDir = './output/voiceovers';
    await fs.mkdir(outputDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const audioPath = path.join(outputDir, `test_audio_${timestamp}.mp3`);
    
    await fs.writeFile(audioPath, response.data);
    
    console.log(`✅ Audio generated successfully: ${audioPath}`);
    
    // Check file size
    const stats = await fs.stat(audioPath);
    console.log(`📊 File size: ${stats.size} bytes`);
    
    if (stats.size > 0) {
      console.log('✅ Audio file is valid (size > 0)');
      return audioPath;
    } else {
      console.log('❌ Audio file is empty');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Audio generation failed:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    }
    return null;
  }
}

// Run test
testAudioGeneration()
  .then(result => {
    if (result) {
      console.log(`\n🎉 Audio generation test PASSED!`);
      console.log(`📁 Generated file: ${result}`);
    } else {
      console.log(`\n❌ Audio generation test FAILED!`);
    }
  })
  .catch(error => {
    console.error('\n💥 Test crashed:', error.message);
  });