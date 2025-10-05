import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // Split FontAwesome into separate chunk (this is likely your biggest culprit)
          'vendor-fontawesome': [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/react-fontawesome'
          ],
          
          // Split jsPDF separately (another large library)
          'vendor-jspdf': ['jspdf'],
          
          // Split react-icons separately
          'vendor-icons': ['react-icons'],
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  }
})