import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as Runtime from '../AppRuntime';
import { useRuntime } from '../runtime';
import { normalizeVisionResult as normalizeServiceVisionResult } from '../services/adapters';

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

function normalizeVisionPageResult(row) {
  const standard = normalizeServiceVisionResult(row);
  return normalizeVisionResult({
    ...standard,
    visionTaskId: standard.taskId ?? standard.visionTaskId,
    screenshot: standard.snapshotUrl ?? standard.screenshot,
    time: standard.createdAt ?? standard.time,
  });
}

function getVisionPageKey(row) {
  return row?.id ?? row?.snapshotUrl ?? row?.screenshot ?? `${row?.createdAt ?? row?.time}-${row?.cameraId}-${row?.taskId ?? row?.visionTaskId}`;
}

export function VisionRecognitionPage({ activeVisionTab, currentUser, navigation, selectedVisionCameraId, selectedVisionResultKey, selectedVisionTaskId, setActiveVisionTab, setSelectedVisionCameraId, setSelectedVisionResultKey, setSelectedVisionTaskId }) {
  const liveVisionResults = useRuntime((state) => state.visionResults ?? []);
  const liveLogs = useRuntime((state) => state.logs ?? []);
  const liveVisionLogs = useMemo(() => liveLogs.filter((row) => (row.type ?? row.logType) === '视觉' || (row.type ?? row.logType) === '视觉识别'), [liveLogs]);
  const [results, setResults] = useState(() => visionResults.map(normalizeVisionPageResult));
  const [notice, setNotice] = useState('');
  const [runtimeLogs, setRuntimeLogs] = useState(visionLogs);
  useEffect(() => {
    setResults(liveVisionResults.map(normalizeVisionPageResult));
  }, [liveVisionResults]);
  useEffect(() => {
    if (liveVisionLogs.length) setRuntimeLogs(liveVisionLogs);
  }, [liveVisionLogs]);
  const selectVisionTarget = ({ cameraId, resultKey, tab = 'overview', taskId }) => {
    const result = resultKey ? results.find((row) => getVisionPageKey(row) === resultKey) : null;
    const task = visionTasks.find((item) => item.visionTaskId === taskId) ?? visionTasks.find((item) => item.visionTaskId === (result?.taskId ?? result?.visionTaskId)) ?? visionTasks.find((item) => item.cameraId === cameraId);
    setSelectedVisionCameraId(cameraId ?? result?.cameraId ?? task?.cameraId ?? 'CAM-001');
    setSelectedVisionTaskId(task?.visionTaskId ?? result?.taskId ?? result?.visionTaskId ?? selectedVisionTaskId);
    setSelectedVisionResultKey(resultKey ?? (result ? getVisionPageKey(result) : ''));
    setActiveVisionTab(tab);
  };
  const writeVisionLog = (content, target = selectedVisionTaskId, status = '成功') => {
    setRuntimeLogs((rows) => [{
      time: formatNowTime(),
      objectType: 'vision',
      objectId: target,
      deviceId: selectedVisionCameraId,
      taskId: visionTasks.find((task) => task.visionTaskId === target)?.relatedRobotTask ?? '无',
      logType: '视觉识别',
      content,
      params: target,
      status,
      operator: currentUser?.username ?? currentUser?.role ?? 'mock-user',
    }, ...rows]);
  };
  const runVision = (task = visionTasks[0]) => {
    const imageType = getVisionImageTypeByTask(task);
    const row = normalizeVisionPageResult({
      time: formatNowTime(),
      cameraId: task.cameraId,
      visionTaskId: task.visionTaskId,
      object: getVisionObjectByTask(task),
      result: task.status === '异常' ? '异常' : '通过',
      confidence: task.status === '异常' ? '0%' : '95%',
      duration: task.status === '异常' ? '-' : '132 ms',
      relatedTask: task.relatedRobotTask,
      relatedDevice: task.relatedDevice,
      screenshot: `mock://vision/${task.cameraId}/${Date.now()}`,
      processStatus: task.status === '异常' ? '处理中' : '已上传',
      imageType,
      frameStatus: task.status === '异常' ? 'OFFLINE' : 'SNAPSHOT',
    });
    setResults((rows) => [row, ...rows].slice(0, 16));
    selectVisionTarget({ cameraId: row.cameraId, resultKey: getVisionPageKey(row), taskId: row.taskId ?? row.visionTaskId, tab: 'overview' });
    writeVisionLog(`触发识别：${task.taskName}`, task.visionTaskId, row.result === '异常' ? '异常' : '成功');
    setNotice(`已执行识别：${task.taskName}`);
    window.setTimeout(() => setNotice(''), 1800);
  };
  const updateResultStatus = (result, nextStatus, content) => {
    const key = getVisionPageKey(result);
    setResults((rows) => rows.map((row) => (getVisionPageKey(row) === key ? { ...row, status: nextStatus, processStatus: nextStatus } : row)));
    setSelectedVisionResultKey(key);
    writeVisionLog(content, result.taskId ?? result.visionTaskId, nextStatus === '转人工处理' ? '待处理' : '成功');
    setNotice(content);
    window.setTimeout(() => setNotice(''), 1800);
  };
  const sharedProps = {
    navigation,
    notice,
    results,
    runVision,
    runtimeLogs,
    selectedVisionCameraId,
    selectedVisionResultKey,
    selectedVisionTaskId,
    selectVisionTarget,
    setActiveVisionTab,
    updateResultStatus,
  };

  if (activeVisionTab === 'cameras') return <CameraConfigPage {...sharedProps} />;
  if (activeVisionTab === 'tasks') return <VisionTaskPage {...sharedProps} setSelectedVisionTaskId={setSelectedVisionTaskId} />;
  if (activeVisionTab === 'results') return <VisionResultPage {...sharedProps} />;
  if (activeVisionTab === 'models') return <VisionModelPage />;
  return <VisionOverviewPage {...sharedProps} />;
}

function VisionOverviewPage({ navigation, notice, results, runVision, runtimeLogs, selectedVisionCameraId, selectedVisionResultKey, selectedVisionTaskId, selectVisionTarget, setActiveVisionTab, updateResultStatus }) {
  const selectedCamera = cameras.find((camera) => camera.cameraId === selectedVisionCameraId) ?? cameras[0];
  const selectedTask = visionTasks.find((task) => task.visionTaskId === selectedVisionTaskId) ?? visionTasks.find((task) => task.cameraId === selectedCamera.cameraId) ?? visionTasks[0];
  const selectedResult = results.find((row) => getVisionPageKey(row) === selectedVisionResultKey)
    ?? results.find((row) => (row.taskId ?? row.visionTaskId) === selectedTask?.visionTaskId)
    ?? results.find((row) => row.cameraId === selectedCamera?.cameraId)
    ?? normalizeVisionPageResult(visionResults[0]);
  const stats = getVisionStats(results);
  return (
    <div className="vision-monitor-workbench">
      <section className="panel vision-summary-panel vision-workbench-summary">
        <SectionTitle icon={MonitorCog} title="视觉监控工作台" action={notice || 'mock 画面 / 本地识别复核'} />
        <SummaryStrip items={[{ label: '相机总数', value: stats.cameraTotal }, { label: '在线相机', value: stats.online, tone: 'ok' }, { label: '识别中', value: stats.running }, { label: '识别异常', value: stats.abnormal, tone: stats.abnormal ? 'bad' : 'ok' }, { label: '今日识别次数', value: stats.today }, { label: '异常结果数', value: stats.badResults, tone: stats.badResults ? 'warn' : 'ok' }, { label: '平均识别耗时', value: stats.avgDuration }]} />
      </section>
      <VisionTargetPanel selectedCameraId={selectedCamera.cameraId} selectedTaskId={selectedTask.visionTaskId} selectVisionTarget={selectVisionTarget} />
      <section className="panel vision-screen-panel">
        <SectionTitle icon={MonitorCog} title="实时画面 / 当前识别截图" action={selectedCamera.cameraId} />
        <div className="vision-screen-stack">
          <MockVisionFrame camera={selectedCamera} result={selectedResult} task={selectedTask} variant="live" />
          <MockVisionFrame camera={selectedCamera} result={selectedResult} task={selectedTask} variant="snapshot" />
        </div>
      </section>
      <VisionDetailPanel navigation={navigation} result={selectedResult} runVision={runVision} task={selectedTask} updateResultStatus={updateResultStatus} />
      <section className="panel vision-record-panel">
        <SectionTitle icon={History} title="最近识别记录" action={<button type="button" onClick={() => setActiveVisionTab('results')}>查看全部</button>} />
        <VisionRecentRecords navigation={navigation} results={results.slice(0, 6)} selectVisionTarget={selectVisionTarget} updateResultStatus={updateResultStatus} />
        {runtimeLogs.length > 0 && <div className="vision-log-inline">{runtimeLogs[0].createdAt ?? runtimeLogs[0].updatedAt ?? runtimeLogs[0].time}｜{runtimeLogs[0].message ?? runtimeLogs[0].content}</div>}
      </section>
    </div>
  );
}

function VisionTargetPanel({ selectedCameraId, selectedTaskId, selectVisionTarget }) {
  return (
    <section className="panel vision-target-panel">
      <SectionTitle icon={Database} title="相机 / 识别任务" />
      <div className="vision-target-panel-list">
        <div className="vision-target-block">
          <strong>相机列表</strong>
          {cameras.length === 0 ? <EmptyState title="暂无相机数据" compact /> : cameras.map((camera) => (
            <button className={`vision-target-card ${selectedCameraId === camera.cameraId ? 'selected' : ''}`} key={camera.cameraId} type="button" onClick={() => selectVisionTarget({ cameraId: camera.cameraId })}>
              <span>{camera.cameraId}｜{camera.cameraName}</span>
              <em>{camera.position}</em>
              <small>{camera.online}｜{camera.updatedAt}</small>
            </button>
          ))}
        </div>
        <div className="vision-target-block">
          <strong>识别任务</strong>
          {visionTasks.length === 0 ? <EmptyState title="暂无识别任务" compact /> : visionTasks.map((task) => (
            <button className={`vision-target-card ${selectedTaskId === task.visionTaskId ? 'selected' : ''}`} key={task.visionTaskId} type="button" onClick={() => selectVisionTarget({ cameraId: task.cameraId, taskId: task.visionTaskId })}>
              <span>{task.visionTaskId}｜{task.taskName}</span>
              <em>{task.recognitionType}｜{task.cameraId}</em>
              <small>{task.relatedDevice}｜{task.relatedRobotTask}｜{task.status}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MockVisionFrame({ camera, result, task, variant = 'snapshot' }) {
  const frameStatus = variant === 'live' ? (camera.online === '在线' ? 'LIVE' : 'OFFLINE') : result.frameStatus;
  const imageType = variant === 'live' ? getVisionImageTypeByTask(task) : result.imageType;
  const offline = frameStatus === 'OFFLINE';
  const label = variant === 'live' ? `${camera.cameraName} 实时监控` : `${result.snapshotUrl ?? result.screenshot} 当前识别截图`;
  return (
    <div className={`vision-frame ${imageType} ${offline ? 'offline' : ''}`}>
      <div className="vision-frame-head">
        <span className={`vision-frame-badge ${frameStatus.toLowerCase()}`}>{frameStatus}</span>
        <strong>{label}</strong>
        <span>{camera.cameraId}｜{camera.resolution}｜{camera.fps}</span>
      </div>
      <div className="vision-frame-body">
        <div className="vision-grid-lines" />
        <div className="vision-roi" style={getVisionBoxStyle(result.roi)} />
        <VisionScene imageType={imageType} offline={offline} />
        {!offline && <div className={`vision-bbox ${getVisionBoxTone(result)}`} style={getVisionBoxStyle(result.bbox)}><span>{result.bbox?.label ?? `${result.name ?? result.object} / ${result.confidence ?? result.score}`}</span></div>}
        {offline && <div className="vision-offline-mask">OFFLINE</div>}
      </div>
      <div className="vision-frame-foot">
        <span>{task.taskName}</span>
        <span>{task.modelVersion}</span>
        <span>{result.duration}</span>
        <span>{result.createdAt ?? result.updatedAt ?? result.time}</span>
      </div>
    </div>
  );
}

function VisionScene({ imageType, offline }) {
  if (offline) return <div className="vision-scene offline-scene">相机离线 / 无画面</div>;
  if (imageType === 'code-read') return <div className="vision-scene code-scene"><i /><i /><i /><b /></div>;
  if (imageType === 'gripper-pose') return <div className="vision-scene gripper-scene"><i /><b /><span /></div>;
  if (imageType === 'safety-area') return <div className="vision-scene safety-scene"><i /><b /></div>;
  return <div className="vision-scene material-scene"><i /><b /><span /></div>;
}

function VisionDetailPanel({ navigation, result, runVision, task, updateResultStatus }) {
  if (!result || !task) {
    return (
      <section className="panel vision-detail-panel">
        <EmptyState title="请选择识别任务或结果" compact />
      </section>
    );
  }
  const model = visionModels.find((item) => item.version === task.modelVersion) ?? visionModels.find((item) => item.task === task.taskName) ?? visionModels[0];
  const suggestion = getVisionSuggestion(result, model);
  return (
    <section className="panel vision-detail-panel">
      <SectionTitle icon={ClipboardList} title="识别结果详情" action={<StatusText value={result.status ?? result.processStatus} />} />
      <div className="detail-list dense">
        <Info label="识别任务" value={result.taskId ?? result.visionTaskId} />
        <Info label="识别类型" value={task.recognitionType} />
        <Info label="关联相机" value={result.cameraId} />
        <Info label="关联设备" value={result.relatedDevice} />
        <Info label="关联任务" value={result.relatedTask} />
        <Info label="识别对象" value={result.name ?? result.object} />
        <Info label="识别结果" value={<StatusText value={result.result} />} />
        <Info label="置信度" value={result.confidence ?? result.score} />
        <Info label="识别耗时" value={result.duration} />
        <Info label="模型版本" value={task.modelVersion} />
        <Info label="截图编号" value={result.snapshotUrl ?? result.screenshot} />
        <Info label="更新时间" value={result.updatedAt ?? result.createdAt ?? result.time} />
      </div>
      <div className={`vision-suggestion ${suggestion.tone}`}>
        <strong>{suggestion.title}</strong>
        <span>{suggestion.text}</span>
          <em>模型：{model.modelName}｜{model.deployStatus}｜{model.accuracy}</em>
      </div>
      <div className="vision-detail-actions">
        <button type="button" onClick={() => runVision(task)}>重新识别</button>
        <button type="button" onClick={() => navigation?.navigateToTask?.(result.relatedTask)}>查看关联任务</button>
        <button type="button" onClick={() => navigation?.navigateToDevice?.(result.relatedDevice)}>查看设备</button>
        <button type="button" onClick={() => navigation?.navigateToLogs?.(result.taskId ?? result.visionTaskId, '视觉识别')}>查看日志</button>
        <button type="button" onClick={() => updateResultStatus(result, '已复核', `已复核视觉结果：${result.taskId ?? result.visionTaskId}`)}>标记已复核</button>
        <button type="button" onClick={() => updateResultStatus(result, '转人工处理', `视觉结果转人工处理：${result.taskId ?? result.visionTaskId}`)}>转人工处理</button>
      </div>
    </section>
  );
}

function CameraConfigPage({ runVision, selectVisionTarget, setActiveVisionTab }) {
  const [notice, setNotice] = useState('');
  const run = (message, camera) => {
    setNotice(`${message}：${camera.cameraId}`);
    window.setTimeout(() => setNotice(''), 1600);
  };
  return (
    <section className="panel page-full camera-config-page">
      <SectionTitle icon={Database} title="相机配置" />
      <DataTable
        stickyHeader
        maxHeight={560}
        minWidth={1470}
        columnWidths={[110, 130, 140, 150, 120, 100, 70, 80, 120, 90, 100, 260]}
        columns={['相机编号', '相机名称', '安装位置', '关联设备 / 工位', 'IP 地址', '分辨率', '帧率', '曝光', '光源配置', '在线状态', '更新时间', '操作']}
        rows={cameras.map((camera) => [
          camera.cameraId,
          camera.cameraName,
          camera.position,
          camera.relatedDevice,
          camera.ip,
          camera.resolution,
          camera.fps,
          camera.exposure,
          camera.light,
          <StatusText value={camera.online} />,
          camera.updatedAt,
          <div className="table-actions">
            <button type="button" onClick={() => selectVisionTarget({ cameraId: camera.cameraId })}>查看监控</button>
            <button type="button" onClick={() => { setActiveVisionTab('tasks'); selectVisionTarget({ cameraId: camera.cameraId, tab: 'tasks' }); }}>查看识别任务</button>
            <button type="button" onClick={() => { setActiveVisionTab('results'); selectVisionTarget({ cameraId: camera.cameraId, tab: 'results' }); }}>查看结果</button>
            <button type="button" onClick={() => runVision(visionTasks.find((task) => task.cameraId === camera.cameraId) ?? visionTasks[0])}>测试拍照</button>
            <button type="button" onClick={() => run('编辑配置', camera)}>编辑配置</button>
          </div>,
        ])}
      />
      {notice && <div className="inline-feedback">{notice}</div>}
    </section>
  );
}

function VisionTaskPage({ navigation, notice, runVision, selectedVisionTaskId, selectVisionTarget, setSelectedVisionTaskId }) {
  return (
    <section className="panel page-full vision-task-page">
      <SectionTitle icon={ClipboardList} title="识别任务" />
      <DataTable
        stickyHeader
        maxHeight={560}
        minWidth={1380}
        columnWidths={[120, 150, 110, 100, 110, 110, 140, 110, 100, 90, 240]}
        columns={['识别任务编号', '任务名称', '识别类型', '关联相机', '关联设备', '关联工位', '关联机器人任务', '模型版本', '触发方式', '状态', '操作']}
        rows={visionTasks.map((task) => [
          task.visionTaskId,
          task.taskName,
          task.recognitionType,
          task.cameraId,
          task.relatedDevice,
          task.workstation,
          task.relatedRobotTask,
          task.modelVersion,
          task.triggerMode,
          <StatusText value={task.status} />,
          <div className="table-actions">
            <button type="button" onClick={() => selectVisionTarget({ cameraId: task.cameraId, taskId: task.visionTaskId })}>查看监控</button>
            <button type="button" onClick={() => selectVisionTarget({ cameraId: task.cameraId, taskId: task.visionTaskId, tab: 'results' })}>查看结果</button>
            <button type="button" onClick={() => runVision(task)}>触发识别</button>
            <button type="button" onClick={() => navigation?.navigateToTask?.(task.relatedRobotTask)}>查看关联任务</button>
          </div>,
        ])}
        rowKeys={visionTasks.map((task) => task.visionTaskId)}
        selectedKey={selectedVisionTaskId}
        onRowClick={setSelectedVisionTaskId}
      />
      {notice && <div className="inline-feedback">{notice}</div>}
    </section>
  );
}

function VisionResultPage({ navigation, results, runVision, selectedVisionCameraId, selectedVisionResultKey, selectedVisionTaskId, selectVisionTarget, updateResultStatus }) {
  const selectedResult = results.find((row) => getVisionPageKey(row) === selectedVisionResultKey)
    ?? results.find((row) => (row.taskId ?? row.visionTaskId) === selectedVisionTaskId)
    ?? results.find((row) => row.cameraId === selectedVisionCameraId)
    ?? results[0];
  const task = visionTasks.find((item) => item.visionTaskId === (selectedResult.taskId ?? selectedResult.visionTaskId)) ?? visionTasks[0];
  const camera = cameras.find((item) => item.cameraId === selectedResult.cameraId) ?? cameras[0];
  return (
    <div className="vision-result-workspace">
      <section className="panel vision-result-list-panel">
        <SectionTitle icon={History} title="识别结果列表" />
        <VisionRecentRecords compact navigation={navigation} results={results} selectVisionTarget={(payload) => selectVisionTarget({ ...payload, tab: 'results' })} updateResultStatus={updateResultStatus} />
      </section>
      <section className="panel vision-result-preview-panel">
        <SectionTitle icon={MonitorCog} title="结果截图预览" action={selectedResult.snapshotUrl ?? selectedResult.screenshot} />
        <MockVisionFrame camera={camera} result={selectedResult} task={task} variant="snapshot" />
      </section>
      <VisionDetailPanel navigation={navigation} result={selectedResult} runVision={runVision} task={task} updateResultStatus={updateResultStatus} />
    </div>
  );
}

// 截图 URL / 编号在 mock 与 runtime 新增记录时可能重复，渲染 key 用复合值保证唯一；
// 选中逻辑优先使用标准 id / snapshotUrl，旧截图字段继续兜底。
function getVisionRecordKey(row, index) {
  return [
    row.id || row.snapshotUrl || row.resultId || row.recordId || row.screenshot || 'vision',
    row.cameraId || row.camera || 'unknown-camera',
    row.taskId || row.visionTaskId || row.task || 'unknown-task',
    row.createdAt || row.updatedAt || row.time || 'time',
    index,
  ].join('-');
}

function VisionRecentRecords({ compact = false, navigation, results, selectVisionTarget, updateResultStatus }) {
  if (!results.length) return <EmptyState title="暂无识别结果" compact />;
  return (
    <div className={`vision-record-list ${compact ? 'compact' : ''}`}>
      {results.map((row, index) => (
        <div className="vision-record-row" key={getVisionRecordKey(row, index)} role="button" tabIndex={0} onClick={() => selectVisionTarget({ cameraId: row.cameraId, resultKey: getVisionPageKey(row), taskId: row.taskId ?? row.visionTaskId })} onKeyDown={(event) => { if (event.key === 'Enter') selectVisionTarget({ cameraId: row.cameraId, resultKey: getVisionPageKey(row), taskId: row.taskId ?? row.visionTaskId }); }}>
          <span>{row.createdAt ?? row.updatedAt ?? row.time}</span>
          <strong>{row.cameraId}｜{row.name ?? row.object}</strong>
          <em>{row.taskId ?? row.visionTaskId}｜{row.relatedTask}</em>
          <StatusText value={row.result} />
          <small>{row.confidence ?? row.score}｜{row.duration}｜{row.status ?? row.processStatus}</small>
          <span className="vision-record-actions">
            <button type="button" onClick={(event) => { event.stopPropagation(); selectVisionTarget({ cameraId: row.cameraId, resultKey: getVisionPageKey(row), taskId: row.taskId ?? row.visionTaskId }); }}>查看截图</button>
            <button type="button" onClick={(event) => { event.stopPropagation(); navigation?.navigateToTask?.(row.relatedTask); }}>查看任务</button>
            <button type="button" onClick={(event) => { event.stopPropagation(); navigation?.navigateToDevice?.(row.relatedDevice); }}>查看设备</button>
            <button type="button" onClick={(event) => { event.stopPropagation(); updateResultStatus(row, '已复核', `已复核视觉结果：${row.taskId ?? row.visionTaskId}`); }}>复核</button>
          </span>
        </div>
      ))}
    </div>
  );
}

function VisionResultTable({ rows, onPreview }) {
  return (
    <DataTable
      columns={['时间', '相机', '识别任务', '识别对象', '结果', '置信度', '耗时', '关联任务', '关联设备', '截图', '处理状态', '操作']}
      rows={rows.map((row) => [
        row.createdAt ?? row.updatedAt ?? row.time,
        row.cameraId,
        row.taskId ?? row.visionTaskId,
        row.name ?? row.object,
        <StatusText value={row.result} />,
        row.confidence ?? row.score,
        row.duration,
        row.relatedTask,
        row.relatedDevice,
        row.snapshotUrl ?? row.screenshot,
        <StatusText value={row.status ?? row.processStatus} />,
        <button type="button" onClick={() => onPreview?.(row)}>查看截图</button>,
      ])}
    />
  );
}

function VisionModelPage() {
  const [notice, setNotice] = useState('');
  const run = (action, model) => {
    setNotice(`${action}：${model.modelName}`);
    window.setTimeout(() => setNotice(''), 1600);
  };
  return (
    <section className="panel page-full vision-model-page">
      <SectionTitle icon={Cpu} title="模型管理" />
      <DataTable
        stickyHeader
        maxHeight={560}
        minWidth={1200}
        columnWidths={[150, 110, 100, 140, 100, 110, 90, 200, 200]}
        columns={['模型名称', '模型类型', '版本号', '适用任务', '部署状态', '更新时间', '准确率', '备注', '操作']}
        rows={visionModels.map((model) => [
          model.modelName,
          model.modelType,
          model.version,
          model.task,
          <StatusText value={model.deployStatus} />,
          model.updatedAt,
          model.accuracy,
          model.remark,
          <div className="table-actions">
            {['查看', '启用', '停用', '切换版本'].map((action) => <button key={action} type="button" onClick={() => run(action, model)}>{action}</button>)}
          </div>,
        ])}
      />
      {notice && <div className="inline-feedback">{notice}</div>}
    </section>
  );
}

export default VisionRecognitionPage;
