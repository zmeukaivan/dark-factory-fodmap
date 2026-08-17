#!/usr/bin/env python3
"""MUTATION TESTING. Break the software on purpose and require the gate to notice.

    python harness/mutations/run.py

THE ONLY THING THAT MEASURES YOUR HARNESS RATHER THAN YOUR CODE.

Each defect: copy the repo to a temp dir, apply one textual mutation to real source,
run the gate there, and require it to go RED. A mutation the gate misses is a class of
bug that can currently merge unreviewed.

This repo is TypeScript, so the throwaway build gets a junction to the real
`node_modules` (a copy of 1200 packages per defect is not a thing anyone runs twice)
and the root config files the `npx`/`npm` commands need.

Emits `MUTATIONS_TOTAL=N` and `MUTATIONS_CAUGHT=N`. The gate requires them to be equal.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
DEFECTS = Path(__file__).resolve().parent / "defects.json"

# What to copy into each throwaway build. The source, the harness, and the holdout.
COPY = ["packages", "harness", ".factory"]
# Root files the `npx`/`npm` commands need.
ROOT_FILES = ["package.json", "package-lock.json", "tsconfig.json"]
SKIP_DIRS = {"__pycache__", ".git", "runs", "locks-runtime", "builds", ".worktrees"}


def build_copy(dest: Path) -> None:
    for item in COPY:
        src = ROOT / item
        if not src.exists():
            continue
        if src.is_dir():
            shutil.copytree(src, dest / item,
                            ignore=shutil.ignore_patterns(*SKIP_DIRS))
        else:
            shutil.copy(src, dest / item)
    for name in ROOT_FILES:
        src = ROOT / name
        if src.exists():
            shutil.copy(src, dest / name)
    _link_node_modules(dest)


def _link_node_modules(dest: Path) -> None:
    """Junction to the real node_modules, so npx/npm work without a 1200-package copy."""
    src = ROOT / "node_modules"
    if not src.exists():
        return
    link = dest / "node_modules"
    if os.name == "nt":
        subprocess.run(["cmd", "/c", "mklink", "/J", str(link), str(src)],
                       capture_output=True, check=False)
    else:
        os.symlink(src, link, target_is_directory=True)


def apply(dest: Path, d: dict) -> bool:
    """Textual mutation. Returns False if the anchor was not found."""
    target = dest / d["file"]
    if not target.exists():
        return False
    body = target.read_text(encoding="utf-8")
    if d["find"] not in body:
        return False
    target.write_text(body.replace(d["find"], d["replace"], 1), encoding="utf-8")
    return True


def main() -> int:
    if not DEFECTS.exists():
        print("MUTATIONS_ABSENT no defects.json next to this script", flush=True)
        return 0

    defects = json.loads(DEFECTS.read_text(encoding="utf-8"))["defects"]
    total = caught = not_injected = 0

    print("MUTATION_START", flush=True)
    for d in defects:
        total += 1
        with tempfile.TemporaryDirectory() as td:
            dest = Path(td) / "build"
            dest.mkdir()
            build_copy(dest)

            if not apply(dest, d):
                not_injected += 1
                print(f"  NOT_INJECTED  {d['id']:<38} anchor not found in {d['file']}",
                      flush=True)
                continue

            env = dict(os.environ, FACTORY_IN_MUTATION="1")
            r = subprocess.run([sys.executable, "harness/ci.py"], cwd=dest, env=env,
                               capture_output=True, text=True, encoding="utf-8",
                               errors="replace", timeout=600)
            if r.returncode != 0:
                caught += 1
                step = "gate"
                for line in (r.stdout or "").splitlines():
                    if line.startswith("GATE_FAILED:"):
                        step = line.split(":", 1)[1].strip()
                print(f"  CAUGHT        {d['id']:<38} by {step}", flush=True)
            else:
                print(f"  ESCAPED       {d['id']:<38} <-- {d['why']}", flush=True)

    print(f"MUTATIONS_TOTAL={total}", flush=True)
    print(f"MUTATIONS_CAUGHT={caught}", flush=True)
    print(f"MUTATIONS_NOT_INJECTED={not_injected}", flush=True)
    if caught == total and not_injected == 0:
        print("MUTATIONS_OK", flush=True)
        return 0
    print("MUTATIONS_FAILED - every escaped defect is a class of bug that can currently "
          "merge unreviewed", flush=True)
    return 1


if __name__ == "__main__":
    sys.exit(main())
