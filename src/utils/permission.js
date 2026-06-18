export const ACTION_KEYS = {
  TASK_PAUSE: 'TASK_PAUSE',
  TASK_RESUME: 'TASK_RESUME',
  TASK_CANCEL: 'TASK_CANCEL',
  TASK_RETRY: 'TASK_RETRY',
  ALARM_ACK: 'ALARM_ACK',
  ALARM_RECOVER: 'ALARM_RECOVER',
  COMMAND_RETRY: 'COMMAND_RETRY',
  COMMAND_CANCEL: 'COMMAND_CANCEL',
  DEVICE_CHECK: 'DEVICE_CHECK',
  ARM_EMERGENCY_STOP: 'ARM_EMERGENCY_STOP',
  ARM_RESET: 'ARM_RESET',
  MAP_SAVE: 'MAP_SAVE',
  POINT_SAVE: 'POINT_SAVE',
};

const DANGEROUS_ACTIONS = new Set([
  ACTION_KEYS.TASK_CANCEL,
  ACTION_KEYS.ALARM_RECOVER,
  ACTION_KEYS.COMMAND_CANCEL,
  ACTION_KEYS.ARM_EMERGENCY_STOP,
  ACTION_KEYS.ARM_RESET,
]);

export function canOperate(actionKey, context = {}) {
  if (context.requireLogin && !context.isLoggedIn) return false;
  if (DANGEROUS_ACTIONS.has(actionKey)) return Boolean(context.allowDangerous);
  return true;
}

export function getOperatePermissionReason(actionKey, context = {}) {
  if (context.requireLogin && !context.isLoggedIn) {
    return '无权限：请登录后再执行该操作';
  }
  if (DANGEROUS_ACTIONS.has(actionKey) && !context.allowDangerous) {
    return '无权限：当前账号不能执行高风险操作';
  }
  return '';
}
