// 日志字段标准化（纯函数）。保留原始字段，补充标准字段。
export function normalizeLogRecord(raw = {}) {
  const type = raw.type ?? raw.logType;
  const target = raw.target ?? raw.objectId ?? raw.deviceId;
  const message = raw.message ?? raw.content;
  const createdAt = raw.createdAt ?? raw.time;
  return {
    ...raw,
    id: raw.id ?? raw.logId ?? [createdAt, type, target, message].filter(Boolean).join('-'),
    name: raw.name ?? message,
    type,
    source: raw.source ?? raw.objectType,
    target,
    message,
    status: raw.status ?? raw.result,
    deviceId: raw.deviceId ?? (raw.objectType === 'device' ? raw.objectId : undefined),
    taskId: raw.taskId ?? raw.orderId,
    createdAt,
    updatedAt: raw.updatedAt ?? raw.updateTime ?? createdAt,
  };
}

export function normalizeLogRecords(list = []) {
  return Array.isArray(list) ? list.map(normalizeLogRecord) : list;
}
