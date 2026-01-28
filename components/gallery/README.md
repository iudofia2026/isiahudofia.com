# Gallery Components

This directory contains reusable gallery components for the site.

## Directory Structure

```
components/
├── README.md (this file)
└── gallery/
    ├── katherine-kato-gallery.html
    └── README.md (this file)
```

## Available Components

### Katherine Kato Gallery Component
**File:** `katherine-kato-gallery.html`

**Features:**
- 12-column CSS Grid layout (responsive)
- 6 images in 3-4-4, 6-6, 12 column pattern
- Hover tooltips with shuffle animation
- Fixed height images (500px) with object-fit cover
- Mouse-following tooltips with custom styling
- Responsive mobile layout (single column)
- Custom font integration with site typography

**Layout Pattern:**
- **Desktop:** 12-column grid
  - Top row: 3 columns spanning 4 each
  - Middle row: 2 columns spanning 6 each
  - Bottom row: 1 column spanning 12 (full width)
- **Mobile:** Single column stack

**Current Images:**
1. Olympics Crowd - Paris 2024
2. Seine Sunset - Paris
3. NYC Rooftop - New York
4. Infinity Pool - Barcelona
5. Lombard Street - San Francisco
6. Yale Snow - New Haven

## Usage

1. **Copy the component** into your page structure
2. **Customize images** by updating `src` attributes
3. **Update titles/categories** in both `.img-content` and `.img-content-hover` spans
4. **Add component CSS** to your page styles
5. **Include JavaScript** for tooltip shuffle animation

## Required CSS

The component requires these CSS classes:
- `.gallery` - Main section wrapper
- `.gallery .grid` - 12-column grid layout
- `.column-xs-12`, `.column-md-4`, `.column-md-6` - Responsive column classes
- `.img-container` - Image wrapper with hover effects
- `.img-content`, `.img-content-hover` - Tooltip content
- `.global-tooltip` - Mouse-following tooltip

## Required JavaScript

The component needs:
- Shuffle animation system for tooltip text
- Mouse tracking for tooltip positioning
- Global tooltip creation and management

## Customization

### Adding/Removing Images
- Follow the 12-column grid pattern
- Use `column-md-4` for 3-column layouts
- Use `column-md-6` for 2-column layouts
- Use `column-xs-12` for full-width mobile

### Image Sizing
- Fixed height: 500px on desktop
- Height: 100% on mobile (variable)
- Object-fit: cover for consistent aspect ratios

### Tooltip Styling
- Background: Black (#000)
- Title color: White (#fff)
- Category color: Gray (#999)
- Font: Site primary font family
- Border-radius: 0 (sharp edges)