import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as Runtime from '../AppRuntime';

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

export function MapManagementPage({ activeMapTab, currentUser, navigation, setActiveMapTab, setSelectedTaskId }) {
  const [localMaps, setLocalMaps] = useState(maps);
  const [selectedMapId, setSelectedMapId] = useState(maps.find((map) => map.isDefault)?.mapId ?? maps[0]?.mapId);
  const selectedMap = localMaps.find((map) => map.mapId === selectedMapId) ?? localMaps[0];
  const setDefaultMap = (mapId) => {
    setLocalMaps((rows) => rows.map((map) => ({ ...map, isDefault: map.mapId === mapId })));
    setSelectedMapId(mapId);
  };
  const deleteMap = (mapId) => {
    setLocalMaps((rows) => rows.filter((map) => map.mapId !== mapId || map.isDefault));
  };

  if (activeMapTab === 'editor') return <MapEditorPage selectedMap={selectedMap} />;
  if (activeMapTab === 'routes') return <RouteManagementPage navigation={navigation} setSelectedTaskId={setSelectedTaskId} />;
  if (activeMapTab === 'mapping') return <AutoMappingPage />;
  return <MapOverviewPage currentUser={currentUser} mapsForView={localMaps} onDelete={deleteMap} onSelect={setSelectedMapId} onSetDefault={setDefaultMap} selectedMapId={selectedMapId} setActiveMapTab={setActiveMapTab} />;
}

function MapOverviewPage({ currentUser, mapsForView, onDelete, onSelect, onSetDefault, selectedMapId, setActiveMapTab }) {
  return (
    <section className="panel page-full map-overview-page">
      <SectionTitle
        icon={Database}
        title="地图总览"
        action={<ExportButton pageName="地图管理" columns={['地图编号', '地图名称', '默认地图', '尺寸', '分辨率', '点位数量', '路线数量', '更新时间']} getRows={() => mapsForView.map((map) => ({ mapId: map.mapId, mapName: map.mapName, isDefault: map.isDefault ? '是' : '否', size: `${map.width}m x ${map.height}m`, resolution: `${map.resolution}m`, pointCount: map.pointCount, routeCount: map.routeCount, updatedAt: map.updatedAt }))} currentUser={currentUser} />}
      />
      <DataTable
        columns={['地图编号', '默认', '地图名称', '地图尺寸', '分辨率', '点位', '路线', '更新时间', '操作']}
        rows={mapsForView.map((map) => [
          map.mapId,
          map.isDefault ? '默认地图' : '-',
          map.mapName,
          `${map.width}m x ${map.height}m`,
          `${map.resolution}m`,
          map.pointCount,
          map.routeCount,
          map.updatedAt,
          <div className="table-actions">
            <button type="button" onClick={() => { onSelect(map.mapId); setActiveMapTab('editor'); }}>查看</button>
            <button type="button" disabled={map.isDefault} onClick={() => onSetDefault(map.mapId)}>设为默认</button>
            <button className="danger" type="button" disabled={map.isDefault} onClick={() => onDelete(map.mapId)}>删除</button>
          </div>,
        ])}
        rowKeys={mapsForView.map((map) => map.mapId)}
        selectedKey={selectedMapId}
        onRowClick={onSelect}
      />
    </section>
  );
}

function MapEditorPage({ selectedMap }) {
  const [tool, setTool] = useState('点位');
  const [saveMessage, setSaveMessage] = useState('');
  const layerStats = [
    ['区域', mapAreas.length],
    ['点位', mapPoints.length],
    ['路线', mapRoutes.length],
    ['虚拟墙', mapVirtualWalls.length],
    ['禁行区', mapNoGoAreas.length],
    ['障碍物', mapObstacles.length],
    ['门', mapDoors.length],
    ['充电点', mapPoints.filter((point) => point.type === '充电点').length],
  ];
  const saveEdit = () => {
    setSaveMessage(`已模拟保存：${selectedMap?.mapName ?? '当前地图'}`);
    window.setTimeout(() => setSaveMessage(''), 1800);
  };

  return (
    <div className="page-grid map-editor-grid">
      <section className="panel map-canvas-panel">
        <SectionTitle icon={Database} title="地图画布" action={selectedMap?.mapName ?? '当前地图'} />
        <RobotMapCanvas editable activeRouteId="R001" robot={robotStatus} />
      </section>
      <section className="panel map-layer-panel">
        <SectionTitle icon={TerminalSquare} title="编辑对象" action={tool} />
        <SegmentedFilter options={['区域', '点位', '路线', '虚拟墙', '禁行区', '障碍物', '门', '充电点']} value={tool} onChange={setTool} />
        <DataTable compact columns={['对象', '数量']} rows={layerStats.map(([label, count]) => [label, count])} />
        <div className="button-row">
          <button type="button" onClick={saveEdit}>保存编辑</button>
          <button type="button">新增{tool}</button>
        </div>
        {saveMessage && <div className="inline-feedback">{saveMessage}</div>}
      </section>
    </div>
  );
}

function RouteManagementPage({ navigation, setSelectedTaskId }) {
  const [selectedRouteId, setSelectedRouteId] = useState(mapRoutes[0]?.routeId);
  const [notice, setNotice] = useState('');
  const getPointNames = (route) => route.pointSequence.map((pointId) => mapPoints.find((point) => point.pointId === pointId)?.name ?? pointId).join(' → ');
  const startInspect = (route) => {
    setSelectedTaskId?.('TASK-006');
    setNotice(`已模拟发起巡检：${route.routeName}`);
    window.setTimeout(() => setNotice(''), 1800);
    navigation?.navigateToTask('TASK-006');
  };

  return (
    <section className="panel page-full route-management-page">
      <SectionTitle icon={ClipboardList} title="路线管理" action={`${mapRoutes.length} 条路线`} />
      <DataTable
        stickyHeader
        maxHeight={520}
        minWidth={1080}
        columnWidths={[110, 140, 130, 'auto', 110, 100, 90, 220]}
        columns={['路线编号', '路线名称', '所属地图', '点位顺序', '执行模式', '预计耗时', '状态', '操作']}
        rows={mapRoutes.map((route) => [
          route.routeId,
          route.routeName,
          maps.find((map) => map.mapId === route.mapId)?.mapName ?? route.mapId,
          getPointNames(route),
          route.mode,
          route.estimatedDuration,
          <StatusText value={route.status} />,
          <div className="table-actions">
            <button type="button" onClick={() => setSelectedRouteId(route.routeId)}>查看</button>
            <button type="button" onClick={() => setNotice(`已进入模拟编辑：${route.routeName}`)}>编辑</button>
            <button className="danger" type="button" onClick={() => setNotice(`已模拟删除：${route.routeName}`)}>删除</button>
            <button type="button" onClick={() => startInspect(route)}>发起巡检</button>
          </div>,
        ])}
        rowKeys={mapRoutes.map((route) => route.routeId)}
        selectedKey={selectedRouteId}
        onRowClick={setSelectedRouteId}
      />
      {notice && <div className="inline-feedback">{notice}</div>}
    </section>
  );
}

function AutoMappingPage() {
  const [task, setTask] = useState(mappingTasks[0]);
  const [mapName, setMapName] = useState(mappingTasks[0]?.mapName ?? '车间A自动扫描地图');
  const [logs, setLogs] = useState(mappingLogs);
  const statusLabel = task.status;
  const addLog = (message) => setLogs((rows) => [`${formatNowTime()} ${message}`, ...rows].slice(0, 8));
  const patchTask = (patch, message) => {
    setTask((current) => ({ ...current, ...patch, updatedAt: formatNowTime() }));
    addLog(message);
  };

  return (
    <div className="page-grid mapping-grid">
      <section className="panel mapping-control-panel">
        <SectionTitle icon={MonitorCog} title="自动建图控制" action={<StatusText value={statusLabel} />} />
        <div className="settings-grid mapping-form-grid">
          <label className="setting-item"><span>选择机器人底座</span><select value={task.robotId} onChange={(event) => patchTask({ robotId: event.target.value }, `已选择底座：${event.target.value}`)}>{robots.map((robot) => <option key={robot.robotId}>{robot.robotId}</option>)}</select><small>第一版仅模拟状态</small></label>
          <label className="setting-item"><span>地图名称</span><input value={mapName} onChange={(event) => setMapName(event.target.value)} /><small>保存时写入 mock 状态</small></label>
          <div className="setting-item"><span>建图状态</span><strong>{task.status}</strong><small>{task.mappingTaskId}</small></div>
          <div className="setting-item"><span>建图进度</span><strong>{task.progress}%</strong><small>{task.resultStatus}</small></div>
        </div>
        <div className="button-row">
          <button type="button" onClick={() => patchTask({ status: '建图中', progress: Math.max(task.progress, 24), resultStatus: '未保存', startedAt: task.startedAt === '-' ? formatNowTime() : task.startedAt }, '建图开始')}>开始建图</button>
          <button type="button" onClick={() => patchTask({ status: '已暂停' }, '建图暂停')}>暂停建图</button>
          <button type="button" onClick={() => patchTask({ status: '建图中', progress: Math.min(86, task.progress + 18) }, '建图继续')}>继续建图</button>
          <button type="button" onClick={() => patchTask({ status: '已停止', progress: Math.max(task.progress, 72) }, '建图停止，生成轨迹预览')}>停止建图</button>
          <button type="button" onClick={() => patchTask({ status: '已保存', progress: 100, resultStatus: '已保存', mapName }, `保存地图：${mapName}`)}>保存地图</button>
        </div>
      </section>
      <section className="panel mapping-preview-panel">
        <SectionTitle icon={Database} title="建图轨迹预览" action={`${task.progress}%`} />
        <MappingPreviewSvg progress={task.progress} />
      </section>
      <section className="panel mapping-log-panel">
        <SectionTitle icon={History} title="建图日志" />
        <div className="mapping-log-list">
          {logs.map((log) => <div key={log}>{log}</div>)}
        </div>
      </section>
    </div>
  );
}

export default MapManagementPage;
