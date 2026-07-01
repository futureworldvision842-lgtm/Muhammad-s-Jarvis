import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import pino from 'pino';

const logger = pino({ level: 'trace' });

async function testFetch() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection } = update;
    if (connection === 'open') {
      logger.info('Connection open!');
      try {
        const groupJID = '120363295237397932@g.us'; // VP Content group JID
        const history = await sock.fetchMessageHistory(groupJID, 25);
        logger.info('History fetched:', JSON.stringify(history, null, 2));
      } catch (err) {
        logger.error('Error fetching history:', err);
      }
    }
  });
}

testFetch();