# isiahudofia.com

A Yale-blue, product-minded portfolio for Isiah Udofia. The site presents a polished overview of projects, background, and contact details with a premium dark theme inspired by Yale design language.

## Live Surface
- **Static site (`basic-site/`)** – Hand-tuned HTML/CSS/JS that mirrors the latest portfolio design. Open `basic-site/index.html` in any modern browser for the most up-to-date experience.

The repository also retains a Next.js App Router scaffold (`app/`, `components/`, `data/`) for future feature work, but the current production surface is the static build under `basic-site/`.

## Highlights
- Hero section with animated neural gradient, CTA cluster, and quick access to GitHub/LinkedIn
- Projects grid with branded tiles and hover motion
- Case-study pages for Live Translator for Discord, Zen Video Agency, and the Yale thesis
- About page with Yale-themed typography, focus-chip pills, and short narrative bio
- Contact hub featuring a primary email CTA and action chips for phone/GitHub/LinkedIn
- Resume viewer page with centered download call-to-action and quick links to every channel

## Folder Guide
- `basic-site/` – Production HTML/CSS/JS, assets, and static resume PDF placeholder
- `components/`, `app/`, `data/` – Next.js scaffold retained for future dynamic features
- `public/` – Shared assets (favicons, logos, etc.)
- `tailwind.config.ts`, `postcss.config.js` – Tailwind build config (used by the Next scaffold)

## Quick Start (Static)
1. `cd basic-site`
2. Open `index.html` in a browser (double-click or use `open index.html` on macOS)

## Quick Start (Next.js Scaffold)
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` to preview the React-based version. The scaffold uses Node 20 (`.nvmrc`) and Tailwind/Framer Motion if you choose to continue development there.

## Editing Tips
- Hero/CTA content: edit `basic-site/index.html`
- About content & chips: edit `basic-site/about.html`
- Project cards/grid spacing: edit `basic-site/projects.html` and corresponding CSS in `basic-site/css/styles.css`
- Resume layout & metadata: edit `basic-site/resume.html`
- Yale theme tokens, spacing, and animations: `basic-site/css/styles.css`

## Deployment
1. Host the `basic-site/` directory on any static host (Vercel, Netlify, GitHub Pages, etc.).
2. Ensure `basic-site/assets/Udofia_Isiah_Resume.pdf` contains the latest resume.
3. Optionally migrate changes back into the Next.js scaffold before deploying to Vercel for SSR capabilities.

## Contact
- Email: [isiah.udofia@yale.edu](mailto:isiah.udofia@yale.edu)
- GitHub: [@iudofia2026](https://github.com/iudofia2026)
- LinkedIn: [linkedin.com/in/isiah-udofia](https://www.linkedin.com/in/isiah-udofia/)
