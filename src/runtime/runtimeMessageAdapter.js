import { RUNTIME_CONFIG } from './runtimeConfig.js';
import { normalizeAlarm, normalizeVisionResult, normalizeLogRecord } from '../services/adapters';

// WebSocket 实时消息类型（与 docs/api-contract.md「实时消息通道」一致）。
export const RUNTIME_MESSAGE_TYPES = {
  DEVICE_STATUS_UPDATED: 'DEVICE_STATUS_UPDATED',
  TASK_STEP_UPDATED: 'TASK_STEP_UPDATED',
  TASK_STATUS_UPDATED: 'TASK_STATUS_UPDATED',
  ALARM_CREATED: 'ALARM_CREATED',
  ALARM_UPDATED: 'ALARM_UPDATED',
  COMMAND_ACK_UPDATED: 'COMMAND_ACK_UPDATED',
  VISION_RESULT_CREATED: 'VISION_RESULT_CREATED',
  MAP_BUILDING_UPDATED: 'MAP_BUILDING_UPDATED',
  SYSTEM_STATUS_UPDATED: 'SYSTEM_STATUS_UPDATED',
  LOG_CREATED: 'LOG_CREATED',
};

// 把 WebSocket 原始消息（字符串 JSON 或对象）归一化为 { type, timestamp, payload }。
// 解析失败 / 缺 type 时返回 null（调用方安全忽略）。
export function normalizeRuntimeMessage(rawMessage) {
  let obj = rawMessage;
  if (typeof rawMessage === 'string') {
    try {
      obj = JSON.parse(rawMessage);
    } catch {
      return null;
    }
  }
  if (!obj || typeof obj !== 'object' || !obj.type) return null;
  return {
    type: obj.type,
    timestamp: obj.timestamp ?? null,
    payload: obj.payload ?? {},
  };
}

// 工具：按 id 字段匹配（兼容多种命名）。
function matchId(item, payload, keys) {
  for (const k of keys) {
    if (payload[k] != null && item != null) {
      if (item.id === payload[k] || item[k] === payload[k]) return true;
    }
  }
  return false;
}

// 根据消息类型返回新的 state（不修改原 state）。未知 type / 缺字段时安全返回原 state。
export function applyRuntimeMessage(state, message) {
  if (!state || !message || !message.type) return state;
  const payload = message.payload || {};
  const T = RUNTIME_MESSAGE_TYPES;

  switch (message.type) {
    case T.DEVICE_STATUS_UPDATED: {
      if (!Array.isArray(state.devices)) return state;
      const devices = state.devices.map((device) =>
        matchId(device, payload, ['id', 'deviceId'])
          ? { ...device, ...payload }
          : device,
      );
      return { ...state, devices };
    }

    case T.TASK_STEP_UPDATED:
    case T.TASK_STATUS_UPDATED: {
      if (!Array.isArray(state.tasks)) return state;
      const tasks = state.tasks.map((task) =>
        matchId(task, payload, ['id', 'taskId'])
          ? { ...task, ...payload }
          : task,
      );
      return { ...state, tasks };
    }

    case T.ALARM_CREATED: {
      if (!payload || Object.keys(payload).length === 0) return state;
      const alarms = Array.isArray(state.alarms) ? state.alarms : [];
      return { ...state, alarms: [normalizeAlarm(payload), ...alarms] };
    }

    case T.ALARM_UPDATED: {
      if (!Array.isArray(state.alarms)) return state;
      const alarms = state.alarms.map((alarm) =>
        matchId(alarm, payload, ['id', 'alarmId']) || alarm.name === payload.name
          ? { ...alarm, ...payload }
          : alarm,
      );
      return { ...state, alarms };
    }

    case T.COMMAND_ACK_UPDATED: {
      if (!Array.isArray(state.commands)) return state;
      const commands = state.commands.map((command) =>
        matchId(command, payload, ['id', 'commandId'])
          ? { ...command, ...payload }
          : command,
      );
      return { ...state, commands };
    }

    case T.VISION_RESULT_CREATED: {
      if (!payload || Object.keys(payload).length === 0) return state;
      const visionResults = Array.isArray(state.visionResults) ? state.visionResults : [];
      return { ...state, visionResults: [normalizeVisionResult(payload), ...visionResults] };
    }

    case T.MAP_BUILDING_UPDATED: {
      // 建图进度：合并到 systemStatus.mapping（不存在则新建），不报错。
      return {
        ...state,
        systemStatus: { ...(state.systemStatus || {}), mapping: { ...payload } },
      };
    }

    case T.SYSTEM_STATUS_UPDATED: {
      return {
        ...state,
        systemStatus: { ...(state.systemStatus || {}), ...payload },
      };
    }

    case T.LOG_CREATED: {
      if (!payload || Object.keys(payload).length === 0) return state;
      const logs = Array.isArray(state.logs) ? state.logs : [];
      return { ...state, logs: [normalizeLogRecord(payload), ...logs].slice(0, RUNTIME_CONFIG.maxLogs) };
    }

    default:
      return state;
  }
}
