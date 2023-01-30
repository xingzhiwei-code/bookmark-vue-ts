import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 路径处理模块
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // 定义路径别名
  alias: {
    '@': resolve(__dirname, 'src'),
    coms: resolve(__dirname, 'src/components'),
    assets: resolve(__dirname, 'src/assets'),
    styles: resolve(__dirname, 'src/styles'),
    base: resolve(__dirname, 'src/baseComponents'),
  },
  plugins: [vue()],
});
