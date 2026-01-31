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

- **Home** (`index.html`) – Featured projects showcase with hover effects and shuffle text animations
- **Academic Index** (`academicindex.html`) – Gamified college application platform with video demos
- **LAMC Painting** (`lamcpainting.html`) – Professional painting company website
- **Info** (`info.html`) – About page with background and bio
- **Resume** (`resume.html`) – Professional experience and skills
- **Photography** (`photography.html`) – Photography gallery
- **Thesis** (`thesis.html`) – Academic thesis project
- **Track & Field** (`track-and-field.html`) – Athletic portfolio

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

**Currently deployed via Vercel** – [isiahudofia.com](https://isiahudofia.com)

- **Project:** isiahudofia-com
- **Framework:** Static site (Node.js 24.x)
- **Build time:** ~10 seconds
- **Environment:** Production

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

The site is production-ready as a static site and can be deployed to any static hosting service.

---

## License

All rights reserved – Isiah Udofia

---

**Documentation:** [View Technical Docs](/documentation/README.md)
