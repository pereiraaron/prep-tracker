# Prep Tracker - Project Guidelines

## Tech Stack

- React 18 + TypeScript + Vite
- Chakra UI v3 (`defineConfig`, `createSystem`, `mergeConfigs` — NOT v2's `extendTheme`)
- Zustand for state management
- React Router for routing
- Path aliases: `@api/`, `@components/`, `@store/`, `@screens/`, `@hooks/`

## Project Structure

```
src/
├── api/          # API clients and shared types/constants
├── components/   # Shared reusable components (used across multiple screens)
├── hooks/        # Shared custom hooks
├── screens/      # Feature screens (each screen is a folder)
│   └── Feature/
│       ├── Feature.tsx        # Main screen component
│       ├── components/        # Components only used by this screen
│       └── mockData.ts        # Dev mock data (if needed)
├── store/        # Zustand stores
├── theme.ts      # Chakra UI v3 custom theme
├── App.tsx       # Router and app shell
└── main.tsx      # Entry point
```

## Component Placement Rules

- **`src/components/`**: Only for components used by 2+ screens. If a component is only used within a single screen, it belongs in that screen's `components/` folder.
- **`src/screens/Feature/components/`**: Components scoped to a single screen. Keeps the parent `components/` folder clean.
- When a screen-scoped component starts being used elsewhere, move it to `src/components/`.

## Shared Constants

- Color maps (`CATEGORY_COLOR`, `DIFFICULTY_COLOR`, `INSTANCE_STATUS_COLOR`), labels, and enums live in `src/api/types.ts`. Do not duplicate them in screen files.

## Styling Rules

- Use Chakra spacing tokens (numbers) for `p`, `px`, `py`, `gap`, `mb`, etc. (e.g., `p={4}`, `gap={3}`)
- Use `rem` only for `maxW` or values that represent large layout constraints (e.g., `maxW="75rem"`)
- Use semantic tokens for colors: `bg.card`, `border.card`, `fg.muted`, `brand.solid`, etc.
- Prefer Chakra's built-in components (e.g., `Avatar.Root` + `Avatar.Fallback`) over custom implementations

## Dev Mode

- Mock user is enabled in dev via `DEV_MOCK_USER` in `useAuthStore.ts` — remove before production
- Mock token bypass exists in `src/api/client.ts` — remove before production
- Screen-level mock data (e.g., `Stats/mockData.ts`) is loaded in `.catch()` when API is unavailable in dev
