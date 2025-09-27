Brand & palette:
- Deep navy Yale blues, white/ink text, muted sky-blue accents.
- Avoid loud purples. Monochrome blues for canvas animations.

Core tokens (CSS variables you can assume exist or add if missing):
--ink: #eaf2ff;
--text: #ccd6e8;
--muted: #9fb1cf;
--yb-900: #0b2545; --yb-800: #13315c; --yb-700: #1b3a6b;
--accent: #7cc5ff; --accent-2: #b6e3ff;

Type scale (system UI stack):
- h1: clamp(32px, 5vw, 56px); h2: 28–32; h3: 20–22; body: 16–18; small: 14.
- Headings tight (line-height ~1.15); body 1.6.

Spacing scale:
- 4, 8, 12, 16, 24, 32, 40, 48, 64, 80 px.

Components (use consistently):
- Container `.wrap` max-width: 1200px; padding-inline: 24–32px.
- Hero cards: rounded, inner gradient, shadow, **margin-top ~40px**, **padding-y ~48px**.
- Buttons: `.btn`, `.btn-primary`, `.btn-ghost` (real filled pills, not plain links).
- Chips: `.chip` compact, single-line, subtle borders.
- Grids: `.grid-2` (1fr 1fr desktop, stack on mobile).
- Reveal-on-scroll: `.reveal-on-scroll` + IntersectionObserver.
- Selection highlight (global): ::selection/::-moz-selection to neutral blue (rgba(124,197,255,.35), color #fff).
- Focus-visible: soft sky-blue ring; maintain AA contrast.

Animation:
- Neural canvas in heroes: **two blues only**; ~15% more motion than default; clipped to hero radius; respects prefers-reduced-motion.
- Micro-interactions via transforms/opacity only; no large reflows.

Accessibility:
- Semantic sections/landmarks, keyboard focus order, visible focus rings, high contrast.
