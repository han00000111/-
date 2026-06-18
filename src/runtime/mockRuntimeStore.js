import { getAlarms } from '../services/alarmService.js';
import { getCommands } from '../services/commandService.js';
import { getDevices } from '../services/deviceService.js';
import { getLogs } from '../services/logService.js';
import { getRobotStatus, getRobots, getTopBarStatus } from '../services/runtimeService.js';
import { getTasks } from '../services/taskService.js';
import { getVisionResults } from '../services/visionService.js';
import { RUNTIME_CONFIG } from './runtimeConfig.js';
import { RUNTIME_EVENT_TYPES, createRuntimeLog } from './runtimeEvents.js';

const listeners = new Set();
let timer = null;
let tickCount = 0;

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatClock(date = new Date()) {
  return date.toTimeString().slice(0, 8);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseTaskStep(step = '') {
  const [current = '0', total = '0'] = String(step).split('/').map((item) => Number.parseInt(item, 10));
  return {
    current: Number.isFinite(current) ? current : 0,
    total: Number.isFinite(total) ? total : 0,
  };
}

export function createInitialRuntimeState() {
  const robotStatus = cloneData(getRobotStatus());
  const robots = cloneData(getRobots());
  return {
    devices: cloneData(getDevices()),
    tasks: cloneData(getTasks()),
    alarms: cloneData(getAlarms()),
    commands: cloneData(getCommands()),
    visionResults: cloneData(getVisionResults()),
    logs: cloneData(getLogs()).slice(0, RUNTIME_CONFIG.maxLogs),
    systemStatus: {
      ...cloneData(getTopBarStatus()),
      now: formatClock(),
      robotStatus,
      robots,
    },
  };
}

let runtimeState = createInitialRuntimeState();

export function getRuntimeSnapshot() {
  return runtimeState;
}

export function subscribeRuntime(listener) {
  listeners.add(listener);
  startMockRuntime();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stopMockRuntime();
  };
}

function pushRuntimeLog(log) {
  runtimeState = {
    ...runtimeState,
    logs: [log, ...runtimeState.logs].slice(0, RUNTIME_CONFIG.maxLogs),
  };
}

function updateDevices(now) {
  const devices = runtimeState.devices.map((device, index) => (
    index % 6 === tickCount % 6 ? { ...device, updatedAt: now } : device
  ));

  const robots = runtimeState.systemStatus.robots.map((robot) => {
    const point = String(robot.currentPoint ?? '');
    const isCharging = point.includes('\u5145\u7535');
    const delta = isCharging ? (tickCount % 2) + 1 : -(tickCount % 2);
    return {
      ...robot,
      battery: clamp(Number(robot.battery ?? 0) + delta, 15, 100),
      updatedAt: now,
    };
  });

  const primaryRobot = robots.find((robot) => robot.robotId === runtimeState.systemStatus.robotStatus.robotId) ?? robots[0];
  runtimeState = {
    ...runtimeState,
    devices,
    systemStatus: {
      ...runtimeState.systemStatus,
      robots,
      robotStatus: {
        ...runtimeState.systemStatus.robotStatus,
        battery: primaryRobot?.battery ?? runtimeState.systemStatus.robotStatus.battery,
        updatedAt: now,
      },
    },
  };
}

function updateTasks(now) {
  const tasks = runtimeState.tasks.map((task) => {
    if (task.id !== 'TASK-001') return task;
    const { current, total } = parseTaskStep(task.step);
    if (!total || current >= total || tickCount % 2 !== 0) return { ...task, updatedAt: now };
    const nextStep = current + 1;
    pushRuntimeLog(createRuntimeLog({
      type: RUNTIME_EVENT_TYPES.TASK_STEP_ADVANCED,
      time: now,
      objectType: 'task',
      objectId: task.id,
      taskId: task.id,
      logType: 'runtime',
      content: `${task.id} step advanced to ${nextStep}/${total}`,
      status: task.status,
    }));
    return {
      ...task,
      step: `${nextStep}/${total}`,
      updatedAt: now,
    };
  });
  runtimeState = { ...runtimeState, tasks };
}

function updateVision(now) {
  const visionResults = runtimeState.visionResults.map((row, index) => {
    if (index !== 0 && row.visionTaskId !== 'VT-001') return row;
    const confidence = 92 + ((tickCount + index) % 8);
    const duration = 118 + ((tickCount * 7 + index * 5) % 34);
    return {
      ...row,
      time: now,
      confidence: `${confidence}%`,
      duration: `${duration} ms`,
    };
  });

  if (tickCount > 0 && tickCount % 9 === 0 && visionResults[0]) {
    const base = visionResults[0];
    visionResults.unshift({
      ...base,
      time: now,
      result: '\u4f4e\u7f6e\u4fe1\u5ea6',
      confidence: '88%',
      duration: '156 ms',
      processStatus: '\u5f85\u590d\u6838',
    });
    pushRuntimeLog(createRuntimeLog({
      type: RUNTIME_EVENT_TYPES.VISION_RESULT_UPDATED,
      time: now,
      objectType: 'vision',
      objectId: base.visionTaskId ?? 'VT-001',
      logType: '\u89c6\u89c9',
      content: '\u89c6\u89c9\u8bc6\u522b\u51fa\u73b0\u4f4e\u7f6e\u4fe1\u5ea6\u7ed3\u679c\uff0c\u7b49\u5f85\u590d\u6838',
      status: '\u5f85\u590d\u6838',
    }));
  }

  runtimeState = {
    ...runtimeState,
    visionResults: visionResults.slice(0, 20),
  };
}

function updateAlarms(now) {
  if (tickCount === 0 || tickCount % 10 !== 0) return;

  const isVisionAlarm = tickCount % 20 === 0;
  const alarm = {
    name: isVisionAlarm ? '\u89c6\u89c9\u8bc6\u522b\u4f4e\u7f6e\u4fe1\u5ea6' : '\u70b9\u4f4d\u8d85\u65f6',
    device: isVisionAlarm ? 'CAM-001' : 'CNC-002',
    type: isVisionAlarm ? '\u89c6\u89c9\u62a5\u8b66' : '\u8bbe\u5907\u62a5\u8b66',
    level: isVisionAlarm ? '\u4e2d\u5371' : '\u4f4e\u5371',
    status: '\u672a\u5904\u7406',
    time: now,
    jumpTarget: isVisionAlarm ? 'vision-recognition' : 'devices',
  };

  runtimeState = {
    ...runtimeState,
    alarms: [alarm, ...runtimeState.alarms].slice(0, 12),
  };
  pushRuntimeLog(createRuntimeLog({
    type: RUNTIME_EVENT_TYPES.ALARM_CREATED,
    time: now,
    objectType: 'alarm',
    objectId: alarm.device,
    deviceId: alarm.device,
    logType: '\u62a5\u8b66',
    content: alarm.name,
    status: alarm.status,
  }));
}

function nextRuntimeState() {
  tickCount += 1;
  const now = formatClock();
  runtimeState = {
    ...runtimeState,
    systemStatus: {
      ...runtimeState.systemStatus,
      now,
      backend: '\u6b63\u5e38',
      mqtt: '\u6b63\u5e38',
      logUpload: '\u6b63\u5e38',
    },
  };
  updateDevices(now);
  updateTasks(now);
  updateVision(now);
  updateAlarms(now);
  return runtimeState;
}

export function startMockRuntime() {
  if (!RUNTIME_CONFIG.enableMockRuntime || timer || typeof window === 'undefined') return;
  timer = window.setInterval(() => {
    const snapshot = nextRuntimeState();
    listeners.forEach((listener) => listener(snapshot));
  }, RUNTIME_CONFIG.tickMs);
}

export function stopMockRuntime() {
  if (!timer || typeof window === 'undefined') return;
  window.clearInterval(timer);
  timer = null;
}
