import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as Runtime from '../AppRuntime';
import { API_CONFIG } from '../api';
import { DataStateBlock } from '../components/common';
import { useInterlocksResource } from '../hooks';
import { RUNTIME_CONFIG, useRuntime } from '../runtime';
import { normalizeAlarms } from '../services/adapters';

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

function getAlarmIdentity(alarm) {
  return alarm?.id ?? alarm?.alarmId ?? alarm?.code ?? alarm?.name;
}

export function AlarmsPage({ setPage, setSelectedTaskId, setSelectedDeviceId, setLogFilter, setLogTypeFilter, currentUser, extraAlarms = [], navigation }) {
  const [selectedAlarmName, setSelectedAlarmName] = useState(alarms[0]?.name ?? '');
  const [alarmFilter, setAlarmFilter] = useState('当前待办');
  const [recordFilter, setRecordFilter] = useState('全部');
  const [alarmStatusOverrides, setAlarmStatusOverrides] = useState({});
  const [handlingRecords, setHandlingRecords] = useState([]);
  const runtime = useRuntime();
  const interlocksResource = useInterlocksResource();
  const sourceAlarms = runtime.alarms ?? [];
  const alarmRows = useMemo(
    () => normalizeAlarms([...extraAlarms, ...sourceAlarms]).map((alarm) => ({ ...alarm, status: alarmStatusOverrides[getAlarmIdentity(alarm)] ?? alarm.status })),
    [alarmStatusOverrides, extraAlarms, sourceAlarms],
  );
  const filteredAlarms = useMemo(() => filterAlarms(alarmRows, alarmFilter), [alarmRows, alarmFilter]);
  const selectedAlarm = filteredAlarms.find((alarm) => alarm.name === selectedAlarmName) ?? filteredAlarms[0] ?? null;
  const relatedLogs = useMemo(
    () => filterHandlingLogs([...getAlarmRelatedLogs(selectedAlarm), ...handlingRecords.filter((record) => isRecordRelatedToAlarm(record, selectedAlarm))], recordFilter),
    [selectedAlarm, handlingRecords, recordFilter],
  );
  const relatedDeviceIds = useMemo(() => getAlarmRelatedDeviceIds(selectedAlarm), [selectedAlarm]);

  useEffect(() => {
    if (filteredAlarms[0] && !filteredAlarms.some((alarm) => alarm.name === selectedAlarmName)) {
      setSelectedAlarmName(filteredAlarms[0].name);
    }
  }, [alarmFilter, filteredAlarms, selectedAlarmName]);

  return (
    <div className="page-grid alarms-grid alarms-layout">
      <section className="panel alarm-overview-panel">
        <SectionTitle icon={AlertTriangle} title="报警总览" />
        <DataStateBlock compact>
          <AlarmOverviewBar
            alarms={alarmRows}
            filter={alarmFilter}
            onFilterChange={setAlarmFilter}
          />
        </DataStateBlock>
      </section>
      <section className="panel alarm-card-panel">
        <SectionTitle
          icon={AlertTriangle}
          title="报警卡片列表"
          action={<ExportButton pageName="报警互锁" columns={alarmExportColumns} getRows={() => filteredAlarms.map((alarm) => buildAlarmExportRow(alarm, handlingRecords))} currentUser={currentUser} />}
        />
        <DataStateBlock
          empty={!filteredAlarms.length}
          emptyTitle={alarmFilter === '当前待办' ? '暂无待处理报警' : '无匹配报警'}
          compact
        >
          <AlarmCardList alarms={filteredAlarms} filter={alarmFilter} selectedAlarmName={selectedAlarmName} onSelect={setSelectedAlarmName} />
        </DataStateBlock>
      </section>
      <section className="panel alarm-current-panel">
        <SectionTitle icon={MonitorCog} title="处理工作台" />
        <DataStateBlock empty={!selectedAlarm} emptyTitle="请选择报警" compact>
          <AlarmActionPanel
            alarm={selectedAlarm}
            onRecord={(record, nextStatus) => {
              setHandlingRecords((records) => [record, ...records]);
              if (nextStatus) {
                setAlarmStatusOverrides((overrides) => ({ ...overrides, [getAlarmIdentity(selectedAlarm)]: nextStatus }));
              }
            }}
            onNavigate={(target, payload) => {
              if (target === 'tasks' && payload) {
                setSelectedTaskId(payload);
                setPage('tasks');
              }
              if (target === 'devices' && payload) {
                setSelectedDeviceId(payload);
                setPage('devices');
              }
              if (target === 'robot-monitor') {
                setPage('robot-monitor');
              }
              if (target === 'map-management') {
                setPage('map-management');
              }
              if (target === 'arm-control') {
                navigation?.navigateToArm?.(payload);
              }
              if (target === 'vision-recognition') {
                navigation?.navigateToVision?.(payload);
              }
              if (target === 'logs') {
                setLogFilter(payload);
                setLogTypeFilter('全部');
                setPage('logs');
              }
            }}
            currentUser={currentUser}
          />
        </DataStateBlock>
      </section>
      <section className="panel interlock-matrix-panel">
        <SectionTitle icon={ShieldCheck} title="互锁状态总览" />
        <DataStateBlock
          error={!RUNTIME_CONFIG.enableMockRuntime ? interlocksResource.error : null}
          empty={!RUNTIME_CONFIG.enableMockRuntime && !interlocksResource.data?.length}
          emptyTitle="暂无互锁数据"
          errorMessage="互锁矩阵暂时无法获取，请稍后重试。"
          onRetry={interlocksResource.reload}
          compact
        >
          <InterlockTable
            highlightedDeviceIds={relatedDeviceIds}
            sourceInterlocks={!RUNTIME_CONFIG.enableMockRuntime && !API_CONFIG.useMockService ? interlocksResource.data : undefined}
            onNavigate={(taskId) => {
              setSelectedTaskId(taskId);
              setPage('tasks');
            }}
            onRecord={(record) => setHandlingRecords((records) => [record, ...records])}
            currentUser={currentUser}
          />
        </DataStateBlock>
      </section>
      <section className="panel alarm-record-panel">
        <SectionTitle icon={History} title="处理记录" action="已按当前报警筛选" />
        <SegmentedFilter options={['全部', '报警', '互锁', '任务', '审计', '设备']} value={recordFilter} onChange={setRecordFilter} />
        {relatedLogs.length ? <SimpleLogTable rows={relatedLogs} /> : <div className="attachment-empty">暂无相关处理记录</div>}
      </section>
    </div>
  );
}

export default AlarmsPage;
