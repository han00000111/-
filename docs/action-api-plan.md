# 用户操作类接口计划

所有操作默认走 mock service；`VITE_USE_MOCK_SERVICE=false` 时切换到 REST。

| 操作 | 页面入口 | Service 函数 | 建议 REST 接口 | 高风险/确认 | 成功反馈 |
|---|---|---|---|---|---|
| 暂停任务 | 总览、任务管理 | `pauseTask` | `POST /api/tasks/:id/pause` | 否 | 暂停任务成功 |
| 恢复任务 | 任务管理 | `resumeTask` | `POST /api/tasks/:id/resume` | 否 | 任务已恢复 |
| 取消任务 | 总览、任务管理 | `cancelTask` | `POST /api/tasks/:id/cancel` | 是/是 | 任务已取消 |
| 重试任务 | 任务管理 | `retryTask` | `POST /api/tasks/:id/retry` | 否 | 任务重新下发成功 |
| 下发任务 | 任务管理 | `dispatchTask` | `POST /api/tasks/:id/dispatch` | 否 | 任务重新下发成功 |
| 确认报警 | 报警互锁 | `acknowledgeAlarm` | `POST /api/alarms/:id/ack` | 否 | 报警已确认 |
| 恢复报警 | 报警互锁 | `recoverAlarm` | `POST /api/alarms/:id/recover` | 是/是 | 报警已恢复 |
| 忽略报警 | 报警互锁 | `ignoreAlarm` | `POST /api/alarms/:id/ignore` | 是/是 | 报警已忽略 |
| 重试指令 | 指令回执 | `retryCommand` | `POST /api/commands/:id/retry` | 否 | 指令重试已下发 |
| 取消指令 | 指令回执 | `cancelCommand` | `POST /api/commands/:id/cancel` | 是/是 | 指令已取消 |
| 重新发送 | 指令回执 | `resendCommand` | `POST /api/commands/:id/resend` | 是/是 | 指令重新发送成功 |
| 检查连接 | 设备总览、设备详情 | `checkDeviceConnection` | `POST /api/devices/:id/check-connection` | 否 | 设备连接检查已发起 |
| 刷新状态 | 设备总览、设备详情 | `refreshDeviceStatus` | `POST /api/devices/:id/refresh-status` | 否 | 设备状态已刷新 |
| 机械臂急停 | 机械臂控制 | `emergencyStopArm` | `POST /api/arms/:id/emergency-stop` | 是/是 | 急停指令已下发 |
| 机械臂复位 | 机械臂控制 | `resetArm` | `POST /api/arms/:id/reset` | 是/是 | 复位指令已下发 |
| 执行动作/模板 | 机械臂控制 | `executeArmAction` | `POST /api/arms/:id/actions` | 是/是 | 动作执行已下发 |
| 保存示教点 | 姿态示教 | `saveTeachingPoint` | `POST /api/arms/teaching-points` | 否 | 示教点已保存 |
| 重试视觉任务 | 视觉识别 | `retryVisionTask` | `POST /api/vision/tasks/:id/retry` | 否 | 视觉任务重试已发起 |
| 标记视觉复核 | 视觉识别 | `markVisionResultReviewed` | `POST /api/vision/results/:id/review` | 否 | 视觉结果已复核 |
| 转人工处理 | 视觉识别 | `transferVisionResultToManual` | `POST /api/vision/results/:id/manual` | 否 | 视觉结果已转人工处理 |
| 保存地图点位 | 地图编辑 | `saveMapPoint` | `POST /api/maps/points` | 否 | 地图点位已保存 |
| 删除地图点位 | 地图编辑 | `deleteMapPoint` | `DELETE /api/maps/points/:id` | 是/是 | 地图点位已删除 |
| 保存路线 | 路线管理 | `saveRoute` | `POST /api/maps/routes` | 否 | 路线已保存 |
| 启动自动建图 | 自动建图 | `startAutoMapping` | `POST /api/mapping/tasks/start` | 是/是 | 自动建图已启动 |
| 停止自动建图 | 自动建图 | `stopAutoMapping` | `POST /api/mapping/tasks/:id/stop` | 是/是 | 自动建图已停止 |
| 测试系统链路 | 系统设置 | `testSystemLink` | `POST /api/settings/links/:id/test` | 否 | 链路测试成功 |
| 保存运行设置 | 系统设置 | `saveRuntimeSettings` | `PUT /api/settings/runtime` | 否 | 运行设置已保存 |

统一失败反馈：`操作失败，请稍后重试`。底层错误仍保留为 `ApiError`，供后续日志和问题定位使用。
