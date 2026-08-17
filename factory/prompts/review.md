# Node 5: review, and open the PR record

Run the `piv-review-changes` skill over the diff, then write the PR record.

You rubber-stamp this when the gate is green and the diff is small, which is most of the
time - so it goes autonomous early. It is still worth running, because it is the only node
that reads the diff *as code* rather than as a set of markers.

## Review

`git diff {{base}}...{{branch}}`, then read each changed file in full - not just the hunks.
Look for:

- **Logic errors**: off-by-one, inverted conditionals, a branch that cannot be reached
- **Data-correctness breaks** the typecheck cannot see: a rating that contradicts its
  source, a day-key collision, a meal-symptom link that silently drops one side
- **Scope**: anything here unrelated to the issue
- **Conventions** (`AGENTS.md`): core imports nothing that renders, no I/O in
  `packages/core`, explicit return types on exported functions
- **Tests**: a change to domain logic without a matching unit test; a bug fix without a
  regression test; new coverage in the package's own tests, never in `harness/`

Governance files are read from the **base branch**. A change is not judged against a
rulebook it just edited.

## Then write `{{prfile}}`

One file, at exactly that path. On the GitHub backend this becomes the body of a real
pull request, opened by `factory/run-workflow.sh` after you exit - you do not open it and
you are not given `gh`. Same rule as the merge: a model's only output is a record, and
code decides what happens to it.

```markdown
---
issue: {{issue_ref}}
title: <the change, in the imperative>
branch: {{branch}}
state: open
attempts: 0
---

## What changed
<2-4 sentences, in terms of the product, not the files>

## Files
<path - why it changed>

## Gate
<static, unit count, e2e steps, holdout scenarios/assertions, mutations caught/total>

## Review findings
<severity / file:line / what and why - or "none">

## Floor raise to apply
<if assertions were added, the new .factory/locks/floor.json values for a human to commit,
 since that file is protected - or "none">
```

`state: open` hands it to the independent validator. **Do not merge.** Your only
merge-related output is this record; `factory/gate.sh` and `factory/merge.sh` decide, and
they re-check the markers themselves rather than trusting this file.

The front matter is read by the script that opens the PR: `title` becomes the PR title and
everything below the second `---` becomes the PR body. Keep the body readable by a human
who has not seen the issue.
