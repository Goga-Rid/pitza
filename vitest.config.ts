import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['./tests/unit/**/*.{test,spec}.{ts,tsx}'],
    
    // Окружение
    environment: 'jsdom',
    
    // Доступ к глобальным переменным без import { test, expect... }
    globals: false,
  },
})