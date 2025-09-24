# isiahudofia.com

A production-ready Next.js 14 portfolio for Isiah Udofia, crafted to highlight product thinking, polished execution, and measurable outcomes.

## Features
- Next.js 14 App Router with React 18, TypeScript, and strict mode
- Dark-first, premium UI with Tailwind CSS and Framer Motion micro-interactions
- Structured project storytelling (Problem → Approach → Result) and JSON-LD schema
- SEO best practices via Next Metadata + next-seo, sitemap, robots, and OpenGraph configuration
- Accessible navigation, focus states, and keyboard-friendly layout components
- Placeholder analytics hook for easy Vercel Analytics or Plausible drop-in

## Getting Started

```bash
npm run dev
```

The site runs on Node 20 (see `.nvmrc`). All dependencies are already installed in this workspace.

### Scripts
- `npm run dev` — start the local development server
- `npm run build` — create an optimized production build
- `npm run start` — run the production build
- `npm run lint` — lint the codebase with ESLint
- `npm run format` — format files with Prettier

## Project Structure Highlights
- `app/` — App Router routes, layouts, loading/error states, and SEO files
- `components/` — shared UI components (navigation, sections, cards, case study layout, analytics)
- `data/projects.ts` — typed project metadata powering the portfolio and case studies
- `public/Isiah_Udofia_Resume.pdf` — resume placeholder referenced by the Resume route

## Content Overview
- `/` — Hero, featured projects, PM storytelling, and contact CTA
- `/projects` — Project grid with stacks, highlights, and metrics
- `/projects/*` — Case studies for Discorder, Zen Video Agency, and Thesis
- `/about` — Bio, product principles, skills, and tools
- `/contact` — Contact details and form stub
- `/resume` — Embedded resume viewer and download link

## Deployment
1. Push the repository to GitHub.
2. Import the project into Vercel and select the Next.js framework preset.
3. Configure the production domain (e.g., `https://www.isiahudofia.com`).
4. Trigger a deployment; Vercel will run `npm run build` automatically.

Analytics can be enabled by wiring the placeholder component in `components/analytics.tsx` to Vercel Analytics, Plausible, or another provider.
