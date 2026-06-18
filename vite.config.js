import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 两套构建模式：
//   demo       -> 单文件 HTML（vite-plugin-singlefile），适合现场拷贝 / 离线演示
//   production -> 常规 Vite 分包（assets 目录 + 代码分割），适合部署到 nginx / 静态服务器
export default defineConfig(({ mode }) => {
  const isDemo = mode === 'demo';

  return {
    base: './',
    plugins: [react(), ...(isDemo ? [viteSingleFile()] : [])],
    build: {
      outDir: isDemo ? 'dist-demo' : 'dist',
      emptyOutDir: true,
      sourcemap: false,
      // demo：全部内联进单个 HTML；production：超过 4KB 的资源走独立文件，利于缓存
      assetsInlineLimit: isDemo ? 100000000 : 4096,
      cssCodeSplit: !isDemo,
      rollupOptions: isDemo
        ? {}
        : {
            output: {
              manualChunks: {
                vendor: ['react', 'react-dom'],
              },
            },
          },
    },
  };
});
