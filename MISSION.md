# Mission

<!-- Owner: humans only. On the protected list; the factory cannot edit this file. -->

**Derived from:** `docs/low-fodmap-diet-tracker.prd.md`
**Last reconciled with that PRD:** 2026-08-16

## What the Low-FODMAP Diet Tracker is

A free, local-first tool for people with IBS who are following the low-FODMAP
diet. It combines a trustworthy FODMAP food database with meal logging and
symptom tracking in one place, so a user can connect what they ate to how they
felt and identify their personal trigger foods. It is a consumer self-management
tool, not medical advice.

The product is a **single-user, local-first** app: a user's meals and symptoms
are stored on their own device, there are no accounts and no cloud sync in the
current scope, and the same person is both the logger and the reader.

## Who it is for

- A person with IBS, self-managing the low-FODMAP diet during the elimination or
  reintroduction phase, who wants to link food to symptoms and find their trigger
  foods.

The Low-FODMAP Diet Tracker is **not** a medical diagnosis or treatment tool, and
**not** a clinical platform for dietitians managing patients.

## Core capabilities (in scope)

The factory may accept issues in these areas.

**Food database**
- Browse and search foods by name.
- Filter by FODMAP rating and category.
- View a food's rating, safe portion, and high-FODMAP types.

**Meal logging**
- Log a meal (breakfast/lunch/dinner/snack) with its ingredients.
- Reuse a previously-logged meal by name to prefill its ingredients.

**Symptom logging**
- Log a symptom from a preset IBS catalog or a custom entry, with severity (1–5).

**Correlation**
- View a day's meals and symptoms together.

## Out of scope (the factory must never build this)

Issues asking for any of these are rejected at triage, even when they are popular,
well argued, and easy to implement. This list is how drift gets recognised as drift.

**Never, not "not yet."**

- **Medical** — diagnosis, treatment recommendations, or clinical decision support.
- **Data licensing** — redistributing or embedding licensed Monash app data.
- **Other conditions** — celiac disease or non-IBS diet support.
- **Monetization** — payments, subscriptions, or advertising.
- **Off-device data** — accounts, cloud sync, or anything that transmits a user's
  meals/symptoms off their device.
- **Social / public** — sharing, comments, reactions, or a public API for third
  parties.

Deferred-but-allowed (in the backlog, not rejected): a clinician-facing platform,
eating-out dish recognition, and accounts/sync — these are "not yet", not "never".

## Hard invariants (not tunable by any issue)

1. **Food ratings are correct.** A food's FODMAP rating must match its cited
   source. A wrong rating causes real symptoms, so ratings may never be invented,
   guessed, or silently altered. Every food entry carries a source.
2. **Local-first.** A user's meal and symptom data stays on their device. No
   issue may introduce off-device transmission of user data.
3. **The factory cannot modify governance files.** `MISSION.md`,
   `FACTORY_RULES.md`, and `AGENTS.md` are the constitution. A PR touching any of
   them is an automatic reject.

## Allowed evolutions

Explicitly in scope, so the factory does not reject them as architectural drift:

- Extending the food dataset with additional *cited* entries from the approved
  sources (Monash's free list, NHS).
- Adding new symptom types to the preset catalog.
- Performance and quality improvements within the existing architecture.

## Definition of done

Every change the factory ships clears all three gates.

**Gate 1 — static checks and tests pass.** `npm run lint` and `npm run test`.

**Gate 2 — the product-level quality bar.** Any new user-facing feature is usable
without documentation and does not degrade the data-correctness invariant.

**Gate 3 — the end-to-end path passes as a real user.**

1. Start the app.
2. Log a meal with at least one ingredient.
3. Log a symptom with a severity.
4. Open the day view and see both the meal and the symptom persisted.

This runs on every change that touches runnable code. It is not optional.

## Non-goals

The Low-FODMAP Diet Tracker is explicitly not trying to be a medical device, a
multi-tenant SaaS, a clinical platform, or a general nutrition assistant.

When in doubt, the answer is "that is out of scope."

## Open questions — decisions nobody has made yet

These are undecided, not forbidden. **The factory may propose an answer to any of
them**, build against it, and record what it assumed — the merge is then held for a
human. See `FACTORY_RULES.md` §7.

- **Q1** The numeric targets for the success metrics (funnel depth, return rate).
- **Q2** The concrete escalation notification command (channel chosen: push
  notification; the exact command is unset).

Once answered, an entry moves to `.factory/decisions.md` with its answer and date.
**A decision is asked once.**

## What the factory does NOT own — permanently human

- Does it **feel** right — pacing, tone, whether two states read as different.
- Does it **look** right — layout, hierarchy, visual hierarchy.
- Is it **understandable** — can a first-time user work it out without being told.

The factory owns the domain layer — food data correctness, meal/symptom logging,
the correlation logic — whose correctness can be asserted. The list above is
reviewed by a human, on purpose, forever.
