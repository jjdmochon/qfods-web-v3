import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

/**
 * Ruta base de la aplicación.
 *
 * En local se sirve desde la raíz («/»), pero en GitHub Pages el sitio cuelga
 * de una subcarpeta con el nombre del repositorio. Si la base no lo refleja,
 * el HTML pide sus recursos a la raíz del dominio, Pages devuelve 404 y la
 * página sale en blanco sin ningún error visible.
 *
 * Se define con la variable PAGES_BASE al compilar (ver dev.ps1 -Pages).
 */
const base = process.env.PAGES_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
  css: {
    postcss: {
      plugins: []
    }
  },
  server: {
    port: 3001,
    open: true,
    watch: {
      usePolling: true,
      interval: 800
    }
  }
});
