<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1bj7naCo0CApPo4PbHvaAm-vEpRGN0e9c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   
   **Note:** The `--legacy-peer-deps` flag is required due to React 19 compatibility with some dependencies.

2. API Key Configuration:
   - The API key is already configured in `vite.config.ts` as a fallback
   - For production, create a `.env` or `.env.local` file with:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

3. Run the app:
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

## Features

- **AI Chat** - Chat with Gemini AI with Google Search and Maps grounding
- **Image Generation** - Generate images using Imagen 4.0
- **Image Editing** - Edit images with AI-powered transformations
- **Video Generation (VEO)** - Create videos from text prompts
- **Video Analysis** - Analyze video content and transcribe audio
- **Live Conversation** - Real-time voice conversations with Gemini
- **Complex Reasoning** - Advanced reasoning with Gemini 2.5 Pro
- **Content Analysis** - Analyze text and images
- **Poster Generator** - Create custom posters with AI-generated backgrounds
- **QR Code Generator** - Generate QR codes for URLs and text
- **WhatsApp Bot Simulator** - Test AI features in a WhatsApp-like interface
- **AI Developer Assistant** - Code auditing and live updates
