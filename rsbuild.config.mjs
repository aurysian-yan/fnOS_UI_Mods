import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      popup: './src/popup/main.jsx'
    }
  },
  html: {
    template: './src/popup/index.html'
  },
  output: {
    distPath: {
      root: 'popup-dist'
    },
    copy: [
      {
        from: './public/popup-template.html',
        to: 'popup-template.html'
      }
    ]
  }
});
