# Robot Integrated Management Platform

机器人综合管理平台。Vite + React 前端，当前为前端 mock 演示版本。

## 构建与部署

提供两套构建模式，区分「正式部署」与「内网/离线演示」。

### 开发运行

```bash
npm install
npm run dev
```

### 正式构建（推荐用于部署）

```bash
npm run build:prod
```

- 输出目录：`dist`
- 使用 Vite 默认分包，`index.html` + `assets/`（JS / CSS 独立文件，含 `vendor` chunk）
- 适合部署到 nginx / 静态服务器，可有效利用浏览器缓存
- mock runtime 默认**关闭**（数据不再实时跳动），页面仍使用 services 静态数据
- `npm run build` 等价于 `npm run build:prod`

### 演示构建（现场拷贝 / 离线单文件）

```bash
npm run build:demo
```

- 输出目录：`dist-demo`
- 使用 `vite-plugin-singlefile`，JS / CSS 全部内联进单个 `index.html`
- 适合拷贝单文件到现场、离线演示、直接双击打开
- mock runtime 默认**开启**（数据实时演示）

### 预览构建产物

```bash
npm run preview:prod   # 预览 dist
npm run preview:demo   # 预览 dist-demo
```

### mock runtime 开关

由环境变量 `VITE_ENABLE_MOCK_RUNTIME` 控制（见 `src/runtime/runtimeConfig.js`）：

- `.env.demo`：`VITE_ENABLE_MOCK_RUNTIME=true`（演示模式实时跳动）
- `.env.production`：`VITE_ENABLE_MOCK_RUNTIME=false`（正式模式静态数据）
- 未设置时默认开启；如需正式构建也保留动态演示，把 `.env.production` 改为 `true` 即可
- 当前尚未接入真实后端，故两套模式 `VITE_USE_MOCK_SERVICE` 均为 `true`

### 依赖注意

`vite-plugin-singlefile` 与 `vite` 存在 peer 依赖关系，升级时需保证 `vite` 版本满足该插件要求（当前 vite `^5.4.21`）。

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

- 离线单文件双击：先执行 `npm run build:demo`，再双击 `dist-demo/index.html`（推荐，单文件无外部依赖）
- 正式产物 `dist`（`npm run build:prod`）使用 ES module 分包，需通过 HTTP 服务访问（如 `npm run preview:prod`），直接 `file://` 双击可能无法加载脚本
