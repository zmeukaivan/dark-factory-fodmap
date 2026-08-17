# Node 3: implement

Run the `piv-implement` skill against `{{rundir}}/plan.md`.

You skim this step at best, so it goes autonomous first. Work the plan task by task, in
order, running each task's validation command as you go.

## Absolute prohibitions (`FACTORY_RULES.md` §2)

1. **Never modify a test, assertion, tolerance, sample size or lock to make something
   pass.** Fix the source. If a check is genuinely wrong, say so in the report and stop -
   that is a `needs-human` escalation, not a change you make.
2. **Never touch a protected file** - governance, `.factory/locks/**`,
   `.factory/holdout/**`, `factory/**`, `harness/mutations/**`, `packages/fodmap-data/**`,
   `docs/low-fodmap-diet-tracker.prd.md`, `docs/architecture.md`.
3. **Never add a dependency.** The dependency policy is in `AGENTS.md`: keep runtime
   dependencies in the core to zero, and justify any new one in the PR body.
4. **Never build beyond what the plan asked for.** No opportunistic refactors, no "while
   I was in here". The plan's non-goals section is binding.
5. **Never alter a food rating or its source.** Ratings are a hard invariant
   (`MISSION.md`, `FACTORY_RULES.md` §2.8).
6. **Stay under 500 changed lines.** Over the cap, stop and report - the work needs
   splitting.

## The headless-core contract

`packages/core` is the domain library. Its contract (`AGENTS.md`, `docs/architecture.md`):

- the core imports nothing that renders - no UI, no framework, no React
- all food/meal/symptom logic lives behind the `Store` interface
- the core has no I/O: it never logs, never reads the clock, never touches the filesystem
- a `Store` implementation is swapped in by the caller (in-memory for tests/harness,
  IndexedDB for the web)

The typecheck (`npx tsc --noEmit`) and the harness enforce part of this; the point of
reading it here is that finding out now is cheaper than finding out in validation.

## Data correctness ships with the change

If this change touches food data or adds a new food/rating, the rating must match its
cited source, and the entry must carry a `source`. A wrong rating causes real symptoms.
New dataset entries belong in `packages/fodmap-data` and are covered by its integrity
tests. That package is protected - write any dataset change as a proposal in your report
for a human to apply, not as an edit you perform.

## Validate as you go

After each task, run **exactly this command, verbatim**:

```
{{quick}}
```

It is the only one on your allowlist. Any other way of running the tests is denied and
your work goes unchecked until the validator sees it. That is typecheck, unit tests and
the quick gate - fast, and enough to catch a mistake while you still remember making it.

**Do not run the full gate.** It belongs to the validator. A builder that can run the gate
it is judged by will iterate against the gate rather than against the problem.

## Report

Write `{{rundir}}/report.md`: what was built, tasks completed, tests added, validation
results, **deviations from the plan and why**, and any floor raise a human should apply.
Deviations are the reviewer's signal of intent - a documented one is a decision, an
undocumented one is a bug.
