# FODMAP Food Database — Design

Date: 2026-08-16
Status: Approved

## Goal

Deliver the first vertical slice of the Dark Factory (FODMAP) app: a searchable,
filterable **food database** with per-food detail and local favorites, running on
the web. This is the foundation every later feature (meal logging, symptom
tracking, meal planning) builds on.

## Scope

### In scope

- Browse the full food list.
- Search by name.
- Filter by FODMAP rating (`low` / `high`) and by food category.
- Toggle a "favorites only" view.
- Food detail view: rating, safe portion (where known), which FODMAP types the
  food is high in, category, and a favorite button.
- A favorites list page.
- Curated seed dataset sourced from free high-trust references, every entry cited.

### Out of scope (deferred)

- Meal logging, symptom tracking, meal planning (future slices).
- Mobile (Expo) UI — shared packages are written so mobile can consume them later,
  but no mobile UI this slice.
- SQLite / the `db` package — not needed for a read-only dataset; deferred until
  a feature needs writes.
- The `green/amber/red` traffic-light tier and exact per-gram portion data from the
  Monash app (licensed; see Data Source below).

## Architecture

Monorepo (npm workspaces), three packages touched this slice:

```
apps/web                      Next.js 14 (App Router) — the UI
packages/core                 Types + pure logic (no UI, no I/O)
packages/fodmap-data          Curated seed dataset + data-access API
packages/db                   UNTOUCHED this slice
```

The web app consumes `core` and `fodmap-data` via Next.js `transpilePackages`
(they ship as TS source). Food data is imported statically and queried in-memory;
there is no network and no server data path. Favorites are the only mutable state,
persisted to `localStorage`.

## Data model (`packages/core`)

```ts
export type FodmapRating = 'low' | 'high';

export type FodmapCategory =
  | 'fruit'
  | 'vegetable'
  | 'grains-cereals'
  | 'legumes-pulses'
  | 'dairy'
  | 'meat-poultry-fish'
  | 'nuts-seeds'
  | 'sugars-sweeteners'
  | 'condiments-sauces'
  | 'drinks';

export type FodmapType = 'fructans' | 'gos' | 'lactose' | 'fructose' | 'polyols';

export type DataSource = 'monash' | 'nhs';

export interface Portion {
  amount?: number;        // numeric quantity, when the source gives one
  unit?: string;          // 'g' | 'ml' | 'cup' | 'tbsp' | 'tsp' | 'medium' | ...
  description: string;    // human-readable, e.g. "1/2 cup (75g)"
}

export interface Food {
  id: string;                    // slug, e.g. 'apple'
  name: string;
  category: FodmapCategory;
  fodmapRating: FodmapRating;    // binary low/high — the tier free sources support
  safePortion?: Portion;         // max low-FODMAP serve, where a source states it
  highInFodmaps: FodmapType[];   // FODMAP types this food is high in ([] for low foods)
  source: DataSource;            // citation tier per food
  notes?: string;                // caveat, e.g. "ripe bananas are high"
}
```

Note: `green/amber/red` traffic-light and per-type *quantitative* breakdown are
deliberately absent — they are only in Monash's licensed app data. The model keeps
the binary rating free sources support, plus `highInFodmaps` (which Monash's free
page and the NHS sheet both state per food group).

Rating semantics (unambiguous rule): `fodmapRating` reflects the source's headline
classification. A food the source lists as "suitable in limited amount X" is stored
as `low` with `safePortion` = X. A food the source lists as "high / avoid" is
stored as `high` with `safePortion` omitted — unless the source also gives a small
safe amount, in which case `safePortion` is stored and a `notes` caveat records it.

## Data source & trust policy

Two primary, citable references:

1. **Monash University** "High and low FODMAP foods" sample list
   (https://www.monashfodmap.com/about-fodmap-and-ibs/high-and-low-fodmap-foods/)
   — authoritative source's own free list; binary high/low by category.
2. **NHS (Gloucestershire Hospitals)** low FODMAP diet sheet
   (https://www.gloshospitals.nhs.uk/documents/11103/FODMAP_dietsheet_for_website.pdf)
   — dietitian-reviewed; binary high/low with portion guidance.

Rules:

- Every `Food` entry carries a `source` (`monash` or `nhs`) and is cross-checked
  against both where both cover the food.
- No food ships without a citation. Ratings and portions are transcribed from the
  sources, not invented.
- Target dataset size **~150–200 foods** across all categories.
- The Monash app (owned by the user) may be used as a manual lookup to *upgrade*
  specific foods later; it is not an extraction source for this slice.

## Shared packages

### `packages/core` — pure logic only

- `src/types.ts` — the types above.
- `src/search.ts` — `searchFoods(foods, query)` case-insensitive match on name,
  ranked (prefix match before substring).
- `src/filter.ts` — `filterFoods(foods, filter)` where
  `filter: { rating?, category?, favoritesOnly? }`.
- `src/favorites.ts` — `toggleFavorite(ids, id)` and `isFavorite(ids, id)`
  operating on a `string[]` of ids, so favorites logic stays platform-agnostic.
- `src/index.ts` — re-exports.

### `packages/fodmap-data` — dataset + access layer

- `src/foods.ts` — the curated `Food[]` seed dataset.
- `src/index.ts` — `getAllFoods()`, `getFoodById(id)`, `searchFoods(query)`,
  `filterFoods(filter)` (wrapping core's pure functions).

## Web app (`apps/web`, Next.js App Router)

Routes:

- `/` — food list: search box, rating chips (`low` / `high`), category dropdown,
  "favorites only" toggle, and the result grid.
- `/foods/[id]` — detail: rating badge, safe portion, high-FODMAP types, category,
  favorite button; unknown id → `notFound()`.
- `/favorites` — pinned list (reuses the same list/grid components).

Components: `SearchBar`, `FilterBar`, `FoodCard`, `FodmapBadge`, `FoodDetail`.

Favorites: a `FavoritesProvider` + `useFavorites` hook backed by `localStorage`
under a single key (a `string[]` of food ids), hydrated once on mount.

Styling: lightweight CSS Modules (no new UI framework dependency).

## Data flow

Fully client-side, no network. The food dataset is imported statically from
`fodmap-data`; search/filter run in-memory on each keystroke/filter change.
Favorites are read/written to `localStorage`; the favorites list is derived by
joining favorite ids against the static dataset.

## Error handling

- Empty search results → explicit empty state with a "clear filters" action.
- Unknown `/foods/[id]` → `notFound()` (404 page).
- No other failure modes: no network, no server, no I/O beyond localStorage
  (wrapped so a disabled/quota-exceeded localStorage degrades to in-memory only).

## Testing

- `packages/core`: unit tests for `searchFoods`, `filterFoods`, `toggleFavorite`,
  `isFavorite`.
- `packages/fodmap-data`: dataset integrity tests — unique ids, all enums valid,
  `highInFodmaps` empty for `low` foods, every entry has a `source`, no entry lacks
  a `name`/`category`/`rating`.
- Test runner: **Vitest** (lighter for TS/ESM than the jest placeholders currently
  in `core`/`fodmap-data` `package.json`; those scripts get updated to `vitest`).
- Manual check: `npm run dev:web` renders list/search/filter/detail/favorites.

## Non-goals

- No auth, no accounts, no sync.
- No Monash app extraction or licensed-data importer this slice (importer scaffold
  stays a future task in `packages/fodmap-data`).
