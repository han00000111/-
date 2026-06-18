// 设备字段标准化（纯函数，无 React）。
// 规则：保留全部原始字段（...raw），仅“补充”标准字段，绝不删除/改写已有展示字段，页面不会坏。
import { warnMissingFields } from '../../utils/schemaCheck.js';

export function normalizeDevice(raw = {}) {
  const normalized = {
    ...raw,
    id: raw.id ?? raw.deviceId ?? raw.code ?? raw.deviceCode,
    name: raw.name ?? raw.deviceName,
    type: raw.type ?? raw.deviceType,
    onlineStatus: raw.onlineStatus ?? raw.online ?? raw.status,
    runStatus: raw.runStatus ?? raw.runningStatus ?? raw.status,
    currentTaskId: raw.currentTaskId ?? raw.taskId ?? null,
    battery: raw.battery ?? null,
    alarmCount: raw.alarmCount ?? raw.issueCount ?? 0,
    location: raw.location ?? raw.position ?? null,
    updatedAt: raw.updatedAt ?? raw.updateTime ?? raw.time,
  };
  if (import.meta.env?.DEV) {
    warnMissingFields('Device', normalized, ['id', 'type', 'onlineStatus', 'runStatus']);
  }
  return normalized;
}

export function normalizeDevices(list = []) {
  return Array.isArray(list) ? list.map(normalizeDevice) : list;
}
