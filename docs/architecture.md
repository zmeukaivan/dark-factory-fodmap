# Architecture — Low-FODMAP Diet Tracker

Date: 2026-08-16
Status: Approved
Links: PRD at `docs/low-fodmap-diet-tracker.prd.md`

## Problem & goals

People with IBS follow the low-FODMAP diet but have only the paid, phone-only,
lookup-only Monash app — so they cannot connect what they eat to how they feel,
and cannot identify their trigger foods. The goal is a free, local-first,
cross-platform tool that closes the food → symptom loop. The lens for every
decision below: **the domain logic must be headless-testable (the dark factory's
harness must drive it), and food-rating correctness is a hard invariant.**

## Approaches considered

- **A — Headless core library + storage adapter.** All domain logic in a
  framework-agnostic TypeScript package; persistence behind a `Store` interface
  with in-memory (harness) and IndexedDB (web) adapters. Next.js is a thin UI.
  — *chosen.*
- **B — Logic in the Next app, driven over HTTP.** Simpler, but couples domain
  to Next, makes E2E slower/flakier, weak mobile reuse.
- **C — WASM SQLite now.** Faithful to "local-first SQLite", but heavy for a
  read-only food dataset + a couple of log tables.

## Recommended approach

A monorepo where the product's rules live in a headless `packages/core` library
with no UI or framework dependency. The web app (Next.js) is a rendering layer
that calls the core through a `Store` interface. Two `Store` adapters exist:
`InMemoryStore` (what the validation harness imports and drives) and
`IndexedDbStore` (the web app's local-first persistence). Mobile (Expo) reuses
`core` unchanged later.

## Key decisions

- **Stack & libraries:** TypeScript; Next.js 14 (App Router) for web; shared
  `packages/core` and `packages/fodmap-data`. Storage adapter pattern (no
  framework coupling in core). IndexedDB via the tiny `idb` wrapper for the web
  adapter. Vitest for tests. (Alternatives: logic-in-Next, WASM SQLite — rejected
  above.)

- **Data model:**
  - `Food` (static, `packages/fodmap-data`): `id`, `name`, `category`,
    `fodmapRating` (`low`|`high`), `safePortion?`, `highInFodmaps[]`,
    `source` (`monash`|`nhs`), `notes?`.
  - `Meal`: `id`, `date`, `type` (breakfast/lunch/dinner/snack), `name`
    (free text), `entries: MealEntry[]`.
  - `MealEntry` (an ingredient): `name`, `ingredients?` (what it consists of,
    for compound items), `portion?`.
  - `Symptom`: `id`, `date`, `type` (from a preset catalog or custom),
    `severity` (1–5), `note?`.
  - `SymptomCatalog`: static preset list of common IBS symptoms (bloating,
    abdominal pain, diarrhea, constipation, gas, nausea, urgency, incomplete
    evacuation).
  - `DayView` (derived): `{ date, meals, symptoms }` — the correlation unit.

- **Store contract** (headless surface the harness drives):
  ```ts
  interface Store {
    saveMeal(meal): Promise<void>
    saveSymptom(symptom): Promise<void>
    listDay(date): Promise<DayView>
    findMealByName(name): Promise<Meal | undefined>  // ingredient reuse
  }
  ```

- **Boundaries & contracts:** local-first, no auth/accounts in the MVP (PRD
  non-goal). Food data is a static, cited dataset; its correctness is the top
  invariant (a wrong rating causes real symptoms), so the dataset is
  protected/guarded. No external services in the MVP.

- **Reachability (dark factory):** the core library is the `library` driver
  surface; the harness also gets an `http` health route in the web app that
  returns a known word (`APP_STARTED`).

## Missing pieces

- Curated, cited FODMAP food dataset (~150–200 foods from Monash's free list +
  NHS) in `packages/fodmap-data`.
- `IndexedDbStore` adapter (`idb`); `InMemoryStore` for tests/harness.
- Monorepo `npm install` (nothing installed yet).
- Static symptom catalog.

## Spikes & experiments

None blocking. The adapter pattern is settled and reversible; the only
uncertainty — whether the `library`-driver E2E actually runs headlessly — is
answered by the walking skeleton itself, not a separate spike.

## Open questions

- Concrete escalation command (channel chosen: push notification; the exact
  command is deferred to the runner config).
- Numeric success-metric targets (TBD — needs validation).
- GitHub access method for the runner (`gh` is not installed; a PAT is the
  likely fallback).
