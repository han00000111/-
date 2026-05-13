# 工业智能体数据平台 · 现场执行端

Vite + React 前端，部署到 GitHub Pages。

## 部署

推送到 `main` 后，GitHub Actions 会执行：

1. `npm install`
2. `npm run build`
3. 将 `dist` 目录发布到 GitHub Pages

GitHub Pages 的 Source 应设置为 GitHub Actions，不直接发布 `main` 分支源码。

## 检查链接

- 线上首页：https://han00000111.github.io/-/
- 健康检查：https://han00000111.github.io/-/health.json
- 静态快照：https://han00000111.github.io/-/snapshot.html
