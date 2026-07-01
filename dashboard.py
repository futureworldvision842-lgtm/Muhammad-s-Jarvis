"""
J.A.R.V.I.S. OPS DASHBOARD — a SITDECK-style real-time situational-awareness web UI.

Serves a dark, multi-panel dashboard (world map with live conflict markers, daily
briefing, markets, conflict monitor, news, weather, gold) at http://localhost:8770.
Reuses the world_monitor + gold_advisor data. Launched by start_jarvis_boot.bat.
"""
import json
import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn

BASE = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE))
PORT = 8770
app = FastAPI(title="JARVIS Ops Dashboard")

# Country / hotspot centroids for geo-locating conflict headlines on the map.
GEO = {
    "israel": [31.5, 34.8], "gaza": [31.4, 34.4], "palestin": [31.9, 35.2],
    "iran": [32.4, 53.7], "iraq": [33.2, 43.7], "syria": [34.8, 38.9],
    "lebanon": [33.9, 35.5], "yemen": [15.5, 48.5], "saudi": [24.0, 45.0],
    "ukrain": [48.4, 31.2], "russia": [61.5, 105.3], "moscow": [55.75, 37.6],
    "afghan": [33.9, 67.7], "pakistan": [30.4, 69.3], "india": [22.0, 79.0],
    "china": [35.9, 104.2], "taiwan": [23.7, 121.0], "korea": [37.5, 127.0],
    "japan": [36.2, 138.3], "sudan": [12.9, 30.2], "niger": [17.6, 8.1],
    "nigeria": [9.1, 8.7], "ethiopia": [9.1, 40.5], "congo": [-2.9, 23.7],
    "mali": [17.6, -4.0], "libya": [26.3, 17.2], "egypt": [26.8, 30.8],
    "turkey": [38.9, 35.2], "turkiye": [38.9, 35.2], "venezuela": [6.4, -66.6],
    "mexico": [23.6, -102.5], "colombia": [4.6, -74.1], "haiti": [19.0, -72.3],
    "myanmar": [21.9, 95.9], "somalia": [5.2, 46.2], "kashmir": [34.0, 76.0],
    "united states": [39.8, -98.6], "u.s.": [39.8, -98.6], "europe": [50.0, 10.0],
}


def _api_key():
    try:
        return json.loads((BASE / "config" / "api_keys.json").read_text(encoding="utf-8")).get("gemini_api_key")
    except Exception:
        return None


@app.get("/api/markets")
def api_markets():
    try:
        from actions.world_monitor import get_markets
        return get_markets()
    except Exception as e:
        return JSONResponse([], headers={"X-Err": str(e)[:80]})


@app.get("/api/conflict")
def api_conflict():
    try:
        from actions.world_monitor import get_conflict
        return get_conflict()
    except Exception:
        return []


@app.get("/api/news")
def api_news():
    try:
        from actions.world_monitor import get_headlines
        return get_headlines("world", 14)
    except Exception:
        return []


@app.get("/api/briefing")
def api_briefing():
    try:
        from actions.world_monitor import get_situation_brief
        return {"text": get_situation_brief()}
    except Exception as e:
        return {"text": "Briefing unavailable.", "err": str(e)[:80]}


@app.get("/api/weather")
def api_weather():
    try:
        from actions.world_monitor import get_weather
        return get_weather("Islamabad")
    except Exception:
        return {}


@app.get("/api/gold")
def api_gold():
    try:
        from skills.gold_advisor import _gold_data
        return _gold_data()
    except Exception:
        return {}


@app.get("/api/system")
def api_system():
    """Live status of the whole Jarvis ecosystem (ports) for the dashboard."""
    import socket
    svcs = [("Ollama", 11434), ("Odysseus", 7000), ("Moltbot Gateway", 18789),
            ("TS Jarvis", 3142), ("AI Studio BE", 5000), ("AI Studio FE", 3000),
            ("MongoDB", 27017), ("Mobile Remote", 8765), ("WhatsApp", 3199),
            ("Dashboard", 8770)]
    out = []
    for name, port in svcs:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(0.2)
            up = s.connect_ex(("127.0.0.1", port)) == 0
            s.close()
        except Exception:
            up = False
        out.append({"name": name, "port": port, "up": up})
    return out


@app.get("/api/pc")
def api_pc():
    """Live PC vitals for animated gauges."""
    try:
        import psutil
        cpu = psutil.cpu_percent(interval=None)
        mem = psutil.virtual_memory().percent
        try:
            disk = psutil.disk_usage("C:\\").percent
        except Exception:
            disk = 0
        try:
            de = psutil.disk_usage("E:\\").percent
        except Exception:
            de = 0
        return {"cpu": cpu, "mem": mem, "disk_c": disk, "disk_e": de,
                "procs": len(psutil.pids())}
    except Exception:
        return {}


@app.get("/api/activity")
def api_activity():
    """What Jarvis is doing right now — recent tool/voice activity from the log."""
    items = []
    try:
        log = (BASE / "main_out.log").read_text(encoding="utf-8", errors="ignore").splitlines()
        keys = ("[Tool Request]", "[Tool Call]", "[Tool Output]", "You:", "Jarvis:",
                "Goal:", "Executor", "HERMES", "GOLD", "WORLD MONITOR", "Connected",
                "Offline Mode", "Online Mode", "[Memory]")
        for ln in log[-200:]:
            if any(k in ln for k in keys):
                s = ln.strip()
                for p in ("[JARVIS] ", "[Executor] ", "[TaskQueue] "):
                    s = s.replace(p, "")
                items.append(s[:120])
    except Exception:
        pass
    return items[-18:][::-1]


@app.get("/api/memory")
def api_memory():
    """Recent long-term memories."""
    out = []
    try:
        mem = json.loads((BASE / "memory" / "long_term.json").read_text(encoding="utf-8"))
        for cat, items in mem.items():
            if isinstance(items, dict):
                for k, v in items.items():
                    val = v.get("value", "") if isinstance(v, dict) else str(v)
                    out.append({"cat": cat, "key": k, "val": str(val)[:90]})
    except Exception:
        pass
    return out[:20]


@app.get("/api/tasks")
def api_tasks():
    """Active / recent agent tasks."""
    try:
        sys.path.insert(0, str(BASE))
        from agent.task_queue import get_queue
        return [{"id": t.get("task_id"), "goal": t.get("goal", "")[:80], "status": t.get("status")}
                for t in get_queue().get_all_statuses()][:12]
    except Exception:
        return []


@app.get("/api/map")
def api_map():
    """Geo-locate conflict headlines onto map markers."""
    try:
        from actions.world_monitor import get_conflict
        items = get_conflict()
    except Exception:
        items = []
    markers = []
    for it in items:
        t = it.get("title", "").lower()
        for kw, latlon in GEO.items():
            if kw in t:
                markers.append({"lat": latlon[0], "lon": latlon[1],
                                "title": it.get("title", ""), "source": it.get("source", "")})
                break
    return markers


PAGE = """<!doctype html><html><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>JARVIS OPS</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
:root{--bg:#04080f;--pan:#0a131c;--bd:#13354a;--pri:#19e0ff;--dim:#5a7a8a;--grn:#27e07a;--red:#ff5c5c;--amb:#ffb347}
*{box-sizing:border-box;font-family:Consolas,'Courier New',monospace}
body{margin:0;background:var(--bg);color:#cfe;overflow-x:hidden}
.top{display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-bottom:1px solid var(--bd);background:#06101a}
.brand{color:var(--pri);font-weight:bold;letter-spacing:3px;font-size:18px;text-shadow:0 0 8px var(--pri)}
.brand small{color:var(--dim);letter-spacing:1px}
.live{color:var(--grn);font-size:11px}
.clock{color:var(--pri);font-size:15px}
.grid{display:grid;grid-template-columns:2fr 1fr;gap:10px;padding:10px}
.col{display:flex;flex-direction:column;gap:10px}
.card{background:var(--pan);border:1px solid var(--bd);border-radius:6px;overflow:hidden}
.hd{display:flex;justify-content:space-between;align-items:center;padding:6px 10px;border-bottom:1px solid var(--bd);color:var(--dim);font-size:11px;letter-spacing:1px}
.bd{padding:8px 10px;font-size:12px;max-height:260px;overflow:auto}
#map{height:420px}
.mk{display:flex;justify-content:space-between;gap:8px;padding:3px 0;border-bottom:1px solid #0e2230}
.up{color:var(--grn)}.dn{color:var(--red)}
.cf{color:#ff9a7a;padding:3px 0;border-bottom:1px solid #1a0e10;font-size:11px}
.nw{padding:3px 0;border-bottom:1px solid #0e2230;color:#bfe}
.gold{font-size:13px}.gp{font-size:22px;color:var(--amb);font-weight:bold}
.brief{color:#bfe;line-height:1.5}
a{color:var(--pri);text-decoration:none}
.gl{display:flex;justify-content:space-between;font-size:11px;color:#9fe}
.gauge{height:7px;background:#0e2230;border-radius:4px;overflow:hidden;margin:2px 0 7px}
.gfill{height:100%;transition:width .8s ease;border-radius:4px;box-shadow:0 0 6px currentColor}
.act{padding:2px 0;border-bottom:1px solid #0e2230;color:#aee;font-size:11px;animation:fadein .5s}
@keyframes fadein{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
.mem{padding:2px 0;border-bottom:1px solid #0e2230;font-size:11px;color:#bfe}
.tk{padding:2px 0;border-bottom:1px solid #0e2230;font-size:11px}
</style></head><body>
<div class=top>
 <div class=brand>J.A.R.V.I.S <small>OPS CENTER</small></div>
 <div><span class=live id=live>● LIVE</span> &nbsp; <span class=clock id=clk></span></div>
</div>
<div class=grid>
 <div class=col>
  <div class=card><div class=hd><span>WORLD MAP — CONFLICT TRACKER</span><span id=mapn></span></div><div id=map></div></div>
  <div class=card><div class=hd><span>CONFLICT MONITOR</span><span class=live>● LIVE</span></div><div class=bd id=conflict>…</div></div>
  <div class=card><div class=hd><span>JARVIS ACTIVITY — LIVE</span><span class=live>● LIVE</span></div><div class=bd id=activity>…</div></div>
 </div>
 <div class=col>
  <div class=card><div class=hd><span>PC VITALS</span><span class=live>● LIVE</span></div><div class=bd id=pc>…</div></div>
  <div class=card><div class=hd><span>DAILY BRIEFING</span><span id=bts></span></div><div class=bd brief id=brief>Loading…</div></div>
  <div class=card><div class=hd><span>GOLD (XAU)</span><span class=live>● LIVE</span></div><div class=bd gold id=gold>…</div></div>
  <div class=card><div class=hd><span>MARKETS</span></div><div class=bd id=markets>…</div></div>
  <div class=card><div class=hd><span>NEWS FEED</span></div><div class=bd id=news>…</div></div>
  <div class=card><div class=hd><span>WEATHER — ISLAMABAD</span></div><div class=bd id=weather>…</div></div>
  <div class=card><div class=hd><span>SYSTEM — ALL AGENTS & BOTS</span><span class=live>● LIVE</span></div><div class=bd id=system>…</div></div>
  <div class=card><div class=hd><span>ACTIVE TASKS</span></div><div class=bd id=tasks>…</div></div>
  <div class=card><div class=hd><span>MEMORY / BRAIN</span></div><div class=bd id=memory>…</div></div>
 </div>
</div>
<script>
const map=L.map('map',{worldCopyJump:true}).setView([25,30],2);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:7,attribution:''}).addTo(map);
let layer=L.layerGroup().addTo(map);
function tick(){document.getElementById('clk').textContent=new Date().toLocaleTimeString();}
setInterval(tick,1000);tick();
async function j(u){try{return await (await fetch(u)).json()}catch(e){return null}}
async function loadMap(){const m=await j('/api/map');if(!m)return;layer.clearLayers();document.getElementById('mapn').textContent=m.length+' events';
 m.forEach(x=>{L.circleMarker([x.lat,x.lon],{radius:6,color:'#ff5c5c',fillColor:'#ff3b3b',fillOpacity:.8,weight:1}).addTo(layer).bindPopup('<b>'+x.title+'</b><br>'+x.source);});}
async function loadConflict(){const c=await j('/api/conflict');if(!c)return;document.getElementById('conflict').innerHTML=c.map(x=>`<div class=cf>⚠ ${x.title} <span style=color:#7a4a3a>— ${x.source}</span></div>`).join('');}
async function loadMarkets(){const m=await j('/api/markets');if(!m)return;document.getElementById('markets').innerHTML=m.map(x=>{const u=(x.chg||0)>=0;return `<div class=mk><span>${x.name}</span><span class=${u?'up':'dn'}>${(x.price||0).toLocaleString()} ${u?'▲':'▼'}${Math.abs(x.chg||0).toFixed(2)}%</span></div>`}).join('');}
async function loadNews(){const n=await j('/api/news');if(!n)return;document.getElementById('news').innerHTML=n.map(x=>`<div class=nw>• ${x.title} <span style=color:#5a7a8a>(${x.source})</span></div>`).join('');}
async function loadBrief(){const b=await j('/api/briefing');if(!b)return;document.getElementById('brief').textContent=b.text;document.getElementById('bts').textContent=new Date().toLocaleTimeString();}
async function loadGold(){const g=await j('/api/gold');if(!g||!g.price)return;const u=(g.chg_7d||0)>=0;document.getElementById('gold').innerHTML=`<div class=gp>$${g.price.toFixed(1)}/oz</div>7d <span class=${u?'up':'dn'}>${(g.chg_7d||0).toFixed(1)}%</span> · 30d ${(g.chg_30d||0).toFixed(1)}%<br>1mo H $${(g.high_1mo||0).toFixed(0)} · L $${(g.low_1mo||0).toFixed(0)}`;}
async function loadWeather(){const w=await j('/api/weather');if(!w||!w.temp_c)return;document.getElementById('weather').innerHTML=`⛅ ${w.temp_c}°C (feels ${w.feels_c}°C) · ${w.desc}<br>humidity ${w.humidity}% · wind ${w.wind_kph} km/h`;}
async function loadSystem(){const s=await j('/api/system');if(!s)return;const on=s.filter(x=>x.up).length;document.getElementById('system').innerHTML=`<div style='color:#5a7a8a;margin-bottom:4px'>${on}/${s.length} online</div>`+s.map(x=>`<div class=mk><span>${x.name}</span><span class=${x.up?'up':'dn'}>${x.up?'● ONLINE':'○ offline'}</span></div>`).join('');}
function gauge(label,val,col){const v=Math.min(100,val||0);return `<div class=gl><span>${label}</span><span>${v.toFixed(0)}%</span></div><div class=gauge><div class=gfill style="width:${v}%;background:${col};color:${col}"></div></div>`;}
async function loadPc(){const p=await j('/api/pc');if(!p)return;const c=x=>x>=90?'#ff5c5c':x>=75?'#ffb347':'#27e07a';document.getElementById('pc').innerHTML=gauge('CPU',p.cpu,c(p.cpu))+gauge('MEMORY',p.mem,c(p.mem))+gauge('DISK C:',p.disk_c,c(p.disk_c))+gauge('DISK E:',p.disk_e,c(p.disk_e))+`<div style='color:#5a7a8a;font-size:10px'>processes: ${p.procs}</div>`;}
async function loadActivity(){const a=await j('/api/activity');if(!a)return;document.getElementById('activity').innerHTML=a.map(x=>`<div class=act>▸ ${x}</div>`).join('')||'<div style=color:#5a7a8a>idle…</div>';}
async function loadTasks(){const t=await j('/api/tasks');if(!t)return;document.getElementById('tasks').innerHTML=t.length?t.map(x=>{const c=x.status==='running'?'#19e0ff':x.status==='completed'||x.status==='done'?'#27e07a':x.status==='failed'?'#ff5c5c':'#5a7a8a';return `<div class=tk><span style=color:${c}>${x.status==='running'?'●':'○'}</span> ${x.goal} <span style=color:${c}>(${x.status})</span></div>`}).join(''):'<div style=color:#5a7a8a>No active tasks.</div>';}
async function loadMemory(){const m=await j('/api/memory');if(!m)return;document.getElementById('memory').innerHTML=m.map(x=>`<div class=mem><span style=color:#5a7a8a>[${x.cat}]</span> ${x.key}: ${x.val}</div>`).join('')||'<div style=color:#5a7a8a>—</div>';}
function all(){loadMap();loadConflict();loadMarkets();loadNews();loadBrief();loadGold();loadWeather();loadSystem();loadPc();loadActivity();loadTasks();loadMemory();}
setInterval(()=>{loadPc();loadActivity();},5000);
all();setInterval(all,90000);
const lv=document.getElementById('live');setInterval(()=>lv.style.opacity=lv.style.opacity==='0.2'?'1':'0.2',700);
</script></body></html>"""


@app.get("/", response_class=HTMLResponse)
def home():
    return PAGE


if __name__ == "__main__":
    print(f"[JARVIS Ops Dashboard] http://localhost:{PORT}")
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="warning")
