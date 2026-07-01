"""
J.A.R.V.I.S. Mobile Remote Control
----------------------------------
A small FastAPI server so you can control this PC from your phone's browser
(same Wi-Fi). Open  http://<PC-LAN-IP>:8765  on your mobile, enter the PIN, and
you get: run commands, ask Jarvis (Gemini), screenshot, lock, volume, open apps.

Run:  python mobile_control.py     (or it's launched by start_jarvis_boot.bat)
"""
import json
import subprocess
import sys
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, Response
import uvicorn

BASE = Path(__file__).resolve().parent
PIN = "7531"   # change this to your own PIN
PORT = 8765

app = FastAPI(title="JARVIS Mobile")


def _key():
    try:
        return json.loads((BASE / "config" / "api_keys.json").read_text(encoding="utf-8"))["gemini_api_key"]
    except Exception:
        return None


def _auth(req: Request) -> bool:
    return req.headers.get("X-Pin") == PIN


PAGE = """<!doctype html><html><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>JARVIS Mobile</title><style>
*{box-sizing:border-box;font-family:Consolas,monospace}
body{background:#04080f;color:#19e0ff;margin:0;padding:14px}
h1{font-size:20px;text-align:center;letter-spacing:3px;text-shadow:0 0 8px #19e0ff}
.sub{text-align:center;color:#5a7a8a;font-size:11px;margin-bottom:14px}
input,textarea,button{width:100%;padding:11px;margin:5px 0;border-radius:8px;
 border:1px solid #16404f;background:#081722;color:#cfeefb;font-size:15px}
button{background:#0a2230;color:#19e0ff;border:1px solid #19e0ff;font-weight:bold;cursor:pointer}
button:active{background:#19e0ff;color:#04080f}
.row{display:flex;gap:6px}.row button{flex:1}
.card{background:#06121c;border:1px solid #11303d;border-radius:10px;padding:10px;margin-bottom:12px}
.lbl{color:#5a7a8a;font-size:11px;margin:6px 0 2px}
#out{white-space:pre-wrap;font-size:12px;color:#9fe;max-height:42vh;overflow:auto}
img{width:100%;border-radius:8px;margin-top:8px}
</style></head><body>
<h1>J.A.R.V.I.S</h1><div class=sub>MOBILE REMOTE CONTROL</div>
<div class=card id=pinbox>
 <div class=lbl>ENTER PIN</div>
 <input id=pin type=password inputmode=numeric placeholder="PIN">
 <button onclick="savePin()">UNLOCK</button>
</div>
<div id=app style=display:none>
 <div class=card>
  <div class=lbl>ASK JARVIS</div>
  <textarea id=ask rows=2 placeholder="Ask anything..."></textarea>
  <button onclick="ask()">ASK JARVIS</button>
 </div>
 <div class=card>
  <div class=lbl>RUN COMMAND (PowerShell)</div>
  <input id=cmd placeholder="e.g. Get-Date">
  <button onclick="run()">RUN</button>
 </div>
 <div class=card>
  <div class=lbl>OPEN APP</div>
  <input id=app_name placeholder="e.g. notepad, chrome">
  <button onclick="openApp()">OPEN</button>
 </div>
 <div class=card>
  <div class=lbl>QUICK CONTROLS</div>
  <div class=row><button onclick="q('volup')">VOL +</button><button onclick="q('voldown')">VOL -</button><button onclick="q('mute')">MUTE</button></div>
  <div class=row><button onclick="q('lock')">LOCK PC</button><button onclick="shot()">SCREENSHOT</button></div>
 </div>
 <div class=card><div class=lbl>OUTPUT</div><div id=out>Ready.</div><img id=img style=display:none></div>
</div>
<script>
let PIN=sessionStorage.getItem('pin')||'';
if(PIN){document.getElementById('pinbox').style.display='none';document.getElementById('app').style.display='block';}
function savePin(){PIN=document.getElementById('pin').value;sessionStorage.setItem('pin',PIN);
 document.getElementById('pinbox').style.display='none';document.getElementById('app').style.display='block';}
function out(t){document.getElementById('out').textContent=t;document.getElementById('img').style.display='none';}
async function post(u,b){const r=await fetch(u,{method:'POST',headers:{'Content-Type':'application/json','X-Pin':PIN},body:JSON.stringify(b||{})});return r.json();}
async function ask(){out('Thinking...');const r=await post('/api/ask',{q:document.getElementById('ask').value});out(r.text||r.error);}
async function run(){out('Running...');const r=await post('/api/run',{cmd:document.getElementById('cmd').value});out(r.output||r.error);}
async function openApp(){const r=await post('/api/open',{app:document.getElementById('app_name').value});out(r.output||r.error);}
async function q(a){out(a+'...');const r=await post('/api/quick',{action:a});out(r.output||r.error);}
async function shot(){out('Capturing...');const r=await fetch('/api/screenshot',{headers:{'X-Pin':PIN}});if(r.ok){const b=await r.blob();const i=document.getElementById('img');i.src=URL.createObjectURL(b);i.style.display='block';document.getElementById('out').textContent='Screenshot:';}else out('Failed / wrong PIN');}
</script></body></html>"""


@app.get("/", response_class=HTMLResponse)
def home():
    return PAGE


@app.post("/api/ask")
async def api_ask(req: Request):
    if not _auth(req):
        return JSONResponse({"error": "Wrong PIN"}, status_code=403)
    body = await req.json()
    q = (body.get("q") or "").strip()
    if not q:
        return {"error": "empty"}
    key = _key()
    if not key:
        return {"error": "no API key"}
    try:
        import google.genai as genai
        c = genai.Client(api_key=key)
        r = c.models.generate_content(
            model="gemini-2.5-flash",
            contents="You are JARVIS, Muhammad's assistant. Answer briefly.\n\n" + q,
        )
        return {"text": (r.text or "").strip()}
    except Exception as e:
        return {"error": str(e)[:200]}


@app.post("/api/run")
async def api_run(req: Request):
    if not _auth(req):
        return JSONResponse({"error": "Wrong PIN"}, status_code=403)
    body = await req.json()
    cmd = (body.get("cmd") or "").strip()
    if not cmd:
        return {"error": "empty"}
    try:
        r = subprocess.run(["powershell", "-NoProfile", "-Command", cmd],
                           capture_output=True, text=True, timeout=60)
        return {"output": (r.stdout + r.stderr).strip()[:4000] or "(no output)"}
    except Exception as e:
        return {"error": str(e)[:200]}


@app.post("/api/open")
async def api_open(req: Request):
    if not _auth(req):
        return JSONResponse({"error": "Wrong PIN"}, status_code=403)
    body = await req.json()
    app_name = (body.get("app") or "").strip()
    if not app_name:
        return {"error": "empty"}
    try:
        subprocess.Popen(["powershell", "-NoProfile", "-Command", f"Start-Process '{app_name}'"])
        return {"output": f"Opening {app_name}..."}
    except Exception as e:
        return {"error": str(e)[:200]}


@app.post("/api/quick")
async def api_quick(req: Request):
    if not _auth(req):
        return JSONResponse({"error": "Wrong PIN"}, status_code=403)
    body = await req.json()
    action = (body.get("action") or "").strip()
    ps = {
        "lock": "rundll32.exe user32.dll,LockWorkStation",
        "volup": "(New-Object -ComObject WScript.Shell).SendKeys([char]175)",
        "voldown": "(New-Object -ComObject WScript.Shell).SendKeys([char]174)",
        "mute": "(New-Object -ComObject WScript.Shell).SendKeys([char]173)",
    }.get(action)
    if not ps:
        return {"error": "unknown action"}
    try:
        subprocess.run(["powershell", "-NoProfile", "-Command", ps], timeout=10)
        return {"output": f"{action} done."}
    except Exception as e:
        return {"error": str(e)[:200]}


@app.get("/api/screenshot")
def api_screenshot(req: Request):
    if not _auth(req):
        return JSONResponse({"error": "Wrong PIN"}, status_code=403)
    try:
        import io
        try:
            from PIL import ImageGrab
            img = ImageGrab.grab()
        except Exception:
            import pyautogui
            img = pyautogui.screenshot()
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return Response(content=buf.getvalue(), media_type="image/png")
    except Exception as e:
        return JSONResponse({"error": str(e)[:200]}, status_code=500)


if __name__ == "__main__":
    print(f"[JARVIS Mobile] Serving on http://0.0.0.0:{PORT}  (PIN: {PIN})")
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="warning")
