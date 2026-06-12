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

export default defineConfig({
  plugins: [
    tailwindcss(),
    inlineCssPlugin(),
  ],
})
