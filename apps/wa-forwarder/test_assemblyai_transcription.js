require('dotenv').config();
const { AssemblyAI } = require('assemblyai');
const fs = require('fs');
const path = require('path');

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

async function testAssemblyAITranscription() {
  console.log('🧪 Testing AssemblyAI Transcription');
  console.log('================================');
  
  if (!ASSEMBLYAI_API_KEY) {
    console.log('❌ ASSEMBLYAI_API_KEY not found in environment variables');
    console.log('\n📋 Setup Instructions:');
    console.log('1. Go to https://www.assemblyai.com/app/account');
    console.log('2. Sign up for a free account (416 free hours!)');
    console.log('3. Get your API key from the dashboard');
    console.log('4. Add ASSEMBLYAI_API_KEY=your_key_here to your .env file');
    console.log('5. Run this script again');
    return;
  }
  
  console.log(`✅ AssemblyAI API Key found: ${ASSEMBLYAI_API_KEY.substring(0, 10)}...`);
  
  // Check for test audio file
  const audioFilePath = path.join(__dirname, 'test_audio.mp3');
  
  if (!fs.existsSync(audioFilePath)) {
    console.log('❌ Test audio file not found: test_audio.mp3');
    console.log('Please ensure you have a test audio file in the project directory');
    return;
  }
  
  const stats = fs.statSync(audioFilePath);
  console.log(`📊 Audio file size: ${stats.size} bytes`);
  
  try {
    console.log('🆓 Starting AssemblyAI transcription...');
    
    const client = new AssemblyAI({
      apiKey: ASSEMBLYAI_API_KEY
    });
    
    // Upload the audio file first
    console.log('📤 Uploading audio file...');
    const audioFile = fs.readFileSync(audioFilePath);
    const uploadUrl = await client.files.upload(audioFile);
    console.log(`✅ File uploaded successfully: ${uploadUrl}`);
    
    const config = {
      audio_url: uploadUrl,
      language_code: 'ur', // Urdu language
      speaker_labels: false,
      auto_highlights: false,
      punctuate: true,
      format_text: true
    };
    
    console.log('🔄 Starting transcription...');
    const transcript = await client.transcripts.transcribe(config);
    
    if (transcript.status === 'completed' && transcript.text) {
      console.log('✅ Transcription successful!');
      console.log(`📝 Result: ${transcript.text}`);
      console.log(`⏱️ Duration: ${transcript.audio_duration}ms`);
      console.log(`🎯 Confidence: ${transcript.confidence || 'N/A'}`);
    } else if (transcript.status === 'error') {
      console.log(`❌ Transcription failed: ${transcript.error}`);
    } else {
      console.log(`⚠️ Unexpected status: ${transcript.status}`);
      console.log('Full response:', JSON.stringify(transcript, null, 2));
    }
    
  } catch (error) {
    console.log(`❌ Error during transcription: ${error.message}`);
    if (error.response) {
      console.log(`API Status: ${error.response.status}`);
      console.log(`API Error: ${JSON.stringify(error.response.data)}`);
    }
  }
}

testAssemblyAITranscription().catch(console.error);