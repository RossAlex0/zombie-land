import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    env: loadEnv('mode', process.cwd(), ''),
  },
});
