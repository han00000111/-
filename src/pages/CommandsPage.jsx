import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as Runtime from '../AppRuntime';
import { ActionFeedback } from '../components/common';
import { useActionRequest } from '../hooks';
import {
  cancelCommand,
  resendCommand as resendCommandRequest,
  retryCommand,
} from '../services';
import {
  ACTION_KEYS,
  canOperate,
  getOperatePermissionReason,
} from '../utils/permission';

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
  visionLogs,
  visionModels,
  visionResults,
  visionTabs,
  visionTasks,
} = Runtime;

export function CommandsPageImpl({ currentUser, externalCommandRows = [], initialSelectedCommandId = '', navigation, setActiveDeviceTab, setLogFilter, setLogTypeFilter, setPage, setSelectedDeviceId, setSelectedTaskId }) {
  const [commands, setCommands] = useState(() => getInitialCommandWorkbenchRows());
  const [records, setRecords] = useState(() => getInitialCommandReceiptRecords());
  const [keyword, setKeyword] = useState('');
  const [queueFilter, setQueueFilter] = useState('全部');
  const [summaryFilter, setSummaryFilter] = useState('全部');
  const [recordFilter, setRecordFilter] = useState('全部');
  const [selectedCommandId, setSelectedCommandId] = useState('CMD-001');
  const selectedCommand = commands.find((row) => row.id === selectedCommandId) ?? commands[0];
  const stats = getCommandWorkbenchStats(commands);
  const filteredCommands = useMemo(
    () => filterCommandWorkbenchRows(commands, keyword, summaryFilter === '全部' ? queueFilter : summaryFilter),
    [commands, keyword, queueFilter, summaryFilter],
  );
  const visibleRecords = useMemo(
    () => filterCommandReceiptRecords(records, recordFilter),
    [records, recordFilter],
  );

  useEffect(() => {
    if (!externalCommandRows.length) return;
    setCommands((rows) => mergeRowsById(externalCommandRows, rows));
    setRecords((rows) => mergeRowsById(getInitialCommandReceiptRecords(externalCommandRows), rows));
  }, [externalCommandRows]);

  useEffect(() => {
    if (initialSelectedCommandId && commands.some((row) => row.id === initialSelectedCommandId)) {
      setSelectedCommandId(initialSelectedCommandId);
    }
  }, [commands, initialSelectedCommandId]);

  useEffect(() => {
    if (filteredCommands.length && !filteredCommands.some((row) => row.id === selectedCommandId)) {
      setSelectedCommandId(filteredCommands[0].id);
    }
  }, [filteredCommands, selectedCommandId]);

  const selectSummary = (filter) => {
    setSummaryFilter(filter);
    if (filter !== '全部') setQueueFilter('全部');
  };

  const selectQueueFilter = (filter) => {
    setQueueFilter(filter);
    setSummaryFilter('全部');
  };

  const appendRecord = (command, type, content, nextStatus = command.receiptStatus, nextResult = command.sendResult, duration = command.duration) => {
    setRecords((rows) => [
      {
        id: `${command.id}-${type}-${Date.now()}`,
        time: '09:12:20',
        deviceId: command.deviceId,
        commandId: command.id,
        commandName: command.commandName,
        params: command.params,
        sendResult: nextResult,
        receiptStatus: nextStatus,
        duration,
        relatedTask: command.relatedTask,
        type,
        content,
      },
      ...rows,
    ]);
  };

  const updateCommand = (commandId, patch) => {
    setCommands((rows) => rows.map((row) => (row.id === commandId ? { ...row, ...patch } : row)));
  };

  const commandActionRequest = useActionRequest(
    async (action) => {
      if (!selectedCommand) return null;
      let result;
      if (action === '重试指令') result = await retryCommand(selectedCommand.id);
      if (action === '取消指令') result = await cancelCommand(selectedCommand.id);
      if (action === '重新发送') result = await resendCommandRequest(selectedCommand.id);

      const cancelled = action === '取消指令';
      updateCommand(selectedCommand.id, cancelled
        ? {
            sendResult: '已取消',
            receiptStatus: '已取消',
            stage: '已取消',
            failReason: '-',
          }
        : {
            sendResult: '已下发',
            receiptStatus: '待回执',
            stage: '等待回执',
            failReason: '-',
            receiptTime: '-',
            duration: '-',
          });
      appendRecord(
        selectedCommand,
        cancelled ? '处理' : '下发',
        cancelled ? '指令已取消' : `${action}，等待设备回执`,
        cancelled ? '已取消' : '待回执',
        cancelled ? '已取消' : '已下发',
        '-',
      );
      return result;
    },
    {
      confirm: (action) =>
        action === '重试指令' ||
        window.confirm(`确认${action} ${selectedCommand?.id ?? ''}？`),
      errorMessage: '操作失败，请稍后重试',
    },
  );

  const markHandled = () => {
    if (!selectedCommand || !window.confirm('确认将该异常回执标记为已处理？')) return;
    updateCommand(selectedCommand.id, {
      receiptStatus: '已处理',
      stage: '已处理',
      failReason: '-',
      handledBy: currentUser?.username ?? 'operator01',
      handledAt: formatNowTime(),
    });
    appendRecord(selectedCommand, '处理', '异常回执已标记处理', '已处理', selectedCommand.sendResult, selectedCommand.duration);
  };

  const openDevice = () => {
    if (!selectedCommand) return;
    if (isArmCommandDevice(selectedCommand.deviceId, selectedCommand.commandName)) {
      navigation?.navigateToArm?.(getCommandTargetArm(selectedCommand));
      return;
    }
    if (isVisionCommandDevice(selectedCommand.deviceId, selectedCommand.commandName)) {
      const targetCamera = getCommandTargetCamera(selectedCommand);
      navigation?.navigateToVision?.(targetCamera !== '-' ? targetCamera : selectedCommand.objectId);
      return;
    }
    if (navigation?.navigateToDevice) {
      navigation.navigateToDevice(selectedCommand.deviceId);
      return;
    }
    setSelectedDeviceId(selectedCommand.deviceId);
    setActiveDeviceTab('detail');
    setPage('devices');
  };

  const openTask = () => {
    if (!selectedCommand?.relatedTask || selectedCommand.relatedTask === '无') return;
    if (navigation?.navigateToTask) {
      navigation.navigateToTask(selectedCommand.relatedTask);
      return;
    }
    setSelectedTaskId(selectedCommand.relatedTask);
    setPage('tasks');
  };

  const openLogs = () => {
    if (!selectedCommand) return;
    if (navigation?.navigateToLogs) {
      navigation.navigateToLogs(selectedCommand.id, '指令');
      return;
    }
    setLogFilter(selectedCommand.id);
    setLogTypeFilter('指令');
    setPage('logs');
  };

  return (
    <section className="panel page-full command-workbench-page">
      <SectionTitle
        icon={TerminalSquare}
        title="指令闭环工作台"
        action={<ExportButton pageName="指令回执" columns={commandReceiptExportColumns} getRows={() => visibleRecords.map((row) => buildCommandReceiptExportRow(row, commands))} currentUser={currentUser} />}
      />
      <CommandSummaryStrip activeFilter={summaryFilter} onSelect={selectSummary} stats={stats} />
      <div className="command-workbench-main">
        <section className="command-queue-panel">
          <div className="command-panel-head">
            <h3>指令队列</h3>
            <span>{filteredCommands.length} 条</span>
          </div>
          <div className="filterbar command-filterbar command-queue-filter">
            <Search size={17} />
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索指令编号 / 设备 / 指令名称 / 参数" />
          </div>
          <div className="segmented-filter command-status-filter">
            {['全部', '执行中', '待回执', '已确认', '失败', '超时'].map((filter) => (
              <button className={queueFilter === filter && summaryFilter === '全部' ? 'active' : ''} key={filter} type="button" onClick={() => selectQueueFilter(filter)}>
                {filter}
              </button>
            ))}
          </div>
          <DataTable
            stickyHeader
            maxHeight={480}
            columns={['指令编号', '目标设备', '指令名称', '参数', '下发时间', '下发结果', '回执状态', '关联任务']}
            rows={filteredCommands.map((row) => [
              row.id,
              row.deviceId,
              row.commandName,
              row.params,
              row.sendTime,
              <StatusText value={row.sendResult} />,
              <StatusText value={row.receiptStatus} />,
              row.relatedTask,
            ])}
            rowKeys={filteredCommands.map((row) => row.id)}
            selectedKey={selectedCommand?.id}
            onRowClick={setSelectedCommandId}
            emptyText="暂无指令数据"
            className="command-queue-table"
          />
        </section>
        <CommandDetailPanel
          command={selectedCommand}
          currentUser={currentUser}
          onLogs={openLogs}
          onMarkHandled={markHandled}
          onOpenDevice={openDevice}
          onOpenTask={openTask}
          onRunAction={commandActionRequest.run}
          actionRequest={commandActionRequest}
        />
      </div>
      <section className="command-record-panel">
        <div className="command-panel-head">
          <h3>回执记录</h3>
          <div className="segmented-filter">
            {['全部', '下发', '回执', '失败', '处理'].map((filter) => (
              <button className={recordFilter === filter ? 'active' : ''} key={filter} type="button" onClick={() => setRecordFilter(filter)}>
                {filter}
              </button>
            ))}
          </div>
        </div>
        <DataTable
          stickyHeader
          maxHeight={360}
          columns={['时间', '设备', '指令编号', '指令名称', '参数', '下发结果', '回执状态', '耗时', '关联任务', '内容']}
          highlightedKeys={visibleRecords.filter((row) => row.commandId === selectedCommand?.id).map((row) => row.id)}
          rowKeys={visibleRecords.map((row) => row.id)}
          rows={visibleRecords.map((row) => [
            row.time,
            row.deviceId,
            row.commandId,
            row.commandName,
            row.params,
            <StatusText value={row.sendResult} />,
            <StatusText value={row.receiptStatus} />,
            row.duration,
            row.relatedTask,
            row.content,
          ])}
          emptyText="暂无指令记录"
          className="command-record-table"
        />
      </section>
    </section>
  );
}

function CommandSummaryStrip({ activeFilter, onSelect, stats }) {
  const items = [
    { label: '今日下发', value: stats.total, filter: '全部' },
    { label: '执行中', value: stats.running, filter: '执行中' },
    { label: '待回执', value: stats.waiting, filter: '待回执', tone: 'warn' },
    { label: '已确认', value: stats.confirmed, filter: '已确认' },
    { label: '失败', value: stats.failed, filter: '失败', tone: 'bad' },
    { label: '平均回执耗时', value: stats.averageDuration, filter: '平均回执耗时' },
  ];
  return (
    <div className="summary-strip command-summary-strip">
      {items.map((item) => (
        <button className={`summary-item ${activeFilter === item.filter ? 'active' : ''} ${item.tone ?? ''}`} key={item.label} type="button" onClick={() => onSelect(item.filter)}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </button>
      ))}
    </div>
  );
}

function CommandDetailPanel({ actionRequest, command, currentUser, onLogs, onMarkHandled, onOpenDevice, onOpenTask, onRunAction }) {
  if (!command) return <section className="command-detail-panel"><EmptyState title="请选择指令" compact /></section>;
  const device = devices.find((item) => item.id === command.deviceId);
  const relatedAlarms = alarms.filter((alarm) => alarm.device === command.deviceId && alarm.status !== '已恢复');
  const canMaintain = hasPermission(currentUser, 'command-send');
  const permissionContext = {
    requireLogin: true,
    isLoggedIn: Boolean(currentUser),
    allowDangerous: currentUser?.role === '管理员',
  };
  const actions = getCommandActions(command);
  return (
    <section className="command-detail-panel">
      <div className="command-panel-head">
        <h3>当前指令详情与处理</h3>
        <StatusText value={command.receiptStatus} />
      </div>
      <div className="command-detail-section">
        <h4>基础信息</h4>
        <div className="command-detail-grid">
          <Info label="指令编号" value={command.id} />
          <Info label="目标设备" value={command.deviceId} />
          <Info label="目标机器人" value={getCommandTargetRobot(command)} />
          <Info label="目标机械臂" value={getCommandTargetArm(command)} />
          <Info label="目标相机" value={getCommandTargetCamera(command)} />
          <Info label="目标模型" value={getCommandTargetModel(command)} />
          <Info label="目标地图" value={getCommandTargetMap(command)} />
          <Info label="目标路线" value={getCommandTargetRoute(command)} />
          <Info label="指令名称" value={command.commandName} />
          <Info label="参数" value={command.params} />
          <Info label="关联任务" value={command.relatedTask} />
          <Info label="下发人" value={command.sender} />
          <Info label="下发时间" value={command.sendTime} />
        </div>
      </div>
      <div className="command-detail-section">
        <h4>下发与回执</h4>
        <div className="command-detail-grid">
          <Info label="下发结果" value={<StatusText value={command.sendResult} />} />
          <Info label="回执状态" value={<StatusText value={command.receiptStatus} />} />
          <Info label="回执时间" value={command.receiptTime} />
          <Info label="回执耗时" value={command.duration} />
          <Info label="失败原因" value={command.failReason} />
          <Info label="当前阶段" value={command.stage} />
          <Info label="处理人" value={command.handledBy} />
          <Info label="处理时间" value={command.handledAt} />
        </div>
      </div>
      <div className="command-detail-section">
        <h4>设备状态</h4>
        <div className="command-detail-grid">
          <Info label="在线状态" value={<StatusText value={device?.online ?? '-'} />} />
          <Info label="运行状态" value={<StatusText value={device?.runStatus ?? '-'} />} />
          <Info label="互锁状态" value={getDeviceInterlockStatus(device, getDevicePointsFor(device))} />
          <Info label="关联报警" value={relatedAlarms.length ? `${relatedAlarms.length} 条` : '无'} />
        </div>
      </div>
      <div className="command-suggestion">
        <strong>处理建议</strong>
        <span>{getCommandSuggestion(command)}</span>
      </div>
      <div className="button-row command-action-row">
        {actions.includes('重试指令') && <button type="button" disabled={actionRequest.loading || !canMaintain} title={!canMaintain ? getPermissionReason(currentUser, '重试指令') : undefined} onClick={() => onRunAction('重试指令')}>{actionRequest.loading ? '处理中' : '重试指令'}</button>}
        {actions.includes('取消指令') && <button type="button" disabled={actionRequest.loading || !canMaintain || !canOperate(ACTION_KEYS.COMMAND_CANCEL, permissionContext)} title={!canMaintain ? getPermissionReason(currentUser, '取消指令') : undefined} onClick={() => onRunAction('取消指令')}>{actionRequest.loading ? '处理中' : '取消指令'}</button>}
        {actions.includes('重新发送') && <button type="button" disabled={actionRequest.loading || !canMaintain} title={!canMaintain ? getPermissionReason(currentUser, '重新发送') : undefined} onClick={() => onRunAction('重新发送')}>{actionRequest.loading ? '处理中' : '重新发送'}</button>}
        {actions.includes('查看设备') && <button type="button" onClick={onOpenDevice}>查看设备</button>}
        {actions.includes('查看任务') && <button type="button" onClick={onOpenTask}>查看任务</button>}
        {actions.includes('查看日志') && <button type="button" onClick={onLogs}>查看日志</button>}
        {actions.includes('标记已处理') && <button type="button" disabled={!canMaintain} title={!canMaintain ? getPermissionReason(currentUser, '标记已处理') : undefined} onClick={onMarkHandled}>标记已处理</button>}
      </div>
      {actions.some((action) => ['重试指令', '取消指令', '重新发送', '标记已处理'].includes(action)) && !canMaintain && <div className="action-disabled-reason">{getPermissionReason(currentUser, '指令维护')}</div>}
      {actions.includes('取消指令') &&
        canMaintain &&
        !canOperate(ACTION_KEYS.COMMAND_CANCEL, permissionContext) && (
          <div className="action-disabled-reason">
            {getOperatePermissionReason(ACTION_KEYS.COMMAND_CANCEL, permissionContext)}
          </div>
        )}
      <ActionFeedback
        compact
        error={actionRequest.error}
        loading={actionRequest.loading}
        success={actionRequest.lastResult}
        successText={actionRequest.lastResult?.message}
      />
    </section>
  );
}

function isRobotCommandDevice(deviceId = '') {
  return /^(AMR|ROBOT|CHASSIS|LIDAR|MAP-SVC|NAV-SVC|CHARGE)-/.test(String(deviceId));
}

function isArmCommandDevice(deviceId = '', commandName = '') {
  return /^(ARM|GRIPPER|SUCTION)-/.test(String(deviceId)) || /机械臂|夹爪|吸盘|动作模板/.test(String(commandName));
}

function isVisionCommandDevice(deviceId = '', commandName = '') {
  return /^(CAM|LGT|VISION)-/.test(String(deviceId)) || /相机|识别|模型/.test(String(commandName));
}

function getCommandRelatedTask(command) {
  const taskId = command?.relatedTask || command?.taskId;
  return tasks.find((task) => task.id === taskId);
}

function getCommandTargetRobot(command) {
  if (command?.targetRobot) return command.targetRobot;
  if (String(command?.deviceId ?? '').startsWith('AMR-') || String(command?.deviceId ?? '').startsWith('ROBOT-')) return command.deviceId;
  return getCommandRelatedTask(command)?.robotId ?? '-';
}

function getCommandTargetArm(command) {
  if (command?.targetArm) return command.targetArm;
  const deviceId = String(command?.deviceId ?? '');
  if (deviceId.startsWith('ARM-')) return deviceId;
  const tool = endEffectors.find((item) => item.toolId === command?.objectId || item.toolId === deviceId.replace('GRIPPER', 'TOOL').replace('SUCTION', 'TOOL'));
  return tool?.armId ?? getCommandRelatedTask(command)?.armId ?? '-';
}

function getCommandTargetCamera(command) {
  if (command?.targetCamera) return command.targetCamera;
  const deviceId = String(command?.deviceId ?? '');
  if (deviceId.startsWith('CAM-')) return deviceId;
  const taskId = String(command?.objectId ?? command?.params ?? '');
  const visionTask = visionTasks.find((task) => task.visionTaskId === taskId || taskId.includes(task.visionTaskId)) ?? visionTasks.find((task) => task.relatedRobotTask === command?.relatedTask);
  return visionTask?.cameraId ?? '-';
}

function getCommandTargetModel(command) {
  if (command?.targetModel) return command.targetModel;
  const text = `${command?.params ?? ''} ${command?.objectId ?? ''}`;
  const model = visionModels.find((item) => text.includes(item.version));
  const visionTask = visionTasks.find((task) => task.visionTaskId === command?.objectId || task.relatedRobotTask === command?.relatedTask);
  return model?.version ?? visionTask?.modelVersion ?? '-';
}

function getCommandTargetMap(command) {
  if (command?.targetMap) return command.targetMap;
  const mapParam = String(command?.params ?? '').match(/map=([^\s]+)/)?.[1];
  if (mapParam) return maps.find((map) => map.mapId === mapParam)?.mapName ?? mapParam;
  return getCommandRelatedTask(command)?.targetMap ?? '-';
}

function getCommandTargetRoute(command) {
  if (command?.targetRoute) return command.targetRoute;
  const routeParam = String(command?.params ?? '').match(/route=([^\s]+)/)?.[1];
  if (routeParam) return mapRoutes.find((route) => route.routeId === routeParam)?.routeName ?? routeParam;
  return getCommandRelatedTask(command)?.targetRoute ?? '-';
}
function getInitialCommandWorkbenchRows() {
  const baseRows = commandLogs.map((row, index) => ({
    id: `CMD-${String(index + 1).padStart(3, '0')}`,
    commandId: `CMD-${String(index + 1).padStart(3, '0')}`,
    deviceId: row.deviceId,
    deviceType: devices.find((device) => device.id === row.deviceId)?.type ?? '-',
    objectType: row.objectType,
    objectId: row.objectId,
    commandName: row.content,
    params: row.params,
    sendResult: row.result,
    receiptStatus: row.status,
    stage: row.status === '已确认' ? '设备已确认' : '等待回执',
    relatedTask: row.taskId || '无',
    sender: index === 0 ? 'operator01' : 'system',
    sendTime: row.time,
    receiptTime: row.status === '已确认' ? addSecondsToTime(row.time, index + 2) : '-',
    duration: row.status === '已确认' ? `${(1.8 + index * 0.3).toFixed(1)}s` : '-',
    failReason: '-',
    suggestion: row.status === '已确认' ? '设备已确认执行，当前无需处理。' : '等待设备回执，如超过阈值请检查设备连接。',
    handledBy: '-',
    handledAt: '-',
  }));
  return [
    ...baseRows,
    { id: 'CMD-901', commandId: 'CMD-901', deviceId: 'ROBOT-001', deviceType: '工业机器人', commandName: '机器人搬运', params: 'A区→B区', sendResult: '下发失败', receiptStatus: '失败', stage: '异常待处理', relatedTask: 'TASK-002', sender: 'operator01', sendTime: '09:09:45', receiptTime: '-', duration: '-', failReason: '设备不在安全区', suggestion: '下发失败，建议检查参数和设备状态后重新下发。', handledBy: '-', handledAt: '-' },
    { id: 'CMD-902', commandId: 'CMD-902', deviceId: 'CNC-003', deviceType: '数控机床', commandName: '程序装载', params: 'O3007', sendResult: '已下发', receiptStatus: '超时', stage: '异常待处理', relatedTask: 'TASK-004', sender: 'system', sendTime: '09:08:20', receiptTime: '-', duration: '-', failReason: '设备离线，回执超时', suggestion: '回执超时，建议检查设备连接后重新下发。', handledBy: '-', handledAt: '-' },
    { id: 'CMD-903', commandId: 'CMD-903', deviceId: 'PLC-002', deviceType: '控制器', commandName: '防护门复位', params: 'reset=true', sendResult: '已下发', receiptStatus: '已处理', stage: '已处理', relatedTask: 'TASK-003', sender: 'engineer01', sendTime: '09:07:42', receiptTime: '09:08:10', duration: '28.0s', failReason: '-', suggestion: '异常回执已处理，可继续观察后续指令。', handledBy: 'engineer01', handledAt: '09:08:10' },
    { id: 'CMD-904', commandId: 'CMD-904', deviceId: 'CNC-004', deviceType: '数控机床', commandName: '启动加工', params: 'O4001', sendResult: '已下发', receiptStatus: '待回执', stage: '等待回执', relatedTask: 'TASK-001', sender: 'system', sendTime: '09:06:58', receiptTime: '-', duration: '-', failReason: '-', suggestion: '等待设备回执，如超过阈值请检查设备连接。', handledBy: '-', handledAt: '-' },
    { id: 'CMD-905', commandId: 'CMD-905', deviceId: 'ROBOT-002', deviceType: '工业机器人', commandName: '回原点', params: 'home', sendResult: '已下发', receiptStatus: '待回执', stage: '等待回执', relatedTask: 'TASK-002', sender: 'operator01', sendTime: '09:06:20', receiptTime: '-', duration: '-', failReason: '-', suggestion: '等待设备回执，如超过阈值请检查设备连接。', handledBy: '-', handledAt: '-' },
  ];
}

function getInitialCommandReceiptRecords(commandRows = getInitialCommandWorkbenchRows()) {
  return commandRows
    .flatMap((command) => {
      const records = [{
        id: `${command.id}-send`,
        time: command.sendTime,
        deviceId: command.deviceId,
        commandId: command.id,
        commandName: command.commandName,
        params: command.params,
        sendResult: command.sendResult,
        receiptStatus: command.receiptStatus,
        duration: command.duration,
        relatedTask: command.relatedTask,
        type: command.sendResult === '下发失败' ? '失败' : '下发',
        content: command.sendResult === '下发失败' ? command.failReason : `已下发${command.commandName}`,
      }];
      if (command.receiptStatus === '已确认') {
        records.push({ ...records[0], id: `${command.id}-receipt`, time: command.receiptTime, type: '回执', content: `设备确认${command.commandName}` });
      }
      if (['失败', '超时'].includes(command.receiptStatus)) {
        records.push({ ...records[0], id: `${command.id}-fail`, type: '失败', content: command.failReason });
      }
      if (command.receiptStatus === '已处理') {
        records.push({ ...records[0], id: `${command.id}-handle`, type: '处理', content: '异常回执已处理' });
      }
      return records;
    })
    .sort((a, b) => b.time.localeCompare(a.time));
}

function mergeRowsById(incoming, existing) {
  const seen = new Set();
  return [...incoming, ...existing].filter((row) => {
    const id = row.id;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function getCommandWorkbenchStats(rows) {
  const durations = rows.map((row) => Number(String(row.duration).replace('s', ''))).filter(Number.isFinite);
  const average = durations.length ? `${(durations.reduce((sum, item) => sum + item, 0) / durations.length).toFixed(1)}s` : '-';
  return {
    total: rows.length,
    running: rows.filter((row) => row.stage === '等待回执').length,
    waiting: rows.filter((row) => row.receiptStatus === '待回执').length,
    confirmed: rows.filter((row) => row.receiptStatus === '已确认').length,
    failed: rows.filter((row) => ['失败', '超时'].includes(row.receiptStatus) || row.sendResult === '下发失败').length,
    averageDuration: average,
  };
}

function filterCommandWorkbenchRows(rows, keyword, filter) {
  const text = keyword.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesKeyword = !text || [row.id, row.deviceId, row.commandName, row.params, row.sendResult, row.receiptStatus, row.relatedTask].some((value) => String(value).toLowerCase().includes(text));
    const matchesFilter =
      filter === '全部' ||
      filter === '平均回执耗时' ||
      (filter === '执行中' && row.stage === '等待回执') ||
      (filter === '待回执' && row.receiptStatus === '待回执') ||
      (filter === '已确认' && row.receiptStatus === '已确认') ||
      (filter === '失败' && (row.receiptStatus === '失败' || row.sendResult === '下发失败')) ||
      (filter === '超时' && row.receiptStatus === '超时');
    return matchesKeyword && matchesFilter;
  });
}

function filterCommandReceiptRecords(rows, filter) {
  if (filter === '全部') return rows;
  return rows.filter((row) => row.type === filter);
}

function getCommandActions(command) {
  if (command.receiptStatus === '已确认') return ['查看设备', '查看任务', '查看日志'];
  if (command.receiptStatus === '待回执') return ['取消指令', '查看设备', '查看任务', '查看日志', '标记已处理'];
  if (['超时', '失败'].includes(command.receiptStatus) || command.sendResult === '下发失败') return ['重试指令', '重新发送', '查看设备', '查看任务', '查看日志', '标记已处理'];
  return ['查看设备', '查看任务', '查看日志'];
}

function getCommandSuggestion(command) {
  if (command.suggestion) return command.suggestion;
  if (command.receiptStatus === '已确认') return '设备已确认执行，当前无需处理。';
  if (command.receiptStatus === '待回执') return '等待设备回执，如超过阈值请检查设备连接。';
  if (command.receiptStatus === '超时') return '回执超时，建议检查设备连接后重新下发。';
  if (command.receiptStatus === '失败' || command.sendResult === '下发失败') return '下发失败，建议检查参数和设备状态后重新下发。';
  if (command.receiptStatus === '已处理') return '异常回执已处理，可继续观察后续指令。';
  return '请根据现场状态继续跟踪指令回执。';
}

function addSecondsToTime(time, seconds) {
  const [hour = '09', minute = '00', second = '00'] = time.split(':');
  const nextSecond = Number(second) + seconds;
  return `${hour}:${minute}:${String(nextSecond).padStart(2, '0')}`;
}

export default CommandsPageImpl;
