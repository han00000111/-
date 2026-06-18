// 视觉结果字段标准化（纯函数，仅做字段命名收敛）。
// 注意：这是“字段适配”，与 AppRuntime 中负责 bbox/roi 视觉渲染的 normalizeVisionResult 不同，互不影响。
export function normalizeVisionResult(raw = {}) {
  return {
    ...raw,
    id: raw.id ?? raw.resultId ?? raw.recordId,
    cameraId: raw.cameraId ?? raw.camera,
    taskId: raw.taskId ?? raw.visionTaskId,
    result: raw.result ?? raw.resultStatus,
    confidence: raw.confidence ?? raw.score,
    duration: raw.duration ?? raw.cost ?? raw.elapsedMs,
    snapshotUrl: raw.snapshotUrl ?? raw.snapshot ?? raw.screenshot,
    createdAt: raw.createdAt ?? raw.time,
  };
}

export function normalizeVisionResults(list = []) {
  return Array.isArray(list) ? list.map(normalizeVisionResult) : list;
}
