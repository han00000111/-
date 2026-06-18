// Current mock data adapter.
// Replace only the async branch when the real backend is connected.
import { devices, deviceAttachments, devicePoints, taskPoints, trendSeries } from '../mockData.js';
import { API_CONFIG, get, post, unwrapResponse } from '../api';
import { normalizeDevice, normalizeDevices } from './adapters';

export function getDevices() {
  return normalizeDevices(devices);
}

export function getDeviceById(id) {
  return getDevices().find((device) => device.id === id || device.deviceId === id || device.code === id);
}

export function getDeviceSummary() {
  const rows = getDevices();
  return {
    total: rows.length,
    online: rows.filter((device) => device.onlineStatus === '\u5728\u7ebf').length,
    running: rows.filter((device) => device.status === '\u8fd0\u884c\u4e2d').length,
    offline: rows.filter((device) => device.onlineStatus === '\u79bb\u7ebf').length,
    abnormal: rows.filter((device) => device.alarmCount > 0).length,
    maintenance: rows.filter((device) => device.status === '\u7ef4\u62a4\u4e2d').length,
  };
}

export function getDeviceTypes() {
  return [...new Set(getDevices().map((device) => device.type))];
}

export function getDevicePoints(deviceId) {
  return deviceId ? (devicePoints[deviceId] ?? []) : devicePoints;
}

export function getDeviceHistory(deviceId) {
  return {
    deviceId,
    points: getDevicePoints(deviceId),
    trendSeries,
  };
}

export function getDevicePointMap() {
  return devicePoints;
}

export function getTaskPointMap() {
  return taskPoints;
}

export function getDeviceAttachments() {
  return deviceAttachments;
}

export function getActiveDeviceIssues() {
  return getDevices().filter(
    (device) =>
      device.onlineStatus === '\u79bb\u7ebf' ||
      device.alarmCount > 0 ||
      device.status === '\u7ef4\u62a4\u4e2d',
  );
}

function unwrapList(response, url) {
  const data = unwrapResponse(response, { url });
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.items) ? data.items : [];
}

export async function fetchDevices(params = {}) {
  if (API_CONFIG.useMockService) {
    return getDevices();
  }

  const url = '/api/devices';
  const response = await get(url, { query: params });
  return normalizeDevices(unwrapList(response, url));
}

export async function fetchDeviceSummary() {
  if (API_CONFIG.useMockService) {
    return getDeviceSummary();
  }

  const url = '/api/devices/summary';
  const response = await get(url);
  return unwrapResponse(response, { url });
}

export async function fetchDeviceTypes() {
  if (API_CONFIG.useMockService) {
    return getDeviceTypes();
  }

  const url = '/api/devices/types';
  const response = await get(url);
  return unwrapList(response, url);
}

export async function fetchActiveDeviceIssues() {
  if (API_CONFIG.useMockService) {
    return getActiveDeviceIssues();
  }

  const url = '/api/devices/issues/active';
  const response = await get(url);
  return normalizeDevices(unwrapList(response, url));
}

export async function fetchDeviceDetail(id) {
  if (API_CONFIG.useMockService) {
    return getDeviceById(id);
  }

  const url = `/api/devices/${encodeURIComponent(id)}`;
  const response = await get(url);
  const data = unwrapResponse(response, { url });
  return data ? normalizeDevice(data) : data;
}

async function runDeviceAction(deviceId, action, message) {
  if (API_CONFIG.useMockService) {
    return { success: true, deviceId, status: '已发起', message };
  }
  const url = `/api/devices/${encodeURIComponent(deviceId)}/${action}`;
  return unwrapResponse(await post(url), { url });
}

export async function checkDeviceConnection(deviceId) {
  return runDeviceAction(deviceId, 'check-connection', '设备连接检查已发起');
}

export async function refreshDeviceStatus(deviceId) {
  return runDeviceAction(deviceId, 'refresh-status', '设备状态已刷新');
}
