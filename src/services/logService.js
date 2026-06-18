// 当前为 mock 数据适配层。
// 后续接入真实后端时，只替换本文件内部实现，页面不直接改 mockData。
import { auditLogs, commandLogs, stepLogs, telemetryLogs, visionLogs } from '../mockData.js';
import { normalizeLogRecords } from './adapters';

export function getLogs() {
  return normalizeLogRecords([
    ...auditLogs,
    ...commandLogs,
    ...stepLogs,
    ...telemetryLogs,
    ...visionLogs,
  ]);
}

export function getAuditLogs() {
  return normalizeLogRecords(auditLogs);
}

export function getRecentLogs() {
  return getLogs().slice(0, 20);
}

export function getCommandLogs() {
  return normalizeLogRecords(commandLogs);
}

export function getStepLogs() {
  return normalizeLogRecords(stepLogs);
}

export function getTelemetryLogs() {
  return normalizeLogRecords(telemetryLogs);
}

export function getVisionLogs() {
  return normalizeLogRecords(visionLogs);
}
