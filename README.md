# Isiah Udofia – Portfolio Website

A modern, animated portfolio website showcasing design and development work. Built with Webflow, enhanced with custom JavaScript animations, and optimized for performance.

**Live Site:** [isiahudofia.com](https://isiahudofia.com)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Opens at `http://localhost:3000`

---

## Overview

This is a single-page application (SPA) built with:
- **Barba.js** for smooth page transitions
- **GSAP** for advanced animations
- **Custom shuffle text effects** for interactive elements
- **Responsive design** optimized for mobile and desktop

### Project Pages

- **Home** – Featured projects showcase with hover effects
- **Academic Index** – Gamified college application platform
- **LAMC Painting** – Professional painting company website
- **Info** – About and background
- **Résumé** – Experience and skills

---

## Documentation

Comprehensive technical documentation is available in the `/documentation` folder.

**Start Here:** [Documentation Hub](/documentation/README.md)

### Key Documents

| Document | Description |
|----------|-------------|
| [Documentation Hub](/documentation/README.md) | Complete documentation index |
| [Architecture](/documentation/architecture/ARCHITECTURAL_PRESERVATION.md) | System architecture and guidelines |
| [Preloader Analysis](/documentation/PRELOADER_ANALYSIS.md) | Preloader system analysis |
| [Data Attributes](/documentation/reference/DATA_ATTRIBUTES_REFERENCE.md) | Data attributes reference |

---

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Scripts
- `npm run dev` – Start development server
- `npm start` – Same as `npm run dev`
- `npm run build` – Production build

### File Structure

```
isiahudofia.com/
├── index.html              # Homepage
├── info.html               # About page
├── resume.html             # Résumé
├── academicindex.html      # Academic Index project
├── lamcpainting.html       # LAMC Painting project
├── assets/                 # Images, videos, favicons
├── template_files/         # Bundled CSS and JavaScript
├── css/                    # Custom CSS
├── js/                     # Custom JavaScript
└── documentation/          # Technical documentation
```

---

## Features

- Smooth page transitions (no full reloads)
- Custom shuffle text animations
- Responsive image galleries
- Mobile-optimized navigation
- Performance-optimized animations
- Accessible semantic HTML

---

## Deployment

Currently deployed via Vercel.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

The site is production-ready as a static site and can be deployed to any static hosting service.

---

## License

All rights reserved – Isiah Udofia

---

**Documentation:** [View Technical Docs](/documentation/README.md)
