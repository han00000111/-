// 机械臂相关字段标准化（纯函数）。保留原始字段，补充标准字段。
export function normalizeArm(raw = {}) {
  return {
    ...raw,
    id: raw.id ?? raw.armId,
    name: raw.name ?? raw.armName,
    type: raw.type ?? raw.armType,
    onlineStatus: raw.onlineStatus ?? raw.online ?? raw.status,
    runStatus: raw.runStatus ?? raw.status,
    currentTaskId: raw.currentTaskId ?? raw.currentTask,
    updatedAt: raw.updatedAt ?? raw.updateTime ?? raw.time,
  };
}

export function normalizeTeachingPoint(raw = {}) {
  return {
    ...raw,
    id: raw.id ?? raw.pointId,
    name: raw.name ?? raw.pointName,
    type: raw.type ?? raw.pointType,
    armId: raw.armId,
  };
}

export function normalizeArms(list = []) {
  return Array.isArray(list) ? list.map(normalizeArm) : list;
}
