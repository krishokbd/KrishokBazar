import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

// Auto-copy newly generated logo image to PWA assets during configuration resolution
try {
  const logoSrc = path.resolve(__dirname, 'src/assets/images/krishok_bazar_logo_1781620958517.jpg');
  if (fs.existsSync(logoSrc)) {
    const publicDir = path.resolve(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.copyFileSync(logoSrc, path.resolve(publicDir, 'icon-192.png'));
    fs.copyFileSync(logoSrc, path.resolve(publicDir, 'icon-512.png'));
    fs.copyFileSync(logoSrc, path.resolve(publicDir, 'favicon.ico'));
    console.log('App branding icons (192, 512, favicon) synchronized successfully!');
  }
} catch (error) {
  console.error('Error synchronizing branding icons:', error);
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
