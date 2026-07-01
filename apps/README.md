# Bundled apps

Extra applications that ship with JARVIS. Each is self-contained — `cd` into it,
copy its `.env.example` to `.env` (fill in your own keys), install deps, and run.

| App | What it is | Run |
|---|---|---|
| `ai-studio/` | Vision-Point AI content studio (React frontend + Node backend) | `backend`: `npm i && npm start` · `frontend`: `npm i && npm run dev` |
| `wa-forwarder/` | Legacy WhatsApp automation (whatsapp-web.js) with TTS/video tools | `npm i && node app.js` (JARVIS core uses `wa/` Baileys instead) |
| `ts-jarvis/` | TypeScript JARVIS daemon (workflows, roles, voice UI) | see `ts-jarvis/QUICKSTART.md` |

> 🔐 No secrets are committed. Every app reads its keys from a local `.env` /
> `.env.local` that you create from the provided `.env.example`. `node_modules`,
> build output, sessions and caches are all git-ignored — reinstall with `npm install`.
