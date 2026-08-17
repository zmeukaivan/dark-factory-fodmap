"""The end-to-end path: ONE journey, driven by the harness as a user drives it.

This project's software is a TypeScript library, so the journey itself lives in
`harness/e2e.ts` and is executed with `tsx`. This file is the bridge: it runs that
journey, propagates its output, and returns the assertion count (or None on failure)
so `ci.py` can emit `E2E_PASSED steps=N`.

The three rules that decide whether the journey is worth anything live over in
`e2e.ts`: assert what a user would notice, count the steps, return failure loudly.
"""
from __future__ import annotations

import json
import re
import shlex
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent

CONFIG = json.loads((HERE / "harness.config.json").read_text(encoding="utf-8"))


def run_e2e(app) -> int | None:
    """Run the journey in Node and return its assertion count, or None on failure."""
    cmd = CONFIG.get("library", {}).get("e2e_cmd", "").strip()
    if not cmd:
        print("  FAIL  no library.e2e_cmd in harness.config.json", flush=True)
        return None

    argv = shlex.split(cmd, posix=False)
    if argv:
        found = shutil.which(argv[0])
        if found:
            argv[0] = found
    try:
        p = subprocess.run(argv, cwd=ROOT, capture_output=True, text=True,
                           encoding="utf-8", errors="replace",
                           timeout=int(CONFIG.get("e2e_timeout_s", 120)))
    except subprocess.TimeoutExpired:
        print("  FAIL  e2e journey timed out", flush=True)
        return None
    except OSError as e:
        print(f"  FAIL  could not run {cmd!r}: {e}", flush=True)
        return None

    if p.stdout:
        sys.stdout.write(p.stdout)
    if p.stderr:
        sys.stderr.write(p.stderr)
    sys.stdout.flush()

    if p.returncode != 0:
        return None

    m = re.search(r"STEPS=(\d+)", p.stdout or "")
    if not m:
        print("  FAIL  e2e ran but reported no STEPS= count", flush=True)
        return None
    return int(m.group(1))
