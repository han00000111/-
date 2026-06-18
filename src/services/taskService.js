// Current mock data adapter.
// Replace only the async branch when the real backend is connected.
import { stepLogs, stepsByTask, taskAttachments, taskPoints, tasks } from '../mockData.js';
import { API_CONFIG, get, post, unwrapResponse } from '../api';
import { normalizeTask, normalizeTasks } from './adapters';

export function getTasks() {
  return normalizeTasks(tasks);
}

export function getTaskById(id) {
  const found = tasks.find((task) => task.id === id);
  return found ? normalizeTask(found) : found;
}

export function getTaskQueue() {
  return normalizeTasks(tasks);
}

export function getCurrentTask() {
  return tasks[0] ? normalizeTask(tasks[0]) : tasks[0];
}

export function getTaskRecords() {
  return stepLogs;
}

export function getStepLogs() {
  return stepLogs;
}

export function getStepsByTask() {
  return stepsByTask;
}

export function getTaskAttachments() {
  return taskAttachments;
}

export function getTaskPoints() {
  return taskPoints;
}

export function getTaskSummary() {
  return {
    total: tasks.length,
    running: tasks.filter((task) => task.status === '\u8fd0\u884c\u4e2d').length,
    queued: tasks.filter((task) => task.status === '\u6392\u961f\u4e2d').length,
    paused: tasks.filter((task) => task.status === '\u6682\u505c').length,
    failed: tasks.filter((task) => task.status === '\u5931\u8d25').length,
    alarmTasks: tasks.filter((task) => task.alarmCount > 0).length,
  };
}

function unwrapList(response, url) {
  const data = unwrapResponse(response, { url });
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.items) ? data.items : [];
}

export async function fetchTasks(params = {}) {
  if (API_CONFIG.useMockService) {
    return getTasks();
  }

  const url = '/api/tasks';
  const response = await get(url, { query: params });
  return normalizeTasks(unwrapList(response, url));
}

export async function fetchTaskSummary() {
  if (API_CONFIG.useMockService) {
    return getTaskSummary();
  }

  const url = '/api/tasks/summary';
  const response = await get(url);
  return unwrapResponse(response, { url });
}

export async function fetchCurrentTask() {
  if (API_CONFIG.useMockService) {
    return getCurrentTask();
  }

  const url = '/api/tasks/current';
  const response = await get(url);
  const data = unwrapResponse(response, { url });
  return data ? normalizeTask(data) : data;
}

export async function fetchTaskRecords(params = {}) {
  if (API_CONFIG.useMockService) {
    return getTaskRecords();
  }

  const url = '/api/tasks/records';
  const response = await get(url, { query: params });
  return unwrapList(response, url);
}

async function runTaskAction(taskId, action, mockResult) {
  if (API_CONFIG.useMockService) return { success: true, taskId, ...mockResult };
  const url = `/api/tasks/${encodeURIComponent(taskId)}/${action}`;
  return unwrapResponse(await post(url), { url });
}

export async function pauseTask(taskId) {
  return runTaskAction(taskId, 'pause', { status: '暂停', message: '暂停任务成功' });
}

export async function resumeTask(taskId) {
  return runTaskAction(taskId, 'resume', { status: '运行中', message: '任务已恢复' });
}

export async function cancelTask(taskId) {
  return runTaskAction(taskId, 'cancel', { status: '已中止', message: '任务已取消' });
}

export async function retryTask(taskId) {
  return runTaskAction(taskId, 'retry', { status: '排队中', message: '任务重新下发成功' });
}

export async function dispatchTask(taskId) {
  return runTaskAction(taskId, 'dispatch', { status: '排队中', message: '任务重新下发成功' });
}
