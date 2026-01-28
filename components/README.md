# Reusable Components

This directory contains reusable components for the site.

## Directory Structure

```
components/
├── README.md (this file)
├── showcase/
│   ├── coming-soon-hover.html
│   └── view-project-hover.html
└── gallery/
    ├── katherine-kato-gallery.html
    └── README.md
```

## Available Components

### Coming Soon Hover Component
**File:** `showcase/coming-soon-hover.html`

**Usage:** For projects that are not yet available or don't have a dedicated page.

**Features:**
- "Coming Soon" hover text
- Clock icon SVG
- Disabled click behavior (href="javascript:void(0)")

**Current Usage:**
- OGM Reposado (Card #03) - Coming March 2026
- Senior Project (Card #04) - Coming April 2026

### View Project Hover Component
**File:** `showcase/view-project-hover.html`

**Usage:** For projects that have dedicated pages.

**Features:**
- "View Project" hover text
- Arrow icon SVG
- Active click behavior (links to project page)

**Current Usage:**
- Academic Index (Card #01)
- LAMC Painting (Card #02)
- About Me (Card #05)

## Implementation Notes

### HTML Structure
Each component includes:
- Hover text div with `data-shuffle-hover` attribute
- SVG icon with proper styling
- Consistent CSS classes for layout

### Styling
- Width: 87px for text alignment
- Flexbox layout for proper spacing
- Consistent icon sizing and positioning

### JavaScript Integration
Components work with the existing shuffle animation system:
- `data-shuffle="text"` for text animation
- `data-shuffle-load="single"` for load animation
- `data-shuffle-hover` for hover state

## Adding New Components

When adding new showcase cards:

1. **Determine the project status:**
   - Has a dedicated page → Use `view-project-hover.html`
   - No page yet/in development → Use `coming-soon-hover.html`

2. **Copy the appropriate component** into your showcase card structure

3. **Update project-specific attributes:**
   - `data-project-title`: Project name
   - `data-project-year`: Year or "Coming [Month] [Year]"
   - `data-project-service1/2/3`: Services provided
   - `data-project-name`: Internal project identifier

## Future Enhancements

Potential additions to the component system:
- Different icon states (loading, error, etc.)
- Additional hover text variations
- Responsive component variants
- Animation component variants