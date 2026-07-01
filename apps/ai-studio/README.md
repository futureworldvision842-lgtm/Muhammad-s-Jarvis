# Vision Point AI Studio - Complete System

## Overview

**Vision Point AI Studio** is a comprehensive AI automation platform combining powerful AI features with WhatsApp automation for content creation, especially for Urdu news and media production.

## Features

### ✨ AI Features
- **AI Chat** - Chat with Gemini with Google Search/Maps grounding
- **Image Generation** - Generate images using Imagen 4.0
- **Image Editing** - Edit images with AI transformations
- **Video Generation** - Create videos using VEO 3.1
- **Video Analysis** - Analyze videos and transcribe audio
- **Live Conversation** - Real-time voice conversations
- **Complex Reasoning** - Advanced reasoning with Gemini 2.5 Pro
- **Content Analysis** - Analyze text and images
- **Poster Generator** - Create custom posters
- **QR Code Generator** - Generate QR codes
- **Developer Assistant** - Code auditing and generation

### 📱 WhatsApp Automation
- **Urdu Script Generation** - Professional Urdu scripts from topics
- **Voice Generation** - Google TTS with Urdu voices
- **Visual Research** - Find verified visuals for video editing
- **Headlines/Agenda** - Get top 10 news headlines
- **Group Management** - Automated content delivery to WhatsApp groups
- **Commands Support**: `topic:`, `script:`, `voice:`, `visuals:`, `agenda`

## Installation

### Prerequisites
- Node.js 16+ installed
- Google Gemini API key

### Step 1: Clone/Navigate to Project
```bash
cd "e:\Muhammad's Work VP automation\full bot\vision-point-ai-studio-complete"
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install --legacy-peer-deps
```

### Step 4: Configure Environment
Backend `.env` file is already configured with your API key:
```
GEMINI_API_KEY=fK52HAPA8C9cwGjfxE7knLRVbcZgu3LZKOloiM2uD74z5IS4IIfwL3dFQhRZ
```

## Running the Application

### Option 1: Run Both Together (Recommended)
From project root:
```bash
# Install concurrently globally (one time only)
npm install -g concurrently

# Run both backend and frontend
cd backend && npm start & cd ../frontend && npm run dev
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## WhatsApp Bot Setup

1. Start the backend server
2. Wait for QR code to appear in terminal
3. Scan with WhatsApp on your phone
4. Bot will auto-connect to configured groups:
   - Content
   - VP RAW VIDEOS
   - Demo script
   - Demo visual

## Using WhatsApp Commands

Send these commands in WhatsApp:

- `topic: Pakistan latest news` - Generate full script with audio and visuals
- `script: Israel Palestine conflict` - Generate script only
- `voice: [your text]` - Generate Urdu audio
- `visuals: [script content]` - Research visuals for script
- `agenda` - Get top 10 headlines
- Send number `1-10` - Generate script for that headline

## API Endpoints

### Chat
- `POST /api/chat/generate` - Generate text with grounding
- `POST /api/chat/complex` - Complex reasoning
- `POST /api/chat/analyze` - Analyze content

### Image
- `POST /api/image/generate` - Generate image
- `POST /api/image/edit` - Edit image

### Video
- `POST /api/video/generate` - Generate video
- `POST /api/video/analyze` - Analyze video
- `POST /api/video/transcribe` - Transcribe audio

### Content (Urdu Scripts)
- `POST /api/content/script` - Generate Urdu script
- `POST /api/content/visuals` - Generate visual research
- `POST /api/content/voice` - Generate audio
- `GET /api/content/headlines` - Get headlines
- `POST /api/content/poster` - Generate poster

### WhatsApp
- `POST /api/whatsapp/connect` - Connect to WhatsApp
- `GET /api/whatsapp/status` - Get connection status
- `POST /api/whatsapp/send` - Send message
- `GET /api/whatsapp/groups` - Get groups

## Architecture

```
vision-point-ai-studio-complete/
├── backend/                 # Node.js Express server
│   ├── server.js           # Main server file
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   │   ├── geminiService.js    # Google Gemini API
│   │   ├── whatsappService.js  # WhatsApp automation
│   │   ├── scriptService.js    # Urdu script generation
│   │   └── audioService.js     # Google TTS
│   ├── config/             # Configuration
│   └── output/             # Generated audio files
└── frontend/               # React + Vite
    ├── App.tsx             # Main app component
    ├── components/         # UI components (16+)
    ├── services/           # API service layer
    └── index.html          # Entry point
```

## Technologies Used

### Backend
- Express.js - Web server
- @google/genai - Google Gemini API
- @whiskeysockets/baileys - WhatsApp automation
- Google Cloud TTS - Urdu voice generation
- Axios - HTTP client

### Frontend
- React 19 - UI framework
- Vite - Build tool
- Lucide React - Icons
- TypeScript - Type safety

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify API key in `.env` file
- Run `npm install` in backend directory

### Frontend won't start
- Check if port 3000 is available
- Run `npm install --legacy-peer-deps` in frontend directory

### WhatsApp won't connect
- Delete `backend/session` folder and restart
- Check internet connection
- Scan QR code within 60 seconds

### Audio generation fails
- Verify Google API key has TTS enabled
- Check `backend/output/voiceovers` folder exists
- Check terminal for specific error messages

## Support

For issues or questions, check:
1. Terminal logs for error messages
2. Browser console for frontend errors
3. Backend `/health` endpoint for status

## License

MIT License - Vision Point AI Studio
