# DATA ATTRIBUTES QUICK REFERENCE

**Version:** 1.0
**Last Updated:** 2026-01-31
**Purpose:** Quick reference for all data attributes used in the codebase

---

## BARBA.JS ATTRIBUTES

### Page Structure

```html
<div id="barba-wrapper" data-barba="wrapper">
  <main data-barba-namespace="home" data-barba="container" class="barba-container">
    <!-- Page content -->
  </main>
</div>
```

| Attribute | Value | Purpose | Required |
|-----------|-------|---------|----------|
| `data-barba="wrapper"` | - | Wraps entire page content | Yes |
| `data-barba="container"` | - | Marks swappable content area | Yes |
| `data-barba-namespace` | string (e.g., "home", "info") | Identifies page for routing | Yes |

### Navigation Control

```html
<!-- Prevents Barba transition (full page load) -->
<a href="/resume.html" data-barba-prevent="true">Resume</a>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-barba-prevent` | "true" | Force full page load (skip Barba) |

**Common Uses:**
- Resume download links
- External project pages
- Pages that need full refresh

---

## ANIMATION ATTRIBUTES

### Text Shuffle Animations

```html
<!-- Hover shuffle effect -->
<p data-shuffle="text" data-shuffle-hover="Hover Text">Original</p>

<!-- Load animation (single line) -->
<p data-shuffle-load="single">Animate This</p>

<!-- Load animation (multi line) -->
<p data-shuffle-load="multi">Line 1</p>
<p data-shuffle-load="multi">Line 2</p>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-shuffle` | "text" | Enables hover shuffle effect |
| `data-shuffle-hover` | string | Text to shuffle to on hover |
| `data-shuffle-load` | "single" or "multi" | Animate on page load |

**Behavior:**
- `data-shuffle`: Text shuffles through random characters on hover
- `data-shuffle-hover`: Target text when shuffling
- `data-shuffle-load`: Triggers animation when page loads
- `single`: Single line animation
- `multi`: Staggered multi-line animation

### Preloader Attributes

```html
<div class="loader_wrap">
  <h1 data-load="title" class="preloader-text">Welcome</h1>
  <p data-load="title2" class="preloader-text">back</p>
  <p data-load="subtitle" class="preloader-text">[Portfolio 2K25]</p>
</div>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-load="title"` | - | Main preloader title |
| `data-load="title2"` | - | Secondary preloader text |
| `data-load="subtitle"` | - | Preloader subtitle/description |

**Note:** Text is read from these elements but currently overwritten by hardcoded strings in bundle.js. See [PRELOADER_SYSTEM.md](/documentation/systems/PRELOADER_SYSTEM.md) for customization details.

---

## IMAGE ATTRIBUTES

### Image Loading and Animation

```html
<!-- Desktop image -->
<img data-image="desktop" src="image.jpg" alt="Description">

<!-- Mobile image -->
<img data-image="mobile" src="mobile-image.jpg" alt="Description">

<!-- Icon -->
<img data-image="icon" src="icon.svg" alt="Icon">
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-image="desktop"` | - | Desktop image (blur-in animation) |
| `data-image="mobile"` | - | Mobile image (blur-in animation) |
| `data-image="icon"` | - | Icon (blur-in animation) |

**Behavior:**
- Images start at `opacity: 0, filter: blur(12px)`
- Animate to `opacity: 1, filter: blur(0px)`
- Staggered animation (0.1s delay between images)
- Triggered after preloader completes

---

## NAVIGATION ATTRIBUTES

### Navigation Buttons

```html
<a data-nav-btn="home" href="/">Home</a>
<a data-nav-btn="info" href="/info.html">Info</a>
<a data-nav-btn="archive" href="/resume.html">Resume</a>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-nav-btn` | string (e.g., "home", "info") | Identifies navigation button |

**Used For:**
- Styling active state (`.nav-active` class)
- JavaScript navigation handlers
- Keyboard navigation

---

## PROJECT DATA ATTRIBUTES

### Project Information

```html
<div data-project-title="Academic Index"
     data-project-year="2025"
     data-project-service1="Research"
     data-project-service2="Design"
     data-project-service3="Development"
     data-project-name="academicindex">
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-project-title` | string | Project display title |
| `data-project-year` | string | Project year |
| `data-project-service1` | string | Service category 1 |
| `data-project-service2` | string | Service category 2 |
| `data-project-service3` | string | Service category 3 |
| `data-project-name` | string | Project identifier |

**Used For:**
- Hover effects showing project details
- Dynamic content display
- Project filtering/sorting (if implemented)

---

## BRACKET ATTRIBUTES

### Decorative Brackets

```html
<p data-bracket="1" class="bracket-left">[</p>
<p data-bracket="2" class="bracket-right">]</p>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-bracket="1"` | - | Left bracket |
| `data-bracket="2"` | - | Right bracket |

**Behavior:**
- Opacity controlled by JavaScript
- `opacity: 0` when not hovering
- `opacity: 1` when hovering parent element
- Used around navigation links and project titles

---

## LINE ATTRIBUTES

### Content Lines

```html
<p data-line="1">First line</p>
<p data-line="2">Second line</p>
<p data-line="location">New Haven, CT</p>
<p data-line="time">05:57:50</p>
<p data-time="" data-line="time">...</p>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-line="1"` | number | Sequential line number |
| `data-line="location"` | "location" | Location display |
| `data-line="time"` | "time" | Time display |
| `data-time` | - | Enable time updating |

**Behavior:**
- Used for staggered animations
- Special handling for location and time
- Time element updates automatically

---

## PRELOADER-RELATED ATTRIBUTES

### Preloader Elements

```html
<div data-preloader class="element">Content</div>
<div data-shuffle-load class="element">Content</div>
```

| Attribute | Purpose |
|-----------|---------|
| `data-preloader` | Element hidden during preloader |
| `data-shuffle-load` | Element has shuffle animation on load |

**Behavior:**
- Initially `opacity: 0`
- Set to `opacity: 1` after preloader completes
- Shuffle animation triggered on page load

---

## GRID BACKGROUND ATTRIBUTES

### Background Grid System

```html
<div class="bg_grid_wrap is-loader"></div>
<div class="bg_grid_wrap persistant"></div>
<div class="bg_column is-desktop"></div>
<div class="bg_column is-mobile"></div>
```

| Class | Purpose |
|-------|---------|
| `bg_grid_wrap` | Grid container |
| `is-loader` | Visible during preloader |
| `persistant` | Always visible |
| `is-desktop` | Desktop columns (10 columns) |
| `is-mobile` | Mobile columns (4-6 columns) |

---

## WEBFLOW ATTRIBUTES

### Webflow Integration

```html
<html data-wf-domain="www.isiahudofia.com"
      data-wf-page="66eaf290a1e24c5a75c8d28c"
      data-wf-site="648e04349ae84f3d539b1ea0"
      class="w-mod-js lenis">
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-wf-domain` | string | Webflow domain |
| `data-wf-page` | string | Webflow page ID |
| `data-wf-site` | string | Webflow site ID |

**Important:** Do not modify these attributes - they're required for Webflow CMS integration.

---

## CUSTOM COMPONENT ATTRIBUTES

### Gallery Components

```html
<!-- Gallery wrapper -->
<div class="gallery-component">
  <!-- Gallery items -->
</div>
```

See: `/components/gallery/README.md`

### Showcase Components

```html
<!-- Coming soon hover -->
<div class="coming-soon-hover">...</div>

<!-- View project hover -->
<div class="view-project-hover">...</div>
```

See: `/components/showcase/` directory

---

## SUMMARY TABLE

| Attribute | Used By | Purpose |
|-----------|---------|---------|
| `data-barba="wrapper"` | Barba.js | Page wrapper |
| `data-barba="container"` | Barba.js | Swappable content |
| `data-barba-namespace` | Barba.js | Page identifier |
| `data-barba-prevent` | Barba.js | Skip transition |
| `data-shuffle` | Custom | Hover shuffle effect |
| `data-shuffle-hover` | Custom | Shuffle target text |
| `data-shuffle-load` | Custom | Load animation |
| `data-load` | Custom | Preloader text |
| `data-image` | Custom | Image animations |
| `data-nav-btn` | Custom | Navigation button |
| `data-project-*` | Custom | Project metadata |
| `data-bracket` | Custom | Decorative brackets |
| `data-line` | Custom | Content lines |
| `data-time` | Custom | Time display |

---

## TROUBLESHOOTING

### Attribute Not Working?

**Check:**
1. Is the attribute spelled correctly?
2. Is the value correct?
3. Is the required JavaScript loaded?
4. Are there console errors?

**Common Issues:**

**Issue:** Barba transition not working
- **Check:** `data-barba="container"` and `data-barba-namespace` present
- **Check:** bundle.js loaded
- **Check:** No JavaScript errors before Barba init

**Issue:** Shuffle animation not playing
- **Check:** `data-shuffle` or `data-shuffle-load` present
- **Check:** bundle.js loaded
- **Check:** Element has text content

**Issue:** Preloader text wrong
- **Check:** `data-load` attributes present
- **Check:** bundle.js hardcoded strings (see PRELOADER_SYSTEM.md)

**Issue:** Images not animating
- **Check:** `data-image` attribute present
- **Check:** Image has src attribute
- **Check:** No CSS overriding opacity/filter

---

## SEE ALSO

- [ARCHITECTURAL_PRESERVATION.md - Appendix B](/documentation/architecture/ARCHITECTURAL_PRESERVATION.md#appendix-b-data-attribute-reference)
- [PRELOADER_SYSTEM.md](/documentation/systems/PRELOADER_SYSTEM.md)
- [Documentation Hub](/documentation/README.md)

---

**END OF REFERENCE**

This document should be updated when new data attributes are added to the codebase.
