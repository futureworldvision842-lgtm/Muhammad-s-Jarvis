require('dotenv').config();

module.exports = {
  // Google Gemini API
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  
  // Server Config
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // WhatsApp Config
  SESSION_DIR: process.env.SESSION_DIR || './session',
  CONTENT_GROUP_NAME: process.env.CONTENT_GROUP_NAME || 'Content',
  RAW_VIDEOS_GROUP_NAME: process.env.RAW_VIDEOS_GROUP_NAME || 'VP RAW VIDEOS',
  DEMO_SCRIPT_GROUP_NAME: process.env.DEMO_SCRIPT_GROUP_NAME || 'Demo script',
  DEMO_VISUAL_GROUP_NAME: process.env.DEMO_VISUAL_GROUP_NAME || 'Demo visual',
  
  // Google TTS Config
  GOOGLE_TTS_LANGUAGE_CODE: process.env.GOOGLE_TTS_LANGUAGE_CODE || 'ur-PK',
  GOOGLE_TTS_VOICE_NAME: process.env.GOOGLE_TTS_VOICE_NAME || 'ur-PK-Standard-A',
};
