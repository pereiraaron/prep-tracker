# Prep Tracker

A full-featured interview preparation tracker to organize, monitor, and analyze your technical interview prep progress.

## Features

- **Dashboard** — Overview with stats, progress bar, recent activity, and quick actions
- **Questions** — Browse, search, filter, and manage solved questions with rich metadata (category, difficulty, topic, source, company tags)
- **Backlog** — Save questions to solve later and track pending items
- **Analytics** — Activity heatmap, daily/weekly/cumulative progress charts, breakdowns by category, difficulty, topic, source, and company
- **Auth** — Email/password, Google OAuth, and Passkey (WebAuthn) authentication
- **Dark Mode** — Theme toggle with persistence
- **Responsive** — Desktop sidebar + mobile bottom navigation

## Tech Stack

- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS 4** with glass-morphism design
- **Zustand** for state management
- **Recharts** for data visualization
- **shadcn/ui** (Radix UI) components
- **React Router 7** for routing

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/your-username/prep-tracker.git
cd prep-tracker
npm install
cp .env.example .env
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AUTH_BASE_URL=http://localhost:3000/api
VITE_AUTH_API_KEY=your_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### Development

```bash
npm run dev        # Start dev server (port 5176)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Lint check
npm run typecheck  # Type check
npm run test       # Run tests
```

## Project Structure

```
src/
├── api/           # API fetch wrappers
├── store/         # Zustand stores
├── hooks/         # Custom hooks (store wrappers)
├── pages/         # Route pages
├── components/    # Reusable components
│   └── ui/        # shadcn/ui primitives
└── lib/           # Utilities
```
