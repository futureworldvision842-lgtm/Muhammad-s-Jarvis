#!/usr/bin/env node

/**
 * AssemblyAI Free Speech-to-Text Test Script
 * 
 * This script demonstrates how to use AssemblyAI's free tier (416 hours) for speech-to-text transcription.
 * 
 * Setup Instructions:
 * 1. Go to https://www.assemblyai.com/app/account
 * 2. Sign up for a free account
 * 3. Get your API key from the dashboard
 * 4. Add ASSEMBLYAI_API_KEY=your_key_here to your .env file
 * 5. Run: node test_assemblyai.js
 */

require('dotenv').config();
const { AssemblyAI } = require('assemblyai');
const fs = require('fs');
const path = require('path');

// AssemblyAI API Key
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

console.log('🔧 AssemblyAI Free Speech-to-Text Test');
console.log('=====================================');

if (!ASSEMBLYAI_API_KEY) {
  console.log('❌ ASSEMBLYAI_API_KEY not found in environment variables');
  console.log('');
  console.log('📋 Setup Instructions:');
  console.log('1. Go to https://www.assemblyai.com/app/account');
  console.log('2. Sign up for a free account (416 free hours!)');
  console.log('3. Get your API key from the dashboard');
  console.log('4. Add ASSEMBLYAI_API_KEY=your_key_here to your .env file');
  console.log('5. Run this script again');
  console.log('');
  console.log('💡 AssemblyAI offers:');
  console.log('   • 416 FREE hours of transcription');
  console.log('   • High accuracy speech-to-text');
  console.log('   • Support for 99+ languages');
  console.log('   • Real-time and batch processing');
  console.log('   • No credit card required for free tier');
  process.exit(1);
}

console.log(`✅ AssemblyAI API Key found: ${ASSEMBLYAI_API_KEY.substring(0, 10)}...`);

// Initialize AssemblyAI client
const client = new AssemblyAI({
  apiKey: ASSEMBLYAI_API_KEY
});

async function testAssemblyAI() {
  try {
    console.log('');
    console.log('🎤 Testing AssemblyAI Speech-to-Text...');
    
    // Look for test audio files
    const audioFiles = [
      'test_audio.mp3',
      'sample.mp3',
      'audio.mp3',
      'test.mp3',
      'voice.mp3'
    ];
    
    let audioFile = null;
    for (const file of audioFiles) {
      if (fs.existsSync(file)) {
        audioFile = file;
        break;
      }
    }
    
    if (!audioFile) {
      console.log('⚠️ No test audio file found. Please add one of these files:');
      audioFiles.forEach(file => console.log(`   • ${file}`));
      console.log('');
      console.log('💡 You can download a sample audio file or record a short voice message');
      return;
    }
    
    console.log(`📁 Using audio file: ${audioFile}`);
    
    // Check file size
    const stats = fs.statSync(audioFile);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    
    if (stats.size === 0) {
      console.log('❌ Audio file is empty');
      return;
    }
    
    // Transcribe the audio file
    console.log('🔄 Uploading and transcribing audio...');
    
    const config = {
      audio: audioFile,
      language_code: 'ur', // Urdu language
      // Additional options for better accuracy
      punctuate: true,
      format_text: true,
      dual_channel: false,
      speaker_labels: false
    };
    
    const transcript = await client.transcripts.transcribe(config);
    
    if (transcript.status === 'error') {
      console.log('❌ Transcription failed:', transcript.error);
      return;
    }
    
    console.log('✅ Transcription successful!');
    console.log('');
    console.log('📝 Transcript:');
    console.log('─'.repeat(50));
    console.log(transcript.text);
    console.log('─'.repeat(50));
    console.log('');
    
    // Show additional information
    if (transcript.confidence) {
      console.log(`🎯 Confidence: ${(transcript.confidence * 100).toFixed(1)}%`);
    }
    
    if (transcript.audio_duration) {
      console.log(`⏱️ Audio duration: ${transcript.audio_duration} seconds`);
    }
    
    console.log('');
    console.log('🎉 AssemblyAI test completed successfully!');
    console.log('💡 You can now use AssemblyAI for free speech-to-text in your WhatsApp bot');
    
  } catch (error) {
    console.log('❌ AssemblyAI test failed:', error.message);
    
    if (error.response) {
      console.log('API Response:', error.response.status, error.response.statusText);
      if (error.response.data) {
        console.log('Error details:', error.response.data);
      }
    }
    
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check your API key is correct');
    console.log('2. Ensure you have internet connection');
    console.log('3. Verify the audio file is valid');
    console.log('4. Check AssemblyAI service status');
  }
}

// Run the test
testAssemblyAI();