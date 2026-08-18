#!/usr/bin/env bash
# Adapter: translate the runner's Claude-Code-style invocation to opencode's headless CLI.
#
# The runner calls:  <agent> -p "<prompt>" --model <m> --allowedTools <tools>
#                    --disallowedTools <holdout-deny> --permission-mode acceptEdits
#                    --add-dir <dir> --max-budget-usd <n> --output-format json
#
# opencode's headless surface is:  opencode run "<prompt>" -m <provider/model>
#                                  [--dir <dir>] --format json --dangerously-skip-permissions
#
# Flags we cannot express are dropped, not faked:
#   --allowedTools / --disallowedTools   opencode has no per-invocation tool allowlist;
#                                        the holdout deny is enforced by opencode's own
#                                        permission config (see opencode.json), not here.
#   --permission-mode acceptEdits        covered by --dangerously-skip-permissions.
#   --max-budget-usd                     no opencode equivalent; cost is instrumented by
#                                        factory/cost.py where the agent supports it.
set -euo pipefail

prompt=""
model=""

while [ $# -gt 0 ]; do
  case "$1" in
    -p|--prompt)          prompt="$2"; shift 2 ;;
    --model)              model="$2";   shift 2 ;;
    # --add-dir is dropped, not mapped to --dir. `--dir` CHDIRs the agent, but the runner
    # already `cd`s into the worktree before invoking us; mapping it sent the builder into
    # the ROOT checkout instead, so its edits landed outside the worktree and the run
    # escalated with an empty diff. Run in the process cwd (the worktree) instead.
    --add-dir)            shift 2 ;;
    --output-format)      shift 2 ;;   # the runner only ever passes json
    --allowedTools)       shift 2 ;;
    --permission-mode)    shift 2 ;;
    --max-budget-usd)     shift 2 ;;
    --disallowedTools)    shift ;;     # holdout deny; value args skipped by the *) arm
    *)                    shift ;;     # stray value (e.g. holdout deny globs)
  esac
done

[ -n "$prompt" ] || { echo "opencode-agent: no prompt received" >&2; exit 2; }

# A desktop opencode session exports these and `opencode run` then tries to attach to it
# (--attach) and dies with "Session not found". A fresh headless run must start its own
# server, so strip the attach credentials and let it do exactly that.
unset OPENCODE_SERVER_PASSWORD OPENCODE_SERVER_USERNAME OPENCODE_CLIENT OPENCODE_SERVER 2>/dev/null || true

args=()
[ -n "$model" ] && args+=(-m "$model")

exec opencode run "$prompt" "${args[@]}" --format json --dangerously-skip-permissions
