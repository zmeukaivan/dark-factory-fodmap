# Low-FODMAP Diet Tracker — PRD

Status: Draft (product intent; engineering decisions deliberately deferred to `plan-architecture` / the dark-factory build)
Date: 2026-08-16

## 1. Problem Statement

People with irritable bowel syndrome (IBS) who follow the low-FODMAP diet have
essentially one good tool — the Monash University app — and it is paid and
phone-only. Worse, it is a *lookup* reference: it tells you whether a single food
is safe, but it does not help you connect what you ate to how you felt. The
result is that people cannot reliably identify their personal trigger foods, and
in real situations (the grocery store, a restaurant) they are left guessing. The
cost of not solving this is continued, avoidable IBS symptom days and diet
abandonment.

## 2. Evidence

- **Assumption-led.** This is a personal-need project; no user interviews or
  analytics exist yet. The following are hypotheses, not measured facts:
  - The Monash app is the only trusted option and requires payment + a phone.
    (Observation: Monash's full data is app-gated; free lists online are
    scattered and low-trust.)
  - Eating out is a blind spot: Monash has no dish-level "is this safe for me"
    recognition.
  - Food→symptom correlation is the missing capability people actually want.
- **To validate:** the MVP's funnel metrics (see Success Metrics) are the first
  real evidence.

## 3. Thesis (why build it)

Give people with IBS a free, local-first, cross-platform (web + Android) tool
that combines a trustworthy FODMAP food database with **meal logging and symptom
tracking in one place**, so they can correlate what they eat with how they feel
and identify their trigger foods. This is why now (a personal need with no good
alternative) and why it beats the incumbent: Monash is lookup-only and
single-device; this closes the loop from food → symptom → insight, offline-first,
across platforms.

## 4. Hypothesis

> We believe a local-first app that pairs a FODMAP food database with meal and
> symptom logging will cause people with IBS to actually link their diet to their
> symptoms, resulting in identified trigger foods.
>
> **We'll know we're RIGHT if** a user who logs a meal also logs a symptom on the
> same day, and does so consistently across a 4–6 week elimination window
> (the leading signal: symptom entries tied to meal entries).
>
> **We'll know we're WRONG if** meal logging happens but symptom logging never
> does — users stop at meals and never complete the correlation loop (the
> counter-signal: high meal-log volume, near-zero symptom-log volume).

## 5. Target User & JTBD

- **Primary user:** a person with IBS, self-managing the low-FODMAP diet during
  the elimination or reintroduction phase.
- **JTBD:** *When I'm choosing what to eat — at home, at the store, or eating
  out — I want to know quickly and trustworthily whether it's low-FODMAP for me,
  and to connect what I ate to how I felt, so I can avoid triggering symptoms.*
- **Non-users:** people without IBS/functional gut disorders; people seeking a
  medical diagnosis; celiac patients (a different diet); clinicians managing
  patients (this is a consumer self-management tool, not a clinical platform).

## 6. MVP

The thinnest end-to-end line that tests the correlation hypothesis:

1. **Food database** — browse, search, and filter a FODMAP food dataset, with
   per-food detail (rating, safe portion, high-FODMAP types).
2. **Meal logging** — record what was eaten and how much, organized by day/meal.
3. **Symptom logging** — record symptoms and severity, on the same day as meals,
   so food→symptom correlation is possible.

Local-first; no account required to use the core loop. (Food data source and
trust policy are an engineering decision — see Open Questions.)

## 7. Success Metrics

- **Primary (funnel depth — do people complete the correlation loop?):**
  of sessions that log a meal, the share that also log a symptom the same day.
  Target: TBD — needs validation.
- **Secondary (return lookups):** weekly active food lookups / return rate.
  Target: TBD — needs validation.
- **How measured:** in-app event tracking for `food_view`, `meal_logged`,
  `symptom_logged` (anonymous, local-first; opt-in if synced anywhere).

## 8. Non-goals

- No medical diagnosis, treatment advice, or clinician decision support.
- Not for celiac disease or non-IBS conditions.
- No clinician / patient-management platform.
- No eating-out / restaurant dish-recognition feature in the MVP (a named pain,
  deliberately deferred — not the current bet).
- No accounts, cloud sync, or social features in the MVP.
- No redistribution of licensed Monash app data.

## 9. Open Questions

- [ ] Food data: which source(s) and what trust policy? (free high-trust lists
      vs. licensed Monash export — engineering, but product-relevant)
- [ ] Does "local-first, no account" hold, or is cross-device sync a real need?
- [ ] What exact numeric targets make the success metrics pass/fail?
- [ ] Is the 4–6 week window long enough to observe symptom logging retention?
- [ ] Scope of "reintroduction" support (the phase after elimination) — in MVP or later?
