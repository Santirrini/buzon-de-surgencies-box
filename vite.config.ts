import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', ''); // Existing environment variable loading

    return {
      // Existing 'define' block for environment variables
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },

      // Existing 'resolve' block for aliases
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },

      // New 'server' block for proxy configuration
      server: {
        proxy: {
          // Proxy requests from /api to the backend server running on port 3001
          '/api': {
            target: 'http://localhost:3001', // Your backend server address
            changeOrigin: true, // Recommended, especially for virtual hosted sites
            // secure: false, // Set to false if your backend is HTTP
            // rewrite: (path) => path.replace(/^\/api/, '') // Optional: if your backend doesn't expect /api prefix
            // In our case, the backend routes ARE prefixed with /api, so the default behavior of appending the path is fine.
            // For example, frontend /api/suggestions/public -> backend http://localhost:3001/api/suggestions/public
          }
        }
      }
    };
});
