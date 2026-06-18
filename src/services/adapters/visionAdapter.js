// 视觉结果字段标准化（纯函数，仅做字段命名收敛）。
// 注意：这是“字段适配”，与 AppRuntime 中负责 bbox/roi 视觉渲染的 normalizeVisionResult 不同，互不影响。
export function normalizeVisionResult(raw = {}) {
  const taskId = raw.taskId ?? raw.visionTaskId;
  const snapshotUrl = raw.snapshotUrl ?? raw.snapshot ?? raw.screenshot;
  const createdAt = raw.createdAt ?? raw.time;
  return {
    ...raw,
    id: raw.id ?? raw.resultId ?? raw.recordId ?? snapshotUrl ?? [raw.cameraId ?? raw.camera, taskId, createdAt].filter(Boolean).join('-'),
    name: raw.name ?? raw.object ?? raw.resultName,
    type: raw.type ?? raw.resultType ?? raw.imageType,
    status: raw.status ?? raw.processStatus ?? raw.resultStatus ?? raw.result,
    cameraId: raw.cameraId ?? raw.camera,
    taskId,
    result: raw.result ?? raw.resultStatus,
    confidence: raw.confidence ?? raw.score,
    score: raw.score ?? raw.confidence,
    duration: raw.duration ?? raw.cost ?? raw.elapsedMs,
    snapshotUrl,
    createdAt,
    updatedAt: raw.updatedAt ?? raw.updateTime ?? createdAt,
  };
}

export function normalizeVisionResults(list = []) {
  return Array.isArray(list) ? list.map(normalizeVisionResult) : list;
}
