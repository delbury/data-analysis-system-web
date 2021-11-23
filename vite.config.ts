import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
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
      '/@': path.resolve(__dirname, 'src'),
      '/@/types': path.resolve(__dirname, 'types'),
    },
  },
  server: {
    host: 'localhost',
    port: 3000,
    strictPort: false,
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
  build: {
    sourcemap: false,
  },
});
