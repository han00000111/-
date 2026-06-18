# API Client 使用说明

> 位置：`src/api/`。底层请求能力已就位；当前环境仍默认使用 mock service。系统状态、设备、任务、报警查询已具备真实 API 切换骨架，其他业务域按 `service-adapter-plan.md` 继续接入。

## 1. httpClient 的职责

`src/api/httpClient.js` 封装原生 `fetch`，统一处理：

- 自动拼接 `API_CONFIG.baseUrl`；
- 默认 `Content-Type: application/json`；
- 超时（`AbortController` + `API_CONFIG.timeout`），并尊重外部传入的 `signal`；
- query 参数对象拼接（跳过 null/undefined）；
- 非 2xx 抛 `ApiError`；
- JSON 解析失败时给出可读错误；
- 不引入 axios，不改现有 service 调用。

导出：`request(url, options)`、`get`、`post`、`put`、`del`。

## 2. API_CONFIG 环境变量（`src/api/apiConfig.js`）

| 变量 | 默认 | 说明 |
|---|---|---|
| `VITE_API_BASE_URL` | `''` | 真实后端基础地址；为空时配合 mock 使用 |
| `VITE_USE_MOCK_SERVICE` | `true`（仅 `'false'` 时关闭）| 是否使用 mock service |
| `VITE_REQUEST_TIMEOUT` | `10000` | 请求超时（毫秒）|

```js
export const API_CONFIG = {
  baseUrl: import.meta.env?.VITE_API_BASE_URL || '',
  useMockService: import.meta.env?.VITE_USE_MOCK_SERVICE !== 'false',
  timeout: Number(import.meta.env?.VITE_REQUEST_TIMEOUT || 10000),
};
```

- 默认仍使用 mock；没有真实地址不报错；production 也可继续 mock，不强制后端存在。

## 3. request / get / post / put / del 用法

```js
import { get, post, put, del, request } from '../api';

// GET + query
await get('/api/devices', { query: { page: 1, pageSize: 20 } });

// POST + body
await post('/api/tasks/TASK-001/pause', { reason: '人工接管' });

// PUT
await put('/api/settings/runtime', { tickMs: 3000 });

// DELETE
await del('/api/maps/M001/points/P001');

// 通用 request（可传 signal / headers / timeout）
const controller = new AbortController();
await request('/api/alarms', { method: 'GET', query: { level: '高危' }, signal: controller.signal, timeout: 8000 });
```

`options` 支持：`method`、`query`、`body`、`headers`、`signal`、`timeout`。

## 4. ApiError 格式（`src/api/apiError.js`）

```js
class ApiError extends Error {
  name = 'ApiError';
  status;   // HTTP 状态码（如 404 / 500）
  code;     // 后端业务码 或 'NETWORK_ERROR' / 'TIMEOUT_OR_ABORT' / 'INVALID_JSON'
  details;  // 原始错误体 / 文本片段
  url;      // 请求地址
}
```

- `normalizeApiError(error, context)`：把网络错误（`TypeError`）、超时/取消（`AbortError`）、其它异常统一成 `ApiError`。
- 页面不直接处理原生 fetch error，统一接 `ApiError`。

## 5. unwrapResponse 支持的响应格式（`src/api/responseAdapter.js`）

```js
import { unwrapResponse } from '../api';
```

兼容三类：

| 格式 | 示例 | 处理 |
|---|---|---|
| A | `{ "code": 0, "message": "ok", "data": {} }` | `code !== 0` 抛 `ApiError`，否则返回 `data` |
| B | `{ "success": true, "data": {}, "message": "ok" }` | `success === false` 抛 `ApiError`，否则返回 `data` |
| C | 直接数组 / 对象 | 原样返回（不破坏 mock 数据）|

## 6. 当前启用状态

- 项目当前无真实后端；`VITE_USE_MOCK_SERVICE` 在 `.env.demo` / `.env.production` 均为 `true`。
- 系统状态、设备、任务和报警已提供 `fetchXxx` 与 resource hook；关闭 mock service 后会请求真实接口。
- 指令、视觉、地图、机械臂和设置已具备部分操作类 REST 调用，但查询侧尚未全部切换为异步真实接口。
- 未完成的范围见 `service-adapter-plan.md` 和 `known-issues.md`。

## 7. 启用真实请求的最小改动示例

以 `deviceService` 为例（接入时）：

```js
import { API_CONFIG } from '../api';
import { get, unwrapResponse } from '../api';

export async function getDevices() {
  if (API_CONFIG.useMockService) return getMockDevices();      // 仍可回退 mock
  const res = await get('/api/devices', { query: { page: 1, pageSize: 20 } });
  return unwrapResponse(res);
}
```

配合：
1. `.env.production`：`VITE_USE_MOCK_SERVICE=false`、`VITE_API_BASE_URL=http://your-api-host`；
2. 页面用 `useResourceState(() => getDevices())` 接 loading/error（三态兜底已就位）；
3. 其余 service 逐域照此改造，顺序见 `service-adapter-plan.md`。

接入时按业务域逐项验证，不应仅修改环境变量后直接上线。
