const axios = require('axios');
require('dotenv').config();

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

const modelsToTry = [
  'llama-3.1-sonar-small-128k-online',
  'llama-3.1-sonar-large-128k-online', 
  'sonar-small-chat',
  'sonar-medium-chat',
  'sonar-small-online',
  'sonar-medium-online',
  'llama-3-sonar-small-32k-chat',
  'llama-3-sonar-small-32k-online',
  'llama-3-sonar-large-32k-chat',
  'llama-3-sonar-large-32k-online'
];

async function testModels() {
  console.log('Testing Perplexity API models...\n');
  
  for (const model of modelsToTry) {
    try {
      console.log(`Testing model: ${model}`);
      const response = await axios.post('https://api.perplexity.ai/chat/completions', {
        model: model,
        messages: [
          {
            role: 'user',
            content: 'Hello, write one sentence in Urdu about technology.'
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ SUCCESS with ${model}!`);
      console.log('Response:', response.data.choices[0].message.content);
      console.log('\n');
      break; // Stop after first success
    } catch (error) {
      console.log(`❌ Failed with ${model}: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

testModels().catch(console.error);