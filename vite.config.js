import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

function inlineCssPlugin() {
  return {
    name: 'inline-css',
    enforce: 'post',
    generateBundle(options, bundle) {
      const cssAsset = Object.keys(bundle).find(key => key.endsWith('.css'));
      if (!cssAsset) return;
      const cssContent = bundle[cssAsset].source;

      for (const key of Object.keys(bundle)) {
        if (key.endsWith('.html')) {
          const htmlChunk = bundle[key];
          htmlChunk.source = htmlChunk.source.replace(
            new RegExp(`<link[^>]+href="[^"]*${cssAsset.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}"[^>]*>`),
            `<style>${cssContent}</style>`
          );
        }
      }
      delete bundle[cssAsset];
    }
  };
}

import { resolve } from 'path';

export default defineConfig({
  base: '/loswiss/',
  plugins: [
    tailwindcss(),
    inlineCssPlugin(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        contact: resolve(__dirname, 'contact.html'),
        accessibility: resolve(__dirname, 'accessibility.html'),
        fraud: resolve(__dirname, 'fraud.html'),
        legal: resolve(__dirname, 'legal.html'),
        privacy: resolve(__dirname, 'privacy.html')
      }
    }
  }
})
