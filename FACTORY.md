# The factory

<!--
  Maintainer: whoever raises the autonomy dial. Update the level and the date on the
  same commit that changes the level - a stale level here is a lie about what is
  running unattended.
-->

**Current autonomy level: 3** - a labelled issue is implemented, independently validated, and auto-merged on green structural gates; deploy runs after the merge.
**Raised to this level on:** 2026-08-19
**Stop button:** `touch .factory/STOP` (local kill file) and a `factory:stop` label on any open issue (fails closed).
**Built from PRD:** `docs/low-fodmap-diet-tracker.prd.md` - `MISSION.md` is its compression. Change one, change both.

## The process this encodes

One `implement-issue` lap runs four nodes, then the independent validator runs a fifth:

1. **prime** (`deepseek-v4-flash`) - loads the issue and the governance files, prepares the run dir.
2. **plan** (`deepseek-v4-pro`) - reads issue + governance, writes the implementation plan. The one premium slot.
3. **implement** (`deepseek-v4-flash`) - edits code and tests in a worktree, runs the `--quick` gate on itself.
4. **review** (`deepseek-v4-flash`) - writes the PR record/description.
5. **judge** (`deepseek-v4-flash`, in `validate-pr`) - independent verdict against base-branch governance, the diff, and a gate run it performed itself.

Two more nodes exist for the non-happy paths: **fix** (addresses validator findings, max 2 attempts) and **sort** (triage). Each node loads `MISSION.md`, `FACTORY_RULES.md` and `AGENTS.md` at the step where they govern it; the runner is `factory/run-workflow.sh` shelling out to the headless opencode CLI via `factory/opencode-agent.sh`.

## The five components, as built here

| # | Component | This repo's version |
|---|-----------|---------------------|
| 1 | Workflow-driven repo | opencode (headless) via `factory/orchestrator.sh` + `factory/run-workflow.sh` |
| 2 | The trigger | **not armed** (Task Scheduler, planned; none installed yet) |
| 3 | Deployment | local versioned snapshot (`factory/deploy.sh`), polling, health-checked before the pointer moves |
| 4 | Guidance layer | `MISSION.md` · `FACTORY_RULES.md` · `AGENTS.md` |
| 5 | Validation harness | `library` driver (`harness/ci.py`), holdout at `.factory/holdout/` |

## The gates that are actually code

Everything else is a prompt instruction, which is a suggestion with good manners.
These are the ones a model cannot argue past:

1. `factory/gate.sh` - asserts every marker in `FACTORY_REQUIRED_MARKERS`, checks the
   counts, and refuses the merge when the raw output and the verdict disagree.
2. `factory/guard.py` - the protected list and the scope caps. Fails **closed**.
3. `harness/ci.py` - the `APP_STARTED` and `E2E_PASSED` assertions: a positive marker
   that the app actually started, and a counted journey, not "did anything fail".

## The end-to-end path

The single user journey that gates every merge, driven against the headless core:

1. Log a meal
2. Log a symptom
3. View the day (meal and symptom linked to the same date)
4. Reuse a previously-logged meal by name

Required step count: **4** (`E2E_PASSED steps=4`; ratchet in `.factory/locks/floor.json`).

**Last deliberately broken and confirmed failing:** 2026-08-18 - the mutation runner
(`harness/mutations/defects.json`, 4 defects) is re-run by every gate and was confirmed
4/4 caught on the first merged lap.

## The autonomy ladder, and where we stop

| Level | Automatic | Reached |
|---|---|---|
| 1 | labelled issue → PR opens | 2026-08-19 |
| 2 | validator runs and posts a verdict | 2026-08-19 |
| 3 | validator auto-merges on green structural gates | 2026-08-19 |
| 4 | self-triage, and a scheduled test files its own bugs | |
| 5 | writes its own issues from the mission | |

**Before the next notch, these must be true:**

- [x] A hand-run lap completed end to end and merged (PR #2, 2026-08-18: Food type + `searchFoods`).
- [x] `factory_doctor` clean; runner behaviour suite 56/56; deployment proven (`deploy.sh` snapshot → smoke → pointer).
- [ ] `bash` on PATH resolves to Git Bash, not the WSL relay, for the machine that will run the trigger.

## Operating notes

- **Cost.** Not yet measured. `factory/cost.py` records per-node spend; re-edit this once a lap's cost is known.
- **Model routing.** Planning slot: `opencode-go/deepseek-v4-pro`. Everything else: `opencode-go/deepseek-v4-flash`.
- **What reaches a human.** Only `factory:needs-human` (and the assumption/calibration holds). `FACTORY_NOTIFY_CMD` is **unset**, so escalations currently wait in `.factory/needs-human.md` until a human looks.
- **Known gotchas for this repo.**
  - Deploy **polls** rather than using a push trigger, because commits made with the default GitHub token do not fire workflows.
  - The standalone opencode CLI must stay current with the desktop app: v1.14.31 threw `ConfigInvalidError` on the current auth; fixed by upgrading to v1.18.18.
  - `shutil.which("bash")` resolves to the WSL relay on this machine; the runner needs Git Bash first on PATH.

## Incident log

Append only. Every entry is a rule that now exists because of it.

| Date | What happened | What changed as a result |
|---|---|---|
| 2026-08-18 | Headless `opencode run` (v1.14.31) threw `ConfigInvalidError` against the current auth, blocking every node | Upgraded the standalone CLI to v1.18.18 |
| 2026-08-18 | Builder edited the root checkout instead of the worktree (`--add-dir` → `--dir` remapped opencode's cwd), so its edits landed outside the worktree | Dropped the remapping in `factory/opencode-agent.sh`; builders now run in the worktree |
| 2026-08-19 | Prime node (issue #7) hung ~12 min with no output — full tool access let it run the full gate and spawn a browser. Killed it; the runner logged `NODE_FAILED` and continued to `plan`, which re-derived the priming context and the lap completed | Not yet fixed. The root cause is that `opencode-agent.sh` drops `--allowedTools`, so nodes get unrestricted tool access the prompts do not account for |
