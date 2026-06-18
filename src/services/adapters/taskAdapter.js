// 任务字段标准化（纯函数）。保留原始字段，补充标准字段。
function parseStep(step) {
  const parts = String(step ?? '').split('/');
  const cur = Number.parseInt(parts[0], 10);
  const total = Number.parseInt(parts[1], 10);
  return {
    cur: Number.isFinite(cur) ? cur : null,
    total: Number.isFinite(total) ? total : null,
  };
}

export function normalizeTask(raw = {}) {
  const { cur, total } = parseStep(raw.step);
  return {
    ...raw,
    id: raw.id ?? raw.taskId ?? raw.orderId ?? raw.orderNo,
    name: raw.name ?? raw.taskName ?? raw.taskType,
    status: raw.status ?? raw.taskStatus,
    currentStep: raw.currentStep ?? raw.currentStepName ?? raw.step,
    currentStepIndex: raw.currentStepIndex ?? raw.stepIndex ?? cur,
    totalSteps: raw.totalSteps ?? raw.stepTotal ?? total,
    relatedDevices: raw.relatedDevices ?? raw.devices ?? raw.relatedDevice ?? raw.targetDevice,
    commandStatus: raw.commandStatus ?? raw.processStatus,
    ackStatus: raw.ackStatus ?? raw.receiptStatus,
    startedAt: raw.startedAt ?? raw.startTime,
    updatedAt: raw.updatedAt ?? raw.updateTime ?? raw.time,
  };
}

export function normalizeTasks(list = []) {
  return Array.isArray(list) ? list.map(normalizeTask) : list;
}
