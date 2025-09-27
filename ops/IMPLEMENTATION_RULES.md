Operating constraints:
- No frameworks, no build tools, no npm packages.
- All pages under `/basic-site/`. Global CSS `/basic-site/css/styles.css`. Global JS `/basic-site/js/main.js`.
- Asset paths must be correct from each HTML (avoid `../styles.css.css` type mistakes).
- Do not recolor project **artwork**; only surfaces/typography/accents.

What to change **now** (in the next step with Cursor):
- Upgrade only the project detail pages’ layout/clarity/animations:
  1) `/basic-site/projects/discord.html`
  2) `/basic-site/projects/zen-video-agency.html`
  3) `/basic-site/projects/thesis-ml.html`
- Keep nav, footer, home, about, resume, contact as they are (unless a global class is shared).
- Ensure buttons render as real pills everywhere they appear on these pages.

Common layout rules to apply on each project page:
- Top hero uses the Yale palette, is **not glued to nav** (margin-top ~40px), has consistent padding and a neural canvas in the background (if used).
- Under hero: cards with clear sections; use `.grid-2` when there is a left/right layout; apply `gap: 32px`.
- Mobile: stack gracefully; spacings reduce ~20%.

CTAs:
- Discord: button to Live Site (https://livecalltranslator.netlify.app) + Contact.
- Zen: button to Agency Site (https://zeneditingagency.netlify.app), **no email button on this page**.
- Thesis: no external demo; keep an internal Contact or “Read more” optional; focus on approach/milestones.

Resume + PDF (context for Cursor, do not modify here):
- The working file is `/basic-site/assets/Udofia_Isiah_Resume.pdf`. Links elsewhere should point to it.
