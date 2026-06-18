// 地图相关字段标准化（纯函数）。保留原始字段，补充标准字段。
export function normalizeMapInfo(raw = {}) {
  return {
    ...raw,
    id: raw.id ?? raw.mapId,
    name: raw.name ?? raw.mapName,
    isDefault: raw.isDefault ?? false,
    updatedAt: raw.updatedAt ?? raw.updateTime ?? raw.time,
  };
}

export function normalizeMapPoint(raw = {}) {
  return {
    ...raw,
    id: raw.id ?? raw.pointId,
    mapId: raw.mapId,
    name: raw.name ?? raw.pointName,
    type: raw.type ?? raw.pointType,
  };
}

export function normalizeRoute(raw = {}) {
  return {
    ...raw,
    id: raw.id ?? raw.routeId,
    name: raw.name ?? raw.routeName,
    mapId: raw.mapId,
    status: raw.status,
  };
}

export function normalizeMaps(list = []) {
  return Array.isArray(list) ? list.map(normalizeMapInfo) : list;
}
