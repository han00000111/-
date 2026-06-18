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

const INFO_STATUSES = new Set([
  '处理中',
  '执行中',
  '识别中',
  '下发中',
  '建图中',
  'LIVE',
  'SNAPSHOT',
]);

[
  '正常',
  '在线',
  '运行中',
  '已启用',
  '启用',
  '已完成',
  '已校验',
  '通过',
  '识别通过',
  '成功',
  '已上传',
  '已下发',
  '已确认',
  '已处理',
  '已恢复',
  '已归档',
  '满足',
  '良好',
  '无报警',
].forEach((item) => OK_STATUSES.add(item));

[
  '维护中',
  '维护',
  '待机',
  '排队中',
  '暂停',
  '待审核',
  '待触发',
  '待执行',
  '待处理',
  '未处理',
  '待确认',
  '待回执',
  '待下发',
  '中危',
  '低危',
  '低置信度',
  '充电中',
  '导航中',
  '巡检中',
  '未启用',
].forEach((item) => WARN_STATUSES.add(item));

[
  '异常',
  '配置异常',
  '离线',
  '失败',
  '下发失败',
  '停止',
  '急停',
  '未满足',
  '不满足',
  '互锁不满足',
  '高危',
  '超时',
  '模型加载失败',
  '报警',
  '未通过',
  'OFFLINE',
].forEach((item) => BAD_STATUSES.add(item));

const NEUTRAL_STATUSES = new Set(['空闲', '未登录', '未配置', '暂无', '无', '未知', '-']);

export function getStatusTone(status) {
  const value = String(status ?? '').trim();
  if (!value || NEUTRAL_STATUSES.has(value)) return 'neutral';
  if (OK_STATUSES.has(value)) return 'ok';
  if (WARN_STATUSES.has(value)) return 'warn';
  if (BAD_STATUSES.has(value)) return 'bad';
  if (INFO_STATUSES.has(value)) return 'info';
  if (['异常', '失败', '离线', '急停', '超时', '不满足', '未通过', '模型加载失败'].some((keyword) => value.includes(keyword))) return 'bad';
  if (value.includes('报警') && value !== '无报警') return 'bad';
  if (['待', '排队', '暂停', '维护', '中危', '低置信度', '充电中', '导航中', '巡检中'].some((keyword) => value.includes(keyword))) return 'warn';
  if (['正常', '在线', '完成', '确认', '恢复', '成功', '通过', '满足', '良好', '启用', '上传', '下发'].some((keyword) => value.includes(keyword))) return 'ok';
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
