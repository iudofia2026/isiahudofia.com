# Lando-Inspired Portfolio Setup Guide

## Overview

This is a complete rebuild of your personal portfolio inspired by the design, animations, and interactions from landonorris.com. All your personal information has been integrated from your existing site.

## What's Been Built

### ✅ Complete Features from Lando Norris Site

1. **Navigation System**
   - Context-aware theme switching (dark/light)
   - Sticky navigation with scroll detection
   - Hamburger menu with preview images
   - Smooth transitions between sections

2. **Design System**
   - Dark green theme (#0a1f1a) with lime accents (#c1ff72)
   - Fluid typography scaling (320px - 1920px viewports)
   - Custom CSS variables for consistency
   - Lando's custom easing curves: `cubic-bezier(0.65, 0.05, 0, 1)`

3. **Animations & Interactions**
   - Split-text animations (word and character level)
   - Smooth scrolling with Lenis library
   - Canvas particle system (Rive-inspired)
   - 3D tilt effects on cards
   - Hover state transformations
   - Parallax scrolling on hero

4. **Sections**
   - **Hero**: Full-screen with animated canvas background
   - **Message**: Personal quote/mission statement
   - **On Track**: Technical projects (Discord Translator, Thesis)
   - **Off Track**: Beyond code (Zen Agency, Track & Field)
   - **Timeline**: Helmet gallery-inspired milestone timeline (2022-2026)
   - **Partnerships**: Organizations and technologies
   - **Contact**: Email, phone, and social links
   - **Footer**: Clean footer with attribution

5. **Mobile Experience**
   - Full mobile menu overlay with preview images
   - Rotation prompt for landscape orientation
   - Responsive grid layouts
   - Touch-optimized interactions

6. **Accessibility & Performance**
   - Reduced motion support
   - Focus-visible outlines
   - Semantic HTML
   - Performance monitoring
   - Print-friendly styles

## Your Personal Information Integrated

All content has been populated with your info from the existing site:

- **Name**: Isiah Udofia
- **School**: Yale University, Cognitive Science B.S.
- **Location**: Montclair, New Jersey / New Haven, Connecticut
- **Email**: isiah.udofia@yale.edu
- **Phone**: 973-303-6883
- **Projects**: Discord Translator, Zen Video Agency, B.S. Thesis
- **Achievements**: All-Ivy Team, UBS Summer Analyst, Bain & Co.
- **Social**: GitHub, LinkedIn, TikTok
- **Timeline**: 2022 (Yale start) → 2026 (Graduation)

## File Structure

```
lando-inspired/
├── index.html          # Main HTML with all sections
├── css/
│   └── styles.css      # Complete Lando-inspired styles
├── js/
│   └── main.js         # All animations and interactions
├── assets/             # Copied from root (images, resume, etc.)
│   ├── pfp.jpg
│   ├── discord.png
│   ├── zen.png
│   ├── thesis.png
│   └── yale.svg
├── package.json        # Dependencies
├── README.md           # Project overview
└── SETUP.md           # This file
```

## Running the Site

### Development Server

```bash
# Install dependencies (already done)
npm install

# Start local server
npm run dev
```

Visit: http://localhost:3000

### Alternative (Python)

```bash
python3 -m http.server 3000
```

### Alternative (VS Code Live Server)

1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## Key Technologies

1. **Lenis**: Smooth scrolling library (same as Lando's site)
2. **Vanilla JavaScript**: All animations in pure JS
3. **CSS Custom Properties**: Complete design system
4. **Canvas API**: Particle system animations
5. **Intersection Observer**: Scroll-triggered animations

## Customization Guide

### Colors

Edit in `css/styles.css`:

```css
:root {
  --color-dark-green: #0a1f1a;    /* Main background */
  --color-lime: #c1ff72;          /* Accent color */
  --color-off-white: #f5f5f5;     /* Light sections */
}
```

### Content

All content is in `index.html`. Update:

- Hero title and subtitle
- Next milestone event
- Personal quote in message section
- Project cards in On Track/Off Track
- Timeline milestones
- Partnership logos

### Adding More Sections

Follow the pattern:

```html
<section class="new-section" data-nav-theme="dark">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title split-text" data-split>Title</h2>
      <p class="section-subtitle">Subtitle</p>
    </div>
    <!-- Your content -->
  </div>
</section>
```

## What You Need to Provide

To make this site even better, consider adding:

1. **Custom Font**: Lando uses "Brier" font family. You can:
   - Purchase/download Brier font
   - Or choose another modern display font (Outfit, Inter Display, etc.)
   - Add to CSS: `@font-face { font-family: 'Brier'; src: url(...); }`

2. **Higher Quality Images**:
   - Professional headshots for hero
   - Project screenshots
   - Timeline event images (instead of gradient placeholders)

3. **Rive Animations** (Optional):
   - Lando uses Rive for vector animations
   - You can create custom animations at rive.app
   - Replace canvas particle system with Rive runtime

4. **Partnership Logos**:
   - Get SVG logos for UBS, Bain, etc.
   - Replace text placeholders in partnerships section

5. **Video Content** (Optional):
   - Add video backgrounds to hero
   - Showcase reel for Zen Video Agency
   - Track & Field highlight clips

## Deployment

### Netlify (Recommended)

1. Create `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy:
   - Drag `lando-inspired` folder to netlify.app/drop
   - Or connect GitHub repo

### Vercel

```bash
npm install -g vercel
vercel
```

### GitHub Pages

1. Push to GitHub
2. Settings → Pages → Source: main branch
3. Select `/lando-inspired` folder (or move files to root)

## Performance Tips

1. **Optimize Images**:
   ```bash
   # Use tools like:
   npm install -g sharp-cli
   sharp -i pfp.jpg -o pfp-optimized.jpg --webp
   ```

2. **Lazy Load Images**:
   Add `loading="lazy"` to images below the fold

3. **Minify CSS/JS**:
   ```bash
   npm install -g clean-css-cli uglify-js
   cleancss -o styles.min.css styles.css
   uglifyjs main.js -o main.min.js
   ```

4. **CDN for Lenis**:
   Already using unpkg.com CDN for Lenis

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (may need -webkit- prefixes)
- Mobile Safari: Full support
- IE11: Not supported (uses modern CSS/JS)

## Accessibility Checklist

- [x] Semantic HTML
- [x] Keyboard navigation
- [x] Focus indicators
- [x] Alt text on images
- [x] ARIA labels on interactive elements
- [x] Reduced motion support
- [x] Color contrast compliance

## Next Steps

1. **Review Content**: Go through all text and update as needed
2. **Add Images**: Replace gradient placeholders with real images
3. **Test Mobile**: Check on actual devices
4. **Add Analytics**: Google Analytics or Plausible
5. **SEO**: Add meta tags, Open Graph, schema.org
6. **Deploy**: Push to production
7. **Monitor**: Check performance with Lighthouse

## Differences from Original Site

Your site vs. Lando's site:

| Feature | Lando | Your Site |
|---------|-------|-----------|
| Theme | Dark green + lime | Same ✅ |
| Smooth scroll | Lenis | Lenis ✅ |
| Hero animation | Rive | Canvas particles |
| Font | Brier | System fonts (add Brier) |
| Helmet gallery | F1 helmets | Career milestones ✅ |
| Navigation | Context-aware | Same ✅ |
| Split text | Yes | Yes ✅ |
| Mobile menu | Overlay with previews | Same ✅ |

## Questions or Issues?

If you need to adjust anything:

1. Content changes → Edit `index.html`
2. Style changes → Edit `css/styles.css`
3. Animation changes → Edit `js/main.js`
4. New dependencies → Update `package.json`

All code is heavily commented for easy modification.

## Credits

- Design inspiration: landonorris.com
- Smooth scrolling: Lenis by Studio Freight
- Built for: Isiah Udofia, Yale University

---

**Ready to launch!** 🚀

Run `npm run dev` and visit http://localhost:3000 to see your new site.
