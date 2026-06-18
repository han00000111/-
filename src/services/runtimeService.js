// Current mock data adapter.
// Replace only the async branch when the real backend is connected.
import { navItems, robotStatus, robots, trendSeries } from '../mockData.js';
import { API_CONFIG, get, unwrapResponse } from '../api';

export function getSystemStatus() {
  return {
    robotStatus,
    robots,
  };
}

export function getTopBarStatus() {
  return {
    navItems,
    backend: '\u6b63\u5e38',
    mqtt: '\u6b63\u5e38',
    logUpload: '\u6b63\u5e38',
    cache: '7 \u5929',
  };
}

export function getMockNow() {
  return '2025-05-27 10:30:45';
}

export function getNavItems() {
  return navItems;
}

export function getRobots() {
  return robots;
}

export function getRobotStatus() {
  return robotStatus;
}

export function getTrendSeries() {
  return trendSeries;
}

export async function fetchSystemStatus() {
  if (API_CONFIG.useMockService) {
    return getSystemStatus();
  }

  const url = '/api/system/status';
  const response = await get(url);
  return unwrapResponse(response, { url });
}

export async function fetchTopBarStatus() {
  if (API_CONFIG.useMockService) {
    return getTopBarStatus();
  }

  const url = '/api/system/status';
  const response = await get(url);
  return unwrapResponse(response, { url });
}
