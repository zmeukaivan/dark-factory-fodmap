#!/usr/bin/env python3
"""Holdout scenarios. The assertions live in `scenarios.ts` (hidden from the builder);
this file is the Python bridge `ci.py` invokes, which runs them under `tsx`.

The builder is blocked from reading `.factory/holdout/**`, which is the whole point:
these scenarios are the only checks the agent cannot read and iterate against.
"""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent

NPX = shutil.which("npx") or "npx"
CMD = [NPX, "tsx", str(HERE / "scenarios.ts")]


def main() -> int:
    try:
        p = subprocess.run(CMD, cwd=ROOT, capture_output=True, text=True,
                           encoding="utf-8", errors="replace", timeout=120)
    except subprocess.TimeoutExpired:
        print("HOLDOUT_FAILED scenarios=0 assertions=0 failures=1 (timeout)", flush=True)
        return 1
    except OSError as e:
        print(f"HOLDOUT_FAILED scenarios=0 assertions=0 failures=1 ({e})", flush=True)
        return 1

    if p.stdout:
        sys.stdout.write(p.stdout)
    if p.stderr:
        sys.stderr.write(p.stderr)
    sys.stdout.flush()
    return p.returncode


if __name__ == "__main__":
    sys.exit(main())
