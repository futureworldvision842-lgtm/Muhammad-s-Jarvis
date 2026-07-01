require('dotenv').config();
const axios = require('axios');

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

/**
 * Test the voice-to-Perplexity integration
 */
async function testVoicePerplexity() {
  console.log('🧪 Testing Voice-to-Perplexity Integration...\n');
  
  // Check if API key is available
  if (!PERPLEXITY_API_KEY) {
    console.error('❌ PERPLEXITY_API_KEY not found in environment variables');
    console.log('\n📋 Setup Instructions:');
    console.log('1. Make sure you have a Perplexity API key');
    console.log('2. Add it to your .env file as PERPLEXITY_API_KEY=your_key_here');
    return;
  }
  
  console.log(`✅ Perplexity API Key found: ${PERPLEXITY_API_KEY.substring(0, 10)}...`);
  
  // Test transcript examples
  const testTranscripts = [
    "Hello, how are you today?",
    "آج موسم کیسا ہے؟", // "How is the weather today?" in Urdu
    "What is the capital of Pakistan?",
    "مجھے پاکستان کے بارے میں بتائیں" // "Tell me about Pakistan" in Urdu
  ];
  
  for (let i = 0; i < testTranscripts.length; i++) {
    const transcript = testTranscripts[i];
    console.log(`\n🎤 Test ${i + 1}: "${transcript}"`);
    console.log('⏳ Processing with Perplexity...');
    
    try {
      const response = await callPerplexityAPIForVoice(transcript);
      if (response) {
        console.log('✅ Response received:');
        console.log(`📝 ${response.substring(0, 200)}${response.length > 200 ? '...' : ''}`);
      } else {
        console.log('❌ No response received');
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
    
    // Wait a bit between requests
    if (i < testTranscripts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n🎉 Voice-to-Perplexity integration test completed!');
}

/**
 * Call Perplexity API for voice responses with a simpler prompt
 */
async function callPerplexityAPIForVoice(transcript) {
  try {
    const VOICE_PROMPT = `You are a helpful AI assistant. The user has sent you a voice message that has been transcribed. Please provide a helpful, informative, and conversational response to their message.

The transcribed voice message is: "${transcript}"

Please respond in a natural, conversational way. If the message is in Urdu, respond in Urdu. If it's in English, respond in English. Keep your response concise but helpful.`;

    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'sonar',
      messages: [
        {
          role: 'user',
          content: VOICE_PROMPT
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Perplexity API error for voice:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return null;
  }
}

// Run the test
testVoicePerplexity().catch(console.error);