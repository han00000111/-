// 当前为 mock 数据适配层。
// 后续接入真实后端时，只替换本文件内部实现，页面不直接改 mockData。
import { armActionLogs, armActionSteps, armActionTemplates, armCommandReceipts, armTeachingPoints, armTemplateLogs, endEffectors, robotArms, teachingPointLogs } from '../mockData.js';
import { API_CONFIG, post, unwrapResponse } from '../api';

export function getArms() {
  return robotArms;
}

export function getArmById(id) {
  return robotArms.find((arm) => arm.id === id);
}

export function getTeachingPoints() {
  return armTeachingPoints;
}

export function getArmTemplates() {
  return armActionTemplates;
}

export function getEndEffectors() {
  return endEffectors;
}

export function getArmRecords() {
  return armActionLogs;
}

export function getArmActionLogs() {
  return armActionLogs;
}

export function getArmActionSteps() {
  return armActionSteps;
}

export function getArmCommandReceipts() {
  return armCommandReceipts;
}

export function getArmTemplateLogs() {
  return armTemplateLogs;
}

export function getTeachingPointLogs() {
  return teachingPointLogs;
}

async function runArmAction(armId, action, body, message) {
  if (API_CONFIG.useMockService) {
    return { success: true, armId, actionId: body?.actionId, status: '已下发', message };
  }
  const url = `/api/arms/${encodeURIComponent(armId)}/${action}`;
  return unwrapResponse(await post(url, body), { url });
}

export async function emergencyStopArm(armId) {
  return runArmAction(armId, 'emergency-stop', undefined, '急停指令已下发');
}

export async function resetArm(armId) {
  return runArmAction(armId, 'reset', undefined, '复位指令已下发');
}

export async function executeArmAction(armId, actionId) {
  return runArmAction(armId, 'actions', { actionId }, '动作执行已下发');
}

export async function saveTeachingPoint(point) {
  if (API_CONFIG.useMockService) {
    return { success: true, point, message: '示教点已保存' };
  }
  const url = '/api/arms/teaching-points';
  return unwrapResponse(await post(url, point), { url });
}
