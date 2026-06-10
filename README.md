# Robot Integrated Management Platform

机器人综合管理平台。Vite + React 前端，当前为前端 mock 演示版本。

## 部署

推送到 `main` 后，GitHub Actions 会执行：

1. `npm install`
2. `npm run build`
3. 将 `dist` 目录发布到 GitHub Pages

GitHub Pages 的 Source 应设置为 GitHub Actions，不直接发布 `main` 分支源码。

## 检查链接

- 线上首页：https://han00000111.github.io/robot-integrated-management-platform/
- 健康检查：https://han00000111.github.io/robot-integrated-management-platform/health.json
- 静态快照：https://han00000111.github.io/robot-integrated-management-platform/snapshot.html

## 本地开发稳定启动

### 开发时固定本地地址

双击：

`start-local-dev.bat`

访问：

http://127.0.0.1:5173/robot-integrated-management-platform/

保存代码后，页面会自动热更新，不需要提交到远程。

### 设置开机自动启动

双击：

`install-dev-autostart.bat`

设置后，Windows 登录后会自动启动本地开发服务。

### 取消开机自动启动

双击：

`uninstall-dev-autostart.bat`

### 局域网访问

如需其他设备访问，双击：

`start-local-lan-dev.bat`

然后用同一局域网设备访问：

http://本机IP:5173/robot-integrated-management-platform/

### 注意

不要直接双击 `dist/index.html` 作为开发方式。
开发时不要用 `serve dist`。
开发时应使用 Vite dev server，这样修改源码后页面才能实时更新。

## 本地双击打开方式

仅用于查看已构建的静态产物，不适合开发调试。

- 先执行 `npm run build`
- 打开 `dist` 文件夹
- 双击 `dist/index.html`
