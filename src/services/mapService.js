// 当前为 mock 数据适配层。
// 后续接入真实后端时，只替换本文件内部实现，页面不直接改 mockData。
import { mapAreas, mapDoors, mapNoGoAreas, mapObstacles, mapPoints, mapRoutes, mapVirtualWalls, mapWalls, mappingLogs, mappingTasks, maps } from '../mockData.js';
import { API_CONFIG, del, post, unwrapResponse } from '../api';

export function getMaps() {
  return maps;
}

export function getCurrentMap() {
  return maps[0];
}

export function getMapPoints() {
  return mapPoints;
}

export function getRoutes() {
  return mapRoutes;
}

export function getAutoMappingLogs() {
  return mappingLogs;
}

export function getMapAreas() {
  return mapAreas;
}

export function getMapDoors() {
  return mapDoors;
}

export function getMapNoGoAreas() {
  return mapNoGoAreas;
}

export function getMapObstacles() {
  return mapObstacles;
}

export function getMapVirtualWalls() {
  return mapVirtualWalls;
}

export function getMapWalls() {
  return mapWalls;
}

export function getMappingTasks() {
  return mappingTasks;
}

async function runMapAction(url, body, result, method = post) {
  if (API_CONFIG.useMockService) return { success: true, ...result };
  const response = method === del ? await del(url) : await method(url, body);
  return unwrapResponse(response, { url });
}

export async function saveMapPoint(point) {
  return runMapAction('/api/maps/points', point, { point, message: '地图点位已保存' });
}

export async function deleteMapPoint(pointId) {
  const url = `/api/maps/points/${encodeURIComponent(pointId)}`;
  return runMapAction(url, undefined, { pointId, message: '地图点位已删除' }, del);
}

export async function saveRoute(route) {
  return runMapAction('/api/maps/routes', route, { route, message: '路线已保存' });
}

export async function startAutoMapping(robotId) {
  return runMapAction('/api/mapping/tasks/start', { robotId }, {
    robotId,
    status: '建图中',
    message: '自动建图已启动',
  });
}

export async function stopAutoMapping(taskId) {
  return runMapAction(`/api/mapping/tasks/${encodeURIComponent(taskId)}/stop`, undefined, {
    taskId,
    status: '已停止',
    message: '自动建图已停止',
  });
}
