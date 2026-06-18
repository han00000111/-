# 机器人综合管理平台

Vite + React 前端。当前交付版本默认使用本地 mock service；demo 模式提供动态 runtime，production 模式默认使用静态数据。

## 环境要求

- Node.js 22（见 `.nvmrc`、`.node-version` 和 `package.json#engines`）
- npm

首次运行：

```bash
npm install
```

## 启动方式

```bash
npm run dev
```

默认地址：`http://127.0.0.1:5173/`。局域网调试可运行 `npm run dev:lan`。

## 构建模式

### production 模式

```bash
npm run build:prod
```

- 输出目录：`dist`
- 使用常规 Vite 分包，适合 nginx、GitHub Pages 等静态服务器
- `.env.production` 默认 `runtimeSource=static`
- mock runtime 定时器和 WebSocket 默认关闭
- 当前尚无完整真实后端，因此 mock service 默认仍开启
- `npm run build` 等价于 `npm run build:prod`

### demo 模式

```bash
npm run build:demo
```

- 输出目录：`dist-demo`
- JS/CSS 内联到单个 HTML，适合离线演示
- `.env.demo` 默认 `runtimeSource=mock`
- mock runtime 默认开启，页面数据会按定时器动态变化
- 构建后可直接打开 `dist-demo/index.html`

### 预览与检查

```bash
npm run preview:prod   # 预览 dist
npm run preview:demo   # 预览 dist-demo
npm run lint           # ESLint 检查
npm run format         # 仅格式化 src 下 JS/JSX/CSS
npm run check          # lint + production 构建 + demo 构建
```

## runtime 与 mock 开关

| 变量 | 作用 | demo 默认 | production 默认 |
|---|---|---|---|
| `VITE_ENABLE_MOCK_RUNTIME` | 是否启动旧 mock runtime 定时器 | `true` | `false` |
| `VITE_RUNTIME_SOURCE` | 统一 runtime 数据源：`mock` / `static` / `ws` | `mock` | `static` |
| `VITE_USE_MOCK_SERVICE` | services 是否返回本地 mock 数据 | `true` | `true` |
| `VITE_API_BASE_URL` | 真实 REST API 基础地址 | 空 | 空 |
| `VITE_ENABLE_WS_RUNTIME` | 是否允许建立 WS runtime 连接 | `false` | `false` |
| `VITE_WS_RUNTIME_URL` | WS runtime 地址 | 空 | 空 |

`VITE_RUNTIME_SOURCE=ws` 时，还必须设置：

```dotenv
VITE_ENABLE_MOCK_RUNTIME=false
VITE_RUNTIME_SOURCE=ws
VITE_ENABLE_WS_RUNTIME=true
VITE_WS_RUNTIME_URL=ws://后端地址/ws/runtime
```

WS 连接失败会保留静态初始数据并有限次重连，不会导致整页白屏。当前 WS 接入范围见 `docs/known-issues.md`。

## API 接入

当前页面通过 `src/services/` 访问数据，HTTP 基础能力位于 `src/api/`。接入真实后端时：

1. 在 `.env.production` 设置 `VITE_USE_MOCK_SERVICE=false`。
2. 填写 `VITE_API_BASE_URL` 和请求超时。
3. 按业务域完成 service 的异步接口适配。
4. 按 `docs/api-contract.md`、`docs/api-client.md` 和 `docs/service-adapter-plan.md` 验证字段、错误态及加载态。
5. 实时增量按 `/ws/runtime` 契约接入。

目前系统状态、设备、任务和报警查询已具备真实 API 切换骨架；其他业务域仍需继续接入，不能仅修改环境变量后视为完成生产对接。

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

## Windows 本地辅助脚本

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

## 常见问题

### 为什么不能直接双击 `dist/index.html`？

production 产物包含 ES module 和 `assets/`，应通过 `npm run preview:prod` 或静态服务器访问。需要离线双击时使用 `npm run build:demo` 生成的 `dist-demo/index.html`。

### production 为什么仍显示 mock 数据？

`.env.production` 当前设置 `VITE_USE_MOCK_SERVICE=true`，这是因为真实后端尚未完整接入。完成对应 service 适配并配置 API 地址后才能关闭。

### mock runtime 与 mock service 有什么区别？

mock service 决定查询和操作是否使用本地数据；mock runtime 决定演示数据是否按定时器动态变化。production 默认使用静态 mock service，不启动动态 runtime。

### WS 地址已配置但没有连接？

需要同时设置 `VITE_RUNTIME_SOURCE=ws`、`VITE_ENABLE_WS_RUNTIME=true` 和非空 `VITE_WS_RUNTIME_URL`。连接失败后页面保留静态数据，并在有限次数重连后显示异常状态。

### 构建出现 `spawn EPERM` 怎么处理？

这是 Windows 环境中常见的进程权限或安全软件限制。先关闭占用进程，或在具备权限的终端重新执行原构建命令；不要因此回退业务代码。

### 依赖升级后 demo 构建失败怎么办？

检查 `vite-plugin-singlefile` 与 Vite 的 peer dependency 是否兼容，再执行 `npm install` 和 `npm run build:demo`。

## 交付资料

- API 契约：`docs/api-contract.md`
- 数据模型：`docs/data-models.md`
- Service 接入计划：`docs/service-adapter-plan.md`
- API Client：`docs/api-client.md`
- 操作接口计划：`docs/action-api-plan.md`
- 字段标准化：`docs/field-normalization.md`
- 交付验收：`docs/delivery-checklist.md`
- 遗留问题：`docs/known-issues.md`
