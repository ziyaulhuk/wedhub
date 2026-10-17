import { defineConfig } from 'vite';

// base: './' is required so the built assets load correctly inside the
// Capacitor WebView (capacitor:// scheme) instead of only from a web server.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020'
  }
});
