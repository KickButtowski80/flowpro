import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['utils/ai/__tests__/**/*.test.js'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', '.nuxt/', '.output/']
    }
  }
})
