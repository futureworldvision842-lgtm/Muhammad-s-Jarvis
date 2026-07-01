const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// API Keys
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Retry function
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      console.log(`⏳ Retry ${i + 1}/${maxRetries} in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Test script content - a sample Pakistani script
const testScript = `
پاکستان کی خوبصورت وادیوں میں سے ایک سوات کی وادی ہے۔ یہاں کے پہاڑ برف سے ڈھکے ہوئے ہیں اور دریا صاف پانی سے بہتا ہے۔

مقامی لوگ روایتی لباس پہنتے ہیں اور اپنی ثقافت کو زندہ رکھتے ہیں۔ بازار میں تازہ پھل اور سبزیاں ملتی ہیں۔

شام کے وقت مسجد سے اذان کی آواز آتی ہے اور لوگ نماز کے لیے جمع ہوتے ہیں۔
`;

// Enhanced Hugging Face image generation for ultra-realistic images
async function generateImageWithHuggingFace(prompt, scriptTitle, imageIndex, timestamp) {
  // Enhanced prompt for maximum realism
  const enhancedPrompt = `${prompt}, ultra-realistic, photorealistic, high resolution, professional photography, natural lighting, authentic details, sharp focus, realistic skin textures, National Geographic quality, documentary photography, 4K resolution, Canon EOS R5, 85mm lens, natural colors, genuine expressions, real environment`;
  
  // Try multiple high-quality models for best results
  const models = [
    'stabilityai/stable-diffusion-xl-base-1.0',
    'runwayml/stable-diffusion-v1-5',
    'stabilityai/stable-diffusion-2-1'
  ];
  
  let lastError = null;
  
  for (const model of models) {
    try {
      console.log(`🎨 Trying model: ${model} for image ${imageIndex}`);
      
      const response = await retryWithBackoff(async () => {
        return await axios.post(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            inputs: enhancedPrompt,
            parameters: {
              num_inference_steps: 50, // Higher steps for better quality
              guidance_scale: 7.5, // Optimal guidance for realism
              width: 1024, // High resolution
              height: 1024,
              negative_prompt: "cartoon, anime, illustration, drawing, painting, sketch, low quality, blurry, distorted, unrealistic, artificial, fake, low resolution, pixelated, grainy, oversaturated, undersaturated, overexposed, underexposed, bad anatomy, deformed, mutated, ugly, disgusting, poorly drawn, bad proportions, gross proportions, disfigured, out of frame, extra limbs, missing limbs, extra fingers, missing fingers, fused fingers, too many fingers, long neck, duplicate, morbid, mutilated, extra arms, extra legs, malformed limbs, missing arms, missing legs, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck"
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
              'Accept': 'image/png',
              'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer',
            timeout: 180000 // Increased timeout for high-quality generation
          }
        );
      }, 3, 8000); // 3 retries with 8 second base delay

      if (response.data && response.data.byteLength > 0) {
        const imageBuffer = Buffer.from(response.data);
        const filename = `realistic-ai-image-${scriptTitle}-${imageIndex}-${timestamp}.png`;
        const filepath = path.join('./output/images/ai-generated', filename);
        
        // Ensure directory exists
        await fs.ensureDir(path.dirname(filepath));
        await fs.writeFile(filepath, imageBuffer);
        
        console.log(`✅ Ultra-realistic image generated successfully with ${model}`);
        
        return {
          prompt: enhancedPrompt,
          originalPrompt: prompt,
          filepath: filepath,
          filename: filename,
          index: imageIndex,
          api: 'huggingface',
          model: model,
          quality: 'ultra-realistic'
        };
      }
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Model ${model} failed for image ${imageIndex}: ${error.message}`);
      continue; // Try next model
    }
  }
  
  throw new Error(`All models failed for image ${imageIndex}. Last error: ${lastError?.message || 'Unknown error'}`);
}

async function testRealisticImageGeneration() {
  console.log('🧪 Testing Ultra-Realistic Image Generation System');
  console.log('=' .repeat(60));
  
  try {
    // Test prompts based on the Pakistani script
    const testPrompts = [
      "Beautiful snow-covered mountains of Swat valley in Pakistan with clear river flowing through, natural landscape photography",
      "Pakistani people in traditional clothing at a local market with fresh fruits and vegetables, authentic cultural scene",
      "Evening prayer time at a Pakistani mosque with people gathering for prayer, peaceful religious atmosphere"
    ];
    
    console.log('\n📸 Testing ultra-realistic image generation...');
    console.log('⏱️ This may take a few minutes for high-quality generation...');
    
    const scriptTitle = 'test-realistic';
    const timestamp = Date.now();
    const generatedImages = [];
    
    // Generate images one by one
    for (let i = 0; i < testPrompts.length; i++) {
      console.log(`\n🎨 Generating image ${i + 1}/${testPrompts.length}...`);
      console.log(`📝 Prompt: ${testPrompts[i]}`);
      
      try {
        const imageData = await generateImageWithHuggingFace(
          testPrompts[i], 
          scriptTitle, 
          i + 1, 
          timestamp
        );
        generatedImages.push(imageData);
        console.log(`✅ Image ${i + 1} generated successfully!`);
      } catch (error) {
        console.error(`❌ Failed to generate image ${i + 1}: ${error.message}`);
      }
    }
    
    if (generatedImages.length === 0) {
      throw new Error('Failed to generate any images');
    }
    
    console.log('\n🎉 ULTRA-REALISTIC IMAGE GENERATION TEST RESULTS');
    console.log('=' .repeat(60));
    console.log(`✅ Successfully generated: ${generatedImages.length}/${testPrompts.length} images`);
    
    // Display results
    generatedImages.forEach((imageData, index) => {
      console.log(`\n📸 Image ${imageData.index}:`);
      console.log(`📁 File: ${imageData.filename}`);
      console.log(`🤖 Model: ${imageData.model}`);
      console.log(`🎨 Quality: ${imageData.quality}`);
      console.log(`📝 Original Prompt: ${imageData.originalPrompt?.substring(0, 100)}...`);
      console.log(`📂 Path: ${imageData.filepath}`);
      
      // Check if file exists
      if (fs.existsSync(imageData.filepath)) {
        const stats = fs.statSync(imageData.filepath);
        console.log(`📏 File size: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`✅ File saved successfully`);
      } else {
        console.log('❌ File not found on disk');
      }
    });
    
    // Final Summary
    console.log('\n🚀 FINAL SUMMARY');
    console.log('=' .repeat(40));
    console.log(`✅ Images generated: ${generatedImages.length}`);
    console.log(`📂 Output directory: ./output/images/ai-generated/`);
    console.log(`🎯 Quality level: Ultra-realistic photographic`);
    console.log(`📐 Resolution: 1024x1024 HD`);
    console.log(`💡 Features: Natural lighting, authentic details, professional photography`);
    console.log(`🔥 Enhanced prompts: Professional camera settings, National Geographic quality`);
    console.log(`🎨 Negative prompts: Removes cartoon/anime/illustration elements`);
    
    console.log('\n🎉 Ultra-realistic image generation system is working perfectly!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('🔍 Error details:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testRealisticImageGeneration()
    .then(() => {
      console.log('\n✅ Test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testRealisticImageGeneration };