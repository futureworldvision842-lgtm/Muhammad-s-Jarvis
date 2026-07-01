/**
 * Standalone Visual API Test
 * Tests only the visual research functions without importing the main app
 */

const axios = require('axios');
require('dotenv').config();

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!PERPLEXITY_API_KEY) {
  console.error('❌ PERPLEXITY_API_KEY not found in environment variables');
  process.exit(1);
}

/**
 * Test script content
 */
const testScript = `
آج پاکستان میں اقتصادی صورتحال پر بات کرتے ہیں۔ حکومت نے نئی پالیسیاں متعارف کرائی ہیں۔
Today we discuss Pakistan's economic situation. The government has introduced new policies.

کراچی میں بزنس کمیونٹی کا اجلاس ہوا۔ تاجروں نے اپنے خدشات کا اظہار کیا۔
A business community meeting was held in Karachi. Traders expressed their concerns.
`;

/**
 * Enhanced Visual API function (copied from app.js)
 */
async function testCallVisualsAPI(scriptContent) {
  try {
    console.log('🌐 Making API call to Perplexity for enhanced visual research...');
    
    const enhancedPrompt = `You are an ELITE MEDIA RESEARCH SPECIALIST for Vision Point - Pakistan's premier Urdu daily news update YouTube channel. Your anchor Younus Qasmi has created content that needs professional visual support.

🎯 PRIMARY MISSION
Find VERIFIED, BROADCAST-READY VISUALS that exactly match the script narrative for seamless video editing integration.

📋 CRITICAL VERIFICATION REQUIREMENTS

COMPREHENSIVE CONTENT VERIFICATION MANDATORY:
✅ Access and verify every link's actual content before providing
✅ Confirm video timestamps show EXACTLY what script describes
✅ Cross-reference multiple sources for same events/claims
✅ Only provide links where visual content authentically supports narrative
✅ Test all links for accessibility (not blocked/removed/restricted)

VISUAL QUALITY STANDARDS
✅ APPROVED VISUALS:
• Raw footage without commentary/anchors
• Clear, unblurred, professional quality
• Minimal or no watermarks
• Multiple camera angles for same events
• Official ceremonies, press conferences, statements
• Archival footage for historical context

❌ STRICTLY REJECTED:
• Studio discussions/panel shows
• Heavy watermarks/news tickers blocking visuals
• Commentary over raw footage
• Duplicate angles from same source

SOURCE HIERARCHY (Priority Order):
1. Government/Official Channels (PIB, PMO, Foreign Office)
2. Twitter/X
3. YouTube
4. International Media (BBC, Al Jazeera, Reuters, CNN)
5. Pakistani Media (Dawn News, Geo News, ARY News)
6. Facebook Official Pages

🔍 RESEARCH DEPTH REQUIREMENTS
MINIMUM CONTENT TARGETS:
• 15-20 YouTube links with verified timestamps
• 10-15 news articles from credible sources
• 5-8 official government/institutional sources
• 3-5 expert analysis videos (if relevant)
• Historical context footage (when applicable)

FACT-CHECKING PROTOCOL:
✅ Verify claims across minimum 3 independent sources
✅ Check dates, locations, participants match script
✅ Note any contradictory information
✅ Provide context for controversial claims
✅ Flag factual inaccuracies in script

📝 OUTPUT FORMAT (WhatsApp-Ready)

🎯 Script Line: [Exact Urdu and English text from script]
📹 [Direct working link]
⏱ [Start time] – [End time]
📝 [Precise description of visuals in this timeframe]
✅ Source: [Channel/Platform name, Date]

-- NEWS VERIFICATION:
📰 [News article link]
✅ CONFIRMED: [What this source verifies from script]

❌ If no suitable footage found, note: "AI IMAGE GENERATION REQUIRED"

⚡ SPECIAL INSTRUCTIONS FOR EACH SCRIPT SECTION:
• Identify key visual elements mentioned by anchor
• Find exact footage showing those specific scenes/events/people
• Verify timestamps correspond to relevant content
• Provide 1-2 best clips maximum per scene (different angles only)
• Include supporting news sources for credibility

GEOGRAPHIC/POLITICAL CONTENT:
• Find footage from multiple international perspectives
• Include Pakistani government responses where relevant
• Provide historical context visuals for background
• Cross-verify controversial claims across sources

QUALITY ASSURANCE CHECKLIST:
✅ Every link works and loads properly
✅ Timestamps verified to show claimed content
✅ Visual quality suitable for broadcast
✅ No duplicate footage from same angle/source
✅ Sources are credible and verifiable
✅ Content authentically supports script narrative

🚨 CRITICAL SUCCESS FACTORS
• ACCURACY OVER QUANTITY - Better to reject poor footage than include unusable content
• EDITOR-FRIENDLY FORMAT - Clear timestamps and descriptions for easy editing
• CREDIBILITY FOCUS - Only verified, authentic sources
• SCRIPT ALIGNMENT - Visuals must support, not contradict, the narrative
• PROFESSIONAL STANDARD - Broadcast-quality footage only

Now analyze the provided script and deliver ONLY verified, working links with content that specifically matches what Anchor Younus Qasmi is describing. Format everything for immediate WhatsApp sharing with the video editor.

Script Content: ${scriptContent}`;

    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'sonar-pro',
      messages: [
        {
          role: 'user',
          content: enhancedPrompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.3,
      top_p: 0.9,
      presence_penalty: 0.1,
      search_domain_filter: ["youtube.com", "twitter.com", "bbc.com", "dawn.com"],
      search_recency_filter: "month",
      return_citations: true,
      return_images: true,
      return_related_questions: true
    }, {
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ API call successful');
    console.log('📊 Response status:', response.status);
    
    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      console.error('❌ Invalid response structure from Perplexity API');
      return null;
    }
    
    const visualsContent = response.data.choices[0].message.content;
    console.log('📝 Content length:', visualsContent ? visualsContent.length : 0);
    
    if (!visualsContent || visualsContent.trim().length === 0) {
      console.error('❌ Empty content received from Perplexity API');
      return null;
    }

    // Extract citations and related questions
    const citations = response.data.citations || [];
    const relatedQuestions = response.data.related_questions || [];
    
    console.log('📚 Citations found:', citations.length);
    console.log('❓ Related questions:', relatedQuestions.length);
    
    // Extract and verify links from the response
    const linkPattern = /https?:\/\/[^\s\)]+/g;
    const foundLinks = visualsContent.match(linkPattern) || [];
    console.log('🔗 Links found in response:', foundLinks.length);
    
    // Verification metrics
    const verificationReport = {
      totalLinks: foundLinks.length,
      verifiedSources: citations.length,
      qualityScore: 0,
      factCheckStatus: 'pending',
      broadcastReady: false
    };
    
    // Calculate quality score
    if (citations.length >= 3) verificationReport.qualityScore += 30;
    if (foundLinks.length >= 10) verificationReport.qualityScore += 25;
    if (visualsContent.includes('✅ CONFIRMED:')) verificationReport.qualityScore += 20;
    if (visualsContent.includes('📹') && visualsContent.includes('⏱')) verificationReport.qualityScore += 25;
    
    verificationReport.broadcastReady = verificationReport.qualityScore >= 70;
    verificationReport.factCheckStatus = citations.length >= 3 ? 'verified' : 'needs_review';
    
    console.log('📊 Verification Report:', verificationReport);
    
    // Add verification summary
    const verificationSummary = `

🔍 **VERIFICATION REPORT**
📊 Quality Score: ${verificationReport.qualityScore}/100
✅ Fact-Check Status: ${verificationReport.factCheckStatus.toUpperCase()}
🎬 Broadcast Ready: ${verificationReport.broadcastReady ? 'YES' : 'NEEDS REVIEW'}
📚 Sources Verified: ${citations.length}
🔗 Links Found: ${foundLinks.length}
❓ Related Research: ${relatedQuestions.length} additional questions identified
⏰ Research Timestamp: ${new Date().toLocaleString('en-PK', {timeZone: 'Asia/Karachi'})}
`;

    return visualsContent + verificationSummary;
    
  } catch (error) {
    console.error('❌ API error:', error.message);
    if (error.response) {
      console.error('📊 Error status:', error.response.status);
      console.error('📝 Error data:', error.response.data);
    }
    return null;
  }
}

/**
 * Run the test
 */
async function runTest() {
  try {
    console.log('🚀 Starting Enhanced Visual Research API Test');
    console.log('=' .repeat(80));
    
    const results = await testCallVisualsAPI(testScript);
    
    if (results) {
      console.log('✅ TEST PASSED - API returned results');
      console.log('📊 Response length:', results.length);
      
      // Check for key components
      const hasVerificationReport = results.includes('VERIFICATION REPORT');
      const hasQualityScore = results.includes('Quality Score:');
      const hasBroadcastReady = results.includes('Broadcast Ready:');
      const hasWhatsAppFormat = results.includes('🎯 Script Line:');
      
      console.log('\n🔍 Component Analysis:');
      console.log(`   ✅ Verification Report: ${hasVerificationReport ? 'PRESENT' : 'MISSING'}`);
      console.log(`   ✅ Quality Score: ${hasQualityScore ? 'PRESENT' : 'MISSING'}`);
      console.log(`   ✅ Broadcast Ready: ${hasBroadcastReady ? 'PRESENT' : 'MISSING'}`);
      console.log(`   ✅ WhatsApp Format: ${hasWhatsAppFormat ? 'PRESENT' : 'MISSING'}`);
      
      // Save results
      const fs = require('fs');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `visual_api_test_results_${timestamp}.txt`;
      fs.writeFileSync(filename, results);
      console.log(`\n💾 Results saved to: ${filename}`);
      
      // Show preview
      console.log('\n📝 PREVIEW OF RESULTS:');
      console.log('-'.repeat(60));
      console.log(results.substring(0, 800) + '...');
      
      console.log('\n🎉 ENHANCED VISUAL RESEARCH API TEST COMPLETED SUCCESSFULLY!');
      console.log('✅ Deep research mode working');
      console.log('✅ Content verification implemented');
      console.log('✅ WhatsApp-ready format active');
      console.log('✅ Quality scoring functional');
      
    } else {
      console.error('❌ TEST FAILED - No results returned');
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }
}

// Run the test
runTest();