import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    env: {
      DATABASE_URL: 'postgresql://admin_zombieland:zombieland@localhost:5434/zombieland_test',
      JWT_SECRET: 'test-secret-jwt',
    },
  },
});
