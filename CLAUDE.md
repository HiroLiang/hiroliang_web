# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Type-check + production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test runner is configured yet.

## Environment

Copy `.env.example` to `.env.local` and set:

```
VITE_API_BASE_URL=   # Backend API base URL
```

## Architecture

**Entry point:** `src/main.tsx` — mounts into `#root` with `HashRouter` (hash-based routing), wraps in `AppProviders` (React Query).

**Routing:** `src/router/index.tsx` — all routes wrapped in `AppLayout`. Current routes: `/` (HomePage), `/project` (ProjectPage).

**State:** `src/stores/app-store.ts` — Zustand store with `persist` middleware (key: `app-preferences`). Currently holds `locale` (persisted) and `visitCount` (ephemeral).

**i18n:** Custom solution — no external i18n library. `MessageDictionary` type (`src/locales/types.ts`) is the source of truth for all translatable strings. Add new locales in `src/locales/`, register them in `src/locales/index.ts`. Use `useMessages()` in components to get typed strings for the current locale.

**API:** `src/lib/axios.ts` exports `apiClient` (Axios instance) and a typed `request<TResponse>()` wrapper. Base URL from `VITE_API_BASE_URL`.

**UI components:** shadcn/ui pattern — components in `src/components/ui/` are copied/adapted from shadcn, built on Radix UI primitives + Tailwind + `class-variance-authority`.

**Features:** Feature-specific logic lives in `src/features/<feature>/`. Currently `src/features/project/use-detected-platform.ts` detects mac/windows/mobile/desktop from `navigator`.

**Path alias:** `@/` maps to `src/`.
