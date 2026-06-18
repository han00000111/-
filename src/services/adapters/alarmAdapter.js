// 报警字段标准化（纯函数）。保留原始字段，补充标准字段。
export function normalizeAlarm(raw = {}) {
  const name = raw.name ?? raw.title ?? raw.alarmName;
  const deviceId = raw.deviceId ?? raw.device ?? raw.source ?? raw.object;
  const createdAt = raw.createdAt ?? raw.alarmTime ?? raw.time;
  return {
    ...raw,
    id: raw.id ?? raw.alarmId ?? raw.code ?? [deviceId, name, createdAt].filter(Boolean).join('-'),
    name,
    title: raw.title ?? name,
    type: raw.type ?? raw.alarmType ?? raw.category,
    level: raw.level ?? raw.severity ?? raw.riskLevel,
    status: raw.status ?? raw.handleStatus ?? raw.processStatus,
    deviceId,
    source: raw.source ?? raw.object ?? raw.device,
    taskId: raw.taskId ?? raw.relatedTask,
    message: raw.message ?? raw.content ?? raw.title ?? raw.name,
    suggestion: raw.suggestion ?? raw.action ?? raw.advice,
    createdAt,
    updatedAt: raw.updatedAt ?? raw.updateTime ?? createdAt,
  };
}

export function normalizeAlarms(list = []) {
  return Array.isArray(list) ? list.map(normalizeAlarm) : list;
}

export function normalizeInterlock(raw = {}) {
  const createdAt = raw.createdAt ?? raw.time;
  return {
    ...raw,
    id: raw.id ?? raw.interlockId ?? `${raw.device ?? 'dev'}-${raw.name ?? 'il'}`,
    name: raw.name ?? raw.title,
    type: raw.type ?? 'interlock',
    deviceId: raw.deviceId ?? raw.device,
    status: raw.status,
    createdAt,
    updatedAt: raw.updatedAt ?? createdAt,
  };
}

export function normalizeInterlocks(list = []) {
  return Array.isArray(list) ? list.map(normalizeInterlock) : list;
}
