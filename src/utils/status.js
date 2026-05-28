export const TASK_STATUS = {
  QUEUED: '排队中',
  RUNNING: '运行中',
  PAUSED: '暂停',
  FAILED: '失败',
  ABORTED: '已中止',
  DONE: '已完成',
};

export const ALARM_STATUS = {
  UNHANDLED: '未处理',
  PROCESSING: '处理中',
  RECOVERED: '已恢复',
  ARCHIVED: '已归档',
};

export const POINT_STATUS = {
  NORMAL: '正常',
  TIMEOUT: '超时',
  ABNORMAL: '异常',
  UNCONFIGURED: '未配置',
};

export const COMMAND_STATUS = {
  NOT_SENT: '未下发',
  SENT: '已下发',
  SEND_FAILED: '下发失败',
  WAITING: '待回执',
  CONFIRMED: '已确认',
  TIMEOUT: '超时',
  FAILED: '失败',
  HANDLED: '已处理',
};

export const INTERLOCK_STATUS = {
  SATISFIED: '满足',
  UNSATISFIED: '不满足',
  CLOSED: '已关闭',
  LOCKED: '已锁紧',
  NOT_TRIGGERED: '未触发',
};

const OK_STATUSES = new Set([
  POINT_STATUS.NORMAL,
  '在线',
  TASK_STATUS.RUNNING,
  '启用',
  COMMAND_STATUS.CONFIRMED,
  COMMAND_STATUS.SENT,
  COMMAND_STATUS.HANDLED,
  INTERLOCK_STATUS.SATISFIED,
  INTERLOCK_STATUS.CLOSED,
  INTERLOCK_STATUS.LOCKED,
  INTERLOCK_STATUS.NOT_TRIGGERED,
  '良好',
  '完成',
  TASK_STATUS.DONE,
  ALARM_STATUS.RECOVERED,
  ALARM_STATUS.ARCHIVED,
  '低危',
]);

const WARN_STATUSES = new Set([
  '偏高',
  TASK_STATUS.PAUSED,
  '暂停中',
  '停用',
  POINT_STATUS.TIMEOUT,
  POINT_STATUS.UNCONFIGURED,
  COMMAND_STATUS.NOT_SENT,
  COMMAND_STATUS.WAITING,
  TASK_STATUS.QUEUED,
  '待执行',
  '等待开始',
  ALARM_STATUS.PROCESSING,
  '维护中',
  '等待前置条件',
  '检测中',
  '中危',
]);

const BAD_STATUSES = new Set([
  TASK_STATUS.FAILED,
  COMMAND_STATUS.SEND_FAILED,
  '离线',
  '停止',
  '报警',
  ALARM_STATUS.UNHANDLED,
  POINT_STATUS.ABNORMAL,
  TASK_STATUS.ABORTED,
  '已跳过',
  '未执行',
  INTERLOCK_STATUS.UNSATISFIED,
  '高危',
]);

export function getStatusTone(status) {
  if (OK_STATUSES.has(status)) return 'ok';
  if (WARN_STATUSES.has(status)) return 'warn';
  if (BAD_STATUSES.has(status)) return 'bad';
  return 'neutral';
}

export function getStatusPriority(status) {
  if (BAD_STATUSES.has(status)) return 0;
  if (WARN_STATUSES.has(status)) return 1;
  if (OK_STATUSES.has(status)) return 2;
  return 3;
}

export function isAbnormalStatus(status) {
  return getStatusPriority(status) === 0 || [POINT_STATUS.TIMEOUT, POINT_STATUS.UNCONFIGURED].includes(status);
}

export function isProblemPoint(row) {
  return [POINT_STATUS.TIMEOUT, POINT_STATUS.ABNORMAL, POINT_STATUS.UNCONFIGURED].includes(row?.collectStatus);
}
