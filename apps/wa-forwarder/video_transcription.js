const fs = require('fs');
const path = require('path');
const axios = require('axios');

function safeWrite(filePath, buffer) {
  try { fs.writeFileSync(filePath, buffer); } catch {}
}

function pickSentences(text) {
  const parts = String(text || '').split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(Boolean);
  const scored = parts.map(s => ({ s, score: Math.min(140, Math.max(40, s.length)) }));
  return scored.sort((a,b)=>b.score-a.score).slice(0,5).map(x=>x.s);
}

function buildPoster(transcript) {
  const t = (transcript || '').trim();
  if (!t) return null;
  const sentences = pickSentences(t);
  const title = (sentences[0] || t.split('\n')[0] || t).slice(0,80);
  const hook = t.slice(0,140);
  const points = sentences.map(s => `• ${s}`).join('\n');
  return `🎯 Title: ${title}\n⚡ Hook: ${hook}\n\n🔑 Key Points:\n${points}`;
}

async function uploadToAssembly(buffer, apiKey) {
  const res = await axios.post('https://api.assemblyai.com/v2/upload', buffer, {
    headers: { authorization: apiKey, 'content-type': 'application/octet-stream' },
    maxBodyLength: Infinity,
    maxContentLength: Infinity
  });
  return res.data.upload_url || res.data;
}

async function startTranscript(audioUrl, apiKey) {
  const res = await axios.post('https://api.assemblyai.com/v2/transcript', { audio_url: audioUrl }, {
    headers: { authorization: apiKey }
  });
  return res.data.id;
}

async function pollTranscript(id, apiKey, timeoutMs = 60000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const res = await axios.get(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: { authorization: apiKey }
    });
    if (res.data.status === 'completed') return res.data.text;
    if (res.data.status === 'error') throw new Error(res.data.error || 'transcription_error');
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error('transcription_timeout');
}

async function processVideoTranscription(message) {
  try {
    const media = await message.downloadMedia();
    if (!media) return { transcript: null, posterContent: null, shortLines: [] };
    const ext = (media.mimetype || '').split('/')[1] || 'mp4';
    const buffer = Buffer.from(media.data, 'base64');
    const base = `video_${Date.now()}.${ext}`;
    const videoPath = path.join('temp', base);
    safeWrite(videoPath, buffer);

    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) return { transcript: null, posterContent: null, shortLines: [] };

    const uploadUrl = await uploadToAssembly(buffer, apiKey);
    const id = await startTranscript(uploadUrl, apiKey);
    const text = await pollTranscript(id, apiKey);

    const posterContent = buildPoster(text);
    const shortLines = pickSentences(text);
    return { transcript: text, posterContent, shortLines };
  } catch (e) {
    return { transcript: null, posterContent: null, shortLines: [] };
  }
}

module.exports = { processVideoTranscription };