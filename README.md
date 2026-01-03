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
# Start development server
npm run dev
```

Opens at `http://localhost:3000` with auto-refresh

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
└── package.json         # Project dependencies
```

## 🛠️ Development Tools

- **http-server** - Simple static file server
- **Auto-refresh** - Changes appear when you refresh the browser
- **Zero configuration** - Works immediately after `npm install`

## 🎨 Features

- ✅ Smooth page transitions (Barba.js)
- ✅ Advanced animations (GSAP)
- ✅ Smooth scrolling (Lenis)
- ✅ Responsive design
- ✅ Multiple favicon formats
- ✅ Mobile-optimized

## 📝 Scripts

- `npm run dev` - Start development server at `localhost:3000`
- `npm start` - Same as `npm run dev`
- `npm run build` - Simple build command (files are production-ready)

## 🌐 Deployment

The site is ready to deploy to:
- **GitHub Pages** - Push to main branch
- **Netlify** - Connect repository
- **Vercel** - Import project
- **Any static host** - Upload the files as-is

All files are production-ready and optimized.

## 🔧 Configuration

### Project Details
- **Static site** - No build process required
- **No bundling** - Uses existing bundled files
- **No transformation** - Files served as-is
- **Simple and fast** - Just like a regular static website

### Path Structure
The site uses multiple template directories:
- `template_files/` - Main CSS and JS bundles
- Page-specific directories (created by Webflow export)

All paths work correctly in the current structure.

## 🐛 Troubleshooting

### Port already in use
If port 3000 is busy, change the port in `package.json`:
```json
"dev": "npx http-server -p 3001 -o -c-1"
```

### Changes not appearing
- Hard refresh the browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check that you're editing the correct HTML file
- Verify the server is running

### Images or CSS not loading
- Check the browser console for 404 errors
- Verify file paths match the actual directory structure
- Some pages reference different template directories

## 📄 License

All rights reserved - Isiah Udofia

---

Built with modern web technologies and optimized for performance.
