# ResumeForge AI — Resume Builder & Analyzer

A production-ready React + TypeScript app with two modules:

1. **Resume Builder** — split-screen form with live A4 preview, 5 templates, undo/redo, autosave.
2. **Resume Analyzer** — drag-and-drop PDF/DOCX upload with AI-style scoring, keyword match, suggestions.

## Tech Stack

- React 19 + TypeScript + Vite
- Material UI v7
- React Hook Form + Zod
- TanStack Query + Axios
- React Router DOM v7
- React Dropzone
- Framer Motion
- React Hot Toast

## Getting started

```bash
npm install
npm run dev
```

The app boots on `http://localhost:5173`. It ships with a full `axios-mock-adapter` mock backend so
every feature works offline out of the box. When you have a real API, flip `USE_MOCK_API` to `false`
in `src/utils/constants.ts` and point `VITE_API_BASE_URL` at your server.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and build the production bundle
- `npm run preview` — preview the production build locally
- `npm run lint` — lint with ESLint

## Folder structure

```
src/
├── components/
│   ├── analyzer/         # Analyzer-specific UI (dropzone, charts, suggestions)
│   ├── common/           # Reusable UI primitives (ScoreRing, StatCard, ...)
│   ├── form/             # RHF-connected form controls
│   ├── layout/           # App shell (sidebar, top bar)
│   └── resume/
│       ├── sections/     # Form section blocks
│       └── templates/    # 5 resume templates + shared renderers
├── context/              # ResumeContext (state + undo/redo + autosave)
├── hooks/                # Custom hooks (queries live under queries/)
├── pages/                # Route-level pages, lazy-loaded
├── routes/               # Route definitions
├── services/
│   ├── api/              # Axios instance + typed API modules
│   └── mock/             # axios-mock-adapter wiring
├── theme/                # MUI theme + light/dark mode context
├── types/                # Domain types (Resume, Analyzer)
├── utils/                # Helpers + constants
└── validation/           # Zod schemas
```

## Design system

- **Palette**: Signal Blue (`#3B5BFD`) + Teal Mint (`#14B8A6`) + Amber (`#F59E0B`)
- **Type**: Sora (display) · Inter (body) · JetBrains Mono (data)
- **Signature motif**: gradient `ScoreRing` used consistently across dashboard, builder, and analyzer

## Notable features

- **Autosave** to localStorage via debounced writes.
- **Undo / redo** using a reducer with `past`/`present`/`future` history.
- **Template switching** preserves all resume data.
- **Section rendering** driven by `resume.sectionOrder` — infrastructure ready for drag-and-drop reordering.
- **Print-to-PDF** via a dedicated `#resume-print-area` in `index.css`, no headless-browser dependency needed.
- **A11y**: keyboard nav, ARIA labels on interactive icons, visible focus rings, prefers-reduced-motion.
- **Perf**: route-level code splitting, vendor manual chunks, memoized selectors.

## API contract

If wiring to a real backend, provide these endpoints:

- `GET /resume/templates` → `{ success: true, data: ResumeTemplateMeta[] }`
- `POST /resume/generate` (body: `ResumeData`) → `{ success: true, data: { downloadUrl, generatedAt, message } }`
- `POST /analyzer/analyze` (multipart: `file`) → `{ success: true, data: ResumeAnalysisResult }`

TypeScript types for both live in `src/types/`.
