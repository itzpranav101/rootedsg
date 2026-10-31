import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, host: true },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks so app updates don't bust the framework cache
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom)\//.test(id)) return 'react';
        },
      },
    },
  },
});
