# Prep Tracker

Personal interview preparation tracker. Log solved questions, track progress with charts, and get personalized insights.

## Features

- **Dashboard** — Stat cards (total, solved, backlog, streak), tips, recent activity, quick actions
- **Questions** — Browse, search, filter, and manage solved questions with category, difficulty, topic, source, company tags
- **Backlog** — Save questions to solve later, convert to solved with category assignment
- **Stats & Insights** — Activity heatmap, daily/weekly/cumulative charts, breakdowns by category/difficulty/topic/source/company, streaks, weak areas, milestones
- **Auth** — Email/password, Google OAuth, Passkey (WebAuthn)
- **Dark Mode** — Theme toggle with persistence
- **Mobile-first** — Desktop sidebar + mobile bottom navigation, all screens responsive

## Tech Stack

- **React 19** + **Vite** + **TypeScript**
- **TanStack Query** for data fetching & caching (5min stale time, auto-invalidation on mutations)
- **Zustand** for auth & UI state
- **Tailwind CSS 4** with glass-morphism design
- **Recharts** for data visualization
- **shadcn/ui** (Radix UI) components
- **React Router 7** for routing
- **React Compiler** (auto-memoization)

## Getting Started

```bash
npm install
cp .env.example .env    # Fill in your values
npm run dev             # http://localhost:5176
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:7002/api
VITE_AUTH_BASE_URL=http://localhost:7002/api
VITE_AUTH_API_KEY=your_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5176) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint check |
| `npm run typecheck` | Type check |

## Project Structure

```
src/
├── api/           # API fetch wrappers (statsApi, questionsApi)
├── queries/       # TanStack Query hooks (useStats, useQuestions, useBacklog)
├── store/         # Zustand stores (auth, toast)
├── hooks/         # Utility hooks (usePageTitle, useAuth, useToast)
├── pages/         # Route pages (Dashboard, Questions, Backlog, Stats, Settings)
├── components/    # Reusable components (Layout, StatCard, ActivityItem)
│   └── ui/        # shadcn/ui primitives
└── lib/           # Utilities (queryKeys, cn)
```

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Dashboard | `/` | Stat cards, tips, recent activity, quick actions |
| Questions | `/questions` | Filterable list of solved questions |
| Question Detail | `/questions/:id` | View/edit question with solution |
| New Question | `/new` | Log a solved question (title + solution + category required) |
| Backlog | `/backlog` | Pending questions, solve with category picker |
| Stats | `/stats` | Charts, heatmap, streaks, weak areas, milestones |
| Settings | `/settings` | Profile, passkeys, appearance |

## License

MIT
