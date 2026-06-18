# 数据模型草案

> 字段名、示例值均来自当前 `src/mockData.js`（截至本轮）。
> 「mock 来源」列指当前字段所在的 mock 数组/对象；「备注」给出接入真实后端时的建议。
> 当前 mock 多用中文枚举字符串与 `HH:mm:ss` 时间，接入时建议统一为后端枚举 + ISO 8601，前端 service 负责映射，**页面展示字段名不变**。

---

## 1. Device（设备）— mock 来源：`devices[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| id | string | 是 | `CNC-001` | 设备编号 |
| type | string | 是 | `数控机床` | 设备类型 |
| online | string | 是 | `在线` | 当前枚举：在线/离线；建议后端 `onlineStatus` |
| runStatus | string | 是 | `运行中` | 运行中/待机/异常/维护中 |
| alarmCount | number | 是 | `1` | 报警数量 |
| updatedAt | string | 是 | `09:11:18` | 接入统一 ISO 8601 |
| name | string | 否 | — | 当前 mock 无 name，建议后端补 |
| currentTaskId | string | 否 | — | mock 无，建议后端补（详情页用得到）|

## 2. DevicePoint（设备点位）— mock 来源：`devicePoints[deviceId][]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| device | string | 是 | `CNC-002` | 所属设备编号 |
| name | string | 是 | `主轴转速` | 点位名称 |
| code | string | 是 | `spindle_speed` | 点位编码 |
| pointType | string | 是 | `numeric` | numeric/status/alarm |
| value | string | 是 | `0 rpm` | 当前值（含单位字符串）|
| status | string | 是 | `正常` | 正常/偏高/异常/超时… |
| quality | string | 是 | `良好` | 采集质量 |
| updatedAt | string | 是 | `09:11:18` | — |

## 3. Task（任务）— mock 来源：`tasks[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| id | string | 是 | `TASK-001` | 任务编号 |
| orderNo | string | 否 | `ORD-20250608-001` | 订单编号 |
| taskType | string | 否 | `生产任务` | — |
| targetDevice | string | 否 | `CNC-001` | 目标设备 |
| status | string | 是 | `运行中` | 运行中/排队中/暂停/失败/已中止 |
| processStatus | string | 否 | `待处理` | 处理状态 |
| step | string | 是 | `3/8` | 当前/总步，建议后端拆 `currentStepIndex/totalSteps` |
| currentStep | string | 否 | `STEP-003` | 当前步骤 id |
| devices | string | 否 | `CNC-001, PLC-001` | 关联设备（逗号串）|
| alarmCount | number | 是 | `1` | — |
| command | string | 否 | `启动加工` | 当前指令 |
| startedAt | string | 否 | `09:08:15` | — |
| updatedAt | string | 是 | `09:11:18` | — |
| pickupStation / placementPlan / doorMode / taskPlan / visionMark / actionPoint / materialRule / reviewRule | string | 否 | — | 工艺/方案明细字段 |

## 4. TaskStep（任务步骤）— mock 来源：`stepsByTask[taskId][]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| id | string | 是 | `STEP-001` | 步骤 id |
| name | string | 是 | `夹具锁紧` | 步骤名称 |
| status | string | 是 | `完成` | 完成/进行中/待执行 |

## 5. Command（指令/回执）— mock 来源：`commandLogs[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| time | string | 是 | `09:11:02` | 下发时间 |
| objectType | string | 否 | `task` | 关联对象类型 |
| objectId | string | 否 | `TASK-001` | 关联对象 id |
| deviceId | string | 否 | `CNC-001` | 目标设备 |
| taskId | string | 否 | `TASK-001` | 关联任务 |
| logType | string | 是 | `指令` | — |
| content | string | 是 | `启动加工` | 指令名称/内容 |
| params | string | 否 | `O1001` | 参数 |
| status | string | 是 | `已确认` | 回执状态，建议后端 `ackStatus` |
| result | string | 否 | `已下发` | 下发结果，建议后端 `sendResult` |
| id | string | 否 | — | mock 无唯一 id，建议后端补 |

## 6. Alarm（报警）— mock 来源：`alarms[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| name | string | 是 | `主轴负载过高` | 报警名称（可重复）|
| device | string | 是 | `CNC-001` | 关联设备 |
| type | string | 是 | `设备报警` | 设备/系统/机器人/机械臂/末端工具报警 |
| level | string | 是 | `高危` | 高危/中危/低危，建议 `severity` |
| status | string | 是 | `未处理` | 未处理/处理中/已恢复… |
| time | string | 是 | `09:09:45` | — |
| jumpTarget | string | 否 | `alarms` | 前端跳转目标（前端逻辑，可保留）|
| robotId / armId / relatedTask | string | 否 | `AMR-001` | 机器人/机械臂报警附带 |
| id | string | 否 | — | **mock 无 id**，建议后端必补（前端渲染已用复合 key 兜底）|

## 7. Interlock（互锁）— mock 来源：`interlocks[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| name | string | 是 | `防护门` | 互锁条件名 |
| device | string | 是 | `PLC-001` | 关联设备 |
| status | string | 是 | `已关闭` | 已关闭/已锁紧/未触发/正常… |
| time | string | 是 | `09:11:18` | — |

## 8. MapInfo（地图）— mock 来源：`maps[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| mapId | string | 是 | `M001` | — |
| mapName | string | 是 | `一号厂区地图` | — |
| isDefault | boolean | 是 | `true` | 是否默认地图 |
| width / height | number | 是 | `240 / 180` | 地图尺寸 |
| resolution | number | 是 | `0.05` | 分辨率（m/px）|
| pointCount / routeCount | number | 是 | `5 / 2` | 统计 |
| updatedAt | string | 是 | `2026-06-08 09:08` | — |

## 9. MapPoint（地图点位）— mock 来源：`mapPoints[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| pointId | string | 是 | `P001` | — |
| mapId | string | 是 | `M001` | 所属地图 |
| name | string | 是 | `设备区入口` | — |
| type | string | 是 | `巡检点` | 点位类型 |
| x / y | number | 是 | `190 / 150` | 坐标 |
| theta | number | 否 | `90` | 朝向 |
| areaId | string | 否 | `A001` | 所属区域 |

## 10. Route（路线）— mock 来源：`mapRoutes[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| routeId | string | 是 | `R001` | — |
| routeName | string | 是 | `主通道巡检路线` | — |
| mapId | string | 是 | `M001` | 所属地图 |
| pointSequence | string[] | 是 | `['P001','P002',...]` | 点位顺序 |
| mode | string | 是 | `循环巡检` | 执行模式 |
| estimatedDuration | string | 否 | `18 分钟` | — |
| status | string | 是 | `启用` | 启用/停用 |

## 11. Arm（机械臂）— mock 来源：`robotArms[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| armId | string | 是 | `ARM-001` | — |
| name | string | 是 | `上下料开门机械臂` | — |
| type | string | 是 | `六轴机械臂` | — |
| onlineStatus | string | 是 | `在线` | 与 `online` 重复，接入统一 `onlineStatus` |
| online | string | 否 | `在线` | 冗余字段，建议后端去重 |
| runStatus | string | 是 | `运行中` | — |
| controlMode | string | 是 | `自动` | 自动/手动 |
| currentTask | string | 否 | `TASK-001` | — |
| currentAction | string | 否 | `上抬把手` | — |
| toolId | string | 否 | `TOOL-001` | 末端工具 |
| toolStatus | string | 否 | `夹爪已安装 / 已打开` | — |

## 12. TeachingPoint（示教点）— mock 来源：`armTeachingPoints[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| pointId | string | 是 | `TP-DOOR-001` | — |
| pointName | string | 是 | `开门预备位` | — |
| pointType | string | 是 | `开门点` | — |
| armId | string | 是 | `ARM-001` | 所属机械臂 |
| relatedDevice | string | 否 | `CNC-001` | — |
| relatedWorkstation | string | 否 | `设备门区` | — |
| relatedMapPoint | string | 否 | `DOOR-P01` | — |
| relatedTaskStep | string | 否 | `TASK-001 / 设备开门` | — |
| relatedVisionMarker | string | 否 | `MARKER-HANDLE-001` | — |
| jointAngles | string | 否 | `J1 …` | 关节角（字符串）|

## 13. VisionCamera（相机）— mock 来源：`cameras[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| cameraId | string | 是 | `CAM-001` | — |
| cameraName | string | 是 | `上料位相机` | — |
| position | string | 否 | `CNC-002 上料位` | — |
| relatedDevice | string | 否 | `CNC-002 / WS-001` | — |
| ip | string | 否 | `10.10.2.21` | — |
| resolution / fps / exposure | string | 否 | `1920x1080 / 30 fps / 6 ms` | — |
| light | string | 否 | `环形光 LGT-001` | — |
| online | string | 是 | `在线` | — |
| updatedAt | string | 是 | `09:14:08` | — |

## 14. VisionTask（识别任务）— mock 来源：`visionTasks[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| visionTaskId | string | 是 | `VT-001` | — |
| taskName | string | 是 | `物料位置识别` | — |
| recognitionType | string | 是 | `物体定位` | — |
| cameraId | string | 是 | `CAM-001` | — |
| relatedDevice | string | 否 | `CNC-002` | — |
| workstation | string | 否 | `WS-001` | — |
| relatedRobotTask | string | 否 | `TASK-008` | — |
| modelVersion | string | 否 | `LOC-MAT-v2.3` | — |
| triggerMode | string | 否 | `任务步骤触发` | — |
| status | string | 是 | `识别中` | — |

## 15. VisionResult（识别结果）— mock 来源：`visionResults[]`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| time | string | 是 | `09:14:08` | — |
| cameraId | string | 是 | `CAM-001` | — |
| visionTaskId | string | 是 | `VT-001` | — |
| object | string | 否 | `物料 A-102` | 识别对象 |
| result | string | 是 | `通过` | 通过/异常/低置信度… |
| confidence | string | 否 | `96%` | — |
| duration | string | 否 | `128 ms` | — |
| relatedTask / relatedDevice | string | 否 | `TASK-008 / CNC-002` | — |
| screenshot | string | 否 | `mock://vision/CAM-001/001` | **可重复**，作 key 会冲突；建议后端补 `resultId` |
| processStatus | string | 否 | `已上传` | 处理状态 |
| resultId | string | 否 | — | **mock 无**，建议后端必补 |

## 16. LogRecord（日志）— mock 来源：`auditLogs / commandLogs / stepLogs / telemetryLogs / visionLogs`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| time | string | 是 | `09:09:45` | — |
| objectType | string | 否 | `task` | 关联对象类型 |
| objectId | string | 否 | `TASK-001` | 关联对象 |
| deviceId | string | 否 | `CNC-001` | — |
| taskId | string | 否 | `TASK-001` | — |
| logType | string | 是 | `报警` | 指令/报警/任务/审计/设备/视觉… |
| content | string | 是 | `主轴负载过高` | 日志内容 |
| params | string | 否 | `alarm_code=1007` | — |
| status | string | 否 | `未处理` | — |
| operator | string | 否 | `system` | 操作人 |

## 17. RuntimeStatus（系统/运行状态）— mock 来源：`runtimeService.getTopBarStatus()` + `robotStatus`

| 字段 | 类型 | 必填 | 示例 | 备注 |
|---|---|---|---|---|
| backend | string | 是 | `正常` | 后台链路 |
| mqtt | string | 是 | `正常` | MQTT 链路 |
| logUpload | string | 是 | `正常` | 日志上传 |
| cache | string | 是 | `7 天` | 本地缓存 |
| now | string | 是 | `2025-05-27 10:30:45` | 服务时间，建议后端 `serverTime` |
| robotStatus.chargeStatus | string | 是 | `待机` | 充电状态 |
| robotStatus.motorStatus | string | 是 | `正常` | 电机 |
| robotStatus.odomStatus | string | 是 | `正常` | 里程计 |
| robotStatus.obstacleStatus | string | 是 | `通道清空` | 避障 |
| robotStatus.navStatus | string | 是 | `导航中` | 导航 |
| robotStatus.mappingStatus | string | 是 | `空闲` | 建图 |

---

## 通用接入备注

1. **缺失唯一 id**：`Alarm` / `Command` / `VisionResult` 当前无稳定 `id`，接入后端务必补齐（前端渲染已用复合 key 兜底，但选中/更新逻辑依赖 id 更稳妥）。
2. **时间格式**：统一 ISO 8601（`updatedAt/createdAt/time`），前端展示层格式化。
3. **枚举字段**：中文状态串（在线/运行中/高危…）建议后端用稳定枚举码 + i18n，前端 service 做映射，避免页面散落硬编码。
4. **冗余字段**：`Arm.online` 与 `Arm.onlineStatus` 重复，接入时收敛为一个。

---

## 字段标准化（本轮收敛）

> 原始 mock 字段**不直接重命名**（很多页面在用）。改由 `src/services/adapters/*` 在服务层把原始字段映射成下列标准字段，
> 适配器**保留原始字段**、仅补充标准字段，页面可继续用旧字段、新代码优先用标准字段。详见 `docs/field-normalization.md`。

通用规则：主键统一 `id`；展示名 `name`；类型 `type`；状态按语义细分（不全叫 status）；时间统一 `createdAt`/`updatedAt`（展示由 format 工具处理）。

| 模型 | 标准字段 | 适配器 | 主要兼容来源（原始→标准）|
|---|---|---|---|
| Device | id, name, type, onlineStatus, runStatus, currentTaskId, battery, alarmCount, location, updatedAt | `normalizeDevice` | online→onlineStatus；updateTime/time→updatedAt；deviceId/code→id |
| Task | id, name, status, currentStep, currentStepIndex, totalSteps, relatedDevices, commandStatus, ackStatus, startedAt, updatedAt | `normalizeTask` | step→currentStepIndex/totalSteps；devices/targetDevice→relatedDevices；processStatus→commandStatus；receiptStatus→ackStatus |
| Alarm | id, title, level, status, deviceId, source, taskId, message, suggestion, createdAt, updatedAt | `normalizeAlarm` | name→title；device→deviceId/source；time→createdAt；relatedTask→taskId |
| Interlock | id, name, deviceId, status, updatedAt | `normalizeInterlock` | device→deviceId；time→updatedAt |
| Command | id, taskId, targetId, command, sendStatus, ackStatus, result, createdAt, updatedAt | `normalizeCommand` | content→command；deviceId/objectId→targetId；status→ackStatus；result→sendStatus；time→createdAt |
| VisionResult | id, cameraId, taskId, result, confidence, duration, snapshotUrl, createdAt | `normalizeVisionResult`（字段适配，区别于 AppRuntime 的 bbox 渲染版）| visionTaskId→taskId；screenshot→snapshotUrl；time→createdAt |
| LogRecord | id, type, source, target, message, status, createdAt | `normalizeLogRecord` | logType→type；objectType→source；objectId/deviceId→target；content→message；time→createdAt |
| MapInfo / MapPoint / Route | id, name, type, mapId, status, updatedAt | `normalizeMapInfo`/`normalizeMapPoint`/`normalizeRoute` | mapId/pointId/routeId→id；mapName/pointName/routeName→name |
| Arm / TeachingPoint | id, name, type, onlineStatus, runStatus, currentTaskId | `normalizeArm`/`normalizeTeachingPoint` | armId/pointId→id；online→onlineStatus；currentTask→currentTaskId |

已接入 normalize 的 service：deviceService、taskService、alarmService、commandService、visionService、logService（list/by-id/fetch 三类）。
runtime WS patch 已对 ALARM_CREATED / VISION_RESULT_CREATED / LOG_CREATED 入库前 normalize；设备/任务按 `id`（兼容 `deviceId`/`taskId`）匹配更新。
MapInfo/Arm 适配器已提供，按需在 mapService/armService 接入（本轮未强制改 map/arm 服务）。
