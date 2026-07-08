# StudyOS

A personal productivity dashboard built for managing UNISA coursework — tracking assignments, deadlines, study progress, and focus sessions in one place.

**[Live Demo →](https://byte-master63.github.io/StudyOS/)**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_v6-CA4245?logo=reactrouter&logoColor=white)

---

## Overview

StudyOS is a full-stack front-end productivity tool designed around a real academic workload — eight concurrent university modules, each with their own formative assessments, due dates, and marks. Rather than juggling a spreadsheet and a calendar app separately, StudyOS pulls everything into a single dashboard with live-updating stats, a real assessment calendar, and a built-in focus timer.

It's built as a single-page application with client-side persistence — no backend required, no accounts, no sync between devices (yet). Everything you edit is saved locally in your browser.

## Features

- **Dashboard** — at-a-glance view of tasks, upcoming assignments, progress, a daily quote, this month's due dates, and total study hours
- **Assignment Tracker** — full editable record of every assessment, grouped by module, filterable by status (upcoming / completed / cancelled)
- **Calendar** — month-by-month navigable view with assessment due dates highlighted
- **Modules** — per-module summary: completion rate, average mark, next due date
- **Analytics** — overall task completion, assessment completion, and average marks across all modules
- **Focus Timer** — start/pause/stop session timer that logs real study time back into the dashboard
- **Settings** — one-click reset for all locally stored data

All editable data (task completion, marks, due dates, cancellations, study sessions) persists across page reloads via `localStorage`.

## Tech Stack

- **React 18** — component architecture, hooks-based state
- **Vite** — build tooling and dev server
- **React Router v6** — client-side routing with shared state passed via `Outlet` context
- **Tailwind CSS v4** — utility-first styling via the `@tailwindcss/vite` plugin and CSS-based `@theme` tokens
- **localStorage** — client-side persistence, no backend

## Architecture

```
App
 └─ Layout (owns shared state: tasks, assessments, studySessions)
     ├─ Sidebar (navigation)
     └─ Outlet (renders active page, receives state via context)
         ├─ Dashboard
         ├─ Calendar
         ├─ AssignmentTracker
         ├─ Modules
         ├─ Analytics
         ├─ Focus
         └─ Settings
```

State is lifted into `Layout.jsx` and shared with every routed page through React Router's `useOutletContext()` — this avoids prop drilling through the router while keeping the app free of a global state library. All state is backed by a custom `useLocalStorage` hook for persistence.

### Folder structure

```
src/
├── components/
│   ├── layout/       # Layout, Sidebar
│   ├── ui/            # Card (generic, reusable)
│   ├── dashboard/      # WelcomeCard, TasksCard, AssignmentsCard, etc.
│   └── assignments/    # AssessmentRow (shared editable row)
├── pages/               # Dashboard, Calendar, AssignmentTracker, Modules, Analytics, Focus, Settings
├── data/                # Static seed data (tasks, assessments, quotes)
├── hooks/               # useLocalStorage
├── utils/               # calendarUtils, moduleUtils, getDailyIndex
├── main.jsx
└── index.css            # Tailwind entry + design tokens
```

## Design

StudyOS uses a custom visual identity — **"Student Ledger"** — built around the idea of a lived-in academic logbook: module codes rendered as stamped badges, marks and dates in a monospace "gradebook" typeface, and a sidebar styled like a ring-binder spine.

| Token | Color |
|---|---|
| Paper (background) | `#EFF1EC` |
| Ink (text/headings) | `#1B2A4A` |
| Stamp (accent) | `#A23B2E` |
| Moss (success) | `#3F6C51` |
| Mustard (highlight) | `#E8C468` |

Typography: `Space Grotesk` (display), `Source Serif 4` (body), `IBM Plex Mono` (data/codes).

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Byte-Master63/StudyOS.git
cd StudyOS

# Install dependencies
npm install

# Run the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

This builds the app and pushes the `dist/` folder to the `gh-pages` branch.

## Roadmap

- [ ] Sync data across devices (backend + auth)
- [ ] Notifications for upcoming deadlines
- [ ] Offline support
- [ ] AI-assisted study planning

## Author

Built by [Thokozane Tshabalala](https://github.com/Byte-Master63) — ALX Software Engineering graduate, currently studying at UNISA.

## License

This project is open source and available under the [MIT License](LICENSE).
