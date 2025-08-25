/*
 * @Description:
 * @Author: zby
 * @Date: 2023-10-16 16:28:19
 * @LastEditors: zby
 * @Reference:
 */
import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwind from '@tailwindcss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

const alias = {
  '@': resolve('src/renderer/src'),
};

export default defineConfig({
  main: {
    resolve: {
      alias: alias,
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    resolve: {
      alias: alias,
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    server: {
      proxy: {
        '/api': {
          // target: 'http://192.168.106.109:6500', // 要代理的域名
          // target: 'http://192.168.106.109:5001', // 要代理的域名
          // target: 'http://192.168.106.115:6001', // 要代理的域名
          target: 'http://127.0.0.1:4000', // 要代理的域名
          changeOrigin: true, //允许跨域
          // rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: alias,
    },
    plugins: [
      vue(),
      // Tailwind CSS v4 plugin to enable @import "tailwindcss" in CSS
      tailwind(),
      AutoImport({
        imports: ['vue'],
        resolvers: [ElementPlusResolver()],
        dts: resolve('src/renderer/typings/auto-imports.d.ts'),
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: resolve('src/renderer/typings/components.d.ts'),
      }),
      visualizer({
        filename: 'test.html', //分析图生成的文件名
      }),
    ],
    // Remove SCSS preprocessor options since we no longer use Sass
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            // 'vxe-table': ['vxe-table'],
          },
        },
      },
    },
  },
});
