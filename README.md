# Dark Factory (FODMAP)

A cross-platform low-FODMAP diet application that works on web and Android.

## Architecture

This is a monorepo with the following structure:

```
├── apps/
│   ├── mobile/          # React Native (Expo) mobile app
│   └── web/             # Next.js web application
├── packages/
│   ├── core/            # Shared business logic, types, validation
│   ├── db/              # Shared SQLite schema, migrations, queries
│   └── fodmap-data/     # Monash FODMAP database import scripts + dataset
```

## Tech Stack

- **Mobile**: React Native (Expo)
- **Web**: Next.js
- **Database**: Local-first SQLite (shared schema)
- **Monorepo**: npm workspaces
- **Language**: TypeScript

## Features (Planned)

- 🍽️ **Food Database**: Browse/search foods by FODMAP category with portions and details
- 📝 **Meal Logging**: Log meals and track food intake with portion sizes
- 📊 **Symptom Tracking**: Track symptoms and correlate with food intake
- 🥗 **Meal Planning**: Get suggestions for low-FODMAP meals, recipes, and food swaps

## Data Source

FODMAP food data is imported from the Monash University FODMAP database (the authoritative source).

## Development

```bash
# Install dependencies
npm install

# Start web dev server
npm run dev:web

# Start mobile dev server
npm run dev:mobile

# Build web
npm run build:web

# Build mobile
npm run build:mobile
```

## Local-First

This application is designed to work offline-first. All data is stored locally on the device using SQLite. Optional cloud sync may be added in the future.

## License

MIT
