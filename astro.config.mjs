import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  output: 'server',  // Change this to 'server' for SSR
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    define: {
      'import.meta.env.TURSO_DATABASE_URL': JSON.stringify(process.env.TURSO_DATABASE_URL),
      'import.meta.env.TURSO_AUTH_TOKEN': JSON.stringify(process.env.TURSO_AUTH_TOKEN),
    },
  },
});
