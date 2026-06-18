// services 为 mock 数据适配层：接入真实后端时只替换各 service 内部实现，页面层不直接 fetch、不直接 import mockData。
// 接口契约 / 字段模型 / 接入顺序见 docs/api-contract.md、docs/data-models.md、docs/service-adapter-plan.md。
export * from './deviceService.js';
export * from './taskService.js';
export * from './commandService.js';
export * from './alarmService.js';
export * from './mapService.js';
export * from './armService.js';
export * from './visionService.js';
export * from './logService.js';
export * from './settingsService.js';
export * from './runtimeService.js';
export * from './createResourceState.js';
export * from './useResourceState.js';

export { getCommandLogs } from './commandService.js';
export { getStepLogs } from './taskService.js';
export { getVisionLogs } from './visionService.js';

import { getRuntimeSnapshot } from '../runtime/mockRuntimeStore.js';

export function getLiveDevices() {
  return getRuntimeSnapshot().devices;
}

export function getLiveTasks() {
  return getRuntimeSnapshot().tasks;
}

export function getLiveAlarms() {
  return getRuntimeSnapshot().alarms;
}

export function getLiveCommands() {
  return getRuntimeSnapshot().commands;
}

export function getLiveVisionResults() {
  return getRuntimeSnapshot().visionResults;
}

export function getLiveLogs() {
  return getRuntimeSnapshot().logs;
}

export function getLiveSystemStatus() {
  return getRuntimeSnapshot().systemStatus;
}
