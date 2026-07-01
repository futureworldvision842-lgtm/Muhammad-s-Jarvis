const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
    console.error('❌ ElevenLabs API key not found in environment variables');
    process.exit(1);
}

console.log('🔑 ElevenLabs API key found');

async function testElevenLabsConnection() {
    try {
        console.log('🧪 Testing ElevenLabs API connection...');
        
        // Test API connection by getting user info
        const response = await axios.get('https://api.elevenlabs.io/v1/user', {
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY
            }
        });
        
        console.log('✅ ElevenLabs API connection successful');
        console.log('👤 User info:', {
            subscription: response.data.subscription?.tier || 'Free',
            character_count: response.data.subscription?.character_count || 0,
            character_limit: response.data.subscription?.character_limit || 10000
        });
        
        return true;
    } catch (error) {
        console.error('❌ ElevenLabs API connection failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        return false;
    }
}

async function testTranscription() {
    try {
        console.log('🎤 Testing ElevenLabs Speech-to-Text...');
        
        // Check if we have any audio files to test with
        const audioFiles = ['test.mp3', 'test.wav', 'test.m4a', 'sample.mp3', 'sample.wav', 'audio.mp3', 'voice.wav', 'test_audio.mp3'];
        let testFile = null;
        
        for (const file of audioFiles) {
            if (fs.existsSync(file)) {
                testFile = file;
                break;
            }
        }
        
        if (!testFile) {
            console.log('⚠️ No test audio file found. Please add a test audio file (test.mp3, test.wav, etc.) to test transcription.');
            console.log('📁 Available files in current directory:');
            const files = fs.readdirSync('.').filter(f => f.match(/\.(mp3|wav|m4a|ogg|flac)$/i));
            if (files.length > 0) {
                console.log('   Audio files found:', files.join(', '));
            } else {
                console.log('   No audio files found');
            }
            return false;
        }
        
        console.log(`🎵 Using test file: ${testFile}`);
        
        const formData = new FormData();
        formData.append('file', fs.createReadStream(testFile));
        formData.append('model_id', 'scribe_v1');
        formData.append('language_code', 'en'); // You can change this to 'ur' for Urdu
        formData.append('tag_audio_events', 'false');
        formData.append('diarize', 'false');
        formData.append('timestamps_granularity', 'word');
        
        const response = await axios.post('https://api.elevenlabs.io/v1/speech-to-text/convert', formData, {
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                ...formData.getHeaders()
            },
            timeout: 45000 // 45 seconds timeout
        });
        
        const transcription = response.data.text?.trim();
        
        if (transcription && transcription.length >= 3) {
            console.log('✅ Transcription successful!');
            console.log('📝 Transcribed text:', transcription);
            return true;
        } else {
            console.log('⚠️ Transcription returned empty or very short text');
            console.log('📝 Raw response:', response.data);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Transcription test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        return false;
    }
}

async function runTests() {
    console.log('🚀 Starting ElevenLabs API tests...\n');
    
    const connectionTest = await testElevenLabsConnection();
    console.log('');
    
    if (connectionTest) {
        await testTranscription();
    }
    
    console.log('\n🏁 Tests completed');
}

runTests().catch(console.error);