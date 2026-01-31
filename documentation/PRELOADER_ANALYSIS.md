# Preloader System Analysis

**Date:** 2026-01-31
**Status:** Analysis Complete

---

## Executive Summary

The portfolio website has a custom preloader system that shows "Welcome" / "Welcome back" animation when users first visit the site. Previous attempts to customize this per-page (e.g., showing "Academic Index" instead of "Welcome") failed because the preloader uses hardcoded text strings in JavaScript rather than reading from HTML.

**Key Finding:** The preloader can be customized, but requires modifying `bundle.js` to read text from HTML elements instead of using hardcoded strings.

### Context of This Issue

**User's Goal:** Add custom preloaders to each page where the text matches the page content (e.g., "Academic Index" for academicindex.html, "Info" for info.html, etc.) instead of the generic "Welcome" message.

**What Happened:**
1. User edited HTML in academicindex.html to change "Welcome" to "Academic Index"
2. Site broke - animations failed or wrong text appeared
3. User requested analysis to understand why and how to fix it properly

**Why This Is Complex:**
- The preloader was designed as a **site-wide intro**, not per-page customization
- Hardcoded strings in JavaScript override HTML content
- Session-based tracking means preloader only runs once per session
- Customization requires understanding the interaction between Barba.js, GSAP, and custom shuffle animations

---

## Table of Contents

1. [How It Works](#how-it-works)
2. [Why Customization Failed](#why-customization-failed)
3. [Solution Options](#solution-options)
4. [Recommended Implementation](#recommended-implementation)
5. [Testing Guide](#testing-guide)

---

## How It Works

### Location
- **File:** `template_files/bundle.js`
- **Lines:** 33256-33344
- **Functions:** `initializeFirstLoad()` and `initializeReturnVisit()`

### Flow

```
User arrives at site
    ↓
Check sessionStorage.hasVisited
    ↓
FIRST VISIT?
    ├─ YES → initializeReturnVisit() (0.8s, shorter animation)
    └─ NO  → initializeFirstLoad() (1.3s, full animation)
              ↓
         Set sessionStorage.hasVisited = "true"
              ↓
         Animate "Welcome" → shuffle effect
              ↓
         Animate "back" → shuffle effect
              ↓
         Animate "[Digital Archive]" → shuffle effect
              ↓
         Hide preloader, reveal page
```

### Key Elements

**HTML Structure:**
```html
<div class="loader_wrap u-container">
  <h1 data-load="title" class="preloader_text u-display">Welcome</h1>
  <h1 data-load="title2" class="preloader_text u-display"></h1>
  <p data-load="subtitle" class="preloader_text u-text-main">[Digital Archive]</p>
</div>
```

**JavaScript Functions:**
- `Q.shuffleIn(text, element, speed, uppercase)` - Animates empty → text
- `Q.shuffleWords(current, target, element, speed, uppercase)` - Shuffles between texts
- `me.to()` / `me.set()` - GSAP animations
- `sessionStorage.getItem("hasVisited")` - Tracks return visits

---

## Why Customization Failed

### What Was Tried

```html
<!-- User changed this in academicindex.html -->
<h1 data-load="title">Academic</h1>
<h1 data-load="title2">Index</h1>
```

### Why It Didn't Work

**The JavaScript has hardcoded strings:**

```javascript
// Line 33271 - ALWAYS animates "Welcome"
Q.shuffleIn("Welcome", title1, 50, !1)

// Line 33272 - ALWAYS animates "back"
Q.shuffleIn("back", e, 50, !1)

// Line 33276 - ALWAYS targets "Welcome"
Q.shuffleWords(title1.textContent || "Welcome", "Welcome", title1, 50, !1)
```

**What Happens:**
1. HTML has "Academic"
2. JavaScript reads HTML (sees "Academic")
3. JavaScript immediately overwrites with "Welcome" (hardcoded)
4. Result: "Welcome" shows, custom text is ignored

**Root Cause:** The system was designed as a **site-wide intro**, not **page-specific customization**.

---

## Solution Options

### Option A: Remove sessionStorage Check

**Change:** Remove the `hasVisited` check entirely

**Pros:**
- Each page can show its own preloader
- Simple implementation (1 line change)

**Cons:**
- Annoying UX (1.3s delay on EVERY page load)
- Users see preloader repeatedly
- Hurts perceived performance

**Performance Impact:** HIGH (forced delay every page)

**Code Change:**
```javascript
// Remove these lines:
if (sessionStorage.getItem("hasVisited")) {
  this.initializeReturnVisit();
  return;
}
```

---

### Option B: Per-Page sessionStorage Keys

**Change:** Track visits per page instead of per site

**Pros:**
- Each page shows custom preloader once
- Acceptable UX (only delays first visit to each page)
- Good for explorers who browse multiple pages

**Cons:**
- User sees multiple preloaders if visiting many pages
- More complex tracking

**Performance Impact:** MEDIUM (~2-3s total for 5-page site)

**Code Change:**
```javascript
// Instead of: sessionStorage.getItem("hasVisited")
// Use: sessionStorage.getItem("preloader-" + window.location.pathname)
```

---

### Option C: Direct Visit Detection

**Change:** Only show preloader on direct URL access

**Pros:**
- No delay on internal navigation
- Good UX for normal browsing
- Low overhead

**Cons:**
- Won't show on Barba transitions (most navigation)
- Most users never see custom preloaders
- Complex implementation

**Performance Impact:** LOW (skips preloader most of the time)

**Code Change:**
```javascript
const isDirectVisit = performance.getEntriesByType('navigation')[0]?.type === 'reload';

if (!isDirectVisit) {
  // Skip preloader for internal navigation
  Q.initializeSingle(), Q.initializeMulti();
  return;
}
```

---

### Option D: Hybrid (RECOMMENDED)

**Change:** Combine per-page tracking + navigation detection

**Pros:**
- Custom preloaders on direct visits (bookmarks, links)
- No preloader on internal navigation
- Best UX/performance balance
- Minimal overhead

**Cons:**
- More complex implementation
- Requires multiple code changes

**Performance Impact:** VERY LOW (9/10)

---

## Recommended Implementation

### Overview

Modify `bundle.js` to:
1. Read text from HTML instead of hardcoded strings
2. Use per-page sessionStorage tracking
3. Skip preloader on internal Barba navigation

### Step-by-Step

#### Step 1: Read from HTML

**Find these lines in `bundle.js` (around 33270-33274):**

```javascript
// OLD (current code):
const o = 1300, c = Math.max(0, o - 100), u = e.textContent, d = t.textContent;
me.to(title1, { opacity: 1, duration: 0.3, ease: "power3.out" }), Q.shuffleIn("Welcome", title1, 50, !1), setTimeout(() => {
  me.to(e, { opacity: 1, duration: 0.3, ease: "power3.out" }), Q.shuffleIn("back", e, 50, !1);
```

**Change to:**

```javascript
// NEW (read from HTML):
const o = 1300, c = Math.max(0, o - 100);
const title1Text = title1.textContent.trim() || "Welcome";
const title2Text = e.textContent.trim() || "back";
const subtitleText = t.textContent.trim() || "[Digital Archive]";

me.to(title1, { opacity: 1, duration: 0.3, ease: "power3.out" }), Q.shuffleIn(title1Text, title1, 50, !1), setTimeout(() => {
  me.to(e, { opacity: 1, duration: 0.3, ease: "power3.out" }), Q.shuffleIn(title2Text, e, 50, !1);
```

**Also update line 33276:**

```javascript
// OLD:
Q.shuffleWords(title1.textContent || "Welcome", "Welcome", title1, 50, !1)

// NEW:
Q.shuffleWords(title1.textContent, title1Text, title1, 50, !1)
```

#### Step 2: Per-Page Tracking

**Find line 33257:**

```javascript
// OLD:
if (sessionStorage.getItem("hasVisited")) {
```

**Change to:**

```javascript
// NEW:
const namespace = document.querySelector('[data-barba-namespace]')?.dataset.barbaNamespace || 'home';
const pageKey = `preloader-${namespace}`;

if (sessionStorage.getItem(pageKey)) {
```

**Also update line 33261:**

```javascript
// OLD:
sessionStorage.setItem("hasVisited", "true");

// NEW:
sessionStorage.setItem(pageKey, "true");
```

#### Step 3: Skip on Internal Navigation

**Add after the namespace check (around line 33258):**

```javascript
// Skip preloader for Barba navigation (not direct visits)
const hasReferrer = document.referrer && document.referrer.includes(window.location.hostname);
const isDirectVisit = !hasReferrer;

if (hasReferrer && sessionStorage.getItem(pageKey)) {
  // User is navigating internally - skip preloader
  Q.initializeSingle(), Q.initializeMulti();
  return;
}
```

#### Step 4: Update Return Visit Function

**Apply the same changes to `initializeReturnVisit()` (starting at line 33300):**

1. Read from HTML instead of hardcoded strings
2. Use per-page tracking key
3. Add navigation detection

**Changes needed:**
- Line 33310: Use `title1Text` variable
- Line 33311: Use `title2Text` variable
- Line 33315-33316: Update shuffleWords calls

### Complete Example

```javascript
initializeFirstLoad() {
  // Get page namespace
  const namespace = document.querySelector('[data-barba-namespace]')?.dataset.barbaNamespace || 'home';
  const pageKey = `preloader-${namespace}`;

  // Check if page already visited
  if (sessionStorage.getItem(pageKey)) {
    this.initializeReturnVisit();
    return;
  }

  // Mark page as visited
  sessionStorage.setItem(pageKey, "true");

  // Get elements
  const n = document.querySelector(".loader_wrap");
  const title1 = document.querySelector('[data-load="title"]');
  const e = document.querySelector('[data-load="title2"]');
  const t = document.querySelector('[data-load="subtitle"]');

  if (!n || !title1 || !e || !t) {
    console.warn("Load animation elements not found");
    Q.initializeSingle(), Q.initializeMulti();
    return;
  }

  // Read text from HTML (CUSTOMIZABLE!)
  const title1Text = title1.textContent.trim() || "Welcome";
  const title2Text = e.textContent.trim() || "back";
  const subtitleText = t.textContent.trim() || "[Digital Archive]";

  // ... rest of animation code using these variables instead of hardcoded strings
  Q.shuffleIn(title1Text, title1, 50, !1);
  Q.shuffleIn(title2Text, e, 50, !1);
  Q.shuffleIn(subtitleText, t, 50, !1);
}
```

### Customizing Per Page

After making the changes above, edit HTML in each file:

**index.html:**
```html
<h1 data-load="title">Welcome</h1>
<h1 data-load="title2">back</h1>
<p data-load="subtitle">[Digital Archive]</p>
```

**academicindex.html:**
```html
<h1 data-load="title">Academic</h1>
<h1 data-load="title2">Index</h1>
<p data-load="subtitle">[2025]</p>
```

**info.html:**
```html
<h1 data-load="title">Info</h1>
<h1 data-load="title2"></h1>
<p data-load="subtitle">[About]</p>
```

---

## Testing Guide

### Before Making Changes

1. **Test current behavior:**
   - Open site in incognito window
   - Verify "Welcome" preloader shows
   - Navigate to another page
   - Refresh - verify shorter "Welcome back" shows

2. **Measure baseline:**
   - Network tab: Count loaded resources
   - Performance tab: Measure load time
   - Console: Check for errors

### After Making Changes

1. **Test each page's custom preloader:**
   - Clear site data (or use incognito)
   - Visit each page directly
   - Verify correct text shows

2. **Test navigation:**
   - Start at index.html
   - Click to academicindex.html
   - Verify NO preloader shows (Barba transition)
   - Refresh academicindex.html
   - Verify custom preloader shows

3. **Test return visits:**
   - Visit a page twice
   - Verify shorter animation on second visit
   - Check sessionStorage contains correct keys

4. **Test edge cases:**
   - Direct URL access (bookmark/link)
   - Browser back/forward buttons
   - Refresh after navigation
   - Opening in new tab

### Validation Checklist

- [ ] Custom text shows on each page
- [ ] Preloader skips on internal navigation
- [ ] Return visit shows shorter animation
- [ ] No console errors
- [ ] Performance is acceptable (<2s overhead)
- [ ] Works on mobile and desktop
- [ ] All links still work
- [ ] Images load correctly

---

## Performance Metrics

### Current Implementation

| Metric | Value |
|--------|-------|
| First visit duration | 1.3s |
| Return visit duration | 0.8s |
| Internal navigation | 0s (Barba) |
| User sees preloader | 1x per session |

### Recommended Implementation

| Metric | Value |
|--------|-------|
| First visit per page | 1.3s |
| Return visit per page | 0.8s |
| Internal navigation | 0s (Barba) |
| User sees preloader | 1x per unique page |

### Estimated Impact

For a 5-page site:
- **Worst case:** User visits all pages = ~6.5s total preloader time
- **Best case:** User stays on one page = 1.3s total
- **Typical:** User browses 2-3 pages = ~2-4s total

---

## Troubleshooting

### Preloader doesn't show at all

**Check:**
- Is `.loader_wrap` in HTML?
- Is `display: none` set on `.loader_wrap`?
- Are `data-load` attributes present?
- Console for errors?

### Text shows as "Welcome" instead of custom

**Check:**
- Did you update `bundle.js` to read from HTML?
- Are you using the correct variable names?
- Did you clear sessionStorage/cache?

### Preloader shows on every navigation

**Check:**
- Is Barba.js working?
- Are links using `data-barba-prevent` incorrectly?
- Is navigation detection code working?

### Animation looks broken

**Check:**
- Are all three elements present?
- Are GSAP and bundle.js loaded?
- Is `Q.shuffleIn` defined?

---

## Implementation Estimate

- **Time:** 2-4 hours
- **Difficulty:** Medium (requires careful code editing)
- **Risk:** Medium (modifying minified bundle.js)
- **Testing:** 1-2 hours
- **Total:** 3-6 hours

---

## Related Issues

### Mobile Bracket Color Fix

During the same development session, a separate issue was resolved regarding mobile menu bracket colors.

**Problem:** Brackets on mobile version of academicindex.html were grey instead of blue (#4B9CD3)

**Root Cause:** SVG bracket icons use `fill="currentColor"` but CSS wasn't targeting the SVG path elements directly

**Solution Applied:**
```css
/* Added to academicindex.html */
.mobile_menu_wrap.is-project .mobile_menu_btn .bracket_svg path {
  fill: #4B9CD3 !important;
}

.project_modal_close_btn .bracket_svg path {
  fill: #4B9CD3 !important;
}

.project_header_wrap .bracket_svg path {
  fill: #4B9CD3 !important;
}
```

**Status:** ✅ Resolved - Brackets now display in blue on mobile

This fix is unrelated to the preloader system but was part of the same debugging session.

---

## Related Documentation

- **Architecture:** `/documentation/architecture/ARCHITECTURAL_PRESERVATION.md` - Complete SPA architecture details
- **Data Attributes:** `/documentation/reference/DATA_ATTRIBUTES_REFERENCE.md` - All data attributes reference
- **Performance:** `/documentation/performance/PERFORMANCE_STATE.md` - Performance metrics and optimization

---

**End of Document**
