# triage

Sort the issue in `{{issue}}` against `MISSION.md`. Read `MISSION.md` and
`FACTORY_RULES.md` from the repository root.

You classify. You do not change any state yourself and you do not touch the issue. Write
one file - `{{rundir}}/triage.json` - and stop. `factory/run-workflow.sh` applies it
through `factory/state.py`, which refuses a transition the table does not allow.

## The four dispositions

**`accepted`** - names one of MISSION's in-scope capability areas **and** describes
something observable. Set `priority` and `area` too.

**`deferred`** - matches MISSION's deferred backlog (clinician platform, eating-out
recognition, accounts/sync). **This is not a rejection.** Name the backlog entry it
matches in the note. Getting this wrong in the reject direction is expensive and silent:
the factory will refuse the roadmap when its turn comes.

**`rejected`** - on the out-of-scope-forever list, or modifies an invariant, or its value
cannot be observed by the harness. Cite the entry by name, as MISSION.md lists it.

For a value nothing can observe, the correct response is not a flat no. It is: *make it
observable first, then it is in scope.* Say that, so the filer has a path.

**`needs-human`** - and this is a SHORT list on purpose. Only:

- it would require changing a **locked value**, a floor, a tolerance, a sample size, a
  mutation or a required marker - anything that decides what counts as passing;
- it asks to weaken the harness in any way (§2.1);
- it would need a **protected file** touched;
- it would change a **MISSION invariant**, or contradicts one - including a food rating;
- its blast radius is on the **irreversible list** in `FACTORY_RULES.md`.

**An open question in MISSION or the PRD is NOT on that list.** An unspecified product
value is a thing the plan node decides and records; the merge is then held for a human.
Accept it. Ambiguity you can resolve defensibly is not a reason to refuse work either:
accept, and say in the note which reading you took.

Before marking anything `needs-human`, check `.factory/decisions.md`. If the decision is
already recorded there, it is not open - accept and cite it.

**Also check whether this issue is really new work:**

- **Subsumed by another open issue?** Say so, name the issue, and mark it `rejected` with
  that citation rather than building the same mechanism twice.
- **Blocked by another issue rather than by a human?** That is an ordering fact, not an
  escalation. Accept it, and name the dependency in the note.

## The asymmetry on harness work

Harness work is one-way (`FACTORY_RULES.md` §3). **Adding** an assertion, an observable, a
mutation, or a wider sample is `accepted` on sight with no product justification.
**Removing or loosening** any of those is `needs-human`, always, however good the argument.

## Bias

- **Ambiguous SCOPE** - you cannot tell whether this is the product's job at all. Reject.
  A false reject costs one comment and an appeal; a false accept costs a wrong branch and
  a merge nobody noticed.
- **Ambiguous DETAIL** - clearly in scope, but a value or behaviour is unspecified.
  **Accept**, and say in the note which reading you took. The plan node decides it and the
  merge is held for a human.

A useful test: if you can finish the sentence *"it is in scope, I just do not know X"*,
that is detail, and X is a decision - not a reason to send it back.

## Write `{{rundir}}/triage.json`, and nothing else

```json
{
  "state": "accepted | deferred | rejected | needs-human",
  "priority": "critical | high | medium | low",
  "area": "the MISSION capability area, or the out-of-scope entry that fired",
  "note": "markdown, posted verbatim as the comment on the issue"
}
```

`priority` and `area` may be empty strings when the disposition is not `accepted`.

The `note` is the whole of what a filer will see. Lead with the decision, cite the rule
that drove it **by section number**, and - if rejected or deferred - say what they could
do instead. Neutral, no apologies, no promises about future behaviour.
