# Performance State & Optimization Roadmap
**Date:** 2026-01-31
**Site:** isiahudofia.com
**Status:** Post-Optimization Analysis | Active Improvement Plan

---

## Quick Wins (Immediate Actions - 1-2 hours)

### Priority 1: Remove jQuery References
**Status:** PENDING | **Impact:** 87KB savings

jQuery is still referenced in all HTML files despite previous removal efforts.

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

**Action:** Remove this line from each file:
```html
<script src="./[path]/jquery-3.5.1.min.dc5e7f18c8.js" ...></script>
```

---

### Priority 2: Convert 5 Largest Images to WebP
**Status:** PENDING | **Impact:** 21.7MB savings (95% reduction)

**Current:** 22.9MB in PNG format
**Target:** ~1.2MB in WebP format

**Commands:**
```bash
cd /Users/iudofia/Documents/GitHub/isiahudofia.com/assets

# Convert project images
cwebp -q 80 lamc-gallery.png -o lamc-gallery.webp
cwebp -q 80 lamc-thumbnail.png -o lamc-thumbnail.webp
cwebp -q 80 academic-next.png -o academic-next.webp
cwebp -q 80 lamc_screenshots/lamc-01.png -o lamc_screenshots/lamc-01.webp
cwebp -q 80 ytdubber-logo.png -o ytdubber-logo.webp
```

**Update HTML:** Replace `.png` with `.webp` in:
- index.html
- academicindex.html
- lamcpainting.html

---

### Priority 3: Remove Broken Typekit Script
**Status:** PENDING | **Impact:** Eliminates 1 failed request

**Finding:** Typekit script returns empty response (9 bytes)

**Remove from all HTML files:**
```html
<!-- DELETE THESE LINES -->
<script src="https://use.typekit.net/iin5llv.js" type="text/javascript"></script>
<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
```

---

### Priority 4: Delete Duplicate Screenshots
**Status:** PENDING | **Impact:** 3.1MB savings

**Finding:** 7 academic screenshots stored in 2 locations

**Commands:**
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

---

## Current State Analysis

### JavaScript Bundle
```
bundle.js:                  1,251,512 bytes (1.2MB) - CRITICAL
jquery-3.5.1.min.js:           89,476 bytes (87KB) - SHOULD BE REMOVED
webflow.schunk.js:             35,840 bytes (35KB)
webflow.751e0867.js:            1,024 bytes (1KB)
```

**Identified Libraries:**
- Barba.js v2.10.3 (Page transitions)
- GSAP v3.13.0 (Animation library)
- Lenis (Smooth scroll)
- HLS.js v1.6.15 (Video streaming)
- Swiper (Carousel/slider)

---

### Image Inventory

#### Project Screenshots (CRITICAL)
```
lamc-gallery.png              6.7MB  → ~350KB WebP (95% savings)
lamc_screenshots/lamc-01.png  6.5MB  → ~340KB WebP (95% savings)
lamc-thumbnail.png            4.2MB  → ~220KB WebP (95% savings)
academic-next.png             4.2MB  → ~220KB WebP (95% savings)
ytdubber-logo.png             1.4MB  → ~70KB WebP (95% savings)
```

#### Academic Index Screenshots (Duplicated)
```
01-academic-index.png         601KB  ×2 = 1.2MB
02-academic-index.png         867KB  ×2 = 1.7MB
03-academic-index.png         342KB  ×2 = 684KB
04-academic-index.png         233KB  ×2 = 466KB
05-academic-index.png         353KB  ×2 = 706KB
06-academic-index.png         557KB  ×2 = 1.1MB
07-academic-index.png         1.0MB  ×2 = 2.0MB
```
**Note:** Stored in both `/dist/assets/` and `/dist/assets/academic_screenshots/`

#### Photo Gallery (93MB Total)
```
Catalunya/aiguablava/IMG_4334.jpeg  6.5MB
San Francisco/lombard st.jpeg       4.8MB
England/cambridge/IMG_0113.jpeg     4.6MB
Portugal/lisbon/IMG_2835.jpeg       4.5MB
Madrid/IMG_0886.jpeg                4.1MB
+ 20 more high-resolution photos
```

---

### CSS Analysis
```
main.css:                     148,817 bytes (145KB)
rylanphillips.webflow.css:    127,061 bytes (124KB) ×3 copies = 381KB
swiper-bundle.min.css:         18,454 bytes (18KB) ×3 copies = 55KB
splitting.css:                  1,784 bytes (1.7KB) ×3 copies = 5.3KB
splitting-cells.css:            1,518 bytes (1.5KB) ×3 copies = 4.5KB
```

**Issue:** Same CSS files copied to 3 different directories
**Total waste:** 445KB of duplicate CSS

---

### Font Loading
```
PP Neue Montreal (WOFF):      39,624 bytes (39KB)
Fragment Mono (TTF):         124,148 bytes (121KB) - Convert to WOFF2 → ~60KB
Typekit (use.typekit.net):      ~9 bytes (empty response) - REMOVE
```

---

## High Priority Optimizations (3-4 hours)

### 5. Optimize Photo Gallery
**Status:** PENDING | **Impact:** 81-85MB savings (87-91% reduction)

**Strategy:**
- Generate 3 sizes per image: 400px, 800px, 1200px widths
- Convert to WebP format
- Implement lazy loading with native `loading="lazy"`
- Use `<picture>` with WebP + JPEG fallback

**Example:**
```html
<picture>
  <source
    srcset="/assets/photos/optimized/image-400.webp 400w,
            /assets/photos/optimized/image-800.webp 800w,
            /assets/photos/optimized/image-1200.webp 1200w"
    type="image/webp">
  <img
    srcset="/assets/photos/optimized/image-400.jpg 400w,
            /assets/photos/optimized/image-800.jpg 800w"
    loading="lazy"
    alt="Description">
</picture>
```

---

### 6. Extract Critical CSS
**Status:** PENDING | **Impact:** 50% faster FCP

**Target styles for inline critical CSS:**
- Header layout and positioning
- Hero section typography and grid
- Navigation styles
- Font-face declarations for primary font only

**Estimated Impact:**
```
Current FCP (First Contentful Paint):  ~1.2s
With Critical CSS:                     ~0.6s
IMPROVEMENT:                           50% faster
```

---

### 7. Convert Fragment Mono to WOFF2
**Status:** PENDING | **Impact:** 60KB savings (50% reduction)

```bash
# Install fonttools
pip install fonttools brotli

# Convert Fragment Mono
pyftsubset FragmentMono-Regular.ttf \
  --output-file=FragmentMono-Regular.woff2 \
  --flavor=woff2 \
  --layout-features='*' \
  --no-hinting \
  --desubroutinize
```

---

## Expected Results

### After Quick Wins (Phase 1)
```
Total page weight:  ~95MB (19% reduction)
JavaScript:         1.29MB (6% reduction)
Images (projects):  1.2MB (95% reduction)

LCP:  2.3-3.0s (NEEDS IMPROVEMENT → borderline GOOD)
FCP:  1.0-1.3s (NEEDS IMPROVEMENT)
TTI:  3.7-4.5s (POOR → borderline NEEDS IMPROVEMENT)
CLS:  0.05-0.1 (GOOD - maintained)
```

### After Full Optimization (Phase 2)
```
Total page weight:  ~800KB-1MB (60-67% reduction from current)

LCP:  <2.5s (GOOD) ✓
FCP:  <0.8s (GOOD) ✓
TTI:  <3.5s (GOOD) ✓
CLS:  <0.1 (GOOD) ✓
```

---

## Before/After Comparison

| Asset Type | Before | After Phase 1 | After Phase 2 | Total Savings |
|------------|--------|---------------|---------------|---------------|
| JavaScript | 1.38MB | 1.29MB (-6%) | 1.15MB (-17%) | 230KB |
| CSS | 445KB | 148KB (-67%) | 108KB (-76%) | 337KB |
| Images (project) | 22.9MB | 1.2MB (-95%) | 1.2MB (-95%) | 21.7MB |
| Images (photos) | 93MB | 93MB (0%) | 12MB (-87%) | 81MB |
| Fonts | 160KB | 160KB (0%) | 100KB (-38%) | 60KB |
| **TOTAL** | **~117MB** | **~95MB (-19%)** | **~14.5MB (-88%)** | **~103MB** |

---

## Validation Checklist

After implementing each phase:

- [ ] Test all pages load without errors
- [ ] Verify WebP images display correctly
- [ ] Check no jQuery-dependent features broke
- [ ] Run Lighthouse audit (expect 20-30 point improvement after Phase 1)
- [ ] Test on mobile device
- [ ] Measure actual LCP improvement
- [ ] Verify responsive images load correct sizes
- [ ] Test lazy loading scroll behavior
- [ ] Check all pages (not just homepage)
- [ ] Verify no console errors
- [ ] Test on Safari, Chrome, Firefox

---

## Implementation Tools

### Image Optimization
```bash
# Install WebP tools (macOS)
brew install webp

# Batch convert PNGs to WebP
find assets -name "*.png" -type f -exec sh -c '
  cwebp -q 80 "$1" -o "${1%.png}.webp"
' _ {} \;

# Generate responsive photo sizes
for img in assets/photos/**/*.jpeg; do
  cwebp -resize 400 0 -q 75 "$img" -o "${img%.jpeg}-400.webp"
  cwebp -resize 800 0 -q 75 "$img" -o "${img%.jpeg}-800.webp"
  cwebp -resize 1200 0 -q 80 "$img" -o "${img%.jpeg}-1200.webp"
done
```

### CSS Analysis
```bash
# Use PurgeCSS
npm install -g purgecss
purgecss --css dist/assets/main.css \
         --content dist/*.html \
         --output dist/assets/main.purged.css
```

### Bundle Analysis
```bash
# Install source-map-explorer
npm install -g source-map-explorer

# Analyze bundle
source-map-explorer dist/template_files/bundle.js
```

---

## Monitoring Setup

### Web Vitals Monitoring
```javascript
// Add to all pages
import {onCLS, onFCP, onLCP} from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric);

  if (metric.name === 'LCP' && metric.value > 2500) {
    console.error('LCP threshold exceeded:', metric.value);
  }
}

onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
```

---

## Next Steps

1. **Implement Quick Wins** (1-2 hours)
   - Remove jQuery from all HTML files
   - Convert 5 project PNGs to WebP
   - Remove Typekit script
   - Delete duplicate screenshots

2. **Validate Phase 1**
   - Run Lighthouse audit
   - Test all functionality
   - Measure performance improvements

3. **Proceed to Phase 2** (3-4 hours)
   - Optimize photo gallery
   - Extract critical CSS
   - Convert fonts to WOFF2

4. **Monitor and Maintain**
   - Track Core Web Vitals
   - Set up automated testing
   - Schedule regular performance audits

---

**Attribution:**
- **Original Audit:** @qa-devops-engineer (PERFORMANCE_AUDIT_REPORT.md)
- **Quick Wins Plan:** @qa-devops-engineer (PERFORMANCE_QUICK_WINS.md)
- **Consolidation:** @agile-backlog-manager (Documentation reorganization)
- **Date:** 2026-01-31
- **Status:** Ready for implementation
