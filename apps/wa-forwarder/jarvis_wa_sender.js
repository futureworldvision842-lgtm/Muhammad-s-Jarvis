// jarvis_wa_sender.js — independent WhatsApp sender for J.A.R.V.I.S.
// A 2nd linked device (separate session) so Jarvis can send messages reliably
// (works even when the screen is locked). Exposes POST /send {name|number, message}.
// First run: scan the QR shown in this window with WhatsApp > Linked Devices.
const http = require('http');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const PORT = 3199;
let ready = false;

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'jarvis-sender', dataPath: 'E:\\jarvis\\scratch\\wa_sender_session' }),
  puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
});

client.on('qr', (qr) => {
  console.log('\n[Jarvis WA Sender] Scan this QR in WhatsApp > Settings > Linked Devices:\n');
  qrcode.generate(qr, { small: true });
});
client.on('ready', () => { ready = true; console.log('[Jarvis WA Sender] READY — can send messages.'); });
client.on('auth_failure', (m) => console.error('[Jarvis WA Sender] auth failure', m));
client.initialize();

async function resolveChatId(client, name, number) {
  if (number) {
    const digits = String(number).replace(/[^0-9]/g, '');
    return digits + '@c.us';
  }
  const contacts = await client.getContacts();
  const n = String(name || '').toLowerCase().trim();
  let hit = contacts.find(c => (c.name || '').toLowerCase() === n)
        || contacts.find(c => (c.pushname || '').toLowerCase() === n)
        || contacts.find(c => (c.name || '').toLowerCase().includes(n) && n.length > 2);
  return hit ? hit.id._serialized : null;
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/send') {
    let body = '';
    req.on('data', (d) => body += d);
    req.on('end', async () => {
      try {
        const { name, number, message } = JSON.parse(body || '{}');
        if (!ready) { res.writeHead(503); return res.end(JSON.stringify({ ok: false, error: 'WhatsApp not ready (scan QR?)' })); }
        const chatId = await resolveChatId(client, name, number);
        if (!chatId) { res.writeHead(404); return res.end(JSON.stringify({ ok: false, error: 'contact not found: ' + name })); }
        await client.sendMessage(chatId, message);
        res.writeHead(200); res.end(JSON.stringify({ ok: true, to: chatId }));
      } catch (e) {
        res.writeHead(500); res.end(JSON.stringify({ ok: false, error: String(e).slice(0, 200) }));
      }
    });
  } else if (req.url === '/status') {
    res.writeHead(200); res.end(JSON.stringify({ ready }));
  } else { res.writeHead(404); res.end('JARVIS WA Sender'); }
});
server.listen(PORT, () => console.log(`[Jarvis WA Sender] HTTP on http://localhost:${PORT}`));
