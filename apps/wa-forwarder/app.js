require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { forwardVideoWithValidation, diagnoseVideoIssues } = require('./video_forwarding_fix');
const { processVideoTranscription } = require('./video_transcription');
const fs = require('fs');
const path = require('path');

let GROUP_NAMES = {
  content: process.env.CONTENT_GROUP_NAME || 'Content',
  rawVideos: process.env.RAW_VIDEOS_GROUP_NAME || 'VP RAW VIDEOS'
};
const CONFIG_PATH = path.join('temp', 'group_config.json');
try {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const cfg = JSON.parse(raw);
  if (cfg && typeof cfg === 'object') {
    if (cfg.content) GROUP_NAMES.content = cfg.content;
    if (cfg.rawVideos) GROUP_NAMES.rawVideos = cfg.rawVideos;
  }
} catch {}

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: process.env.SESSION_DIR || undefined }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('loading_screen', (p, m) => console.log('[WA loading]', p, m));
client.on('change_state', (s) => console.log('[WA state]', s));

let groupIds = { content: null, rawVideos: null };

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('Client is ready!');
  try {
    const chats = await client.getChats();
    const contentGroup = chats.find(c => c.isGroup && c.name === GROUP_NAMES.content);
    const rawVideosGroup = chats.find(c => c.isGroup && c.name === GROUP_NAMES.rawVideos);
    groupIds.content = contentGroup ? contentGroup.id._serialized : null;
    groupIds.rawVideos = rawVideosGroup ? rawVideosGroup.id._serialized : null;
    console.log('Group resolution:', groupIds);
  } catch (err) {
    console.error('Failed to resolve groups:', err.message);
  }
});

client.on('message', async message => {
  try {
    const text = (message.body || '').trim();

    if (text === '!ping') {
      await message.reply('pong');
      return;
    }

    // --- Command JARVIS from WhatsApp: any message starting with "jarvis" ---
    if (text.toLowerCase().startsWith('jarvis')) {
      const query = text.replace(/^jarvis[,:\s]*/i, '').trim() || 'hello';
      try {
        const fs = require('fs');
        const axios = require('axios');
        const low = query.toLowerCase();
        // Quick intents handled by Jarvis's own tools, else conversational reply.
        if (low.includes('gold')) {
          const r = await axios.post('http://localhost:8770/api/gold', {}, { timeout: 15000 }).catch(() => null);
          const g = r && r.data;
          if (g && g.price) { await message.reply(`🥇 Gold ~$${g.price.toFixed(1)}/oz | 7d ${(g.chg_7d||0).toFixed(1)}% | 30d ${(g.chg_30d||0).toFixed(1)}%`); return; }
        }
        const key = JSON.parse(fs.readFileSync('E:\\jarvis\\config\\api_keys.json', 'utf8')).gemini_api_key;
        const resp = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
          { contents: [{ parts: [{ text: "You are JARVIS, Muhammad's AI assistant. Reply concisely and helpfully.\n\nUser: " + query }] }] },
          { headers: { 'Content-Type': 'application/json', 'X-goog-api-key': key }, timeout: 30000 }
        );
        const reply = (resp.data.candidates && resp.data.candidates[0].content.parts[0].text) || 'No response.';
        await message.reply(reply);
      } catch (e) {
        await message.reply('Jarvis error: ' + String(e.message || e).slice(0, 140));
      }
      return;
    }

    if (text === '!video-help' || text.toLowerCase() === 'video help' || text === 'ویڈیو مدد' || text === 'ویڈیو ہیلپ') {
      const target = groupIds.content || message.from;
      await diagnoseVideoIssues(client, target);
      return;
    }

    if (text === '!groups') {
      const chats = await client.getChats();
      const parts = chats.filter(c => c.isGroup).map(c => `${c.name} — ${c.id._serialized}`);
      await client.sendMessage(message.from, parts.length ? `Groups:\n${parts.join('\n')}` : 'No groups found');
      return;
    }

    if (text.startsWith('!set-content ')) {
      const name = text.slice('!set-content '.length).trim();
      if (!name) { await message.reply('Provide a group name'); return; }
      GROUP_NAMES.content = name;
      try {
        const cfg = fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) : {};
        cfg.content = name;
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg));
      } catch {}
      const chats = await client.getChats();
      const contentGroup = chats.find(c => c.isGroup && c.name === GROUP_NAMES.content);
      groupIds.content = contentGroup ? contentGroup.id._serialized : null;
      await message.reply(groupIds.content ? `Content set: ${name}` : `Content not found: ${name}`);
      return;
    }

    if (text.startsWith('!set-raw ')) {
      const name = text.slice('!set-raw '.length).trim();
      if (!name) { await message.reply('Provide a group name'); return; }
      GROUP_NAMES.rawVideos = name;
      try {
        const cfg = fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) : {};
        cfg.rawVideos = name;
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg));
      } catch {}
      const chats = await client.getChats();
      const rawVideosGroup = chats.find(c => c.isGroup && c.name === GROUP_NAMES.rawVideos);
      groupIds.rawVideos = rawVideosGroup ? rawVideosGroup.id._serialized : null;
      await message.reply(groupIds.rawVideos ? `Raw videos set: ${name}` : `Raw videos not found: ${name}`);
      return;
    }

    if (message.hasMedia && message.type === 'video') {
      if (groupIds.content && message.from === groupIds.content) {
        const results = await processVideoTranscription(message);
        if (groupIds.rawVideos) {
          const fwd = await forwardVideoWithValidation(client, message, groupIds.rawVideos, groupIds.content);
        }
        if (results.transcript) {
          const tMsg = `📝 TRANSCRIPTION\n\n${results.transcript}`;
          if (groupIds.rawVideos) await client.sendMessage(groupIds.rawVideos, tMsg);
          await client.sendMessage(groupIds.content, tMsg);
        }
        if (results.posterContent) {
          const pMsg = `🎨 POSTER CONTENT\n\n${results.posterContent}`;
          if (groupIds.rawVideos) await client.sendMessage(groupIds.rawVideos, pMsg);
          await client.sendMessage(groupIds.content, pMsg);
        }
        if (results.shortLines && results.shortLines.length) {
          const sMsg = `✂️ SHORT LINES\n\n${results.shortLines.join('\n')}`;
          if (groupIds.rawVideos) await client.sendMessage(groupIds.rawVideos, sMsg);
          await client.sendMessage(groupIds.content, sMsg);
        }
      }
    }
  } catch (err) {
    console.error('Message handler error:', err.message);
  }
});

console.log('Initializing WhatsApp client...');
client.initialize().catch(err => {
  console.error('Client initialization error', err);
});

// ---- JARVIS send endpoint (additive; reuses this already-linked session) ----
let jarvisReady = false;
client.on('ready', () => { jarvisReady = true; });
const _http = require('http');
_http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/jarvis-send') {
    let b = '';
    req.on('data', d => b += d);
    req.on('end', async () => {
      try {
        const { name, number, message } = JSON.parse(b || '{}');
        if (!jarvisReady) { res.writeHead(503); return res.end(JSON.stringify({ ok: false, error: 'WhatsApp not ready yet' })); }
        let chatId = null;
        if (number) {
          chatId = String(number).replace(/[^0-9]/g, '') + '@c.us';
        } else {
          const contacts = await client.getContacts();
          const n = String(name || '').toLowerCase().trim();
          const hit = contacts.find(c => (c.name || '').toLowerCase() === n)
                   || contacts.find(c => (c.pushname || '').toLowerCase() === n)
                   || contacts.find(c => (c.name || '').toLowerCase().includes(n) && n.length > 2);
          chatId = hit ? hit.id._serialized : null;
        }
        if (!chatId) { res.writeHead(404); return res.end(JSON.stringify({ ok: false, error: 'contact not found: ' + name })); }
        await client.sendMessage(chatId, message);
        res.writeHead(200); res.end(JSON.stringify({ ok: true, to: chatId }));
      } catch (e) {
        res.writeHead(500); res.end(JSON.stringify({ ok: false, error: String(e).slice(0, 200) }));
      }
    });
  } else if (req.url === '/jarvis-status') {
    res.writeHead(200); res.end(JSON.stringify({ ready: jarvisReady }));
  } else { res.writeHead(404); res.end('jarvis'); }
}).listen(3199, () => console.log('[Jarvis send endpoint] http://localhost:3199'));

setInterval(() => {}, 1 << 30);