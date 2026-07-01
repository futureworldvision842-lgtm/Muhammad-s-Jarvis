# 🤖 MUHAMMAD'S JARVIS
### A real Iron-Man-style AI operating system for Windows — voice, vision, memory & full PC control.

JARVIS listens, talks back in real time, sees your screen, controls your PC, browses the web, runs on WhatsApp, monitors the world, remembers what matters, and **keeps itself alive** — auto-starting with everything on every boot.

> One command installs it. One click runs it. It sets itself up and starts itself.

---

## ⚡ Get started (3 steps)

```bat
git clone https://github.com/futureworldvision842-lgtm/Muhammad-s-Jarvis.git
cd Muhammad-s-Jarvis
install.bat
```

Then:

1. **Add your key** — open `config\api_keys.json` and paste your free Google Gemini API key
   (get one at <https://aistudio.google.com/apikey>).
2. **Run it** — double-click **`run.bat`**.

That's it. `install.bat` creates the environment, installs every dependency, sets up
the WhatsApp bridge, and prepares your config. `run.bat` launches the supervisor,
which brings up the whole ecosystem and keeps it alive.

**Want the extra bots too?** Run **`install_extras.bat`** — it fetches Moltbot,
Odysseus and a local Ollama model (see *The bots* below). All optional.

---

## ✨ What it does

| | Feature |
|---|---|
| 🎙️ | **Real-time voice** — natural, low-latency conversation (Gemini Live), crash-proof WASAPI audio |
| 🧠 | **Memory & reasoning** — remembers your projects/preferences; learns shortcuts ("do it this way next time") |
| 🖥️ | **Full PC control** — launch apps, manage files, run commands, type & click |
| 👁️ | **Sees your screen** — live screen + webcam understanding |
| 🌐 | **Web + browser control** — searches and drives the browser for you |
| 📱 | **WhatsApp** — sends messages directly (no window popping), and you can command JARVIS *from* WhatsApp |
| 📊 | **Ops dashboard** — futuristic HUD: world monitor, live PC vitals, activity, tasks, memory (`http://localhost:8770`) |
| 🌍 | **World monitor** — live markets, conflict, weather & daily briefing |
| 🥇 | **Daily gold brief** — 5 AM trading suggestions to your WhatsApp contacts |
| 🔧 | **Self-upgrade** — writes and installs its own new skills on request |
| ♻️ | **Self-healing** — a supervisor auto-restarts anything that dies, and auto-starts on boot |

---

## 🤖 The bots / agents

JARVIS is a whole ecosystem. The **core** ships in this repo; the **extra bots** are
open-source and fetched by `install_extras.bat` (so nothing huge or third-party bloats
the repo, but a fresh clone still ends up with everything):

| Bot / agent | Where it lives | How you get it |
|---|---|---|
| 🎙️ Voice core + brain | `main.py` | in this repo ✅ |
| 📊 World Monitor + HUD dashboard | `dashboard.py`, `actions/world_monitor.py`, `ui.py` | in this repo ✅ |
| 📱 WhatsApp bridge | `wa/` (Baileys) | in this repo ✅ |
| 🥇 Gold advisor / 🧪 self-upgrade / skills | `skills/`, `actions/self_upgrade.py` | in this repo ✅ |
| 🧩 **Moltbot** (clawdbot gateway) | npm global | `install_extras.bat` → `npm i -g clawdbot` |
| 🧠 **Odysseus** AI server | `bots/odysseus/` | `install_extras.bat` → git clone |
| 💾 **Ollama** (offline LLM) | system | `install_extras.bat` → `ollama pull` |
| ⚡ **Hermes** agent (Nous) | separate install | auto-detected once `hermes` is on PATH |

The supervisor automatically launches whichever of these are installed — install the
extras and they just light up.

---

## 🖥️ Requirements

| | |
|---|---|
| **OS** | Windows 10 / 11 |
| **Python** | 3.11+ (tick *Add to PATH* when installing) — <https://python.org> |
| **Node.js** | 18+ (for WhatsApp bridge) — <https://nodejs.org> |
| **Microphone** | required for voice |
| **Gemini API key** | free — <https://aistudio.google.com/apikey> |
| *(optional)* MongoDB | for extended memory |
| *(optional)* Ollama | for offline/local LLM fallback |

---

## 🔐 Your data stays yours

The installer creates your personal config from templates. **Nothing private is in this
repo** — no API keys, no WhatsApp session, no phone numbers, no memory. You provide your
own on install:

- `config/api_keys.json` — your Gemini key (created from `api_keys.example.json`)
- `config/gold_config.json` — your WhatsApp contacts (created from `gold_config.example.json`)
- `wa/auth/` — your WhatsApp login (created when you scan the QR on first run)
- `memory/` — your personal long-term memory

All of the above are git-ignored and will never be committed.

---

## 🚀 Auto-start on boot (optional)

To have JARVIS launch itself with everything every time your PC starts, put a shortcut
to **`run.bat`** in your Startup folder:

1. Press `Win + R`, type `shell:startup`, Enter.
2. Right-drag `run.bat` there → *Create shortcuts here*.

Now every boot brings up the full ecosystem and keeps it alive.

---

## 🧩 How it's structured

```
main.py            Voice assistant + brain (Gemini Live)
ui.py              Futuristic HUD
dashboard.py       Ops dashboard / world monitor  (port 8770)
mobile_control.py  Phone remote                    (port 8765)
wa/                WhatsApp bridge (Baileys, Node)  (port 3200)
actions/           Tools: screen, web, world_monitor, self_upgrade, ...
skills/            Hot-loadable skills (gold advisor, hermes, ...)
bootstrap/         Portable supervisor (path-independent launcher)
config/            Your keys & settings (templates committed, real ones ignored)
bots/              External bots fetched by install_extras.bat (e.g. odysseus)
install.bat        One-click installer (core)
install_extras.bat Fetch optional bots (Moltbot, Odysseus, Ollama)
run.bat            Start everything
```

---

## 🙏 Credits

Built by **Muhammad** on top of the excellent open-source Mark-series voice core by
[FatihMakes](https://github.com/FatihMakes/Mark-XXXIX-OR), extended into a full self-hosted
AI OS (world monitor, memory, WhatsApp, self-upgrade, supervisor). For personal, non-commercial use.
