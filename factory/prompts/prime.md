# Node 1: prime

Run the `prime-codebase` skill, scoped to what `{{issue}}` actually touches.

You do not skip this step and neither does the factory. The plan node is the expensive
one; feeding it a cold read of the repository is how a premium model gets spent
re-deriving what a cheap one could have handed it.

## Read

- `git ls-files`, `git log -10 --oneline`, `git status`
- `MISSION.md`, `AGENTS.md`, `README.md`
- `packages/core` in full - the headless domain library at the bottom of the dependency
  graph, the thing the web app and the harness both call
- `packages/fodmap-data` - the curated dataset (its ratings are a protected invariant)
- the harness modules relevant to the issue's capability area (`harness/`)
- `.factory/locks/*.json` - the thresholds a human has set, which the plan must stay inside

## Report to `{{rundir}}/priming.md`

Keep it scannable. Cover:

- **What the issue touches**: the capability area from `MISSION.md`, and the files
- **Existing patterns to mirror**, with `file:line`. Naming, how data threads through the
  `Store` interface, how checks are written and counted
- **The observability surface**: what the harness already asserts (E2E steps, holdout
  scenarios, mutation defects), and which of them the issue's area depends on
- **Current gate counts**: read them from `.factory/locks/floor.json` (the ratchet) and
  `harness/harness.config.json`. Do **not** run `harness/ci.py` to get them - the full
  gate's mutation step is slow and is not what priming is for; if you need the live unit
  count, `harness/ci.py --quick` is the most you should run.
- **Anything that looks like it is already broken** in the area, distinct from the issue.
  Do not fix it. Name it, and note whether it is worth a separate issue.

You are read-only. If you find yourself wanting to edit something, that is a finding for
the report, not an action.
