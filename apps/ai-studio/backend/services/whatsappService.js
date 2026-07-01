const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const config = require('../config/api.config');
const scriptService = require('./scriptService');
const audioService = require('./audioService');
const fs = require('fs-extra');
const path = require('path');

let sock = null;
let groupIds = {
    content: null,
    rawVideos: null,
    demoScript: null,
    demoVisual: null
};
let qrCodeData = null;
let connectionStatus = 'disconnected';
let eventCallbacks = {
    onQR: null,
    onConnected: null,
    onMessage: null
};

/**
 * Connect to WhatsApp
 */
async function connectToWhatsApp() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_DIR);

        sock = makeWASocket({
            auth: state,
            printQRCode: true,
            browser: ['Vision Point Bot', 'Chrome', '1.0.0']
        });

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                qrCodeData = qr;
                connectionStatus = 'qr-ready';
                console.log('🔗 QR Code ready for scanning');
                qrcode.generate(qr, { small: true });

                if (eventCallbacks.onQR) {
                    eventCallbacks.onQR(qr);
                }
            }

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                    ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                    : true;

                console.log('Connection closed, reconnecting:', shouldReconnect);
                connectionStatus = 'disconnected';

                if (shouldReconnect) {
                    setTimeout(() => connectToWhatsApp(), 3000);
                }
            } else if (connection === 'open') {
                console.log('✅ WhatsApp connected successfully!');
                connectionStatus = 'connected';
                await findGroupJIDs();

                if (eventCallbacks.onConnected) {
                    eventCallbacks.onConnected();
                }
            }
        });

        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('messages.upsert', handleIncomingMessages);

    } catch (error) {
        console.error('WhatsApp connection error:', error);
        connectionStatus = 'error';
        throw error;
    }
}

/**
 * Find and store group JIDs
 */
async function findGroupJIDs() {
    try {
        const groups = await sock.groupFetchAllParticipating();
        const groupList = Object.values(groups);

        for (const group of groupList) {
            const groupName = group.subject?.toLowerCase();

            if (groupName === config.CONTENT_GROUP_NAME.toLowerCase()) {
                groupIds.content = group.id;
                console.log(`📝 Found "${config.CONTENT_GROUP_NAME}" group`);
            } else if (groupName === config.RAW_VIDEOS_GROUP_NAME.toLowerCase()) {
                groupIds.rawVideos = group.id;
                console.log(`🎥 Found "${config.RAW_VIDEOS_GROUP_NAME}" group`);
            } else if (groupName === config.DEMO_SCRIPT_GROUP_NAME.toLowerCase()) {
                groupIds.demoScript = group.id;
                console.log(`📄 Found "${config.DEMO_SCRIPT_GROUP_NAME}" group`);
            } else if (groupName === config.DEMO_VISUAL_GROUP_NAME.toLowerCase()) {
                groupIds.demoVisual = group.id;
                console.log(`🖼️ Found "${config.DEMO_VISUAL_GROUP_NAME}" group`);
            }
        }

        console.log('Group resolution complete:', groupIds);
    } catch (error) {
        console.error('Error finding groups:', error);
    }
}

/**
 * Handle incoming WhatsApp messages
 */
async function handleIncomingMessages(m) {
    try {
        const message = m.messages[0];
        if (!message || message.key.fromMe) return;

        const messageText = message.message?.conversation ||
            message.message?.extendedTextMessage?.text;

        if (!messageText) return;

        console.log('📨 Received message:', messageText.substring(0, 100));

        // Parse commands
        const command = parseCommand(messageText);

        if (command) {
            await handleCommand(command, message.key.id, message.key.remoteJid);
        } else if (message.key.remoteJid === groupIds.content) {
            // Treat as editorial content in Content group
            await processEditorial(messageText, message.key.id, message.key.remoteJid);
        }

        if (eventCallbacks.onMessage) {
            eventCallbacks.onMessage(message);
        }
    } catch (error) {
        console.error('Message handler error:', error);
    }
}

/**
 * Parse command from message
 */
function parseCommand(text) {
    const trimmed = text.trim();

    // topic: command
    const topicMatch = trimmed.match(/^topic\s*:\s*([\s\S]+)$/i);
    if (topicMatch) {
        return { type: 'topic', content: topicMatch[1].trim() };
    }

    // script: command
    const scriptMatch = trimmed.match(/^script\s*:\s*([\s\S]+)$/i);
    if (scriptMatch) {
        return { type: 'script', content: scriptMatch[1].trim() };
    }

    // visuals: command
    const visualsMatch = trimmed.match(/^visuals\s*:\s*([\s\S]+)$/i);
    if (visualsMatch) {
        return { type: 'visuals', content: visualsMatch[1].trim() };
    }

    // voice: command
    const voiceMatch = trimmed.match(/^voice\s*:\s*([\s\S]+)$/i);
    if (voiceMatch) {
        return { type: 'voice', content: voiceMatch[1].trim() };
    }

    // agenda command
    if (trimmed.match(/^agenda$/i)) {
        return { type: 'agenda' };
    }

    return null;
}

/**
 * Handle different commands
 */
async function handleCommand(command, messageId, remoteJid) {
    try {
        switch (command.type) {
            case 'topic':
            case 'script':
                await processEditorial(command.content, messageId, remoteJid);
                break;

            case 'visuals':
                const visuals = await scriptService.generateVisuals(command.content);
                await sock.sendMessage(remoteJid, { text: visuals });
                if (groupIds.demoVisual) {
                    await sock.sendMessage(groupIds.demoVisual, { text: visuals });
                }
                break;

            case 'voice':
                const audioPath = await audioService.generateAudio(command.content);
                if (audioPath && await fs.pathExists(audioPath)) {
                    const audioBuffer = await fs.readFile(audioPath);
                    await sock.sendMessage(remoteJid, {
                        audio: audioBuffer,
                        mimetype: 'audio/mpeg',
                        ptt: false
                    });
                }
                break;

            case 'agenda':
                const headlines = await scriptService.getHeadlines();
                await sock.sendMessage(remoteJid, { text: headlines });
                break;
        }
    } catch (error) {
        console.error('Command handler error:', error);
    }
}

/**
 * Process editorial content
 */
async function processEditorial(editorial, messageId, remoteJid) {
    try {
        console.log('🔄 Processing editorial...');

        // Generate script
        const script = await scriptService.generateScript(editorial);

        if (!script) {
            console.error('Failed to generate script');
            return;
        }

        // Generate audio
        let audioPath = null;
        try {
            audioPath = await audioService.generateAudio(script);
        } catch (error) {
            console.error('Audio generation failed:', error);
        }

        // Generate visuals
        let visuals = null;
        try {
            visuals = await scriptService.generateVisuals(script);
        } catch (error) {
            console.error('Visuals generation failed:', error);
        }

        // Send to groups
        if (groupIds.demoScript && script) {
            const heading = `📝 Vision Point Script — ${editorial.substring(0, 70)}...`;
            await sock.sendMessage(groupIds.demoScript, { text: heading });
            await sock.sendMessage(groupIds.demoScript, { text: script });

            if (audioPath && await fs.pathExists(audioPath)) {
                const audioBuffer = await fs.readFile(audioPath);
                await sock.sendMessage(groupIds.demoScript, {
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: path.basename(audioPath),
                    ptt: false
                });
            }
        }

        if (groupIds.demoVisual && visuals) {
            await sock.sendMessage(groupIds.demoVisual, { text: visuals });
        }

        console.log('✅ Editorial processing completed');
    } catch (error) {
        console.error('Editorial processing error:', error);
    }
}

/**
 * Send message to specific group or number
 */
async function sendMessage(to, message) {
    if (!sock) {
        throw new Error('WhatsApp not connected');
    }

    await sock.sendMessage(to, { text: message });
}

/**
 * Get current status
 */
function getStatus() {
    return {
        status: connectionStatus,
        qrCode: qrCodeData,
        groups: groupIds
    };
}

/**
 * Set event callbacks
 */
function setEventCallbacks(callbacks) {
    eventCallbacks = { ...eventCallbacks, ...callbacks };
}

module.exports = {
    connectToWhatsApp,
    sendMessage,
    getStatus,
    setEventCallbacks,
    groupIds
};
