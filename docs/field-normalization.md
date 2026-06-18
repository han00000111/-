# 字段标准化说明（field normalization）

## 1. 为什么需要字段标准化

mock 数据与未来后端接口在字段命名上存在多套写法（如设备 `online` vs `onlineStatus`、报警 `name` vs `title`、时间 `time`/`updateTime`/`updatedAt`），
若让页面到处 `a || b || c` 兼容，维护成本高、易出错。统一在**服务层**做字段收敛，页面只面向一套标准字段。

## 2. 标准字段命名规则

- 主键统一 `id`
- 展示名称统一 `name`
- 类型统一 `type`
- 状态按语义细分（不要都叫 `status`）：如设备 `onlineStatus`/`runStatus`、指令 `sendStatus`/`ackStatus`
- 时间统一 `createdAt` / `updatedAt`（页面展示时间由 format 工具处理）
- 各模型标准字段清单见 `docs/data-models.md`「字段标准化（本轮收敛）」

## 3. 为什么不直接大改 mockData 原始字段

`src/mockData.js` 的字段已被大量页面与 `AppRuntime` 派生函数直接使用。本轮**不重命名 mockData**，避免大面积连锁修改与回归风险。
改为在服务层加适配器映射，原始字段保持不变。

## 4. services/adapters 的职责

- 位置：`src/services/adapters/*`，纯函数、无 React。
- 每个 `normalizeXxx(raw)`：`{ ...raw, 标准字段 }` —— **保留全部原始字段**，仅补充标准字段，绝不删除/改写已有字段。
- 因此：旧字段照常可用（页面不坏），标准字段同时可用（新代码可用）。
- 列表辅助：`normalizeDevices` / `normalizeTasks` / `normalizeAlarms` / ... 对数组逐项 normalize。

## 5. 页面层未来应使用标准字段

- 现状：页面继续读取既有字段（适配器已保留），**本轮不强行改写页面字段读取**，避免造成空白或视觉变化。
- 新页面 / 新接入：优先读取标准字段（如 `device.id`、`alarm.title`、`task.currentStepIndex`）。
- 迁移时若担心旧数据：可临时 `const id = x.id ?? x.deviceId ?? x.code;`，但推荐统一交给适配器，页面只用 `x.id`。

## 6. 后端接入时如何映射

适配器是“接口字段 → 标准字段”的唯一落点：

- 真实接口返回后，`fetchXxx` 已用 `normalizeXxx` 包裹（mock 与 real 两个分支都经过 normalize）。
- 后端若用不同命名，只需在对应 `normalizeXxx` 增补 `?? raw.后端字段名`，页面与 runtime 不动。
- 示例：后端设备在线字段叫 `connState` → 在 `normalizeDevice` 里 `onlineStatus: raw.onlineStatus ?? raw.online ?? raw.connState ?? raw.status`。

## 7. 当前已标准化的模型

Device、Task、Alarm、Interlock、Command、VisionResult、LogRecord（已接入对应 service 的 list / by-id / fetch）。
MapInfo / MapPoint / Route / Arm / TeachingPoint 适配器已提供，按需接入 mapService / armService。

## 8. 当前仍保留的兼容字段（不会删除）

- Device：`online`、`runStatus`、`alarmCount`、`updatedAt`、`type`、`id`（原样保留，新增 `onlineStatus`/`name`/`location`/`battery`/`currentTaskId`）。
- Task：`step`、`currentStep`、`devices`、`status`、`processStatus`、`targetDevice`、`startedAt`（新增 `currentStepIndex`/`totalSteps`/`relatedDevices`/`commandStatus`/`ackStatus`/`name`）。
- Alarm：`name`、`device`、`type`、`level`、`status`、`time`、`jumpTarget`（新增 `title`/`deviceId`/`source`/`taskId`/`message`/`suggestion`/`createdAt`）。
- Command：`content`、`status`、`result`、`deviceId`、`time`、`params`（新增 `command`/`targetId`/`sendStatus`/`ackStatus`/`createdAt`）。
- VisionResult：`screenshot`、`visionTaskId`、`processStatus`、`object`、`relatedTask`（新增 `snapshotUrl`/`taskId`/`createdAt`）。
- LogRecord：`logType`、`content`、`objectType`、`objectId`、`time`（新增 `type`/`message`/`source`/`target`/`createdAt`）。

## 9. 可选校验

`src/utils/schemaCheck.js` 提供 `checkRequiredFields` / `checkListFields` / `warnMissingFields`，仅开发环境 `console.warn` 缺失标准字段，不抛异常、不影响生产。
当前在 `normalizeDevice` 中按 `import.meta.env.DEV` 可选调用，未铺到所有页面。
