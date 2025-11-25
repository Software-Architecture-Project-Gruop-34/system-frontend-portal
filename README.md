# Bookfair Stall Reservation System — Frontend

Modern React + TypeScript frontend for an exhibition/bookfair stall reservation system. It provides separate experiences for Users (vendors) and Admins with dashboards, reservations, stalls browsing, and profile management.

## Tech Stack
- React 19 + TypeScript + Vite 7
- Tailwind CSS 4
- React Router 7
- Axios, React Toastify, Lucide Icons

## Quick Start (Windows PowerShell)
```powershell
npm install
npm run dev
```

Build and preview:
```powershell
npm run build
npm run preview
```

Lint:
```powershell
npm run lint
```

## Project Structure
```
src/
  api/                 # API clients (users 8083, stalls 8081, reservations 8082)
  components/
    common/            # Modal, Table, Toast, LoadingSpinner
    Dashboard/         # StallSummary, ReservationSummary, UserOverview
    NavBar.tsx, SideBar.tsx
  pages/               # Login, Profile, Stalls, MyReservations, AdminDashboard, UserDashboard
  utils/               # Helpers
```

## Key Features
- Admin Dashboard
  - Stall summary by status/size
  - Reservation summary (pending/confirmed/cancelled/revenue)
- User Dashboard
  - Personal reservation stats, upcoming reservation, recent reservations
  - Stall availability snapshot
- Profile
  - View profile; update profile via modal (role-aware fields)
- Stalls
  - Browse/search/filter stalls by status, size, category/name
- Reservations
  - List user reservations; admin view of all reservations

## Routing (examples)
- User: `/dashboard`, `/stalls`, `/myreservations`, `/profile`
- Admin: `/admin/dashboard`, `/admin/reservations`
- Auth: `/login`

## Configuration
- Services (defaults hardcoded in API clients):
  - User Service: `http://localhost:8083/api`
  - Stall Service: `http://localhost:8081/api`
  - Reservation Service: `http://localhost:8082/api`
- Auth: Bearer token stored in `localStorage` as `token`. Additional keys: `userId`, `userRole`, `userStatus`.

If your backend runs on different hosts/ports, update the base URLs in:
- `src/api/auth.ts`
- `src/api/stalls.ts`
- `src/api/reservations.ts`

## Development Notes
- Type-only imports: project enables `verbatimModuleSyntax`. Import types with `import type { ... } from '...'`.
- Tailwind gradients: use `bg-linear-to-r|br` utilities as used in components.
- Toasts: success/error feedback via `react-toastify`.

## Scripts
- `npm run dev`: Start Vite dev server
- `npm run build`: Type-check and build
- `npm run preview`: Preview built app
- `npm run lint`: Run ESLint

## License
Private academic project. No license specified.
