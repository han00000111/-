# Services 接口适配计划

> 本文档说明真实后端接入时 `src/services/*` 与 `src/runtime/*` 的替换策略。
> 原则：**只换内部实现，不换对外签名**，页面层零改动。

## 1. 当前定位：services 是 mock 适配层

- `src/services/*` 当前同步、纯函数，从 `src/mockData.js` 读取并返回。
- `src/services/index.js` 是统一出口（barrel），并提供 `getLive*` 从 runtime 快照取实时值。
- `src/runtime/mockRuntimeStore.js` 调用 7 个 service 构建初始状态，按 `RUNTIME_CONFIG.tickMs` 定时生成新快照，模拟实时。
- 每个 service 顶部已有「mock 数据适配层 / 后续接入真实后端时只替换本文件内部实现」注释，作为接入锚点。

## 2. 接入时怎么改（关键约束）

1. **页面不应直接 `fetch`**：所有数据走 services / `useMockRuntime`，接入时只改 services 内部。
2. **页面不应直接 import `mockData`**：当前已通过 services / AppRuntime 间接获取，保持该边界。
3. **不改 service 函数签名**：例如 `getDevices()` 接入后仍叫 `getDevices()`。
   - 若改真实请求需异步，建议**新增** `getDevicesAsync()` / `fetchDevices()` 并行存在，逐步迁移；**本轮不动**现有同步签名（详见「异步迁移策略」）。
4. **runtime 从 mock 定时器逐步替换为 WebSocket store**：
   - 替换 `mockRuntimeStore` 的 `setInterval` tick 为 `/ws/runtime` 消息分发；
   - `useMockRuntime` 对外接口不变，页面无感知。
5. **loading / error / empty 已就位**：`createResourceState.js`（success/loading/error/empty 工厂）与 `useResourceState.js`（带 loading/error 的加载 Hook）已存在，异步接入时直接复用，页面兜底 UI 不必重写。

## 3. 异步迁移策略（避免破坏同步签名）

当前 services 同步返回，页面/AppRuntime 直接取值。真实接口是异步的，建议分两步、不一次性把同步改异步：

- **步骤 A（接入期）**：services 内部加一层内存缓存 + 后台刷新。
  - 首次返回缓存（或初始 mock），同时发起真实请求；请求回来后更新缓存并通过 runtime/WS 通知页面刷新。
  - 这样 `getX()` 仍同步可用，页面零改动。
- **步骤 B（成熟期）**：对确需 loading 态的页面，改用 `useResourceState(() => fetchX())`，享受 loading/error/empty 兜底。
- 二者可共存，按页面逐个迁移。**本轮只出文档，不改代码。**

## 4. 推荐接入顺序

> 依据：首页、设备、任务、报警是平台最核心的实时链路，先接。

### 第 1 阶段（P0，核心实时链路）
- `runtimeService`（系统/顶栏状态、机器人状态）→ `SYSTEM_STATUS_UPDATED`
- `deviceService`（设备列表/汇总/点位）→ `DEVICE_STATUS_UPDATED`
- `alarmService`（报警/互锁）→ `ALARM_CREATED` / `ALARM_UPDATED`
- `taskService`（任务队列/当前/步骤）→ `TASK_STEP_UPDATED` / `TASK_STATUS_UPDATED`
- 同步替换 `mockRuntimeStore` → WebSocket store（这四类的实时来源）。

### 第 2 阶段（P1）
- `commandService`（指令回执）→ `COMMAND_ACK_UPDATED`
- `logService`（日志/审计，分页）→ 可选 `LOG_CREATED`
- `visionService` 结果部分（识别结果）→ `VISION_RESULT_CREATED`

### 第 3 阶段（P2）
- `mapService`（地图/路线/建图，含 CRUD）→ `MAP_BUILDING_UPDATED`
- `armService`（机械臂读取 + 控制动作，控制类需安全评审/鉴权/审计）
- `settingsService`（链路配置、运行设置、测试连接）

## 5. runtime 替换示意（仅说明，不改代码）

```
现状：
  mockRuntimeStore: setInterval(tickMs) -> nextRuntimeState() -> listeners
接入后：
  realtimeStore: ws.onmessage(type,payload) -> reduce(state,msg) -> listeners
  useMockRuntime / getLive* 接口不变；RUNTIME_CONFIG.enableMockRuntime=false 时
  改由 WS 驱动（已支持 .env 开关，见 README「mock runtime 开关」）。
```

## 6. 每个 service 的接入落点速查

| service | 主要函数 | 阶段 | 通道 |
|---|---|---|---|
| runtimeService | getSystemStatus / getTopBarStatus / getRobotStatus / getTrendSeries | 1 | REST + WS |
| deviceService | getDevices / getDeviceSummary / getDevicePoints / getDeviceHistory | 1 | REST + WS |
| alarmService | getAlarms / getActiveAlarms / getInterlocks | 1 | REST + WS |
| taskService | getTasks / getCurrentTask / getTaskRecords / getStepsByTask | 1 | REST + WS |
| commandService | getCommands / getCommandRecords | 2 | REST + WS |
| logService | getLogs / getAuditLogs（分页）| 2 | REST(+WS 可选) |
| visionService | getVisionResults / getCameras / getVisionModels | 2 | REST + WS（结果）|
| mapService | getMaps / getMapPoints / getRoutes / getMappingTasks | 3 | REST(+WS 建图) |
| armService | getArms / getTeachingPoints / getArmTemplates / 控制动作 | 3 | REST(+WS 回执) |
| settingsService | getSettings / getSystemLinks / 测试连接 | 3 | REST |

## 7. 验收/回归提示（接入每个 service 后）

- 关闭 mock runtime（`.env.production`）后页面仍能展示静态/真实数据，不白屏。
- 列表 key 唯一（已用复合 key），后端补 `id` 后可切回 id key。
- loading/error/empty 三态：用 `useResourceState` + 现有兜底组件验证。
- `npm run lint` 0 error、`npm run build:prod` / `build:demo` 通过。

---

## 8. 从 mock service 切换到真实 API 的步骤

> 底层请求能力已就绪（`src/api/`：httpClient / apiConfig / apiError / responseAdapter）。
> 当前 `API_CONFIG.useMockService` 默认 `true`，原同步函数继续返回 mock；核心域已新增并行的 async fetch 函数。
> 切换时**逐个业务域**进行，页面层不动。

1. **配置环境变量**（`.env.production`）：
   ```
   VITE_USE_MOCK_SERVICE=false
   VITE_API_BASE_URL=http://your-api-host
   VITE_REQUEST_TIMEOUT=10000
   ```

2. **页面切换到对应 async fetch 函数**。原同步函数不删除，真实请求由 `fetchXxx` 调用 api client：
   ```js
   import { get } from '../api';
   export async function fetchDevices(params = {}) {
     if (API_CONFIG.useMockService) return getMockDevices();
     const data = await get('/api/devices', { query: params });
     return unwrapResponse(data); // 兼容 {code,data} / {success,data} / 直接数组
   }
   ```

3. **页面接收 loading/error**：用 `useResourceState(() => getDevices())` 或 `DataStateBlock` 包裹，三态兜底已就位，无需新写。

4. **接入顺序（与第 4 节一致）**：
   - 先：runtimeStatus、devices、tasks、alarms
   - 再：commands、vision、logs
   - 最后：maps、arms、settings

5. **runtime 实时**：把 `mockRuntimeStore` 的定时 tick 换成 `/ws/runtime` WebSocket 消息分发，`useMockRuntime` 接口不变（详见第 5 节）。

6. **回归**：每接一个域，验证页面 mock→real 切换无白屏、key 唯一、lint 0 error、`build:prod`/`build:demo` 通过。

---

## 9. 第一批已具备真实接口切换能力的模块

| 模块 | Service | Async fetch 函数 | 页面 Hook | Mock 模式 | Real API 模式 | 页面接入 |
|---|---|---|---|---|---|---|
| 系统状态 | `runtimeService.js` | `fetchSystemStatus`、`fetchTopBarStatus` | `useSystemStatusResource`、`useTopBarStatusResource` | 返回原 `getSystemStatus/getTopBarStatus` 数据；demo 顶栏优先使用 mock runtime | 请求 `GET /api/system/status`，失败时顶栏状态降级为“未知” | TopBar 已接入 |
| 设备总览 | `deviceService.js` | `fetchDevices`、`fetchDeviceSummary`、`fetchDeviceTypes`、`fetchActiveDeviceIssues`、`fetchDeviceDetail` | `useDevicesResource`、`useDeviceSummaryResource`、`useDeviceTypesResource`、`useActiveDeviceIssuesResource` | production mock 继续保留原设备派生统计和异常判定；demo 使用 runtime 动态设备 | 请求 `/api/devices`、`/summary`、`/types`、`/issues/active`、`/:id` | Overview、DeviceOverviewPage 已接入 |
| 任务管理 | `taskService.js` | `fetchTasks`、`fetchTaskSummary`、`fetchCurrentTask`、`fetchTaskRecords` | `useTasksResource`、`useTaskSummaryResource`、`useCurrentTaskResource`、`useTaskRecordsResource` | demo 使用 runtime 动态任务；production mock 返回原任务、当前任务和记录 | 请求 `/api/tasks`、`/summary`、`/current`、`/records` | Overview、TasksPage 已接入 |
| 报警互锁 | `alarmService.js` | `fetchAlarms`、`fetchActiveAlarms`、`fetchAlarmSummary`、`fetchInterlocks`、`fetchAlarmDetail` | `useAlarmsResource`、`useActiveAlarmsResource`、`useAlarmSummaryResource`、`useInterlocksResource` | demo 使用 runtime 动态报警；production mock 保留原互锁矩阵派生逻辑 | 请求 `/api/alarms`、`/active`、`/summary`、`/api/interlocks`、`/api/alarms/:id` | Overview、AlarmsPage 已接入 |

数据源优先级：

1. `VITE_ENABLE_MOCK_RUNTIME=true`：页面优先使用 mock runtime，保留演示动态。
2. `VITE_ENABLE_MOCK_RUNTIME=false` 且 `VITE_USE_MOCK_SERVICE=true`：resource hooks 调用 async fetch，但 service 返回静态 mock。
3. `VITE_ENABLE_MOCK_RUNTIME=false` 且 `VITE_USE_MOCK_SERVICE=false`：resource hooks 请求真实 API。
4. 真实 API 失败时错误继续抛给 `useResourceState`，由模块级 `DataStateBlock` 或 `DataTable` 显示 ErrorState 和重试按钮，不导致整页白屏。

---

## 10. 用户操作类接口接入骨架

页面按钮不直接调用 `fetch`，统一按以下链路执行：

```text
页面按钮
  -> utils/permission.js 权限判断
  -> useActionRequest 处理确认、loading、成功和失败
  -> services/*Service.js 执行业务操作
  -> mock 模式返回模拟成功 / real 模式调用 REST
```

- 操作统一通过 service 暴露的 async 函数执行，查询类同步函数保持不变。
- 页面通过 `useActionRequest` 阻止重复点击，并统一记录 `error`、`lastResult`。
- 操作权限通过 `utils/permission.js` 的 `ACTION_KEYS`、`canOperate` 判断；原角色权限层继续保留。
- 任务取消、报警恢复、指令取消、机械臂急停和复位属于高风险操作，需要权限判断和确认。
- mock 模式不改 `mockData` 原始结构，service 直接返回带 `success/message` 的模拟成功结果。
- real 模式使用 `httpClient` 调用 REST，网络、超时、HTTP 或业务错误统一转换为 `ApiError`。
- 页面使用 `ActionFeedback` 显示处理中、成功和失败，不在 service 内 `alert`。
- 详细操作与接口映射见 `docs/action-api-plan.md`。

---

## 11. WebSocket runtime 接入计划

实时通道骨架已就位（`src/runtime/`），但**当前无真实后端，默认不连 WebSocket**。

### runtimeSource 三种模式（`RUNTIME_CONFIG.runtimeSource`）

| 模式 | 数据来源 | 定时器 | WebSocket | 默认场景 |
|---|---|---|---|---|
| `mock` | 委托现有 `mockRuntimeStore`（演示动态）| 有 | 无 | **demo** 默认 |
| `static` | services 静态 mock 初始数据 | 无 | 无 | **production** 默认 |
| `ws` | 静态初始数据打底 + `/ws/runtime` 增量 | 无 | 有（启用且有 url 时）| 接真实实时通道 |

- demo 默认 `mock`，production 默认 `static`，二者都不连 WebSocket。
- 切到 `ws` 后续通过环境变量启用：
  ```
  VITE_RUNTIME_SOURCE=ws
  VITE_ENABLE_WS_RUNTIME=true
  VITE_WS_RUNTIME_URL=ws://后端地址/ws/runtime
  ```

### 数据流

```
/ws/runtime 消息(字符串/对象)
  -> normalizeRuntimeMessage  归一化为 { type, timestamp, payload }（解析失败/无 type 返回 null）
  -> applyRuntimeMessage(state, msg)  按 type 不可变更新（设备按 id、报警/识别前插、日志截断 maxLogs、未知 type 原样返回）
  -> runtimeStore  通知订阅者
  -> useRuntime(selector)  页面订阅
```

- **查询接口仍走 services / resource hooks**（REST，见第 8、9 节）。
- **实时增量走 WebSocket patch**，由 `runtimeMessageAdapter` 合并进 runtime state。
- 连接由 `wsRuntimeClient` 负责：url 为空不连接、连接失败不抛页面、有限次重连（`VITE_WS_RECONNECT_MAX`/`INTERVAL`）、`disconnect` 后不再重连、浏览器不支持 WebSocket 时降级，**任何情况都保留初始静态数据、不白屏**。

### 文件

| 文件 | 职责 |
|---|---|
| `src/runtime/runtimeConfig.js` | 读取 runtimeSource / ws 相关环境变量 |
| `src/runtime/runtimeMessageAdapter.js` | `normalizeRuntimeMessage` / `applyRuntimeMessage` |
| `src/runtime/wsRuntimeClient.js` | `createWsRuntimeClient`（连接/重连/回调，状态 idle/connecting/connected/reconnecting/closed/error）|
| `src/runtime/runtimeStore.js` | 统一 store：按 runtimeSource 选 mock/static/ws；`getRuntimeConnectionStatus` / `dispatchRuntimeMessage` |
| `src/runtime/useRuntime.js` | `useRuntime(selector)` / `useRuntimeConnectionStatus()`（基于 useSyncExternalStore）|

### 页面接入现状

- **TopBar**：已用 `useRuntimeConnectionStatus()` 增加「实时」状态徽标（connected→正常 / connecting→连接中 / reconnecting→重连中 / error→异常 / closed→关闭 / idle→未启用）。
- 其余页面**仍使用 `useMockRuntime`**（`mockRuntimeStore`），保持演示动态不变；后续可逐步迁移到 `useRuntime`，对外接口一致。
