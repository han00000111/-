// 指令字段标准化（纯函数）。保留原始字段，补充标准字段。
export function normalizeCommand(raw = {}) {
  return {
    ...raw,
    id: raw.id ?? raw.commandId ?? raw.cmdId,
    taskId: raw.taskId,
    targetId: raw.targetId ?? raw.deviceId ?? raw.objectId,
    command: raw.command ?? raw.commandText ?? raw.commandName ?? raw.instruction ?? raw.content,
    sendStatus: raw.sendStatus ?? raw.dispatchStatus ?? raw.sendResult ?? raw.result,
    ackStatus: raw.ackStatus ?? raw.receiptStatus ?? raw.status,
    result: raw.result,
    createdAt: raw.createdAt ?? raw.sentAt ?? raw.sendTime ?? raw.time,
    updatedAt: raw.updatedAt ?? raw.time,
  };
}

export function normalizeCommands(list = []) {
  return Array.isArray(list) ? list.map(normalizeCommand) : list;
}
