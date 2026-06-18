# 遗留问题

## 高优先级

### 真实后端尚未完整接入

- `.env.production` 当前仍设置 `VITE_USE_MOCK_SERVICE=true`。
- 系统状态、设备、任务和报警查询已有真实 API 切换骨架，但其他业务域的查询接口尚未全部异步化。
- 影响：当前 production 构建可部署和演示，但不能视为已完成真实生产数据对接。

## 中优先级

### 机器人监控尚未统一使用 WS runtime

- `RobotMonitorPage` 仍使用 `useMockRuntime`，其他主要实时页面已逐步使用 `useRuntime`。
- 影响：切换到 `VITE_RUNTIME_SOURCE=ws` 后，机器人监控不能完整消费统一 WS store 的实时增量。

### WS 消息契约尚未经过真实服务联调

- 当前已有连接、有限重连、消息标准化和失败降级代码，但仓库中没有可用的真实 WS 服务。
- 影响：连接成功后的消息类型、字段映射和时序仍需在后端环境中联调确认。

## 低优先级

### ESLint 仍有历史 warning

- 当前 `npm run lint` 结果为 0 error、3542 warnings。
- 主要来源是历史聚合文件的未使用导入/导出、部分 JSX key 和 Hook 依赖提示。
- 影响：不阻断构建；本次按交付范围不做全量 warning 清理。

### `AppRuntime.jsx` 仍承担较多公共实现

- 部分页、公共组件和工具文件仍通过薄包装层从 `AppRuntime.jsx` 复用导出。
- 影响：不影响当前构建和运行，但后续维护时模块边界不够清晰。本次交付不做大重构，也不删除这些可能仍被引用的兼容文件。

### 当前没有自动化视觉回归

- `1366×768`、`1024×768` 和各业务页面仍需按 `delivery-checklist.md` 人工验收。
- 影响：构建通过不能替代分辨率、弹窗遮挡和交互闭环检查。

### 构建存在 Vite CJS Node API 弃用提示

- `build:prod` 和 `build:demo` 均可成功，但 Vite 输出 CJS Node API deprecated 提示。
- 影响：当前不阻断交付；后续升级 Vite 或单文件插件时需验证配置加载方式。
