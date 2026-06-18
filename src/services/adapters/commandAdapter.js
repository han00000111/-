// 指令字段标准化（纯函数）。保留原始字段，补充标准字段。
export function normalizeCommand(raw = {}) {
  const deviceId = raw.deviceId ?? raw.targetId ?? raw.objectId;
  const taskId = raw.taskId ?? raw.orderId ?? raw.relatedTask;
  const name = raw.name ?? raw.command ?? raw.commandText ?? raw.commandName ?? raw.instruction ?? raw.content;
  const createdAt = raw.createdAt ?? raw.sentAt ?? raw.sendTime ?? raw.time;
  return {
    ...raw,
    id: raw.id ?? raw.commandId ?? raw.cmdId ?? raw.code ?? [deviceId, taskId, createdAt, name].filter(Boolean).join('-'),
    name,
    type: raw.type ?? raw.commandType ?? raw.logType,
    status: raw.status ?? raw.ackStatus ?? raw.receiptStatus ?? raw.sendStatus ?? raw.result,
    taskId,
    deviceId,
    targetId: raw.targetId ?? deviceId,
    command: raw.command ?? name,
    sendStatus: raw.sendStatus ?? raw.dispatchStatus ?? raw.sendResult ?? raw.result,
    ackStatus: raw.ackStatus ?? raw.receiptStatus ?? raw.status,
    result: raw.result,
    createdAt,
    updatedAt: raw.updatedAt ?? raw.updateTime ?? createdAt,
  };
}

export function normalizeCommands(list = []) {
  return Array.isArray(list) ? list.map(normalizeCommand) : list;
}
