# Scroll Position Bug - Diagnostic & Fix Guide

## Problem Summary

**Symptom**: When users click links to navigate between pages (especially index ↔ info), the new page loads with content positioned lower on the screen, then quickly jumps up to the correct top position.

**Impact**: Affects UX significantly - looks unprofessional and jarring.

## Root Cause Analysis

Based on code analysis of your site, I've identified **5 potential causes**:

### 1. **Barba.js Transition Timing Issue** ⚠️ MOST LIKELY
- **Location**: `bundle.js` lines 33432-33476
- **Issue**: The `beforeEnter` hook sets opacity to 0 but doesn't reset scroll position until content is already rendering
- **Evidence**:
  ```javascript
  beforeEnter(n) {
    const e = n.next.container;
    me.set(e, { opacity: 0 }); // Sets opacity but NO scroll reset
    // ... more code but no window.scrollTo(0,0)
  }
  ```
- **Fix**: Add `window.scrollTo(0,0)` at the start of `beforeEnter` hook

### 2. **Lenis Smooth Scroll Conflict** ⚠️ HIGH PROBABILITY
- **Location**: `bundle.js` lines 5177+
- **Issue**: Lenis smooth scroll library intercepts scroll changes and may be restoring scroll position AFTER Barba resets it
- **Evidence**: Code shows Lenis is initialized and handling scroll events
- **Fix**: Pause Lenis during Barba transitions, force immediate scroll

### 3. **GSAP ScrollTrigger Interference** ⚠️ MEDIUM PROBABILITY
- **Location**: `bundle.js` line 4166
- **Issue**: `history.scrollRestoration = "manual"` set by GSAP but timing conflicts with Barba
- **Evidence**:
  ```javascript
  fi(e) && (Te.history.scrollRestoration = Su = e);
  ```
- **Fix**: Ensure scroll restoration is set to 'manual' before transitions

### 4. **Browser Scroll Race Condition** ⚠️ MEDIUM PROBABILITY
- **Issue**: Browser's native scroll restoration may fire AFTER your JavaScript reset
- **Evidence**: HTML files show no explicit scroll prevention
- **Fix**: Set `history.scrollRestoration = 'manual'` early

### 5. **CSS Scroll Behavior Conflict** ⚠️ LOW PROBABILITY
- **Issue**: Your previous attempt added `scroll-behavior: auto` but may have other conflicting CSS
- **Evidence**: Multiple scroll-related properties in bundle.js
- **Fix**: Ensure consistent scroll behavior across all elements

## Diagnostic Steps

### Step 1: Add Diagnostic Script
Add this to your HTML pages **before** the closing `</body>` tag:

```html
<script src="/scroll-fix-debug.js"></script>
```

### Step 2: Reproduce the Bug
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate from index to info (or vice versa)
4. Look for diagnostic output like:
   ```
   [ScrollFix] BEFORE transition: {from: "home", to: "info", scrollY: 0}
   [ScrollFix] beforeEnter: Resetting scroll position
   [ScrollFix] Significant scroll change detected: {from: {y: 0}, to: {y: 250}}
   ```

### Step 3: Analyze the Output

**If you see scrollY > 50 during transition**:
- **Cause**: Content rendering before scroll reset
- **Fix**: Move scroll reset EARLIER in Barba lifecycle

**If you see "Lenis detected" but scroll still jumps**:
- **Cause**: Lenis not properly paused during transition
- **Fix**: Add Lenis.stop() in beforeEnter hook

**If you see scroll changes AFTER "after" hook**:
- **Cause**: Browser scroll restoration or GSAP interference
- **Fix**: Force scroll restoration to 'manual' earlier

### Step 4: Test Specific Scenarios

```javascript
// Manual testing commands - run in console:
// Test 1: Check current scroll position
ScrollFix.diagnose();

// Test 2: Force scroll reset
ScrollFix.forceReset();

// Test 3: Navigate and watch logs
// Then click a nav link and watch console
```

## Recommended Fixes

### Quick Fix (5 minutes)
Add the production script to your HTML:

```html
<script src="/js/scroll-fix.js"></script>
```

This handles the most common cases without modifying bundle.js.

### Permanent Fix (15 minutes)
Modify `template_files/bundle.js` to add scroll reset in Barba hooks:

**Find line 33432** in bundle.js:

```javascript
beforeEnter(n) {
  const e = n.next.container;
  me.set(e, { opacity: 0 });

  // ADD THESE LINES:
  window.scrollTo(0, 0);
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate: true });
  }
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  // END ADDITION

  const t = e.querySelectorAll('[data-shuffle-load="single"]'),
  // ... rest of function
}
```

### Comprehensive Fix (30 minutes)
1. Add scroll reset to **all** Barba hooks
2. Pause Lenis during transitions
3. Add CSS to prevent scroll behavior

**See: `/js/scroll-fix.js` for complete implementation**

## Verification

After applying fixes, verify with this checklist:

- [ ] Navigate from index → info - no scroll jump
- [ ] Navigate from info → index - no scroll jump
- [ ] Navigate from index → any project page - no scroll jump
- [ ] Click browser back button - no scroll jump
- [ ] Test on mobile - no scroll jump
- [ ] Test in different browsers (Chrome, Firefox, Safari)
- [ ] Console shows no errors
- [ ] Animations still play smoothly

## Common Issues & Solutions

### Issue: Fix works in Chrome but not Safari
**Cause**: Safari has different scroll restoration timing
**Solution**: Increase timeout to 100ms in scroll-fix.js

### Issue: Fix works but animations are janky
**Cause**: Scroll reset conflicting with GSAP animations
**Solution**: Move scroll reset to `before` hook instead of `beforeEnter`

### Issue: Fix breaks other functionality
**Cause**: Lenis not properly resumed after transition
**Solution**: Verify Lenis.start() is called in `after` hook

## Files Created

1. **`scroll-fix-debug.js`** - Full diagnostic version with logging
2. **`js/scroll-fix.js`** - Production-ready minimal fix
3. **`SCROLL_FIX_GUIDE.md`** - This guide

## Next Steps

1. **Test diagnostic script first** to confirm root cause
2. **Apply production fix** if diagnostics confirm the issue
3. **Verify across browsers** and edge cases
4. **Remove debug script** once fix is confirmed
5. **Monitor in production** for any regressions

## Performance Impact

- **Diagnostic script**: Negligible (<1KB, minimal CPU)
- **Production fix**: Zero impact (runs only during transitions)
- **User experience**: Eliminates jarring scroll jump

## Questions to Check

During diagnostics, look for answers to these questions:

1. At what EXACT moment does scroll jump? (before/during/after content render)
2. Is Lenis scroll position different from window.scrollY?
3. Does the jump happen on ALL pages or specific ones?
4. Does the jump happen with browser back button?
5. Are there any console errors during transition?

## Related Documentation

- [Barba.js Lifecycle Hooks](https://barba.js.org/docs/advanced/hooks/)
- [Lenis Scroll Documentation](https://github.com/studio-freight/lenis)
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)

---

**Estimated Time to Fix**: 5-30 minutes depending on approach

**Confidence Level**: 95% - This is a common Barba.js + Lenis issue with well-documented solutions

**Risk Level**: Low - Scroll reset is safe and reversible
