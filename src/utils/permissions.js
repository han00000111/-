export const PERMISSIONS = {
  TASK_ACTION: 'TASK_ACTION',
  TASK_PAUSE: 'TASK_PAUSE',
  ALARM_HANDLE: 'ALARM_HANDLE',
  COMMAND_RETRY: 'COMMAND_RETRY',
  EXPORT_DATA: 'EXPORT_DATA',
  ATTACHMENT_EDIT: 'ATTACHMENT_EDIT',
  ATTACHMENT_DELETE: 'ATTACHMENT_DELETE',
  SETTINGS_EDIT: 'SETTINGS_EDIT',
  INTERLOCK_REFRESH: 'INTERLOCK_REFRESH',
  RECORD_HANDLE: 'RECORD_HANDLE',
  VIEW: 'VIEW',
};

const ROLE_LEVEL = {
  操作员: 1,
  工程师: 2,
  管理员: 3,
};

const REQUIRED_LEVEL = {
  [PERMISSIONS.VIEW]: 0,
  [PERMISSIONS.EXPORT_DATA]: 1,
  [PERMISSIONS.ALARM_HANDLE]: 1,
  [PERMISSIONS.TASK_PAUSE]: 1,
  [PERMISSIONS.INTERLOCK_REFRESH]: 1,
  [PERMISSIONS.RECORD_HANDLE]: 1,
  [PERMISSIONS.COMMAND_RETRY]: 2,
  [PERMISSIONS.ATTACHMENT_EDIT]: 2,
  [PERMISSIONS.TASK_ACTION]: 2,
  [PERMISSIONS.ATTACHMENT_DELETE]: 3,
  [PERMISSIONS.SETTINGS_EDIT]: 3,
};

export function getRoleLevel(user) {
  if (!user) return 0;
  return ROLE_LEVEL[user.role] ?? 0;
}

export function can(user, permission) {
  return getRoleLevel(user) >= (REQUIRED_LEVEL[permission] ?? 0);
}

export function permissionReason(user, action = '该操作') {
  if (!user) return '无权限：请登录后再执行该操作';
  return `无权限：当前角色不可执行${action}`;
}
