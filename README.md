# isiahudofia.com

A modern, responsive portfolio website for Isiah Udofia, a Yale University student studying Cognitive Science with a focus on product management, AI/ML, and technical execution.

## Overview

This is a professional portfolio website built with vanilla HTML, CSS, and JavaScript - no frameworks or build tools required. The site showcases Isiah's projects, experience, and academic work with a focus on product management readiness and technical storytelling.

## Site Purpose

- **Primary Goal**: Present a crisp, professional, product-management-ready portfolio
- **Emphasis**: Product sense, execution, and storytelling (problem → approach → results)
- **Design**: Accessibility, performance, and visual consistency with Yale blue color system
- **Technology**: Pure HTML/CSS/vanilla JS (Netlify-friendly, no packages)

## Project Structure

```
isiahudofia.com/
├── index.html              # Homepage with hero section and neural canvas
├── about.html              # Personal profile and focus areas
├── projects.html           # Project showcase grid
├── projects/               # Individual project detail pages
│   ├── discord.html        # Live Translator for Discord project
│   ├── zen-video-agency.html # Zen Video Agency project
│   └── thesis-ml.html      # B.S. Thesis ML project
├── contact.html            # Contact information and social links
├── resume.html             # Interactive resume with PDF download
├── 404.html               # Custom 404 error page
├── css/
│   └── styles.css         # Global styles with Yale blue theme
├── js/
│   └── main.js            # Interactive functionality and animations
├── assets/                # Images, icons, and documents
│   ├── pfp.jpg            # Profile picture
│   ├── discord.png        # Discord project logo
│   ├── zen.png            # Zen Video Agency logo
│   ├── thesis.png         # Thesis project logo
│   ├── yale.svg           # Yale University logo
│   └── Udofia_Isiah_Resume.pdf # Resume PDF
├── ops/                   # Project documentation and guidelines
│   ├── SITE_GOAL.md       # Site objectives and requirements
│   ├── STYLE_GUIDE.md     # Design system and component guidelines
│   ├── IMPLEMENTATION_RULES.md # Development constraints and rules
│   └── PROJECTS/          # Individual project documentation
│       ├── discord-voice-translator.md
│       ├── zen-video-agency.md
│       └── thesis-ml.md
└── _headers               # Netlify headers configuration
```

## Design System

### Color Palette
- **Primary**: Deep navy Yale blues (`#00356B`, `#0b2545`, `#13315c`)
- **Accent**: Sky blue (`#69a8ff`, `#7cc5ff`, `#b6e3ff`)
- **Text**: White/ink (`#eaf2ff`, `#ccd6e8`)
- **Muted**: Light blue (`#9fb1cf`)

### Typography
- **Font Stack**: System UI, -apple-system, "Segoe UI", Roboto, Inter, Arial
- **Scale**: Responsive clamp() functions for fluid typography
- **Headings**: Tight line-height (~1.15)
- **Body**: 1.6 line-height for readability

### Components
- **Cards**: Rounded corners, inner gradients, soft shadows
- **Buttons**: Pill-shaped with hover effects and focus states
- **Chips**: Compact, single-line tags with subtle borders
- **Grids**: Responsive CSS Grid layouts
- **Animations**: Neural canvas backgrounds, reveal-on-scroll effects

## Key Features

### Interactive Elements
- **Neural Canvas**: Animated background with floating nodes and connections
- **Reveal Animations**: Scroll-triggered content reveals
- **3D Tilt Effects**: Subtle card interactions on hover
- **Responsive Navigation**: Mobile-friendly hamburger menu
- **Accessibility**: Full keyboard navigation and screen reader support

### Performance Optimizations
- **Vanilla JavaScript**: No framework overhead
- **CSS Custom Properties**: Efficient theming system
- **Intersection Observer**: Optimized scroll animations
- **Reduced Motion Support**: Respects user preferences
- **Lazy Loading**: Images load as needed

## Responsive Design

The site is fully responsive with breakpoints at:
- **Mobile**: < 768px (stacked layouts, simplified navigation)
- **Tablet**: 768px - 1024px (adjusted grids, maintained readability)
- **Desktop**: > 1024px (full grid layouts, enhanced interactions)

## Project Showcase

### 1. Live Translator for Discord
- **Technology**: Discord API, Deepgram STT, WebSocket
- **Focus**: Real-time voice translation with native Discord integration
- **Status**: MVP complete, deployed at livecalltranslator.netlify.app
- **Key Metrics**: <250ms response time, 29 languages supported

### 2. Zen Video Agency
- **Technology**: Premiere Pro, After Effects, Analytics platforms
- **Focus**: Scalable content production system for creators
- **Results**: 95% on-time delivery, 24-48h turnaround
- **Approach**: Data-driven optimization and systematic workflows

### 3. B.S. Thesis - ML for Sleep Data
- **Technology**: Ridge regression, XGBoost, Calibration methods
- **Focus**: Making wearable sleep data actionable and trustworthy
- **Approach**: Calibrated models with evidence-based explanations
- **Timeline**: September 2024 - April 2025

## Technical Implementation

### CSS Architecture
- **Custom Properties**: Centralized design tokens
- **Component-Based**: Reusable UI components
- **Mobile-First**: Progressive enhancement approach
- **Performance**: Optimized selectors and minimal repaints

### JavaScript Features
- **Modular Functions**: Organized, maintainable code
- **Event Handling**: Efficient event delegation
- **Animation Control**: Respects user motion preferences
- **Canvas Rendering**: Custom neural network visualizations

### Accessibility Features
- **Semantic HTML**: Proper landmark structure
- **ARIA Labels**: Screen reader support
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant

## Development Guidelines

### Code Standards
- **No Frameworks**: Pure HTML/CSS/JavaScript only
- **No Build Tools**: Direct file serving
- **Consistent Naming**: BEM-inspired CSS classes
- **Performance First**: Optimize for speed and accessibility

### File Organization
- **Global Styles**: Single CSS file with organized sections
- **Component Logic**: Modular JavaScript functions
- **Asset Management**: Optimized images and icons
- **Documentation**: Comprehensive project docs

## Deployment

The site is designed for easy deployment on Netlify or similar static hosting platforms:

1. **No Build Process**: Direct file upload
2. **Headers Configuration**: `_headers` file for proper MIME types
3. **404 Handling**: Custom error page
4. **Asset Optimization**: Compressed images and minified code

## Performance Metrics

- **Lighthouse Score**: 95+ across all categories
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: CSS Grid, Custom Properties, Intersection Observer
- **Fallbacks**: Graceful degradation for older browsers

## License

This project is part of Isiah Udofia's personal portfolio. All rights reserved.

## Contact

- **Email**: isiah.udofia@yale.edu
- **Phone**: (973) 303-6883
- **LinkedIn**: [linkedin.com/in/isiah-udofia](https://www.linkedin.com/in/isiah-udofia/)
- **GitHub**: [github.com/iudofia2026](https://github.com/iudofia2026)

---

*Built with attention to detail for product management opportunities.*