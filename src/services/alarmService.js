// Current mock data adapter.
// Replace only the async branch when the real backend is connected.
import { alarms, interlocks } from '../mockData.js';
import { API_CONFIG, get, post, unwrapResponse } from '../api';
import { normalizeAlarm, normalizeAlarms, normalizeInterlocks } from './adapters';

export function getAlarms() {
  return normalizeAlarms(alarms);
}

export function getAlarmById(id) {
  const found = alarms.find((alarm) => alarm.id === id || alarm.name === id);
  return found ? normalizeAlarm(found) : found;
}

export function getActiveAlarms() {
  return normalizeAlarms(alarms);
}

export function getInterlocks() {
  return normalizeInterlocks(interlocks);
}

export function getAlarmSummary() {
  return {
    total: alarms.length,
    active: alarms.filter((alarm) => alarm.status !== '\u5df2\u6062\u590d').length,
    high: alarms.filter((alarm) => alarm.level === '\u9ad8\u5371').length,
    medium: alarms.filter((alarm) => alarm.level === '\u4e2d\u5371').length,
    unhandled: alarms.filter((alarm) => alarm.status === '\u672a\u5904\u7406').length,
  };
}

function unwrapList(response, url) {
  const data = unwrapResponse(response, { url });
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.items) ? data.items : [];
}

export async function fetchAlarms(params = {}) {
  if (API_CONFIG.useMockService) {
    return getAlarms();
  }

  const url = '/api/alarms';
  const response = await get(url, { query: params });
  return normalizeAlarms(unwrapList(response, url));
}

export async function fetchActiveAlarms() {
  if (API_CONFIG.useMockService) {
    return getActiveAlarms();
  }

  const url = '/api/alarms/active';
  const response = await get(url);
  return normalizeAlarms(unwrapList(response, url));
}

export async function fetchAlarmSummary() {
  if (API_CONFIG.useMockService) {
    return getAlarmSummary();
  }

  const url = '/api/alarms/summary';
  const response = await get(url);
  return unwrapResponse(response, { url });
}

export async function fetchInterlocks() {
  if (API_CONFIG.useMockService) {
    return getInterlocks();
  }

  const url = '/api/interlocks';
  const response = await get(url);
  return normalizeInterlocks(unwrapList(response, url));
}

export async function fetchAlarmDetail(id) {
  if (API_CONFIG.useMockService) {
    return getAlarmById(id);
  }

  const url = `/api/alarms/${encodeURIComponent(id)}`;
  const response = await get(url);
  const data = unwrapResponse(response, { url });
  return data ? normalizeAlarm(data) : data;
}

async function runAlarmAction(alarmId, action, mockResult) {
  if (API_CONFIG.useMockService) return { success: true, alarmId, ...mockResult };
  const url = `/api/alarms/${encodeURIComponent(alarmId)}/${action}`;
  return unwrapResponse(await post(url), { url });
}

export async function acknowledgeAlarm(alarmId) {
  return runAlarmAction(alarmId, 'ack', { status: '处理中', message: '报警已确认' });
}

export async function recoverAlarm(alarmId) {
  return runAlarmAction(alarmId, 'recover', { status: '已恢复', message: '报警已恢复' });
}

export async function ignoreAlarm(alarmId) {
  return runAlarmAction(alarmId, 'ignore', { status: '已忽略', message: '报警已忽略' });
}
