# Setup Instructions - Vision Point AI Studio

## Quick Start

The development server is not running. Follow these steps to start it:

### Step 1: Install Dependencies

Open a terminal/command prompt in this directory and run:

```bash
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is required due to React 19 compatibility.

### Step 2: Start the Development Server

After dependencies are installed, run:

```bash
npm run dev
```

### Step 3: Access the Application

Once the server starts, you should see output like:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open your browser and navigate to: **http://localhost:3000**

## Alternative: Use the Batch Script

If you're on Windows, you can simply double-click `start-dev.bat` which will:
1. Install dependencies automatically
2. Start the development server

## Troubleshooting

### If you get "npm is not recognized"
- Make sure Node.js is installed
- Download from: https://nodejs.org/
- Restart your terminal after installation

### If port 3000 is already in use
- The server will automatically try the next available port
- Check the terminal output for the actual port number

### If dependencies fail to install
- Make sure you have Node.js version 18 or higher
- Try clearing npm cache: `npm cache clean --force`
- Then try installing again: `npm install --legacy-peer-deps`

## API Key

The API key is already configured in `vite.config.ts`. No additional setup needed!

## Features Available

Once running, you'll have access to:
- AI Chat with Google Search & Maps
- Image Generation & Editing
- Video Generation & Analysis
- Live Voice Conversations
- Complex Reasoning
- Content Analysis
- Poster Generator
- QR Code Generator
- WhatsApp Bot Simulator
- AI Developer Assistant

