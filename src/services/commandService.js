// 当前为 mock 数据适配层。
// 后续接入真实后端时，只替换本文件内部实现，页面不直接改 mockData。
import { commandLogs, robotCommandLogs } from '../mockData.js';
import { API_CONFIG, post, unwrapResponse } from '../api';
import { normalizeCommand, normalizeCommands } from './adapters';

export function getCommands() {
  return normalizeCommands(commandLogs);
}

export function getCommandById(id) {
  const found = commandLogs.find((command) => command.id === id || command.commandId === id);
  return found ? normalizeCommand(found) : found;
}

export function getCommandRecords() {
  return normalizeCommands(commandLogs);
}

export function getCommandSummary() {
  return {
    total: commandLogs.length,
  };
}

export function getCommandLogs() {
  return commandLogs;
}

export function getRobotCommandLogs() {
  return robotCommandLogs;
}

async function runCommandAction(commandId, action, message) {
  if (API_CONFIG.useMockService) {
    return { success: true, commandId, status: '已下发', message };
  }
  const url = `/api/commands/${encodeURIComponent(commandId)}/${action}`;
  return unwrapResponse(await post(url), { url });
}

export async function retryCommand(commandId) {
  return runCommandAction(commandId, 'retry', '指令重试已下发');
}

export async function cancelCommand(commandId) {
  return runCommandAction(commandId, 'cancel', '指令已取消');
}

export async function resendCommand(commandId) {
  return runCommandAction(commandId, 'resend', '指令重新发送成功');
}
