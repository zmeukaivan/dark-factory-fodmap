# Node 2: plan

Run the `piv-plan-implementation` skill for `{{issue}}`.

This is the step you actually read today. Everything downstream inherits whatever this
gets wrong, which is why this node holds the premium model.

## Inputs

- the issue body - this is the ticket
- `{{rundir}}/priming.md` - the priming from node 1
- `MISSION.md` - scope, invariants, and the definition of done
- `docs/low-fodmap-diet-tracker.prd.md` - the PRD `MISSION.md` was compressed from. Read
  it when the issue touches *why* something is the way it is.
- `docs/architecture.md` - the settled engineering decisions (headless core, `Store`
  adapter, data model).
- `AGENTS.md` - conventions
- `FACTORY_RULES.md` - how this runs unattended

## Inherit, don't re-decide

The invariants in `MISSION.md` and the architecture in `docs/architecture.md` are
**already decided**. Plan within them. A plan that proposes changing one has
misunderstood the issue: say so and escalate rather than planning the change.

## You cannot run anything, and the implement node nearly cannot either

**You have `Read`, `Glob`, `Grep` and `Write`. No shell at all.** Do not plan to measure
something yourself; state the measurement as the implement node's first task instead.

**The implement node has** `Read`, `Glob`, `Grep`, `Edit`, `Write`, `Bash(python -c:*)`
for measurement, and `Bash({{quick}})`. It has no `git`, no `gh`, and no other shell. A
task that needs anything else does not fail loudly: the node stops having changed nothing.
Write no task the next node cannot perform.

## Write the plan to `{{rundir}}/plan.md`

Standard `piv-plan-implementation` structure. Four sections matter more here than they do
interactively, because no human reads this before it executes:

**Out of scope / non-goals.** Name what a reasonable reader might assume is included and
is not. Unattended, this is the only thing standing between a two-file change and a
nine-file one.

**Every task has an executable validation command.** Not "verify it works". The command.
The implement node runs these and has nothing else to go on.

**The test task.** Every change that touches `packages/core` or `packages/fodmap-data`
must come with unit tests in the package's own test files (never in `harness/`). A bug fix
must include a regression test that fails on the base branch. Write the tests as an
explicit task, not a trailing "and add tests".

**The harness task, where one is warranted.** If this change makes a new class of bug
possible, add a deliberate defect to `harness/mutations/defects.json` covering it. Note
this is a protected path - write the task as a proposal in the plan body for a human to
apply, not as an edit the implement node performs.

## Decide and proceed. Stopping is the exception, and the list is short.

**Your default is to make the call, build it, and say what you assumed.** An unmade
decision blocks every issue downstream of it; a made decision that turns out wrong is one
line and one merge click.

### The two kinds of value, and only one of them stops you

- **A JUDGEMENT value decides what counts as passing** - anything in
  `.factory/locks/*.json`, a floor, a tolerance, a sample size, a required marker, a
  mutation. **Never choose one. Ever.** Picking these is tuning the judge.
- **A PRODUCT value decides what the software does** - a name, a default, a portion, a
  layout, a wording. **Choose it, and record it.** A PRD that holds one open means "I have
  not decided", not "you may not propose".

### So: write `{{rundir}}/ASSUMPTIONS` and keep going

One line per decision: **what you chose, what it applies to, why, and what would change
your mind.**

```
<name>=<value>  | WHY: derived from <the invariant, rule or existing value it follows
                  from - name it, so the reader can check the derivation>. <what a nearby
                  wrong value would break>.
                  CHANGE IF: <the observation that would make this the wrong call>.
```

That file does **not** stop the run. It rides through the build into the PR record, and
`gate.sh` **holds the merge** on it: the work is built, validated and waiting, with your
reasoning at the top, and a human merges or replaces the number.

### Build the part you can

An issue is rarely wholly blocked. If three quarters of it is buildable and one quarter
needs something on the stop list, **plan the three quarters** and write the rest into
`{{rundir}}/FOLLOWUP` as a follow-up issue.

### The stop list - write `{{rundir}}/ESCALATE` and stop ONLY for these

1. **Any judgement value would have to change** - a lock, a floor, a tolerance, a sample
   size, a mutation, a required marker. Including "just to make this pass".
2. **A protected file would have to change** (`FACTORY_RULES.md` §5).
3. **A MISSION invariant would have to change**, or the issue contradicts one - including
   a food rating or its source.
4. **The blast radius is on the irreversible list** in `FACTORY_RULES.md` - data-store
   schema changes, deletion, or off-device transmission.
5. **Two governance statements genuinely contradict each other**, so any plan violates one
   of them. Name both.

**Not on the list, and therefore not a reason to stop:** an open question in MISSION or the
PRD, an unspecified product value, an ambiguity you can resolve defensibly. Decide, record
it in ASSUMPTIONS, and move.

Before escalating, read `.factory/decisions.md`. If the decision you need is already
answered there, **use it and cite it** - it is not open any more. If it is listed as open
and unanswered, do not re-ask it: reference its ID in ASSUMPTIONS or FOLLOWUP and plan
around it.

**When you do escalate, propose an answer.** A question with a recommendation attached is
a yes/no. Give your recommended value, your reasoning, and what you would do if overruled.

## Report

Path to the plan, complexity, key risks, and a confidence score out of 10 for one-pass
success. Below 6, escalate instead - a plan you do not believe in is cheaper to abandon
here than after three fix attempts.
