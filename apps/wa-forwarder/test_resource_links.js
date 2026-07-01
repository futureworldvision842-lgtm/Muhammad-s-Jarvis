const axios = require('axios');

// Test the resource link generation functions
async function testResourceLinks() {
  console.log('🧪 Testing Resource Link Generation Functions...\n');
  
  // Test script content
  const testScript = `
  آج کل آرٹیفیشل انٹیلیجنس کی دنیا میں بہت تیزی سے ترقی ہو رہی ہے۔ 
  ChatGPT اور دیگر AI ٹولز نے انسانی زندگی کو آسان بنا دیا ہے۔ 
  یہ ٹیکنالوجی تعلیم، صحت، اور کاروبار میں انقلاب لا رہی ہے۔
  `;
  
  try {
    // Test YouTube links generation
    console.log('📺 Testing YouTube Links Generation...');
    const youtubeResponse = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that finds relevant YouTube videos with visual content.'
        },
        {
          role: 'user',
          content: `Find 3-5 relevant YouTube videos with strong visual content related to this script topic. Focus on videos that have good visuals, demonstrations, or educational content.

Script content: ${testScript}

Please provide:
1. Video title
2. Channel name  
3. Brief description of visual content
4. Estimated video URL or search terms

Format as a clean list with emojis.`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ YouTube Response:', youtubeResponse.data.choices[0].message.content.substring(0, 200) + '...\n');
    
    // Test Twitter links generation
    console.log('🐦 Testing Twitter Links Generation...');
    const twitterResponse = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that finds relevant Twitter/X posts with visual content.'
        },
        {
          role: 'user',
          content: `Find 3-5 relevant Twitter/X posts with visual content (images, videos, infographics) related to this script topic.

Script content: ${testScript}

Please provide:
1. Tweet content/description
2. Account name or handle
3. Type of visual content
4. Relevance to topic

Format as a clean list with emojis.`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Twitter Response:', twitterResponse.data.choices[0].message.content.substring(0, 200) + '...\n');
    
    console.log('🎉 Resource Link Generation Test Completed Successfully!');
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

// Load environment variables
require('dotenv').config();

// Run the test
testResourceLinks();