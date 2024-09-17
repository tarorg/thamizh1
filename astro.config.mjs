import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import dotenv from 'dotenv';

import cloudflare from '@astrojs/cloudflare';

// Load environment variables
dotenv.config();

export default defineConfig({
  output: 'server',  // Change this to 'server' for SSR
  adapter: cloudflare(),
  vite: {
    define: {
      'import.meta.env.TURSO_DATABASE_URL': JSON.stringify(process.env.TURSO_DATABASE_URL),
      'import.meta.env.TURSO_AUTH_TOKEN': JSON.stringify(process.env.TURSO_AUTH_TOKEN),
    },
  },
});