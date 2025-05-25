import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host:true,
      proxy: {
          '/api': {
              target: 'https://lexiconapi.onrender.com',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
              configure: (proxy, _options) => {
                  proxy.on('error', (err, _req, _res) => {
                      console.log('Proxy error:', err);
                  });
              }
          },
          '/countries-api': {
              target: 'https://restcountries.com/v3.1/',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/countries-api/, ''),
              configure: (proxy, _options) => {
                  proxy.on('error', (err, _req, _res) => {
                      console.log('Proxy error:', err);
                  });
              }
          }
      },
  }
})