// 报警字段标准化（纯函数）。保留原始字段，补充标准字段。
export function normalizeAlarm(raw = {}) {
  return {
    ...raw,
    id: raw.id ?? raw.alarmId ?? raw.code,
    title: raw.title ?? raw.alarmName ?? raw.name,
    level: raw.level ?? raw.severity ?? raw.riskLevel,
    status: raw.status ?? raw.handleStatus ?? raw.processStatus,
    deviceId: raw.deviceId ?? raw.device ?? raw.source ?? raw.object,
    source: raw.source ?? raw.object ?? raw.device,
    taskId: raw.taskId ?? raw.relatedTask,
    message: raw.message ?? raw.content ?? raw.title ?? raw.name,
    suggestion: raw.suggestion ?? raw.action ?? raw.advice,
    createdAt: raw.createdAt ?? raw.alarmTime ?? raw.time,
    updatedAt: raw.updatedAt ?? raw.updateTime ?? raw.time,
  };
}

export function normalizeAlarms(list = []) {
  return Array.isArray(list) ? list.map(normalizeAlarm) : list;
}

export function normalizeInterlock(raw = {}) {
  return {
    ...raw,
    id: raw.id ?? raw.interlockId ?? `${raw.device ?? 'dev'}-${raw.name ?? 'il'}`,
    name: raw.name ?? raw.title,
    deviceId: raw.deviceId ?? raw.device,
    status: raw.status,
    updatedAt: raw.updatedAt ?? raw.time,
  };
}

export function normalizeInterlocks(list = []) {
  return Array.isArray(list) ? list.map(normalizeInterlock) : list;
}
