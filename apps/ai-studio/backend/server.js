require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./config/api.config');

// Import routes
const chatRoutes = require('./routes/chat');
const imageRoutes = require('./routes/image');
const videoRoutes = require('./routes/video');
const audioRoutes = require('./routes/audio');
const contentRoutes = require('./routes/content');
const developerRoutes = require('./routes/developer');
const whatsappRoutes = require('./routes/whatsapp');
const testRoutes = require('./routes/test');

// Import WhatsApp service
const whatsappService = require('./services/whatsappService');

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/developer', developerRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/test', testRoutes); // Test endpoints

// Internet connection check helper
const dns = require('dns');
function checkInternetConnection() {
    return new Promise((resolve) => {
        dns.lookup('google.com', (err) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

// Health check
app.get('/health', async (req, res) => {
    const isOnline = await checkInternetConnection();
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        connectivity: isOnline ? 'online' : 'offline',
        whatsapp: whatsappService.getStatus()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Vision Point AI Studio Backend Server',
        version: '1.0.0',
        endpoints: [
            '/api/chat/*',
            '/api/image/*',
            '/api/video/*',
            '/api/audio/*',
            '/api/content/*',
            '/api/developer/*',
            '/api/whatsapp/*',
            '/health'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: err.message || 'Internal server error'
    });
});

// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                                                          ║');
    console.log('║       Vision Point AI Studio - Backend Server           ║');
    console.log('║                                                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Server running on: http://localhost:${PORT}`);
    console.log(`✅ Frontend URL: ${config.FRONTEND_URL}`);
    console.log(`✅ API Key configured: ${config.GEMINI_API_KEY ? 'Yes' : 'No'}`);
    console.log('');
    console.log('Available Endpoints:');
    console.log('  📝 Chat: POST /api/chat/generate');
    console.log('  🖼️  Image: POST /api/image/generate');
    console.log('  🎬 Video: POST /api/video/generate');
    console.log('  🎤 Audio: POST /api/audio/generate-speech');
    console.log('  📄 Content: POST /api/content/script');
    console.log('  💻 Developer: POST /api/developer/audit');
    console.log('  📱 WhatsApp: POST /api/whatsapp/connect');
    console.log('  ❤️  Health: GET /health');
    console.log('');
    console.log('🚀 Ready to serve requests!');
    console.log('');

    // Auto-connect WhatsApp
    console.log('📱 Auto-connecting to WhatsApp...');
    whatsappService.connectToWhatsApp()
        .then(() => console.log('✅ WhatsApp connection initiated'))
        .catch(err => console.error('❌ WhatsApp connection failed:', err.message));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});
