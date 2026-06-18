# API 契约草案

> 本文档为**真实后端接入前的准备资料**，不代表已实现的接口。
> 当前前端通过 `src/services/*` 作为 mock 适配层读取 `src/mockData.js`，实时数据由 `src/runtime/mockRuntimeStore.js` 模拟。
> 接入真实后端时，只替换 services 内部实现与 runtime store 的数据源，页面层、字段名、调用方式保持不变。

## 架构现状（数据流）

```
页面 (pages/*.jsx)
  └─ AppRuntime.jsx  ── import * as Services from './services'   (静态读取)
  └─ useMockRuntime  ── runtime/mockRuntimeStore.js              (实时快照)
                          └─ 调用 7 个 service: devices/tasks/alarms/commands/vision/logs/runtime
src/services/*        ── 当前从 mockData.js 读取（同步、纯函数）
src/mockData.js       ── 全量 mock 数据
```

- 页面**不直接** `fetch`，也**不直接** import `mockData`，统一走 services / `useMockRuntime`。
- `services/index.js` 额外提供 `getLiveDevices / getLiveTasks / getLiveAlarms / getLiveCommands / getLiveVisionResults / getLiveLogs / getLiveSystemStatus`，从 runtime 快照取实时值。

## 约定

- 基础路径：`/api`
- 实时通道：`/ws/runtime`（详见末章「实时消息通道」）
- 时间字段当前 mock 多为 `HH:mm:ss` 或 `YYYY-MM-DD HH:mm`，接入时统一为 ISO 8601（`updatedAt` / `createdAt`）。
- 列表类接口建议统一分页响应包：
  ```json
  { "items": [], "total": 0, "page": 1, "pageSize": 20 }
  ```
- 接入优先级：P0（核心实时链路）> P1 > P2，详见每节与 `service-adapter-plan.md`。

---

## 1. 系统状态

- **页面使用场景**：顶部状态栏（TopBar：工位/公共机/后台/MQTT/日志上传/缓存）、机器人监控页状态卡、总览页 KPI。
- **当前 service 函数**：`runtimeService.getSystemStatus / getTopBarStatus / getNavItems / getRobots / getRobotStatus / getTrendSeries / getMockNow`；`index.getLiveSystemStatus`。
- **建议 REST 接口**：
  - `GET /api/system/status` — 顶部链路状态 + 当前时间
  - `GET /api/system/nav` — 导航项（一般可由前端常量保留，见下）
  - `GET /api/robots` / `GET /api/robots/:id/status` — 机器人/底盘状态
  - `GET /api/trends?metric=&deviceId=&range=` — 趋势序列
- **请求参数**：趋势接口 `metric`、`deviceId`、`range`（如 `5m/15m/30m/1h`）。
- **响应字段**：`backend/mqtt/logUpload/cache/now`；robotStatus：`chargeStatus/motorStatus/odomStatus/obstacleStatus/navStatus/mappingStatus`。
- **分页**：否。**轮询**：可（10–30s 兜底）。**WebSocket/MQTT**：是 → `SYSTEM_STATUS_UPDATED`。
- **字段映射**：mock `getTopBarStatus()` 的 `backend/mqtt/logUpload/cache` → 后端 `links.backend.status` 等；`getMockNow()` → 后端 `serverTime`。
- **接入优先级**：**P0**。

> 备注：`navItems` 属前端导航结构，建议保留为前端常量，不必走后端。

## 2. 设备与点位

- **页面使用场景**：总览「设备健康」、设备总览页、设备详情页、点位管理页、历史对比页。
- **当前 service 函数**：`deviceService.getDevices / getDeviceById / getDeviceSummary / getDeviceTypes / getDevicePoints / getDeviceHistory / getDevicePointMap / getTaskPointMap / getDeviceAttachments`；`index.getLiveDevices`。
- **建议 REST 接口**：
  - `GET /api/devices`（支持 `?type=&online=&runStatus=&keyword=&page=&pageSize=`）
  - `GET /api/devices/:id`
  - `GET /api/devices/summary`
  - `GET /api/devices/types`
  - `GET /api/devices/:id/points`
  - `GET /api/devices/:id/history?range=&pointCode=`
  - `GET /api/devices/:id/attachments`
- **请求参数**：筛选（type/online/runStatus/keyword）、分页、历史区间。
- **响应字段**：device：`id/type/online/runStatus/alarmCount/updatedAt`（详见 data-models）；point：`device/name/code/pointType/value/status/quality/updatedAt`。
- **分页**：设备明细**是**；点位按设备分组返回。**轮询**：可。**WebSocket/MQTT**：是 → `DEVICE_STATUS_UPDATED`（在线状态/报警数/点位值实时变化）。
- **字段映射**：mock `device.online`（`在线/离线`字符串）→ 后端建议 `onlineStatus`（枚举）；`alarmCount` 直通；历史 `trendSeries` → `GET history` 的 `series`。
- **接入优先级**：**P0**（设备列表/汇总/实时状态），点位历史 P1。

## 3. 任务管理

- **页面使用场景**：总览「当前任务/任务队列」、任务管理页（队列/详情/记录/人工接管）。
- **当前 service 函数**：`taskService.getTasks / getTaskById / getTaskQueue / getCurrentTask / getTaskRecords / getStepLogs / getStepsByTask / getTaskAttachments / getTaskPoints`；`index.getLiveTasks`。
- **建议 REST 接口**：
  - `GET /api/tasks`（`?status=&taskType=&keyword=&page=&pageSize=`）
  - `GET /api/tasks/current`
  - `GET /api/tasks/:id`
  - `GET /api/tasks/:id/steps`
  - `GET /api/tasks/:id/records`
  - `GET /api/tasks/:id/attachments`
  - `POST /api/tasks/:id/pause` / `POST /api/tasks/:id/resume` / `POST /api/tasks/:id/cancel`
- **请求参数**：筛选、分页；动作类无 body 或 `{ reason }`。
- **响应字段**：task：`id/orderNo/taskType/targetDevice/status/processStatus/step/currentStep/devices/alarmCount/command/startedAt/updatedAt/...`；step：`id/name/status`。
- **分页**：队列**是**。**轮询**：可。**WebSocket/MQTT**：是 → `TASK_STEP_UPDATED`、`TASK_STATUS_UPDATED`。
- **字段映射**：mock `step`（`"3/8"` 字符串）→ 后端建议 `currentStepIndex/totalSteps`，前端保留字符串展示；`processStatus` 直通。
- **接入优先级**：**P0**（列表/当前/状态实时），动作类 P0，记录 P1。

## 4. 指令回执

- **页面使用场景**：指令回执页（指令队列 + 详情 + 回执记录）；机器人/机械臂指令下发回执。
- **当前 service 函数**：`commandService.getCommands / getCommandById / getCommandRecords / getCommandSummary / getCommandLogs / getRobotCommandLogs`；`index.getLiveCommands`。
- **建议 REST 接口**：
  - `GET /api/commands`（`?status=&deviceId=&keyword=&page=&pageSize=`）
  - `GET /api/commands/:id`
  - `GET /api/commands/:id/records`
  - `POST /api/commands/:id/retry` / `POST /api/commands/:id/cancel`
- **请求参数**：筛选、分页。
- **响应字段**：command/log：`time/objectType/objectId/deviceId/taskId/logType/content/params/status/result`（详见 data-models）。
- **分页**：记录**是**。**轮询**：可（短，回执变化快）。**WebSocket/MQTT**：是 → `COMMAND_ACK_UPDATED`。
- **字段映射**：mock `status`（`已确认` 等）+ `result`（`已下发`）→ 后端建议 `ackStatus` + `sendResult`。
- **接入优先级**：**P1**。

## 5. 报警互锁

- **页面使用场景**：总览「需要关注」异常流、报警互锁页（卡片列表 + 处理工作台 + 互锁矩阵 + 处理记录）。
- **当前 service 函数**：`alarmService.getAlarms / getActiveAlarms / getAlarmById / getInterlocks / getAlarmSummary`；`index.getLiveAlarms`。
- **建议 REST 接口**：
  - `GET /api/alarms`（`?level=&status=&deviceId=&page=&pageSize=`）
  - `GET /api/alarms/active`
  - `GET /api/alarms/:id`
  - `POST /api/alarms/:id/ack`（确认/处理中）
  - `POST /api/alarms/:id/recover`（恢复）
  - `GET /api/interlocks`
- **请求参数**：筛选、分页；动作 `{ operator, remark }`。
- **响应字段**：alarm：`name/device/type/level/status/time/jumpTarget`（机器人/机械臂报警含 `robotId/armId/relatedTask`）；interlock：`name/device/status/time`。
- **分页**：列表**是**。**轮询**：可。**WebSocket/MQTT**：是 → `ALARM_CREATED`、`ALARM_UPDATED`。
- **字段映射**：mock alarm **无 `id`**，接入需后端补 `id`（前端渲染已用复合 key 兜底）；`level`（`高危/中危/低危`）→ 枚举 `severity`。
- **接入优先级**：**P0**。

## 6. 地图管理

- **页面使用场景**：地图总览、地图编辑（画布 + 编辑对象）、路线管理、自动建图。
- **当前 service 函数**：`mapService.getMaps / getCurrentMap / getMapPoints / getRoutes / getMappingTasks / getAutoMappingLogs / getMapAreas / getMapDoors / getMapNoGoAreas / getMapObstacles / getMapVirtualWalls / getMapWalls`。
- **建议 REST 接口**：
  - `GET /api/maps` / `GET /api/maps/:id`
  - `GET /api/maps/:id/points` / `POST` / `PUT /:pointId` / `DELETE /:pointId`
  - `GET /api/maps/:id/routes`
  - `GET /api/maps/:id/layers`（areas/doors/no-go/obstacles/walls/virtual-walls 合并返回）
  - `GET /api/mapping/tasks` / `GET /api/mapping/tasks/:id/logs`
  - 建图控制（演示态）：`POST /api/mapping/tasks/:id/start|pause|resume|stop|save`
- **请求参数**：地图 id；点位 CRUD body（`name/type/x/y/theta/areaId`）。
- **响应字段**：map：`mapId/mapName/isDefault/width/height/resolution/pointCount/routeCount/updatedAt`；mapPoint：`pointId/mapId/name/type/x/y/theta/areaId`；route：`routeId/routeName/mapId/pointSequence/mode/estimatedDuration/status`。
- **分页**：一般否（按地图聚合）。**轮询**：建图进度可短轮询。**WebSocket/MQTT**：建图进度 → `MAP_BUILDING_UPDATED`。
- **字段映射**：图层多 service 函数（areas/doors/...）→ 后端建议合并为 `GET /maps/:id/layers`，前端 service 再拆分保持现有函数签名。
- **接入优先级**：**P2**（编辑/CRUD），建图进度 P2。

## 7. 机械臂控制

- **页面使用场景**：机械臂总览、动作控制、姿态示教、末端工具、动作模板。
- **当前 service 函数**：`armService.getArms / getArmById / getTeachingPoints / getArmTemplates / getEndEffectors / getArmRecords / getArmActionLogs / getArmActionSteps / getArmCommandReceipts / getArmTemplateLogs / getTeachingPointLogs`。
- **建议 REST 接口**：
  - `GET /api/arms` / `GET /api/arms/:id`
  - `GET /api/arms/teaching-points` / `GET /api/arms/templates` / `GET /api/arms/end-effectors`
  - `GET /api/arms/:id/records`
  - `POST /api/arms/:id/actions`（执行动作/模板）
  - `POST /api/arms/:id/emergency-stop` / `POST /api/arms/:id/reset` / `POST /api/arms/:id/release`
- **请求参数**：动作 `{ templateId | actionCode, params }`。
- **响应字段**：arm：`armId/name/type/onlineStatus/online/runStatus/controlMode/currentTask/currentAction/toolId/toolStatus`；teachingPoint：`pointId/pointName/pointType/armId/relatedDevice/relatedMapPoint/relatedTaskStep/jointAngles/...`。
- **分页**：记录**是**。**轮询**：动作状态可短轮询。**WebSocket/MQTT**：动作/回执 → 复用 `COMMAND_ACK_UPDATED` 或扩展 `ARM_ACTION_UPDATED`。
- **字段映射**：高风险动作（急停/复位/释放）需后端鉴权 + 审计；`onlineStatus` 与 `online` 并存，接入统一为 `onlineStatus`。
- **接入优先级**：**P2**（读取 P2，控制动作需安全评审后接入）。

## 8. 视觉识别

- **页面使用场景**：视觉总览（相机/任务列表 + 画面 + 详情 + 最近识别记录）、相机配置、识别任务、识别结果、模型管理。
- **当前 service 函数**：`visionService.getCameras / getVisionTasks / getVisionResults / getCurrentVisionResult / getVisionModels / getVisionLogs`；`index.getLiveVisionResults`。
- **建议 REST 接口**：
  - `GET /api/vision/cameras`
  - `GET /api/vision/tasks`
  - `GET /api/vision/results`（`?cameraId=&taskId=&result=&page=&pageSize=`） / `GET /api/vision/results/:id`
  - `GET /api/vision/models`
  - `POST /api/vision/tasks/:id/retry`（重新识别 / 触发）
- **请求参数**：筛选、分页。
- **响应字段**：camera：`cameraId/cameraName/position/relatedDevice/ip/resolution/fps/exposure/light/online/updatedAt`；result：`time/cameraId/visionTaskId/object/result/confidence/duration/relatedTask/relatedDevice/screenshot/processStatus`。
- **分页**：结果**是**。**轮询**：可。**WebSocket/MQTT**：是 → `VISION_RESULT_CREATED`。
- **字段映射**：mock result **无唯一 id**，用 `screenshot` 作 key 会重复，接入需后端补 `resultId`（前端渲染已用复合 key 兜底）。
- **接入优先级**：**P1**（识别结果实时），相机/模型 P2。

## 9. 日志审计

- **页面使用场景**：日志审计页、总览「最近动态」、报警处理记录、设备采集日志。
- **当前 service 函数**：`logService.getLogs / getAuditLogs / getRecentLogs / getCommandLogs / getStepLogs / getTelemetryLogs / getVisionLogs`；`index.getLiveLogs`。
- **建议 REST 接口**：
  - `GET /api/logs`（`?logType=&keyword=&deviceId=&taskId=&from=&to=&page=&pageSize=`）
  - `GET /api/audit-logs`
  - `GET /api/logs/export`（返回文件流 / 导出任务 id）
- **请求参数**：类型/关键字/对象/时间范围、分页。
- **响应字段**：log：`time/objectType/objectId/deviceId/taskId/logType/content/params/status/operator`。
- **分页**：**是**（强烈建议）。**轮询**：可。**WebSocket/MQTT**：可选 → `LOG_CREATED`（实时追加）。
- **字段映射**：当前 `getLogs()` 在前端合并 audit/command/step/telemetry/vision 五类 → 后端建议统一日志表 + `logType` 过滤，前端 service 保留合并/分类函数。
- **接入优先级**：**P1**。

## 10. 系统设置

- **页面使用场景**：系统设置页（基础信息、账号权限、链路配置卡片、本地运行状态）。
- **当前 service 函数**：`settingsService.getSettings / getRuntimeSettings / getAccountPermissions / getSystemLinks`。
- **建议 REST 接口**：
  - `GET /api/settings/runtime` / `PUT /api/settings/runtime`
  - `GET /api/settings/links` / `POST /api/settings/links/:id/test`（测试连接：检测中→成功/失败）
  - `GET /api/account/permissions`
- **请求参数**：PUT body 为配置项；test 无 body。
- **响应字段**：setting：`label/value/desc`；link test：`{ status: 检测中|成功|失败, checkedAt }`。
- **分页**：否。**轮询**：否。**WebSocket/MQTT**：否。
- **字段映射**：`getSystemLinks()` 当前按 label 含「地址/MQTT」过滤 → 后端建议结构化 `links[]`（key/label/value/status/checkedAt）。
- **接入优先级**：**P2**。

---

## 11. 实时消息通道

当前由 `src/runtime/mockRuntimeStore.js` 定时（`tickMs=3000`）生成快照模拟实时；接入真实后端时替换为 WebSocket（或后端网关转发的 MQTT）。

### 11.1 WebSocket 通道（推荐前端直连方式）

- 路径：`/ws/runtime`
- 统一消息信封：
  ```json
  {
    "type": "DEVICE_STATUS_UPDATED",
    "timestamp": "2025-05-27 10:30:45",
    "payload": {}
  }
  ```
- 消息类型与 payload 建议：

  | type | payload 关键字段 | 对应页面 |
  |---|---|---|
  | `DEVICE_STATUS_UPDATED` | `deviceId, online, runStatus, alarmCount, points[]` | 总览/设备 |
  | `TASK_STEP_UPDATED` | `taskId, currentStep, step` | 任务/总览 |
  | `TASK_STATUS_UPDATED` | `taskId, status, processStatus` | 任务/总览 |
  | `ALARM_CREATED` | `alarm{...}` | 报警/总览 |
  | `ALARM_UPDATED` | `alarmId, status` | 报警/总览 |
  | `COMMAND_ACK_UPDATED` | `commandId, status, result` | 指令回执 |
  | `VISION_RESULT_CREATED` | `result{...}` | 视觉 |
  | `MAP_BUILDING_UPDATED` | `mappingTaskId, progress, status` | 地图/自动建图 |
  | `SYSTEM_STATUS_UPDATED` | `backend, mqtt, logUpload, cache, now, robotStatus` | 顶栏/监控 |
  | `LOG_CREATED` | `log{...}` | 日志/总览 |

- 具体消息示例：

  ```json
  {
    "type": "DEVICE_STATUS_UPDATED",
    "timestamp": "2025-05-27 10:30:45",
    "payload": {
      "id": "AMR-001",
      "onlineStatus": "在线",
      "runStatus": "运行中",
      "battery": 78
    }
  }
  ```

  ```json
  {
    "type": "ALARM_CREATED",
    "timestamp": "2025-05-27 10:30:46",
    "payload": {
      "id": "ALM-1007",
      "name": "主轴负载过高",
      "device": "CNC-001",
      "type": "设备报警",
      "level": "高危",
      "status": "未处理",
      "time": "10:30:46"
    }
  }
  ```

  ```json
  {
    "type": "TASK_STEP_UPDATED",
    "timestamp": "2025-05-27 10:30:47",
    "payload": { "id": "TASK-001", "currentStep": "STEP-004", "step": "4/8" }
  }
  ```

- 前端落点：实时骨架已就位（`src/runtime/`：`wsRuntimeClient` / `runtimeMessageAdapter` / `runtimeStore` / `useRuntime`）。
  消息经 `normalizeRuntimeMessage` → `applyRuntimeMessage` 合入 runtime state；页面通过 `useRuntime` 订阅。
  `useMockRuntime` 接口与现有完全一致，可逐步迁移（详见 `service-adapter-plan.md`「WebSocket runtime 接入计划」）。

### 11.2 MQTT Topic 草案（如走 MQTT）

```
robot-platform/devices/+/status
robot-platform/tasks/+/status
robot-platform/alarms/+
robot-platform/commands/+/ack
robot-platform/vision/+/result
robot-platform/maps/+/building
robot-platform/system/status
```

> 说明：**前端通常不直接连 MQTT**（浏览器需 MQTT-over-WebSocket，且涉及鉴权/QoS）。推荐由**后端网关订阅 MQTT 并转为上面的 `/ws/runtime` WebSocket 消息**下发前端。MQTT topic 草案主要供后端/边缘网关参考。

---

## 优先级汇总

| 阶段 | 业务域 | 通道 |
|---|---|---|
| **P0** | 系统状态、设备、任务、报警 | REST + WebSocket |
| **P1** | 指令回执、日志、视觉识别结果 | REST + WebSocket |
| **P2** | 地图管理、机械臂控制、系统设置 | REST（控制类需安全评审）|
