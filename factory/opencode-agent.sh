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
dir=""

while [ $# -gt 0 ]; do
  case "$1" in
    -p|--prompt)          prompt="$2"; shift 2 ;;
    --model)              model="$2";   shift 2 ;;
    --add-dir)            dir="$2";     shift 2 ;;
    --output-format)      shift 2 ;;   # the runner only ever passes json
    --allowedTools)       shift 2 ;;
    --permission-mode)    shift 2 ;;
    --max-budget-usd)     shift 2 ;;
    --disallowedTools)    shift ;;     # holdout deny; value args skipped by the *) arm
    *)                    shift ;;     # stray value (e.g. holdout deny globs)
  esac
done

[ -n "$prompt" ] || { echo "opencode-agent: no prompt received" >&2; exit 2; }

args=()
[ -n "$model" ] && args+=(-m "$model")
[ -n "$dir" ]   && args+=(--dir "$dir")

exec opencode run "$prompt" "${args[@]}" --format json --dangerously-skip-permissions
