import { defineConfig } from 'vitest/config'
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'
import { resolve } from 'path'

export default defineWorkersConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    pool: '@cloudflare/vitest-pool-workers',

    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
      },
      isolatedStorage: false,
      modules: true
    },
  },
})
