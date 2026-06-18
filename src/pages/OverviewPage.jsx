import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as Runtime from '../AppRuntime';
import { DataStateBlock } from '../components/common';
import {
  useActiveAlarmsResource,
  useCurrentTaskResource,
  useDevicesResource,
  useDeviceSummaryResource,
  useTasksResource,
  useTaskSummaryResource,
} from '../hooks';
import { RUNTIME_CONFIG } from '../runtime';

const {
  Activity,
  AlarmActionPanel,
  AlarmCardList,
  AlarmOverviewBar,
  AlarmPointDetail,
  AlertTriangle,
  AttachmentEditModal,
  AttachmentList,
  AttachmentPreview,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Cpu,
  CurrentTaskCard,
  DEVICE_OVERVIEW_SORT_OPTIONS,
  DataTable,
  Database,
  EmptyState,
  DeviceAttachmentManager,
  DeviceTable,
  Download,
  ExportButton,
  ExportConfirmModal,
  FileClock,
  Gauge,
  History,
  Info,
  InterlockTable,
  JOYSTICK_BASE_SIZE,
  JOYSTICK_MAX_OFFSET,
  KeyPointOverview,
  LogTable,
  LoginModal,
  MappingPreviewSvg,
  MiniTrend,
  MonitorCog,
  NumericPointDetail,
  PERMISSIONS,
  Pause,
  Play,
  PointDetail,
  PointTable,
  RecentLogs,
  RobotMapCanvas,
  RotateCcw,
  Search,
  SearchSelect,
  SectionTitle,
  SegmentedFilter,
  Settings,
  ShieldCheck,
  Sidebar,
  SimpleLogTable,
  Square,
  StatusBadge,
  StatusPointDetail,
  StatusText,
  StepList,
  SummaryStrip,
  TaskActions,
  TaskQueue,
  TerminalSquare,
  TopBar,
  TrendChart,
  UserAvatar,
  VirtualJoystick,
  alarmExportColumns,
  alarms,
  allLogs,
  armActionLogs,
  armActionRecordExportColumns,
  armActionSteps,
  armActionTemplates,
  armCommandReceipts,
  armCurrentActionRecordExportColumns,
  armTabs,
  armTeachingPoints,
  armTemplateLogs,
  auditLogs,
  buildAlarmExportRow,
  buildCommandReceiptExportRow,
  buildExportFilename,
  buildLogExportRow,
  buildTaskExportRow,
  buildTaskProcessSteps,
  cameras,
  can,
  commandLogs,
  commandReceiptExportColumns,
  comparePointRows,
  defaultProcessStepNames,
  deviceAttachments,
  devicePoints,
  deviceTabs,
  devices,
  endEffectors,
  exportRowsToCsv,
  filterAlarms,
  filterDeviceOverviewRows,
  filterDeviceRows,
  filterDevices,
  filterHandlingLogs,
  filterInterlockRows,
  filterLogs,
  filterPointManagementRows,
  filterTasks,
  formatMotionValue,
  formatNowTime,
  formatPointDelta,
  formatPointNumber,
  formatPointTypeWithUnit,
  formatTrendValue,
  getActionIcon,
  getActivePointSummaryFilter,
  getAlarmActionPermission,
  getAlarmActionResult,
  getAlarmActionsByStatus,
  getAlarmAnalysis,
  getAlarmComparison,
  getAlarmHandlingContext,
  getAlarmHistoryRecords,
  getAlarmNodeNote,
  getAlarmOperationContext,
  getAlarmOverviewStats,
  getAlarmPointDetail,
  getAlarmRelatedDeviceIds,
  getAlarmRelatedLogs,
  getAlarmUrgencyText,
  getAttachmentUploadTime,
  getAvatarLetter,
  getComparisonDirection,
  getCriticalPointsForDevice,
  getCurrentJudgementText,
  getCurrentTaskForDevice,
  getDefaultUsername,
  getDefaultVisionBox,
  getDefaultVisionRoi,
  getDeviceAttentionPriority,
  getDeviceCoreStatus,
  getDeviceDetailAbnormalPriority,
  getDeviceHistorySummary,
  getDeviceInterlockStatus,
  getDeviceOverviewRow,
  getDeviceOverviewStats,
  getDeviceOverviewSummaryText,
  getDevicePointsFor,
  getDeviceProblemSummary,
  getDeviceStats,
  getDeviceStatusSummary,
  getDeviceSuggestion,
  getDeviceTypeOverviewRows,
  getDeviceUpdatedTimeValue,
  getEffectiveCurrentStepNumber,
  getHistoryComparison,
  getHistoryPreviewDevices,
  getHistoryRecords,
  getHistoryTimes,
  getInitialPointTypeForDevice,
  getInterlockCheck,
  getInterlockMatrixRows,
  getInterlockPoint,
  getInterlockRecordContent,
  getInterlockShortSummary,
  getInterlockStats,
  getInterlockSuggestion,
  getJoystickDirection,
  getJoystickMotion,
  getKeyPointAbnormalCount,
  getKeyPointProblemText,
  getLatestInterlockTime,
  getNumericAnalysis,
  getNumericChartGuides,
  getNumericNodeNote,
  getNumericNormalRange,
  getNumericThreshold,
  getPermissionReason,
  getPermissionRoleLevel,
  getPermissionScope,
  getPointCollectStatus,
  getPointDetailTitle,
  getPointEnableStatus,
  getPointFrequency,
  getPointGroupSummary,
  getPointIssueReason,
  getPointIssueShortReason,
  getPointIssueSuggestion,
  getPointManagementRows,
  getPointManagementStats,
  getPointMappingSummary,
  getPointRowPriority,
  getPointSource,
  getPointStatusIcon,
  getPointStatusTone,
  getPointTopic,
  getPointTrendInfo,
  getPointType,
  getPointTypeFromLabel,
  getPointTypeLabel,
  getPointUnit,
  getPointValueComparison,
  getPreviousStatusValue,
  getRelatedInterlockSummary,
  getRelatedTaskForDevice,
  getRepresentativeDevicesByType,
  getRobotManualSafetyIssues,
  getRoleLevel,
  getRoutePolyline,
  getSelectedVisionResult,
  getStatusAnalysis,
  getStatusComparison,
  getStatusHistoryRecords,
  getStatusNodeNote,
  getStatusTone,
  getStatusVisualTone,
  getStepNavigateLabel,
  getStepTemplateTeachingPoint,
  getTaskActionConfig,
  getTaskActionOverride,
  getTaskActionPermission,
  getTaskCurrentStepDetail,
  getTaskManagementRecordRows,
  getTaskPrimaryDevice,
  getTaskProgressSummary,
  getTaskRecordCategory,
  getTaskStats,
  getTaskStepDisplayStatus,
  getTaskStepPreview,
  getTaskWorkbenchActionPermission,
  getTaskWorkbenchActions,
  getTrendSeriesForDevice,
  getTrendSeriesForPoint,
  getVisionBoxStyle,
  getVisionBoxTone,
  getVisionImageTypeByTask,
  getVisionObjectByTask,
  getVisionResultKey,
  getVisionStats,
  getVisionSuggestion,
  groupPointRows,
  hasPermission,
  iconMap,
  interlocks,
  isAlarmActionDisabled,
  isDeviceNeedAttention,
  isInterlockSatisfied,
  isProblemPoint,
  isProblemPointByStatus,
  isRecordRelatedToAlarm,
  isSameAttachment,
  logExportColumns,
  mapAreas,
  mapDoors,
  mapNoGoAreas,
  mapObstacles,
  mapPoints,
  mapRoutes,
  mapTabs,
  mapVirtualWalls,
  mapWalls,
  mappingLogs,
  mappingTasks,
  maps,
  matchesFilterValue,
  navItems,
  normalizeVisionResult,
  pageTitle,
  parsePointValue,
  parseTaskProgress,
  permissionReason,
  pointListToString,
  pointManagementExportColumns,
  rangeToCompareLabel,
  renderInterlockValue,
  robotArms,
  robotStatus,
  robots,
  settings,
  sortDeviceOverviewDetailRows,
  sortDeviceOverviewRows,
  stepLogs,
  stepsByTask,
  taskAttachments,
  taskExportColumns,
  taskHasDevice,
  taskPoints,
  tasks,
  teachingPointLogs,
  telemetryLogs,
  toChineseStep,
  trendSeries,
  useMockRuntime,
  visionLogs,
  visionModels,
  visionResults,
  visionTabs,
  visionTasks,
} = Runtime;

export function OverviewPage({
  selectedTask,
  taskList,
  selectedTaskId,
  setSelectedTaskId,
  onTaskAction,
  currentUser,
  openTaskDetail,
  openTaskLogs,
  openDevice,
  setPage,
  setLogFilter,
  setLogTypeFilter,
  setSelectedDeviceId,
}) {
  const runtime = useMockRuntime();
  const devicesResource = useDevicesResource();
  const deviceSummaryResource = useDeviceSummaryResource();
  const tasksResource = useTasksResource();
  const taskSummaryResource = useTaskSummaryResource();
  const activeAlarmsResource = useActiveAlarmsResource();
  const currentTaskResource = useCurrentTaskResource();
  const overviewDevices = RUNTIME_CONFIG.enableMockRuntime ? runtime.devices : (devicesResource.data ?? []);
  const overviewTasks = RUNTIME_CONFIG.enableMockRuntime ? runtime.tasks : (tasksResource.data ?? []);
  const overviewAlarms = RUNTIME_CONFIG.enableMockRuntime ? runtime.alarms : (activeAlarmsResource.data ?? []);
  const liveSelectedTask =
    overviewTasks.find((task) => task.id === selectedTaskId) ??
    (RUNTIME_CONFIG.enableMockRuntime ? overviewTasks[0] ?? selectedTask : currentTaskResource.data);
  const jumpFromAlarm = (alarm) => {
    if (!alarm) return;
    if (alarm.jumpTarget === 'logs') {
      setLogFilter(alarm.name);
      setLogTypeFilter('报警');
      setPage('logs');
      return;
    }
    if (['robot-monitor', 'map-management', 'arm-control', 'vision-recognition'].includes(alarm.jumpTarget)) {
      setPage(alarm.jumpTarget);
      return;
    }
    if (alarm.jumpTarget === 'devices') {
      setSelectedDeviceId(alarm.device);
      setPage('devices');
      return;
    }
    setPage('alarms');
  };

  return (
    <div className="overview-v2">
      <OverviewStatusBar
        alarms={overviewAlarms}
        deviceSummaryResource={deviceSummaryResource}
        devices={overviewDevices}
        setPage={setPage}
        taskSummaryResource={taskSummaryResource}
        tasks={overviewTasks}
      />

      <div className="overview-v2-body">
        <div className="overview-v2-col">
          <section className="panel overview-card exceptions-card">
            <SectionTitle icon={AlertTriangle} title="需要关注" action={<button type="button" className="link-btn" onClick={() => setPage('alarms')}>查看全部</button>} />
            <DataStateBlock
              error={!RUNTIME_CONFIG.enableMockRuntime ? activeAlarmsResource.error : null}
              errorMessage="报警数据暂时无法获取，请稍后重试。"
              onRetry={activeAlarmsResource.reload}
              compact
            >
              <ExceptionFeed alarmRows={overviewAlarms} onAlarmJump={jumpFromAlarm} setPage={setPage} />
            </DataStateBlock>
          </section>

          <section className="panel overview-card health-card">
            <SectionTitle icon={Cpu} title="设备健康" action={<button type="button" className="link-btn" onClick={() => setPage('devices')}>设备总览</button>} />
            <DataStateBlock
              error={!RUNTIME_CONFIG.enableMockRuntime ? devicesResource.error : null}
              errorMessage="设备数据暂时无法获取，请稍后重试。"
              onRetry={devicesResource.reload}
              compact
            >
              <DeviceHealthGrid deviceRows={overviewDevices} onSelect={openDevice} setPage={setPage} />
            </DataStateBlock>
          </section>
        </div>

        <div className="overview-v2-col">
          <section className="panel overview-card focus-card">
            <SectionTitle icon={ClipboardList} title="当前任务" action={<button type="button" className="link-btn" onClick={() => setPage('tasks')}>任务管理</button>} />
            <DataStateBlock
              error={!RUNTIME_CONFIG.enableMockRuntime
                ? (tasksResource.error ?? (!liveSelectedTask ? currentTaskResource.error : null))
                : null}
              empty={!liveSelectedTask}
              emptyTitle="当前暂无运行任务"
              errorMessage="任务数据暂时无法获取，请稍后重试。"
              onRetry={() => {
                tasksResource.reload();
                currentTaskResource.reload();
              }}
              compact
            >
              <>
                <CurrentTaskCard task={liveSelectedTask} onTaskAction={onTaskAction} currentUser={currentUser} onDetail={openTaskDetail} onLogs={openTaskLogs} />
                <TaskMiniQueue taskList={overviewTasks.length ? overviewTasks : taskList} selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} setPage={setPage} />
              </>
            </DataStateBlock>
          </section>

          <section className="panel overview-card recent-card">
            <SectionTitle icon={FileClock} title="最近动态" action={<button type="button" className="link-btn" onClick={() => setPage('logs')}>日志审计</button>} />
            <RecentActivity />
          </section>
        </div>
      </div>
    </div>
  );
}

function OverviewStatusBar({ alarms: alarmRows, deviceSummaryResource, devices: deviceRows, setPage, taskSummaryResource, tasks: taskRows }) {
  const derivedDeviceStats = useMemo(() => getDeviceStats(deviceRows), [deviceRows]);
  const derivedTaskStats = useMemo(() => getTaskStats(taskRows), [taskRows]);
  const deviceStats = RUNTIME_CONFIG.enableMockRuntime
    ? derivedDeviceStats
    : { ...derivedDeviceStats, ...(deviceSummaryResource.data ?? {}) };
  const taskStats = RUNTIME_CONFIG.enableMockRuntime
    ? derivedTaskStats
    : { ...derivedTaskStats, ...(taskSummaryResource.data ?? {}) };
  const high = alarmRows.filter((a) => a.level === '高危' && a.status !== '已恢复').length;
  const mid = alarmRows.filter((a) => a.level === '中危' && a.status !== '已恢复').length;
  const untreated = alarmRows.filter((a) => a.status === '未处理').length;
  const onlineRate = deviceStats.total ? Math.round((deviceStats.online / deviceStats.total) * 100) : 0;

  const cards = [
    { key: 'devices', label: '设备在线率', value: `${onlineRate}%`, sub: `${deviceStats.online}/${deviceStats.total} 在线`, tone: deviceStats.offline > 0 ? 'warn' : 'ok', onClick: () => setPage('devices') },
    { key: 'running', label: '任务运行中', value: taskStats.running, sub: `${taskStats.queued} 个排队`, tone: 'ok', onClick: () => setPage('tasks') },
    { key: 'alarm', label: '未处理报警', value: untreated, sub: high > 0 ? `${high} 高危 / ${mid} 中危` : '无高危', tone: high > 0 ? 'bad' : mid > 0 ? 'warn' : 'ok', onClick: () => setPage('alarms') },
    { key: 'abnormal', label: '异常设备', value: deviceStats.abnormal, sub: `${deviceStats.offline} 台离线`, tone: deviceStats.abnormal > 0 ? 'bad' : 'ok', onClick: () => setPage('devices') },
    { key: 'failed', label: '失败任务', value: taskStats.failed, sub: `${taskStats.alarmTasks} 个带报警`, tone: taskStats.failed > 0 ? 'bad' : 'ok', onClick: () => setPage('tasks') },
  ];

  return (
    <DataStateBlock
      error={!RUNTIME_CONFIG.enableMockRuntime ? (deviceSummaryResource.error ?? taskSummaryResource.error) : null}
      errorMessage="总览统计暂时无法获取，请稍后重试。"
      onRetry={() => {
        deviceSummaryResource.reload();
        taskSummaryResource.reload();
      }}
      compact
    >
      <div className="status-bar">
        {cards.map((c) => (
          <button type="button" key={c.key} className={`status-card ${c.tone}`} onClick={c.onClick}>
            <span className="status-card-label">{c.label}</span>
            <strong className="status-card-value">{c.value}</strong>
            <span className="status-card-sub">{c.sub}</span>
          </button>
        ))}
      </div>
    </DataStateBlock>
  );
}

const ALARM_RANK = { 高危: 0, 中危: 1, 低危: 2 };

// 报警 name 可能重复（mock/runtime 生成同名报警），用稳定复合 key 保证唯一性，index 仅作最后兜底。
function getAlarmKey(alarm, index) {
  return [
    alarm.id || alarm.code || alarm.name || 'alarm',
    alarm.device || alarm.deviceId || alarm.source || alarm.object || 'unknown',
    alarm.type || 'type',
    alarm.time || alarm.createdAt || 'time',
    index,
  ].join('-');
}

function ExceptionFeed({ alarmRows, onAlarmJump, setPage }) {
  const sortedAlarms = useMemo(
    () => [...alarmRows].sort((a, b) => (ALARM_RANK[a.level] ?? 9) - (ALARM_RANK[b.level] ?? 9)),
    [alarmRows],
  );
  const brokenInterlocks = useMemo(
    () => interlocks.filter((it) => !['已关闭', '已锁紧', '未触发', '正常'].includes(it.status)),
    [],
  );
  const hasAny = sortedAlarms.length > 0 || brokenInterlocks.length > 0;

  if (!hasAny) {
    return <EmptyState title="当前暂无报警与互锁异常" compact />;
  }

  const toneOf = (level) => (level === '高危' ? 'bad' : level === '中危' ? 'warn' : 'muted');

  return (
    <div className="exception-feed">
      {sortedAlarms.map((alarm, index) => (
        <button type="button" key={getAlarmKey(alarm, index)} className={`exception-item ${toneOf(alarm.level)} ${alarm.status === '已恢复' ? 'resolved' : ''}`} onClick={() => onAlarmJump(alarm)}>
          <span className="exception-dot" />
          <span className="exception-main">
            <span className="exception-title">{alarm.name}</span>
            <span className="exception-meta">{alarm.device}｜{alarm.type}</span>
          </span>
          <span className="exception-side">
            <StatusBadge status={alarm.level} tone={toneOf(alarm.level) === 'muted' ? 'neutral' : toneOf(alarm.level)} size="sm" className="exception-badge" />
            <StatusBadge status={alarm.status} size="sm" className="exception-status" />
            <span className="exception-time">{alarm.time}</span>
          </span>
        </button>
      ))}
      {brokenInterlocks.map((it) => (
        <button type="button" key={`il-${it.name}-${it.device}`} className="exception-item warn" onClick={() => setPage('alarms')}>
          <span className="exception-dot" />
          <span className="exception-main">
            <span className="exception-title">互锁未满足：{it.name}</span>
            <span className="exception-meta">{it.device}</span>
          </span>
          <span className="exception-side">
            <StatusBadge status="互锁" tone="warn" size="sm" className="exception-badge" />
            <StatusBadge status={it.status} size="sm" className="exception-status" />
            <span className="exception-time">{it.time}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function TaskMiniQueue({ taskList, selectedTaskId, setSelectedTaskId, setPage }) {
  const list = (taskList ?? []).slice(0, 5);
  return (
    <div className="task-mini-queue">
      <div className="task-mini-head">
        <span>任务队列</span>
        <button type="button" className="link-btn" onClick={() => setPage('tasks')}>全部 {taskList?.length ?? 0} 个</button>
      </div>
      {list.map((task) => {
        const tone = task.status === '失败' ? 'bad' : task.alarmCount > 0 ? 'warn' : task.status === '运行中' ? 'ok' : 'muted';
        return (
          <button
            type="button"
            key={task.id}
            className={`task-mini-item ${task.id === selectedTaskId ? 'active' : ''}`}
            onClick={() => setSelectedTaskId(task.id)}
          >
            <span className="task-mini-id">{task.orderNo ?? task.id}</span>
            <span className="task-mini-type">{task.taskType ?? '生产任务'}</span>
            <span className="task-mini-device">{task.targetDevice ?? getTaskPrimaryDevice(task)}</span>
            <StatusBadge status={task.status} tone={tone === 'muted' ? 'neutral' : tone} size="sm" className="task-mini-badge" />
            <span className="task-mini-step">{task.step}</span>
          </button>
        );
      })}
    </div>
  );
}

function DeviceHealthGrid({ deviceRows, onSelect, setPage }) {
  const groups = useMemo(() => {
    const map = new Map();
    deviceRows.forEach((d) => {
      const g = map.get(d.type) ?? { type: d.type, total: 0, online: 0, offline: 0, abnormal: 0, firstAbnormalId: null };
      g.total += 1;
      if (d.online === '在线') g.online += 1;
      if (d.online === '离线') g.offline += 1;
      if (d.alarmCount > 0) {
        g.abnormal += 1;
        if (!g.firstAbnormalId) g.firstAbnormalId = d.id;
      }
      map.set(d.type, g);
    });
    return [...map.values()].sort((a, b) => (b.abnormal + b.offline) - (a.abnormal + a.offline));
  }, [deviceRows]);

  return (
    <div className="device-health-grid">
      {groups.length === 0 ? (
        <EmptyState title="暂无设备健康数据" compact />
      ) : groups.map((g) => {
        const bad = g.offline > 0 || g.abnormal > 0;
        return (
          <button
            type="button"
            key={g.type}
            className={`device-health-cell ${bad ? 'bad' : 'ok'}`}
            onClick={() => (g.firstAbnormalId ? onSelect(g.firstAbnormalId) : setPage('devices'))}
          >
            <span className="device-health-type">{g.type}</span>
            <span className="device-health-count">{g.online}/{g.total}</span>
            <span className="device-health-tags">
              {g.abnormal > 0 && <span className="dh-tag bad">{g.abnormal} 异常</span>}
              {g.offline > 0 && <span className="dh-tag warn">{g.offline} 离线</span>}
              {!bad && <span className="dh-tag ok">正常</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function RecentActivity() {
  const liveLogs = useMockRuntime((state) => state.logs);
  const rows = useMemo(() => filterLogs(liveLogs, '全部', '').slice(0, 7), [liveLogs]);
  if (!rows.length) return <EmptyState title="暂无最近动态" compact />;
  return (
    <div className="recent-activity">
      {rows.map((row, idx) => (
        <div className="activity-item" key={`${row.time}-${idx}`}>
          <span className={`activity-tag ${row.logType === '报警' ? 'bad' : row.logType === '指令' ? 'accent' : 'muted'}`}>{row.logType}</span>
          <span className="activity-content">{row.content}</span>
          <span className="activity-time">{row.time}</span>
        </div>
      ))}
    </div>
  );
}

export default OverviewPage;
