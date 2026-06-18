// 当前为 mock 数据适配层。
// 后续接入真实后端时，只替换本文件内部实现，页面不直接改 mockData。
import { cameras, visionLogs, visionModels, visionResults, visionTasks } from '../mockData.js';
import { API_CONFIG, post, unwrapResponse } from '../api';
// 注意：此处 normalizeVisionResult 为「字段适配」，与 AppRuntime 负责 bbox/roi 渲染的同名函数不同。
import { normalizeVisionResult, normalizeVisionResults } from './adapters';

export function getCameras() {
  return cameras;
}

export function getVisionTasks() {
  return visionTasks;
}

export function getVisionResults() {
  return normalizeVisionResults(visionResults);
}

export function getVisionModels() {
  return visionModels;
}

export function getCurrentVisionResult() {
  return visionResults[0] ? normalizeVisionResult(visionResults[0]) : visionResults[0];
}

export function getVisionLogs() {
  return visionLogs;
}

async function runVisionAction(url, result) {
  if (API_CONFIG.useMockService) return { success: true, ...result };
  return unwrapResponse(await post(url), { url });
}

export async function retryVisionTask(taskId) {
  return runVisionAction(`/api/vision/tasks/${encodeURIComponent(taskId)}/retry`, {
    taskId,
    message: '视觉任务重试已发起',
  });
}

export async function markVisionResultReviewed(resultId) {
  return runVisionAction(`/api/vision/results/${encodeURIComponent(resultId)}/review`, {
    resultId,
    message: '视觉结果已复核',
  });
}

export async function transferVisionResultToManual(resultId) {
  return runVisionAction(`/api/vision/results/${encodeURIComponent(resultId)}/manual`, {
    resultId,
    message: '视觉结果已转人工处理',
  });
}
