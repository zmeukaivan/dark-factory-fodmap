# Low-FODMAP Diet Tracker — conventions

<!-- Protected. The factory cannot edit this file. -->

## Stack and commands

```bash
npm install          # install all workspaces (root)
npm run dev:web      # start the Next.js web app
npm run test         # run the test suite (Vitest) across workspaces
npm run lint         # lint across workspaces
```

**npm workspaces, not a single app.** The monorepo is `apps/web` + shared
`packages/*`. Run commands from the repo root.

## Where things live

| path | what belongs there |
|---|---|
| `packages/core/` | all domain logic — types, food/meal/symptom rules, the `Store` interface. No UI or framework imports. |
| `packages/fodmap-data/` | the curated FODMAP food dataset and its access layer. Ratings here are protected (see FACTORY_RULES.md §5). |
| `packages/db/` | reserved for a future SQLite store. Not used yet. |
| `apps/web/` | the Next.js UI. Thin rendering layer over `packages/core`. |
| `harness/` | the validation gate. Protected — see FACTORY_RULES.md. |
| tests (per package) | all tests. New coverage goes in the package's own test files, never into `harness/`. |

**The one architectural rule that matters:** the core imports nothing that renders.
All food/meal/symptom logic lives in `packages/core` as a headless library behind the
`Store` interface; the web app and the validation harness are both just callers of it.

## Code style

- TypeScript, strict mode (`strict: true` in `tsconfig.json`).
- Prefer explicit return types on exported functions.
- Errors: return/throw at the domain boundary; log nothing from `packages/core`
  (it has no I/O). Persistence errors surface to the caller.
- Comments only where the *why* is non-obvious; never restate what the code says.

## Tests

- Colocated per package (`*.test.ts`), run with Vitest.
- A new feature must come with unit tests for its domain logic, plus a regression
  test for any bug fix.
- The dataset in `packages/fodmap-data` is covered by integrity tests (unique ids,
  valid enums, every food has a source, ratings never contradict their source).
- **New coverage goes in the package's own tests, never in the harness.** The
  harness is protected: it is the definition of "working".

## Dependencies

New dependencies require a PR-body section explaining what it does, why the existing
ones do not, and evidence of active maintenance. Keep runtime dependencies in the core
to zero; the `Store` adapter pattern exists so storage libraries live only in the web
app or a dedicated adapter package.

## What is NOT in this file

- **What the product is, and what it will never be** → `MISSION.md`
- **How the factory behaves unsupervised** — PR size caps, protected paths, never
  editing a test to make it pass → `FACTORY_RULES.md`

If you are about to write a rule here that starts "the agent must never...", it almost
certainly belongs in `FACTORY_RULES.md` instead.
