# Isiah Udofia Portfolio

AI-Native Designer & Developer Portfolio Website

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot-reload
npm run dev
```

Opens at `http://localhost:3000`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
isiahudofia.com/
├── assets/              # Images, videos, favicons
├── template_files/      # CSS and JavaScript bundles
├── index.html           # Homepage
├── info.html            # About/Info page
├── projects.html        # Projects showcase
├── resume.html          # Resume/CV page
├── academicindex.html   # Academic Index project page
├── lamcpainting.html    # LAMC Painting project page
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies
```

## 🛠️ Development Tools

- **Vite** - Lightning-fast dev server with Hot Module Replacement
- **Hot Reload** - See changes instantly without refreshing
- **Build Optimization** - Automatic optimization for production

## 🎨 Features

- ✅ Smooth page transitions (Barba.js)
- ✅ Advanced animations (GSAP)
- ✅ Smooth scrolling (Lenis)
- ✅ Responsive design
- ✅ Multiple favicon formats
- ✅ Mobile-optimized

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run serve` - Preview build on port 3000

## 🌐 Deployment

The site is configured for easy deployment to:
- **GitHub Pages** - Push to main branch
- **Netlify** - Connect repository
- **Vercel** - Import project

Build output goes to `dist/` directory.

## 🔧 Configuration

### Vite Config
The `vite.config.js` file handles:
- Development server settings
- Build optimization
- Asset management
- Multi-page setup

### Path Structure
All assets use absolute paths from root (`/assets/`, `/template_files/`) for consistent loading across all pages.

## 🐛 Troubleshooting

### Port already in use
If port 3000 is busy, Vite will automatically use the next available port.

### Assets not loading
Check that all paths use absolute paths (`/assets/`) not relative (`./assets/`).

### Build errors
Clear the Vite cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

## 📄 License

All rights reserved - Isiah Udofia

---

Built with modern web technologies and optimized for performance.
