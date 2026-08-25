import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const projectRoot = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteSingleFile(),
    {
      name: 'copy-offline-entry',
      closeBundle() {
        copyFileSync(
          resolve(projectRoot, 'dist/index.html'),
          resolve(projectRoot, '概率论学习系统.html'),
        )
      },
    },
  ],
})
