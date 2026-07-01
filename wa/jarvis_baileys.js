// jarvis_baileys.js — reliable WhatsApp for J.A.R.V.I.S. (Baileys, no Chromium).
// Robust multi-file auth survives restarts/reboots; auto-reconnects.
// HTTP: POST /send {number|name, message}  ·  GET /status
// Inbound: a message starting with "jarvis ..." gets a Gemini reply.
// First run: scan the QR shown in this window (WhatsApp > Linked Devices).
const http = require('http');
const fs = require('fs');
const https = require('https');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');

const AUTH_DIR = 'E:\\jarvis\\wa\\auth';
const PORT = 3200;
let sock = null, ready = false;

function geminiKey() {
  try { return JSON.parse(fs.readFileSync('E:\\jarvis\\config\\api_keys.json', 'utf8')).gemini_api_key; }
  catch { return null; }
}

function askGemini(prompt) {
  return new Promise((resolve) => {
    const key = geminiKey();
    if (!key) return resolve('No API key.');
    const body = JSON.stringify({ contents: [{ parts: [{ text: "You are JARVIS, Muhammad's AI assistant. Reply concisely.\n\nUser: " + prompt }] }] });
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-2.5-flash:generateContent',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': key, 'Content-Length': Buffer.byteLength(body) },
    }, (r) => { let d = ''; r.on('data', c => d += c); r.on('end', () => {
      try { resolve(JSON.parse(d).candidates[0].content.parts[0].text); } catch { resolve('No response.'); }
    }); });
    req.on('error', () => resolve('Jarvis offline.'));
    req.write(body); req.end();
  });
}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }), browser: ['JARVIS', 'Chrome', '1.0'] });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (u) => {
    const { connection, lastDisconnect, qr } = u;
    if (qr) { console.log('\n[JARVIS Baileys] Scan this QR (WhatsApp > Linked Devices):\n'); qrcode.generate(qr, { small: true }); }
    if (connection === 'open') { ready = true; console.log('[JARVIS Baileys] READY — connected & permanent.'); }
    if (connection === 'close') {
      ready = false;
      const code = lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode;
      if (code === DisconnectReason.loggedOut) console.log('[JARVIS Baileys] logged out — delete wa/auth and re-scan.');
      else { console.log('[JARVIS Baileys] reconnecting...'); setTimeout(start, 2000); }
    }
  });
  // Inbound "jarvis ..." -> Gemini reply
  sock.ev.on('messages.upsert', async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg || msg.key.fromMe || !msg.message) return;
      const text = (msg.message.conversation || (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || '').trim();
      if (text.toLowerCase().startsWith('jarvis')) {
        const reply = await askGemini(text.replace(/^jarvis[,:\s]*/i, '') || 'hello');
        await sock.sendMessage(msg.key.remoteJid, { text: reply });
      }
    } catch {}
  });
}
start();

async function sendTo(numberOrName, text) {
  const digits = String(numberOrName || '').replace(/[^0-9]/g, '');
  if (!digits) throw new Error('Baileys needs a number');
  await sock.sendMessage(digits + '@s.whatsapp.net', { text });
}

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/send') {
    let b = ''; req.on('data', d => b += d); req.on('end', async () => {
      try {
        const { number, name, message } = JSON.parse(b || '{}');
        if (!ready) { res.writeHead(503); return res.end(JSON.stringify({ ok: false, error: 'not ready' })); }
        await sendTo(number || name, message);
        res.writeHead(200); res.end(JSON.stringify({ ok: true }));
      } catch (e) { res.writeHead(500); res.end(JSON.stringify({ ok: false, error: String(e).slice(0, 150) })); }
    });
  } else if (req.url === '/status') { res.writeHead(200); res.end(JSON.stringify({ ready })); }
  else { res.writeHead(404); res.end('jarvis-baileys'); }
}).listen(PORT, () => console.log('[JARVIS Baileys] HTTP on http://localhost:' + PORT));
