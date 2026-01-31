# Performance Quick Wins - Action Checklist
**Priority: IMMEDIATE | Time: 1-2 hours | Impact: 40% reduction**

## Critical Finding: jQuery Still Present!
Despite the removal effort, jQuery is still referenced in all HTML files.

### Action 1: Remove jQuery References
**Files to update:**
```
/dist/index.html
/dist/info.html
/dist/resume.html
/dist/academicindex.html
/dist/lamcpainting.html
/dist/projects.html
/dist/academicindex.html.bak2
```

**Remove this line from each file:**
```html
<script src="./[path]/jquery-3.5.1.min.dc5e7f18c8.js" ...></script>
```

**Savings:** 87KB per page

---

## Action 2: Convert 5 Largest Images to WebP
**Current:** 22.9MB in PNG format
**Target:** ~1.2MB in WebP format
**Savings:** 21.7MB (95% reduction)

### Commands:
```bash
cd /Users/iudofia/Documents/GitHub/isiahudofia.com/assets

# Convert project images
cwebp -q 80 lamc-gallery.png -o lamc-gallery.webp
cwebp -q 80 lamc-thumbnail.png -o lamc-thumbnail.webp
cwebp -q 80 academic-next.png -o academic-next.webp
cwebp -q 80 lamc_screenshots/lamc-01.png -o lamc_screenshots/lamc-01.webp
cwebp -q 80 ytdubber-logo.png -o ytdubber-logo.webp
```

### Update HTML:
Replace `.png` with `.webp` in:
- index.html
- academicindex.html
- lamcpainting.html

---

## Action 3: Remove Broken Typekit Script
**Finding:** Typekit script returns empty response (9 bytes)

### Remove from all HTML files:
```html
<!-- DELETE THESE LINES -->
<script src="https://use.typekit.net/iin5llv.js" type="text/javascript"></script>
<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
```

**Savings:** 1 DNS lookup + 1 failed request + parse time

---

## Action 4: Delete Duplicate Screenshots
**Finding:** 7 academic screenshots stored in 2 locations

### Commands:
```bash
cd /Users/iudofia/Documents/GitHub/isiahudofia.com/dist/assets

# Delete duplicates (keep the ones in academic_screenshots/)
rm 01-academic-index.png
rm 02-academic-index.png
rm 03-academic-index.png
rm 04-academic-index.png
rm 05-academic-index.png
rm 06-academic-index.png
rm 07-academic-index.png
```

**Savings:** 3.1MB

---

## Expected Results After Quick Wins

### Before:
```
Total page weight:  ~117MB
JavaScript:         1.38MB
Images (projects):  22.9MB
LCP:                3.5-4.5s (POOR)
```

### After:
```
Total page weight:  ~95MB (19% reduction)
JavaScript:         1.29MB (6% reduction)
Images (projects):  1.2MB (95% reduction)
LCP:                2.3-3.0s (NEEDS IMPROVEMENT → borderline GOOD)
```

---

## Validation Checklist

After implementing:
- [ ] Test all pages load without errors
- [ ] Verify WebP images display correctly
- [ ] Check no jQuery-dependent features broke
- [ ] Run Lighthouse audit (expect 20-30 point improvement)
- [ ] Test on mobile device
- [ ] Measure actual LCP improvement

---

## Next Phase (After Quick Wins)
1. Optimize photo gallery (93MB → 12MB)
2. Extract critical CSS (FCP improvement)
3. Convert Fragment Mono font to WOFF2 (60KB savings)

**Full details:** See PERFORMANCE_AUDIT_REPORT.md
