import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as Runtime from '../AppRuntime';

const {
  Activity,
  addSecondsToTime,
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

export function RobotMonitorPage({ currentUser, navigation, onRobotCommandEvent, robotRuntimeCommands = [], robotRuntimeLogs = [], selectedRobotId, setSelectedRobotId, setLogFilter, setLogTypeFilter }) {
  const [manualControlActive, setManualControlActive] = useState(false);
  const [joystickDragging, setJoystickDragging] = useState(false);
  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0 });
  const [joystickDirection, setJoystickDirection] = useState('停止');
  const [linearSpeed, setLinearSpeed] = useState(0);
  const [angularSpeed, setAngularSpeed] = useState(0);
  const [robotPoseHint, setRobotPoseHint] = useState({ x: 0, y: 0, theta: 0 });
  const joystickMoveStartedRef = useRef(false);
  const runtime = useMockRuntime();
  const liveRobots = runtime.systemStatus.robots ?? robots;
  const liveRobotStatus = runtime.systemStatus.robotStatus ?? robotStatus;
  const selectedRobot = liveRobots.find((robot) => robot.robotId === selectedRobotId) ?? liveRobots[0];
  const baseStatus = selectedRobotId === liveRobotStatus.robotId ? liveRobotStatus : { ...liveRobotStatus, ...selectedRobot, online: selectedRobot.status, speed: '0 m/s', mode: selectedRobot.mode };
  const status = {
    ...baseStatus,
    mode: manualControlActive ? '手动控制' : baseStatus.mode,
    speed: manualControlActive ? `${formatMotionValue(linearSpeed)} m/s` : baseStatus.speed,
    theta: (baseStatus.theta || 90) + robotPoseHint.theta,
    x: baseStatus.x + robotPoseHint.x,
    y: baseStatus.y + robotPoseHint.y,
  };
  const canManualControl = can(currentUser, PERMISSIONS.TASK_ACTION);
  const safetyIssues = getRobotManualSafetyIssues(status);
  const manualAvailable = canManualControl && safetyIssues.length === 0;
  const joystickDisabledReason = !canManualControl && !currentUser ? '请登录后手动接管' : !manualAvailable ? '当前状态不可操作' : '';
  const robotLogs = [...robotRuntimeLogs, ...runtime.logs, ...telemetryLogs, ...auditLogs]
    .filter((row) => ['机器人', '底盘', '巡检', '建图', '地图', '路线', '手动控制', '手动接管'].includes(row.logType) || row.deviceId === status.robotId)
    .slice(0, 8);
  const robotCommandReceipts = robotRuntimeCommands.filter((row) => row.deviceId === status.robotId).slice(0, 3);
  const openLogs = () => {
    setLogFilter(status.robotId);
    setLogTypeFilter('全部');
    navigation?.navigateToLogs(status.robotId, '全部');
  };
  const writeManualLog = (logType, content, params = '-') => {
    const now = formatNowTime();
    const log = {
      time: now,
      objectType: 'robot',
      objectId: status.robotId,
      deviceId: status.robotId,
      taskId: status.currentTask || '无',
      logType,
      content,
      params,
      status: '成功',
      operator: currentUser?.name ?? currentUser?.role ?? 'mock-user',
    };
    onRobotCommandEvent?.({ log });
    return now;
  };
  const resetJoystick = () => {
    setJoystickDragging(false);
    setJoystickVector({ x: 0, y: 0 });
    setJoystickDirection('停止');
    setLinearSpeed(0);
    setAngularSpeed(0);
    joystickMoveStartedRef.current = false;
  };
  const createManualCommandReceipt = (commandName, params, now) => {
    const commandId = `ROBOT-MANUAL-${Date.now()}`;
    onRobotCommandEvent?.({
      command: {
        id: commandId,
        commandId,
        deviceId: status.robotId,
        deviceType: '移动机器人',
        objectType: 'robot',
        objectId: status.robotId,
        commandName,
        params,
        sendResult: '已下发',
        receiptStatus: '已确认',
        stage: '设备已确认',
        relatedTask: status.currentTask || '无',
        sender: currentUser?.username ?? currentUser?.role ?? 'mock-user',
        sendTime: now,
        receiptTime: addSecondsToTime(now, 1),
        duration: '1.0s',
        failReason: '-',
        suggestion: '前端 mock 已确认执行。',
        handledBy: '-',
        handledAt: '-',
      },
    });
  };
  const takeoverManualControl = () => {
    if (!manualAvailable) return;
    setManualControlActive(true);
    resetJoystick();
    writeManualLog('手动接管', '进入手动控制', currentUser?.role ?? 'operator');
  };
  const releaseManualControl = () => {
    if (!manualControlActive) return;
    setManualControlActive(false);
    resetJoystick();
    writeManualLog('手动接管', '释放手动控制', currentUser?.role ?? 'operator');
  };
  const applyJoystickVector = (vector) => {
    const motion = getJoystickMotion(vector);
    setJoystickVector(vector);
    setJoystickDirection(motion.direction);
    setLinearSpeed(motion.linearSpeed);
    setAngularSpeed(motion.angularSpeed);
    return motion;
  };
  const sendJoystickMoveStart = (motion) => {
    if (joystickMoveStartedRef.current || motion.direction === '停止') return;
    joystickMoveStartedRef.current = true;
    const params = `方向=${motion.direction} speed=${formatMotionValue(motion.linearSpeed)} angular=${formatMotionValue(motion.angularSpeed)}`;
    const receiptParams = `linear=${formatMotionValue(motion.linearSpeed)} angular=${formatMotionValue(motion.angularSpeed)}`;
    const now = writeManualLog('手动控制', `开始移动｜方向=${motion.direction} speed=${formatMotionValue(motion.linearSpeed)} angular=${formatMotionValue(motion.angularSpeed)}`, params);
    createManualCommandReceipt('底盘手动控制', receiptParams, now);
  };
  const startJoystickMove = (vector) => {
    if (!manualControlActive || !manualAvailable) return;
    joystickMoveStartedRef.current = false;
    const motion = applyJoystickVector(vector);
    setJoystickDragging(true);
    sendJoystickMoveStart(motion);
    setRobotPoseHint((pose) => ({
      x: pose.x + vector.x * 8,
      y: pose.y + vector.y * 8,
      theta: pose.theta + vector.x * 12,
    }));
  };
  const changeJoystickMove = (vector) => {
    if (!manualControlActive || !manualAvailable) return;
    const motion = applyJoystickVector(vector);
    sendJoystickMoveStart(motion);
  };
  const stopJoystickMove = () => {
    if (!manualControlActive || !joystickDragging) return;
    resetJoystick();
    const now = writeManualLog('手动控制', '底盘停止', 'linear=0 angular=0');
    createManualCommandReceipt('底盘停止', 'linear=0 angular=0', now);
  };

  return (
    <div className="robot-monitor-grid page-workspace">
      <section className="panel robot-status-panel">
        <SectionTitle icon={MonitorCog} title="机器人状态总览" action={<SegmentedFilter options={robots.map((robot) => robot.robotId)} value={selectedRobotId} onChange={setSelectedRobotId} />} />
        <SummaryStrip
          items={[
            { label: '机器人编号', value: status.robotId },
            { label: '在线状态', value: status.online, tone: status.online === '在线' ? 'ok' : 'bad' },
            { label: '当前任务', value: status.currentTask },
            { label: '电量', value: `${status.battery}%`, tone: status.battery < 30 ? 'bad' : 'ok' },
            { label: '当前模式', value: status.mode },
          ]}
        />
      </section>
      <section className="panel robot-map-panel">
        <SectionTitle icon={Database} title="地图与当前位置" action={status.currentMap} />
        <div className="robot-map-with-joystick">
          <RobotMapCanvas activeRouteId="R001" robot={status} />
          <div className="robot-map-joystick">
            <VirtualJoystick
              active={manualControlActive}
              angularSpeed={angularSpeed}
              disabled={!manualAvailable}
              disabledReason={joystickDisabledReason}
              direction={joystickDirection}
              joystickDragging={joystickDragging}
              joystickVector={joystickVector}
              linearSpeed={linearSpeed}
              onMoveChange={changeJoystickMove}
              onMoveEnd={stopJoystickMove}
              onMoveStart={startJoystickMove}
              onRelease={releaseManualControl}
              onTakeover={takeoverManualControl}
            />
          </div>
        </div>
        <div className="detail-list dense robot-map-detail">
          <Info label="当前地图" value={status.currentMap} />
          <Info label="当前点位" value={status.currentPoint} />
          <Info label="当前路线" value={status.targetRoute} />
          <Info label="速度" value={status.speed} />
        </div>
      </section>
      <section className="panel robot-chassis-panel">
        <SectionTitle icon={Cpu} title="底盘状态" />
        <div className="robot-status-cards">
          {[
            ['定位状态', status.localizationStatus],
            ['通信状态', status.communicationStatus],
            ['激光雷达', status.lidarStatus],
            ['急停状态', status.emergencyStatus],
            ['导航状态', status.chassis.navStatus],
            ['建图状态', status.chassis.mappingStatus],
            ['充电状态', status.chassis.chargeStatus],
            ['避障状态', status.chassis.obstacleStatus],
          ].map(([label, value]) => (
            <div className="robot-status-card" key={label}>
              <span>{label}</span>
              <StatusText value={value} />
            </div>
          ))}
        </div>
      </section>

      <section className="panel robot-log-panel workbench-panel">
        <SectionTitle icon={History} title="机器人运行日志" action={<button type="button" onClick={openLogs}>查看全部</button>} />
        <div className="workbench-body-scroll">
          <SimpleLogTable rows={robotLogs} />
          {robotCommandReceipts.length > 0 && (
            <div className="robot-receipt-list">
              <strong>最近指令回执</strong>
              {robotCommandReceipts.map((row) => (
                <div key={row.id}>{row.deviceId}｜{row.commandName}｜{row.params}｜{row.sendResult}｜{row.receiptStatus}</div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default RobotMonitorPage;
