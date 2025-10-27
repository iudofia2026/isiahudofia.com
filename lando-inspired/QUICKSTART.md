# Quick Start Guide 🚀

## See Your New Site in 30 Seconds

```bash
# 1. Navigate to the folder
cd lando-inspired

# 2. Start the server (dependencies already installed)
npm run dev

# 3. Open in browser
# Visit: http://localhost:3000
```

That's it! Your Lando-inspired portfolio is now running.

## What You're Looking At

Your new site has:

✅ **Dark green theme** with lime accents (exact Lando colors)
✅ **Smooth scrolling** (Lenis library)
✅ **Animated hero** section with particles
✅ **Split-text animations** (character-by-character)
✅ **Mobile menu** with preview images
✅ **Timeline gallery** (your milestones 2022-2026)
✅ **3D card effects** on hover
✅ **All your content** from existing site

## File Overview

- `index.html` - All your content (edit this to change text)
- `css/styles.css` - All Lando-inspired styling
- `js/main.js` - All animations and interactions
- `assets/` - Your images (copied from root)

## Quick Edits

### Change Colors
Edit `css/styles.css` line 11-13:
```css
--color-dark-green: #0a1f1a;
--color-lime: #c1ff72;
```

### Update Your Info
Edit `index.html`:
- Line 42-48: Hero title
- Line 68-72: Next milestone
- Line 81-86: Personal quote
- Sections below: Projects, timeline, contact

### Add More Projects
Copy this pattern in `index.html` around line 120:
```html
<article class="track-card">
  <div class="track-card-image">
    <img src="assets/your-image.png" alt="Project Name">
  </div>
  <div class="track-card-content">
    <h3>Project Name</h3>
    <p>Description here...</p>
    <a href="#" class="track-link">
      View Project <span class="arrow">→</span>
    </a>
  </div>
</article>
```

## Deploy When Ready

### Netlify (Easiest)
1. Go to netlify.app/drop
2. Drag the `lando-inspired` folder
3. Done! You get a URL like `your-site.netlify.app`

### Vercel
```bash
npm install -g vercel
vercel
```

### GitHub Pages
1. Push to GitHub
2. Settings → Pages → Enable
3. Your site: `username.github.io/repo-name`

## Need Help?

- **Detailed setup**: Read `SETUP.md`
- **Full summary**: Read `SUMMARY.md`
- **Code questions**: All files are heavily commented

## What's Next?

1. ✅ Review content in `index.html`
2. ✅ Test on mobile (real device)
3. ✅ Add better images if you want
4. ✅ Deploy to hosting
5. ✅ Share your new portfolio!

---

**Enjoy your new Lando-inspired portfolio!** 🏎️💨
