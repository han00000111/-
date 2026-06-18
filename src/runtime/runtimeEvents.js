export const RUNTIME_EVENT_TYPES = {
  DEVICE_STATUS_CHANGED: 'DEVICE_STATUS_CHANGED',
  TASK_STEP_ADVANCED: 'TASK_STEP_ADVANCED',
  ALARM_CREATED: 'ALARM_CREATED',
  ALARM_RECOVERED: 'ALARM_RECOVERED',
  COMMAND_ACK_UPDATED: 'COMMAND_ACK_UPDATED',
  VISION_RESULT_UPDATED: 'VISION_RESULT_UPDATED',
};

export function createRuntimeLog(event) {
  return {
    time: event.time,
    objectType: event.objectType ?? 'runtime',
    objectId: event.objectId ?? event.target ?? '-',
    deviceId: event.deviceId ?? event.objectId ?? '-',
    taskId: event.taskId ?? '',
    logType: event.logType ?? 'runtime',
    content: event.content,
    params: event.params ?? '-',
    status: event.status ?? '\u6b63\u5e38',
    operator: 'mock-runtime',
  };
}
