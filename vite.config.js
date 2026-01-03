import { defineConfig } from 'vite'

export default defineConfig({
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    // Enable hot module replacement
    hmr: true,
  },

  // Build configuration
  build: {
    // Output directory for production builds
    outDir: 'dist',
    // Generate source maps for debugging
    sourcemap: true,
    // Don't minify during build (keep existing minified files as-is)
    minify: false,
    // Keep existing asset structure
    assetsDir: 'assets',
    // Copy all HTML files and assets without transformation
    rollupOptions: {
      input: {
        main: './index.html',
        info: './info.html',
        projects: './projects.html',
        resume: './resume.html',
        academicindex: './academicindex.html',
        lamcpainting: './lamcpainting.html',
      },
      output: {
        // Keep asset paths consistent
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      },
    },
  },

  // Serve static files from current directory
  publicDir: '.',

  // Dependencies to optimize (pre-bundle)
  optimizeDeps: {
    // Don't pre-bundle anything - we're using existing bundled files
    exclude: ['all'],
  },
})
