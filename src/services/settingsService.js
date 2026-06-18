// Mock data adapter. Replace internals when real backend is connected.
import { settings } from '../mockData.js';
import { API_CONFIG, post, put, unwrapResponse } from '../api';

export function getRuntimeSettings() {
  return settings;
}

export function getAccountPermissions() {
  return [];
}

export function getSystemLinks() {
  // 地址匹配兼容旧 mock 数据中的状态文案（Unicode 转义写法与中文写法）
  return settings.filter((item) => String(item.label).includes('\u5730\u5740') || String(item.label).includes('MQTT') || String(item.label).includes('地址'));
}

export function getSettings() {
  return settings;
}

export async function testSystemLink(linkId) {
  if (API_CONFIG.useMockService) {
    return { success: true, linkId, status: '成功', message: '链路测试成功' };
  }
  const url = `/api/settings/links/${encodeURIComponent(linkId)}/test`;
  return unwrapResponse(await post(url), { url });
}

export async function saveRuntimeSettings(runtimeSettings) {
  if (API_CONFIG.useMockService) {
    return { success: true, settings: runtimeSettings, message: '运行设置已保存' };
  }
  const url = '/api/settings/runtime';
  return unwrapResponse(await put(url, runtimeSettings), { url });
}
