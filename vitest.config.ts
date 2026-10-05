import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    env: loadEnv('test', process.cwd(), ''),
    // Integration tests on a shared database: we forbid parallel execution of files
    // (otherwise their cleanups/inserts collide).
    fileParallelism: false,
    // Clean the database before each test file.
    setupFiles: ['./src/test/db-reset.ts'],
  },
});
