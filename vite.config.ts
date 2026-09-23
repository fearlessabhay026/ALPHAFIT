import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      // The SSR build (prerender only) leaves node_modules external, so it can't chunk them.
      output: isSsrBuild
        ? {}
        : {
            manualChunks: {
              motion: ['gsap', 'lenis'],
            },
          },
    },
  },
}));
