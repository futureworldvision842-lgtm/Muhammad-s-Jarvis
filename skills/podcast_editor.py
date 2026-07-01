"""
podcast_editor — edit podcasts/audio/video for J.A.R.V.I.S. using FFmpeg.

Real local editing (no cloud): trim, merge, normalize loudness, strip silence,
convert format, extract audio from video, add intro/outro. FFmpeg must be on PATH
(it is via winget). Inspired by the workflows in the claude-code-video-toolkit,
but runs fully local and is callable by Jarvis.
"""
import os
import shutil
import subprocess

FFMPEG = shutil.which("ffmpeg") or "ffmpeg"


MANIFEST = {
    "name": "podcast_editor",
    "description": (
        "Edit a podcast / audio / video file locally with FFmpeg. Actions: "
        "trim (start/end seconds), merge (join files), normalize (broadcast loudness), "
        "remove_silence, convert (change format e.g. mp3/wav/m4a/mp4), extract_audio "
        "(from a video), add_intro (prepend an intro clip). Use when Boss asks to edit, "
        "cut, trim, merge, clean up, normalize, or convert a podcast/audio/video file."
    ),
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "action": {"type": "STRING", "description": "trim | merge | normalize | remove_silence | convert | extract_audio | add_intro"},
            "input": {"type": "STRING", "description": "Path to the input file."},
            "inputs": {"type": "ARRAY", "items": {"type": "STRING"}, "description": "List of file paths (for merge)."},
            "output": {"type": "STRING", "description": "Output file path. If omitted, one is derived from the input."},
            "start": {"type": "STRING", "description": "Trim start (seconds or HH:MM:SS)."},
            "end": {"type": "STRING", "description": "Trim end (seconds or HH:MM:SS)."},
            "intro": {"type": "STRING", "description": "Intro clip path (for add_intro)."},
        },
        "required": ["action"],
    },
}


def _run(args):
    r = subprocess.run([FFMPEG, "-y", *args], capture_output=True, text=True, timeout=1800)
    return r.returncode == 0, (r.stderr or "")[-400:]


def _out(inp, suffix, ext=None):
    base, e = os.path.splitext(inp)
    return f"{base}_{suffix}{('.'+ext) if ext else e}"


def run(parameters=None, player=None, speak=None):
    p = parameters or {}
    action = (p.get("action") or "").strip().lower()
    inp = (p.get("input") or "").strip().strip('"')
    out = (p.get("output") or "").strip().strip('"')

    if not shutil.which("ffmpeg") and not os.path.exists(FFMPEG):
        return "FFmpeg isn't available on PATH, Sir. Install it first."
    if action != "merge" and inp and not os.path.exists(inp):
        return f"Input file not found: {inp}"

    if player is not None:
        try:
            player.write_log(f"PODCAST: {action} -> {os.path.basename(inp) or 'files'}")
        except Exception:
            pass

    try:
        if action == "trim":
            out = out or _out(inp, "trim")
            args = ["-i", inp]
            if p.get("start"):
                args = ["-ss", str(p["start"]), "-i", inp]
            if p.get("end"):
                args += ["-to", str(p["end"])]
            args += ["-c", "copy", out]
            ok, err = _run(args)
            return f"Trimmed -> {out}" if ok else f"Trim failed: {err}"

        if action == "merge":
            files = [f.strip().strip('"') for f in (p.get("inputs") or []) if f.strip()]
            files = [f for f in files if os.path.exists(f)]
            if len(files) < 2:
                return "Give at least 2 existing files to merge (inputs)."
            out = out or _out(files[0], "merged")
            listfile = out + ".txt"
            with open(listfile, "w", encoding="utf-8") as fh:
                for f in files:
                    fh.write(f"file '{os.path.abspath(f)}'\n")
            ok, err = _run(["-f", "concat", "-safe", "0", "-i", listfile, "-c", "copy", out])
            try: os.remove(listfile)
            except Exception: pass
            return f"Merged {len(files)} files -> {out}" if ok else f"Merge failed: {err}"

        if action == "normalize":
            out = out or _out(inp, "norm")
            ok, err = _run(["-i", inp, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", out])
            return f"Normalized (broadcast loudness) -> {out}" if ok else f"Normalize failed: {err}"

        if action == "remove_silence":
            out = out or _out(inp, "nosilence")
            ok, err = _run(["-i", inp, "-af",
                            "silenceremove=stop_periods=-1:stop_duration=0.8:stop_threshold=-40dB", out])
            return f"Silence trimmed -> {out}" if ok else f"Remove-silence failed: {err}"

        if action == "convert":
            if not out:
                return "Give an output path with the target extension (e.g. out.mp3)."
            ok, err = _run(["-i", inp, out])
            return f"Converted -> {out}" if ok else f"Convert failed: {err}"

        if action == "extract_audio":
            out = out or _out(inp, "audio", "mp3")
            ok, err = _run(["-i", inp, "-vn", "-q:a", "2", out])
            return f"Audio extracted -> {out}" if ok else f"Extract failed: {err}"

        if action == "add_intro":
            intro = (p.get("intro") or "").strip().strip('"')
            if not (intro and os.path.exists(intro)):
                return "Give a valid intro clip path."
            out = out or _out(inp, "withintro")
            listfile = out + ".txt"
            with open(listfile, "w", encoding="utf-8") as fh:
                fh.write(f"file '{os.path.abspath(intro)}'\nfile '{os.path.abspath(inp)}'\n")
            ok, err = _run(["-f", "concat", "-safe", "0", "-i", listfile, "-c", "copy", out])
            try: os.remove(listfile)
            except Exception: pass
            return f"Intro added -> {out}" if ok else f"Add-intro failed: {err}"

        return ("Unknown action. Use: trim, merge, normalize, remove_silence, "
                "convert, extract_audio, add_intro.")
    except subprocess.TimeoutExpired:
        return "That edit took too long and timed out, Sir."
    except Exception as e:
        return f"Podcast edit failed: {e}"


if __name__ == "__main__":
    print("podcast_editor ready. FFmpeg:", FFMPEG)
