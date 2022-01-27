import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    viteCompression(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "./src/assets/style/vars.scss" as *;', // 全局引入变量
      },
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '~types': path.resolve(__dirname, 'types'),
    },
  },
  server: {
    host: 'localhost',
    port: 3000,
    strictPort: true,
    open: false, // boolean | string
    hmr: true,
    proxy: {
      '^/api/.*': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  base: '/',
  build: {
    sourcemap: false,
    outDir: './output',
  },
});
