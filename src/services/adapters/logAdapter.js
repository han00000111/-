// 日志字段标准化（纯函数）。保留原始字段，补充标准字段。
export function normalizeLogRecord(raw = {}) {
  return {
    ...raw,
    id: raw.id ?? raw.logId,
    type: raw.type ?? raw.logType,
    source: raw.source ?? raw.objectType,
    target: raw.target ?? raw.objectId ?? raw.deviceId,
    message: raw.message ?? raw.content,
    status: raw.status ?? raw.result,
    createdAt: raw.createdAt ?? raw.time,
  };
}

export function normalizeLogRecords(list = []) {
  return Array.isArray(list) ? list.map(normalizeLogRecord) : list;
}
