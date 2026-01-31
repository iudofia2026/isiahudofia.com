# Quick Start: Scroll Position Fix

## 60-Second Fix

1. **Add this line to each HTML page** before `</body>`:
   ```html
   <script src="/js/scroll-fix.js"></script>
   ```

2. **Test it** - Navigate between pages

3. **Done!** ✓

---

## What This Fixes

- ✅ Scroll jump when navigating between pages
- ✅ Content appearing mid-page then jumping to top
- ✅ Barba.js + Lenis smooth scroll conflicts
- ✅ Browser scroll restoration interference

---

## If It Doesn't Work

Use the debug version instead:

```html
<script src="/scroll-fix-debug.js"></script>
```

Then check browser console for diagnostic output.

---

## Permanent Solution (Optional)

For a cleaner solution, edit `template_files/bundle.js`:

**Find line 33432** and add the highlighted lines:

```javascript
beforeEnter(n) {
  const e = n.next.container;
  me.set(e, { opacity: 0 });

  // ADD THESE 3 LINES:
  window.scrollTo(0, 0);
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // ... rest of code continues
```

---

## Files

- `/js/scroll-fix.js` - Production fix (use this)
- `/scroll-fix-debug.js` - Diagnostic version (if you need to troubleshoot)
- `SCROLL_FIX_GUIDE.md` - Complete documentation

---

**Questions?** See `SCROLL_FIX_GUIDE.md` for full diagnostic steps and solutions.
