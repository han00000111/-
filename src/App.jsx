import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';
import * as Runtime from './AppRuntime';
import OverviewPage from './pages/OverviewPage';
import RobotMonitorPage from './pages/RobotMonitorPage';
import MapManagementPage from './pages/MapManagementPage';
import ArmControlPage from './pages/ArmControlPage';
import VisionRecognitionPage from './pages/VisionRecognitionPage';
import DevicesPage from './pages/DevicesPage';
import TasksPage from './pages/TasksPage';
import CommandsPage from './pages/CommandsPage';
import AlarmsPage from './pages/AlarmsPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';

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
  PageErrorBoundary,
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

export default function App() {
  const [page, setPage] = useState('overview');
  const [activeDeviceTab, setActiveDeviceTab] = useState('overview');
  const [activeMapTab, setActiveMapTab] = useState('overview');
  const [activeArmTab, setActiveArmTab] = useState('overview');
  const [activeVisionTab, setActiveVisionTab] = useState('overview');
  const [selectedArmId, setSelectedArmId] = useState('ARM-001');
  const [selectedTeachingPointId, setSelectedTeachingPointId] = useState('TP-DOOR-001');
  const [selectedArmTemplateId, setSelectedArmTemplateId] = useState('TPL-DOOR-001');
  const [selectedVisionTaskId, setSelectedVisionTaskId] = useState('VT-001');
  const [selectedVisionCameraId, setSelectedVisionCameraId] = useState('CAM-001');
  const [selectedVisionResultKey, setSelectedVisionResultKey] = useState('');
  const [selectedRobotId, setSelectedRobotId] = useState('AMR-001');
  const [selectedTaskId, setSelectedTaskId] = useState('TASK-001');
  const [selectedDeviceId, setSelectedDeviceId] = useState('CNC-001');
  const [logFilter, setLogFilter] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState('全部');
  const [taskStatusOverrides, setTaskStatusOverrides] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [accountLogs, setAccountLogs] = useState([]);
  const [armRuntimeCommands, setArmRuntimeCommands] = useState(armCommandReceipts);
  const [robotRuntimeCommands, setRobotRuntimeCommands] = useState([]);
  const [armRuntimeLogs, setArmRuntimeLogs] = useState([]);
  const [robotRuntimeLogs, setRobotRuntimeLogs] = useState([]);
  const [armRuntimeAlarms, setArmRuntimeAlarms] = useState([]);
  const [selectedCommandId, setSelectedCommandId] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const taskList = useMemo(
    () => tasks.map((task) => {
      const override = taskStatusOverrides[task.id];
      return typeof override === 'string' ? { ...task, status: override } : { ...task, ...override };
    }),
    [taskStatusOverrides]
  );
  const selectedTask = taskList.find((task) => task.id === selectedTaskId) ?? taskList[0];
  const selectedDevice = devices.find((device) => device.id === selectedDeviceId) ?? devices[0];
  const logRows = useMemo(() => [...robotRuntimeLogs, ...armRuntimeLogs, ...accountLogs, ...allLogs].sort((a, b) => b.time.localeCompare(a.time)), [accountLogs, armRuntimeLogs, robotRuntimeLogs]);
  const topbarTitle = page === 'devices'
    ? `设备与点位 / ${deviceTabs.find((tab) => tab.key === activeDeviceTab)?.label ?? '设备详情'}`
    : page === 'map-management'
      ? `地图管理 / ${mapTabs.find((tab) => tab.key === activeMapTab)?.label ?? '地图总览'}`
      : page === 'arm-control'
        ? `机械臂控制 / ${armTabs.find((tab) => tab.key === activeArmTab)?.label ?? '机械臂总览'}`
        : page === 'vision-recognition'
          ? `视觉识别 / ${visionTabs.find((tab) => tab.key === activeVisionTab)?.label ?? '视觉总览'}`
          : pageTitle[page];

  const writeAccountLog = (user, content) => {
    setAccountLogs((rows) => [
      {
        time: formatNowTime(),
        objectId: user?.username ?? '未登录',
        deviceId: user?.username ?? '未登录',
        taskId: '',
        logType: '账号',
        content,
        params: user?.role ?? '-',
        status: '成功',
      },
      ...rows,
    ]);
  };

  const handleLogin = (payload) => {
    const username = payload.username.trim() || getDefaultUsername(payload.role);
    const user = {
      username,
      role: payload.role,
      avatar: payload.avatar,
      loginAt: formatNowTime(),
    };
    setCurrentUser(user);
    setLoginModalOpen(false);
    writeAccountLog(user, currentUser ? '切换用户' : '登录系统');
  };

  const handleLogout = () => {
    if (currentUser) writeAccountLog(currentUser, '退出登录');
    setCurrentUser(null);
  };

  const openTaskDetail = () => setPage('tasks');
  const openTaskLogs = () => {
    setLogFilter(selectedTask.id);
    setLogTypeFilter('全部');
    setPage('logs');
  };
  const openDevice = (deviceId) => {
    setSelectedDeviceId(deviceId);
    setActiveDeviceTab('detail');
    setPage('devices');
  };
  const navigation = {
    navigateToDevice: (deviceId) => {
      if (!deviceId) return;
      setSelectedDeviceId(deviceId);
      setActiveDeviceTab('detail');
      setPage('devices');
    },
    navigateToTask: (taskId) => {
      if (!taskId || taskId === '无') return;
      setSelectedTaskId(taskId);
      setPage('tasks');
    },
    navigateToLogs: (filter = '', type = '全部') => {
      setLogFilter(filter);
      setLogTypeFilter(type);
      setPage('logs');
    },
    navigateToAlarm: () => {
      setPage('alarms');
    },
    navigateToCommand: (commandId = '') => {
      if (commandId) setSelectedCommandId(commandId);
      setPage('commands');
    },
    navigateToArm: (armId = 'ARM-001') => {
      if (armId) setSelectedArmId(armId);
      setActiveArmTab('control');
      setPage('arm-control');
    },
    navigateToRobot: (robotId = 'AMR-001') => {
      if (robotId) setSelectedRobotId(robotId);
      setPage('robot-monitor');
    },
    navigateToTeachingPoint: (pointId = 'TP-DOOR-001') => {
      if (pointId) setSelectedTeachingPointId(pointId);
      setActiveArmTab('teaching');
      setPage('arm-control');
    },
    navigateToArmTemplate: (templateId = 'TPL-DOOR-001') => {
      if (templateId) setSelectedArmTemplateId(templateId);
      setActiveArmTab('templates');
      setPage('arm-control');
    },
    navigateToVision: (targetId = 'VT-001') => {
      const target = String(targetId || 'VT-001');
      const result = visionResults.find((item) => item.screenshot === target || `${item.time}-${item.cameraId}-${item.visionTaskId}` === target);
      const task = visionTasks.find((item) => item.visionTaskId === target) ?? visionTasks.find((item) => item.cameraId === target) ?? visionTasks.find((item) => item.visionTaskId === result?.visionTaskId);
      const cameraId = target.startsWith('CAM-') ? target : result?.cameraId ?? task?.cameraId ?? 'CAM-001';
      setSelectedVisionCameraId(cameraId);
      setSelectedVisionTaskId(task?.visionTaskId ?? result?.visionTaskId ?? 'VT-001');
      setSelectedVisionResultKey(result ? getVisionResultKey(result) : '');
      setActiveVisionTab('overview');
      setPage('vision-recognition');
    },
  };
  const handleTaskAction = (task, action) => {
    const nextStatus = {
      开始: '运行中',
      暂停: '暂停',
      恢复: '运行中',
      中止: '已中止',
      重试: '排队中',
      重新运行: '排队中',
    }[action];

    if (nextStatus) {
      setTaskStatusOverrides((statuses) => ({ ...statuses, [task.id]: getTaskActionOverride(task, action, nextStatus) }));
    }
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar activeArmTab={activeArmTab} activeDeviceTab={activeDeviceTab} activeMapTab={activeMapTab} activeVisionTab={activeVisionTab} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((value) => !value)} page={page} setActiveArmTab={setActiveArmTab} setActiveDeviceTab={setActiveDeviceTab} setActiveMapTab={setActiveMapTab} setActiveVisionTab={setActiveVisionTab} setPage={setPage} />
      <main className={`main ${page === 'overview' ? 'overview-main' : ''}`}>
        <TopBar title={topbarTitle} currentUser={currentUser} onLoginRequest={() => setLoginModalOpen(true)} onLogout={handleLogout} onAccountSettings={() => setPage('settings')} />
        <PageErrorBoundary pageName={topbarTitle}>
          {page === 'overview' && (
            <OverviewPage
            selectedTask={selectedTask}
            taskList={taskList}
            selectedTaskId={selectedTaskId}
            setSelectedTaskId={setSelectedTaskId}
            onTaskAction={handleTaskAction}
            currentUser={currentUser}
            openTaskDetail={openTaskDetail}
            openTaskLogs={openTaskLogs}
            openDevice={openDevice}
            setPage={setPage}
            setLogFilter={setLogFilter}
            setLogTypeFilter={setLogTypeFilter}
            setSelectedDeviceId={setSelectedDeviceId}
            />
          )}
          {page === 'robot-monitor' && (
            <RobotMonitorPage
            currentUser={currentUser}
            navigation={navigation}
            onRobotCommandEvent={({ command, log }) => {
              if (command) {
                setRobotRuntimeCommands((rows) => [command, ...rows.filter((row) => row.id !== command.id)]);
                setSelectedCommandId(command.id);
              }
              if (log) setRobotRuntimeLogs((rows) => [log, ...rows]);
            }}
            robotRuntimeCommands={robotRuntimeCommands}
            robotRuntimeLogs={robotRuntimeLogs}
            selectedRobotId={selectedRobotId}
            setSelectedRobotId={setSelectedRobotId}
            setLogFilter={setLogFilter}
            setLogTypeFilter={setLogTypeFilter}
            />
          )}
          {page === 'map-management' && (
            <MapManagementPage
            activeMapTab={activeMapTab}
            currentUser={currentUser}
            navigation={navigation}
            setActiveMapTab={setActiveMapTab}
            setSelectedTaskId={setSelectedTaskId}
            />
          )}
          {page === 'arm-control' && (
            <ArmControlPage
            activeArmTab={activeArmTab}
            currentUser={currentUser}
            navigation={navigation}
            onArmActionEvent={({ command, log, alarm, taskUpdate }) => {
              if (command) {
                setArmRuntimeCommands((rows) => [command, ...rows.filter((row) => row.id !== command.id)]);
                setSelectedCommandId(command.id);
              }
              if (log) setArmRuntimeLogs((rows) => [log, ...rows]);
              if (alarm) setArmRuntimeAlarms((rows) => [alarm, ...rows.filter((row) => !(row.name === alarm.name && row.device === alarm.device))]);
              if (taskUpdate?.taskId) {
                setTaskStatusOverrides((rows) => ({ ...rows, [taskUpdate.taskId]: taskUpdate.patch }));
              }
            }}
            selectedArmId={selectedArmId}
            selectedArmTemplateId={selectedArmTemplateId}
            selectedTeachingPointId={selectedTeachingPointId}
            setActiveArmTab={setActiveArmTab}
            setSelectedArmTemplateId={setSelectedArmTemplateId}
            setSelectedArmId={setSelectedArmId}
            setSelectedTeachingPointId={setSelectedTeachingPointId}
            />
          )}
          {page === 'vision-recognition' && (
            <VisionRecognitionPage
            activeVisionTab={activeVisionTab}
            currentUser={currentUser}
            selectedVisionTaskId={selectedVisionTaskId}
            selectedVisionCameraId={selectedVisionCameraId}
            selectedVisionResultKey={selectedVisionResultKey}
            setActiveVisionTab={setActiveVisionTab}
            setSelectedVisionCameraId={setSelectedVisionCameraId}
            setSelectedVisionResultKey={setSelectedVisionResultKey}
            setSelectedVisionTaskId={setSelectedVisionTaskId}
            navigation={navigation}
            />
          )}
          {page === 'devices' && (
            <div className="devices-page-route" data-page="devices">
            <DevicesPage
              activeDeviceTab={activeDeviceTab}
              currentUser={currentUser}
              selectedDevice={selectedDevice}
              selectedDeviceId={selectedDeviceId}
              setActiveDeviceTab={setActiveDeviceTab}
              setSelectedDeviceId={setSelectedDeviceId}
            />
            </div>
          )}
          {page === 'tasks' && (
            <div className="tasks-page-route" data-page="tasks">
            <TasksPage
              selectedTask={selectedTask}
              taskList={taskList}
              selectedTaskId={selectedTaskId}
              setSelectedTaskId={setSelectedTaskId}
              onTaskAction={handleTaskAction}
              currentUser={currentUser}
              openTaskLogs={openTaskLogs}
              navigation={navigation}
              setActiveDeviceTab={setActiveDeviceTab}
              setLogFilter={setLogFilter}
              setLogTypeFilter={setLogTypeFilter}
              setPage={setPage}
              setSelectedDeviceId={setSelectedDeviceId}
            />
            </div>
          )}
          {page === 'commands' && (
            <CommandsPage
            currentUser={currentUser}
            externalCommandRows={[...robotRuntimeCommands, ...armRuntimeCommands]}
            initialSelectedCommandId={selectedCommandId}
            navigation={navigation}
            setActiveDeviceTab={setActiveDeviceTab}
            setLogFilter={setLogFilter}
            setLogTypeFilter={setLogTypeFilter}
            setPage={setPage}
            setSelectedDeviceId={setSelectedDeviceId}
            setSelectedTaskId={setSelectedTaskId}
            />
          )}
          {page === 'alarms' && (
            <AlarmsPage
            setPage={setPage}
            setSelectedTaskId={setSelectedTaskId}
            setSelectedDeviceId={setSelectedDeviceId}
            setLogFilter={setLogFilter}
            setLogTypeFilter={setLogTypeFilter}
            currentUser={currentUser}
            extraAlarms={armRuntimeAlarms}
            navigation={navigation}
            />
          )}
          {page === 'logs' && (
            <LogsPage
            filter={logFilter}
            setFilter={setLogFilter}
            typeFilter={logTypeFilter}
            setTypeFilter={setLogTypeFilter}
            rows={logRows}
            currentUser={currentUser}
            />
          )}
          {page === 'settings' && <SettingsPage currentUser={currentUser} onLoginRequest={() => setLoginModalOpen(true)} onLogout={handleLogout} />}
        </PageErrorBoundary>
      </main>
      {loginModalOpen && <LoginModal currentUser={currentUser} onSubmit={handleLogin} onClose={() => setLoginModalOpen(false)} />}
    </div>
  );
}
