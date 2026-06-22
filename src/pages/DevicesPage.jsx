import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as Runtime from '../AppRuntime';
import { ActionFeedback, DataStateBlock } from '../components/common';
import { useActionRequest } from '../hooks';
import { useRuntime } from '../runtime';
import { checkDeviceConnection, refreshDeviceStatus } from '../services';
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

export function DevicesPageImpl({ activeDeviceTab, currentUser, selectedDevice, selectedDeviceId, setActiveDeviceTab, setSelectedDeviceId }) {
  const [deviceSearch, setDeviceSearch] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('全部');
  const points = useMemo(() => getDevicePointsFor(selectedDevice), [selectedDevice]);
  const [selectedPointCode, setSelectedPointCode] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [attachmentMap, setAttachmentMap] = useState(() => deviceAttachments);
  const [attachmentLogs, setAttachmentLogs] = useState([]);
  const deviceFilterOptions = ['全部', '数控机床', '工业机器人', '控制器', '在线', '离线', '运行中', '维护中', '异常'];
  const filteredDevices = devices.filter((device) => {
    const keyword = deviceSearch.trim().toLowerCase();
    const matchesKeyword =
      !keyword ||
      [device.id, device.type, device.online, device.runStatus].some((value) => value.toLowerCase().includes(keyword));
    const matchesFilter =
      deviceFilter === '全部' ||
      device.type === deviceFilter ||
      device.online === deviceFilter ||
      device.runStatus === deviceFilter ||
      (deviceFilter === '异常' && device.alarmCount > 0);
    return matchesKeyword && matchesFilter;
  });

  useEffect(() => {
    setSelectedPointCode(points[0]?.code ?? '');
  }, [selectedDeviceId, points]);

  const selectedPoint = points.find((point) => point.code === selectedPointCode) ?? points[0];
  const allPointRows = useMemo(
    () => devices.flatMap((device) => getDevicePointsFor(device).map((point) => ({ device, point }))),
    []
  );
  return (
    <div className="devices-page">
      {activeDeviceTab === 'overview' && (
        <DeviceOverviewPage
          currentUser={currentUser}
          onSelectDevice={(deviceId) => {
            setSelectedDeviceId(deviceId);
            setActiveDeviceTab('detail');
          }}
          selectedDeviceId={selectedDeviceId}
        />
      )}

      {activeDeviceTab === 'detail' && (
        <DeviceDetailPage
          deviceFilter={deviceFilter}
          deviceFilterOptions={deviceFilterOptions}
          deviceSearch={deviceSearch}
          attachmentItems={attachmentMap[selectedDevice.id] ?? []}
          attachmentLogs={attachmentLogs}
          currentUser={currentUser}
          filteredDevices={filteredDevices}
          onAttachmentChange={(deviceId, nextItems, logContent) => {
            setAttachmentMap((current) => ({ ...current, [deviceId]: nextItems }));
            setAttachmentLogs((rows) => [
              {
                time: formatNowTime(),
                objectId: deviceId,
                deviceId,
                logType: '附件',
                content: logContent,
                params: currentUser?.username ?? '-',
                status: '成功',
              },
              ...rows,
            ]);
          }}
          onPreviewAttachment={setPreviewAttachment}
          points={points}
          selectedDevice={selectedDevice}
          selectedDeviceId={selectedDeviceId}
          selectedPoint={selectedPoint}
          selectedPointCode={selectedPoint?.code}
          setDeviceFilter={setDeviceFilter}
          setDeviceSearch={setDeviceSearch}
          setSelectedDeviceId={setSelectedDeviceId}
          setSelectedPointCode={setSelectedPointCode}
        />
      )}

      {activeDeviceTab === 'points' && <PointManagementPage allPointRows={allPointRows} currentUser={currentUser} />}

      {activeDeviceTab === 'history' && <HistoryComparePage allPointRows={allPointRows} selectedDeviceId={selectedDeviceId} setSelectedDeviceId={setSelectedDeviceId} />}

      {previewAttachment && <AttachmentPreview attachment={previewAttachment} onClose={() => setPreviewAttachment(null)} />}
    </div>
  );
}

function DeviceOverviewPage({ currentUser, onSelectDevice, selectedDeviceId }) {
  const [filter, setFilter] = useState('全部');
  const [detailSort, setDetailSort] = useState('异常优先');
  const [showAllAttention, setShowAllAttention] = useState(false);
  const sourceDevices = useRuntime((state) => state.devices ?? []);
  const rows = useMemo(
    () => sortDeviceOverviewRows(sourceDevices.map((device) => getDeviceOverviewRow({
      ...device,
      id: device.id ?? device.deviceId ?? device.code,
      online: device.onlineStatus ?? device.online,
      runStatus: device.status ?? device.runStatus,
      updatedAt: device.updatedAt ?? device.createdAt ?? device.time,
    }))),
    [sourceDevices],
  );
  const filteredRows = useMemo(() => sortDeviceOverviewDetailRows(filterDeviceOverviewRows(rows, filter), detailSort), [rows, filter, detailSort]);
  const stats = useMemo(() => getDeviceOverviewStats(rows), [rows]);
  const attentionRows = useMemo(() => rows.filter(isDeviceNeedAttention), [rows]);
  const visibleAttentionRows = showAllAttention ? attentionRows : attentionRows.slice(0, 4);
  const typeRows = useMemo(() => getDeviceTypeOverviewRows(rows), [rows]);
  const overviewText = useMemo(() => getDeviceOverviewSummaryText(rows, attentionRows), [rows, attentionRows]);

  return (
    <section className="panel page-full device-overview-page">
      <SectionTitle icon={Cpu} title="设备总览" />
      <DataStateBlock compact>
        <>
          <SummaryStrip
            items={[
              { label: '总设备', value: stats.total },
              { label: '在线', value: stats.online, tone: 'ok' },
              { label: '运行中', value: stats.running, tone: 'ok' },
              { label: '异常', value: stats.abnormal, tone: 'bad' },
              { label: '离线', value: stats.offline, tone: 'bad' },
              { label: '维护', value: stats.maintenance, tone: 'warn' },
            ]}
          />
          <div className="overview-status-summary">{overviewText}</div>
        </>
      </DataStateBlock>
      <div className="overview-section-grid">
        <section className="overview-subpanel attention-devices-panel">
          <div className="subsection-title">
            <strong>异常设备</strong>
          </div>
          <DataStateBlock compact>
          {attentionRows.length ? (
            <div className="attention-device-list">
              {visibleAttentionRows.map((row, index) => (
                <button className={`attention-device-row${index === 0 ? ' is-priority' : ''}`} key={row.id} type="button" onClick={() => onSelectDevice(row.id)}>
                  <div className="attention-device-identity"><strong>{row.id}</strong><span>（{row.type}）</span></div>
                  <StatusText value={row.coreStatus} />
                  {index === 0 ? <span className="priority-label">优先处理</span> : <span className="priority-spacer" />}
                  <div className="attention-device-summary">{row.problemSummary}</div>
                  <div className="attention-device-task">{row.currentTask === '无' ? '无当前任务' : `影响 ${row.currentTask}`}</div>
                  <div className="attention-device-suggestion">{row.suggestion}</div>
                  <span className="attention-device-action">查看详情</span>
                </button>
              ))}
              {attentionRows.length > 4 && (
                <button className="attention-expand-button" type="button" onClick={() => setShowAllAttention((value) => !value)}>
                  {showAllAttention ? '收起异常设备' : '查看全部异常设备'}
                </button>
              )}
            </div>
          ) : (
            <EmptyState title="当前暂无异常设备" compact />
          )}
          </DataStateBlock>
        </section>
        <section className="overview-subpanel device-type-overview-panel">
          <div className="subsection-title">
            <strong>设备类型概览</strong>
          </div>
          <DataTable
            compact
            emptyText="暂无设备类型数据"
            columns={['设备类型', '数量', '运行', '异常', '离线']}
            rows={typeRows.map((row) => [
              row.type,
              row.total,
              row.running,
              row.abnormal,
              row.offline,
            ])}
          />
        </section>
      </div>
      <div className="overview-detail-head">
        <div>
          <strong>全部设备明细</strong>
        </div>
        <label className="overview-sort-control">
          <span>排序：</span>
          <select value={detailSort} onChange={(event) => setDetailSort(event.target.value)}>
            {DEVICE_OVERVIEW_SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <SegmentedFilter options={['全部', '异常', '离线', '运行中', '维护', '有任务']} value={filter} onChange={setFilter} />
      <DataTable
        stickyHeader
        maxHeight={520}
        minWidth={1190}
        columnWidths={[120, 100, 90, 90, 110, 80, 100, 120, 180, 100, 100]}
        columns={['设备编号', '类型', '在线状态', '运行状态', '当前任务', '报警数', '互锁状态', '关键点位异常数', '状态摘要', '更新时间', '操作']}
        emptyText="暂无设备数据"
        rows={filteredRows.map((row) => [
          row.id,
          row.type,
          <StatusText value={row.online} />,
          <StatusText value={row.runStatus} />,
          row.currentTask,
          row.alarmCount,
          <StatusText value={row.interlockStatus} />,
          row.keyAbnormalCount,
          row.statusSummary,
          row.updatedAt,
          <DeviceActionControls
            compact
            currentUser={currentUser}
            device={row}
            onOpenDetail={() => onSelectDevice(row.id)}
          />,
        ])}
        rowKeys={filteredRows.map((row) => row.id)}
        selectedKey={selectedDeviceId}
        onRowClick={onSelectDevice}
      />
    </section>
  );
}

function DeviceDetailPage({
  attachmentItems,
  attachmentLogs,
  currentUser,
  deviceFilter,
  deviceFilterOptions,
  deviceSearch,
  filteredDevices,
  onAttachmentChange,
  onPreviewAttachment,
  points,
  selectedDevice,
  selectedDeviceId,
  selectedPoint,
  selectedPointCode,
  setDeviceFilter,
  setDeviceSearch,
  setSelectedDeviceId,
  setSelectedPointCode,
}) {
  const historySummary = getDeviceHistorySummary(selectedDevice);
  const relatedAlarms = alarms.filter((alarm) => alarm.device === selectedDevice.id);
  const relatedLogs = [
    ...attachmentLogs.filter((row) => row.deviceId === selectedDevice.id || row.objectId === selectedDevice.id),
    ...telemetryLogs.filter((row) => row.deviceId === selectedDevice.id || row.objectId === selectedDevice.id),
  ];
  const currentTask = getCurrentTaskForDevice(selectedDevice.id);
  const overview = getDeviceOverviewRow(selectedDevice);
  const [keyPointCompareRange, setKeyPointCompareRange] = useState('5分钟均值');

  return (
    <div className="device-detail-page device-detail-grid">
      <div className="device-detail-workspace">
        <div className="device-detail-main-grid">
          <section className="panel device-list-panel device-detail-panel">
            <SectionTitle icon={Cpu} title="设备选择" />
            <div className="device-search-row">
              <Search size={16} />
              <SearchableFilterField
                label="设备"
                value={deviceSearch || '全部'}
                options={['全部', ...devices.map((device) => ({ label: `${device.id}｜${device.type}`, value: device.id }))]}
                onChange={(value) => setDeviceSearch(value === '全部' ? '' : value)}
                commitOnType
              />
              <SearchableFilterField
                label="状态"
                value={deviceFilter}
                options={deviceFilterOptions}
                onChange={setDeviceFilter}
                commitOnType={false}
              />
            </div>
            <div className="compact-device-list device-detail-scroll">
              {filteredDevices.map((device) => (
                <button
                  className={`compact-device-row ${selectedDeviceId === device.id ? 'selected' : ''}`}
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  type="button"
                >
                  <div className="device-row-main">
                    <strong>{device.id}</strong>
                    <small>{device.updatedAt}</small>
              </div>
              <div className="device-row-sub">
                <span className="device-row-type">{device.type}</span>
                <StatusText value={device.online} />
                <StatusText value={device.runStatus} />
              </div>
                </button>
              ))}
              {!filteredDevices.length && <div className="attachment-empty">暂无设备状态数据</div>}
            </div>
          </section>

          <div className="device-main-panel">
            <section className="panel device-overview-card-panel">
              <SectionTitle icon={MonitorCog} title="设备概况" />
              <DeviceActionControls
                currentUser={currentUser}
                device={selectedDevice}
              />
              <div className="device-overview-card-grid">
                <Info label="设备编号" value={selectedDevice.id} />
                <Info label="设备类型" value={selectedDevice.type} />
                <Info label="在线状态" value={<StatusText value={selectedDevice.online} />} />
                <Info label="运行状态" value={<StatusText value={selectedDevice.runStatus} />} />
                <Info label="当前任务" value={overview.currentTask} />
                <Info label="互锁状态" value={<StatusText value={overview.interlockStatus} />} />
                <Info label="报警数" value={selectedDevice.alarmCount} />
                <Info label="更新时间" value={selectedDevice.updatedAt} />
              </div>
            </section>

            <section className="panel trend-panel">
              <SectionTitle icon={Activity} title="趋势图" />
              <div className="trend-history-layout">
                <TrendChart device={selectedDevice} showMini={false} />
                <div className="history-inline-summary">
                  <h3>历史摘要</h3>
                  {historySummary.length ? (
                    historySummary.slice(0, 3).map((item) => (
                      <div className="history-inline-row" key={item.name}>
                        <strong>{item.name}</strong>
                        <span>当前值{item.current}</span>
                        <span>上一值{item.previous}</span>
                        <span>5分钟均值{item.average}</span>
                        <span>变化幅度 {item.delta}</span>
                      </div>
                    ))
                  ) : (
                    <div className="attachment-empty">暂无历史对比数据</div>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="device-side-panel">
            <section className="panel key-points-panel device-detail-panel">
              <SectionTitle
                icon={Activity}
                title="关键点位"
                action={(
                  <select className="section-action-select" value={keyPointCompareRange} onChange={(event) => setKeyPointCompareRange(event.target.value)}>
                    {['5分钟均值', '30分钟均值', '1小时均值'].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}
              />
              <div className="device-side-scroll">
                <KeyPointOverview compareRange={keyPointCompareRange} device={selectedDevice} />
              </div>
            </section>

            <section className="panel related-panel device-detail-panel">
              <SectionTitle icon={ClipboardList} title="关联信息" />
              <div className="related-info-grid compact device-side-scroll">
                <div className="related-info-card">
                  <span>当前任务</span>
                  <strong>{currentTask?.id ?? '无'}</strong>
                  <small>{currentTask ? `${currentTask.status}｜${currentTask.command}` : '暂无关联任务'}</small>
                </div>
                <div className="related-info-card">
                  <span>关联报警</span>
                  <strong>{relatedAlarms.length ? `${relatedAlarms.length} 条` : '无'}</strong>
                  <small>{relatedAlarms[0] ? `${relatedAlarms[0].name}｜${relatedAlarms[0].status}` : '暂无关联报警'}</small>
                </div>
                <div className="related-info-card">
                  <span>采集日志摘要</span>
                  <strong>{relatedLogs.length ? `${relatedLogs.length} 条` : '无'}</strong>
                  <small>{relatedLogs[0] ? `${relatedLogs[0].time}｜${relatedLogs[0].content}` : '暂无采集日志'}</small>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="point-workspace-panel device-point-section">
          <div className="point-workspace-grid">
            <div className="point-workspace-table collapsible-section">
              <SectionTitle icon={Database} title={selectedDevice.id + ' 点位表'} />
              {points.length ? <PointTable points={points} selectedPointCode={selectedPointCode} onSelectPoint={setSelectedPointCode} /> : <div className="attachment-empty">暂无点位映射数据</div>}
            </div>
            <div className="point-workspace-detail collapsible-section">
              <SectionTitle icon={Search} title={getPointDetailTitle(selectedPoint)} action={selectedPoint?.name ?? '-'} />
              <PointDetail point={selectedPoint} device={selectedDevice} />
            </div>
          </div>
        </section>
      </div>

      <div className="device-detail-secondary-grid">
        <section className="panel attachment-panel">
          <SectionTitle icon={FileClock} title="设备附件管理" />
          <DeviceAttachmentManager
            currentUser={currentUser}
            device={selectedDevice}
            items={attachmentItems}
            onChange={onAttachmentChange}
            onPreview={onPreviewAttachment}
          />
        </section>
        <section className="panel collect-log-panel">
          <SectionTitle icon={FileClock} title="采集日志" />
          {relatedLogs.length ? (
            <DataTable
              columns={['时间', '对象', '类型', '内容']}
              rows={relatedLogs.map((row) => [row.time, row.objectId ?? row.deviceId, row.logType, row.content])}
            />
          ) : (
            <div className="attachment-empty">暂无采集日志</div>
          )}
        </section>
      </div>
    </div>
  );
}

function DeviceActionControls({ compact = false, currentUser, device, onOpenDetail, onRefresh }) {
  const permissionContext = {
    requireLogin: true,
    isLoggedIn: Boolean(currentUser),
  };
  const permissionOk =
    hasPermission(currentUser, 'device-debug') &&
    canOperate(ACTION_KEYS.DEVICE_CHECK, permissionContext);
  const actionRequest = useActionRequest(
    async (action) => {
      const result =
        action === '检查设备连接'
          ? await checkDeviceConnection(device.id)
          : await refreshDeviceStatus(device.id);
      if (action === '刷新状态') onRefresh?.();
      return result;
    },
    {
      errorMessage: '操作失败，请稍后重试',
    },
  );

  return (
    <div
      className={`device-action-controls ${compact ? 'compact' : ''}`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="table-actions">
        {onOpenDetail && (
          <button type="button" onClick={onOpenDetail}>
            查看详情
          </button>
        )}
        <button
          disabled={actionRequest.loading || !permissionOk}
          onClick={() => actionRequest.run('检查设备连接')}
          type="button"
        >
          {actionRequest.loading ? '处理中' : '检查连接'}
        </button>
        <button
          disabled={actionRequest.loading || !permissionOk}
          onClick={() => actionRequest.run('刷新状态')}
          type="button"
        >
          {actionRequest.loading ? '刷新中' : '刷新状态'}
        </button>
      </div>
      {!permissionOk && (
        <div className="action-disabled-reason">
          {getOperatePermissionReason(ACTION_KEYS.DEVICE_CHECK, permissionContext) ||
            getPermissionReason(currentUser, '设备检查')}
        </div>
      )}
      <ActionFeedback
        compact
        error={actionRequest.error}
        loading={actionRequest.loading}
        success={actionRequest.lastResult}
        successText={actionRequest.lastResult?.message}
      />
    </div>
  );
}

function PointManagementPage({ allPointRows, currentUser }) {
  const defaultFilters = { type: '全部', device: '全部', pointType: '全部', source: '全部', status: '全部', enableStatus: '全部', query: '' };
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedPointRow, setSelectedPointRow] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');
  const rows = useMemo(() => getPointManagementRows(allPointRows), [allPointRows]);
  const filteredRows = useMemo(() => filterPointManagementRows(rows, filters), [rows, filters]);
  const stats = useMemo(() => getPointManagementStats(rows), [rows]);
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const applyStatFilter = (summaryFilter) => {
    const nextFilters = { ...defaultFilters };
    if (summaryFilter === 'normal') nextFilters.status = '正常';
    if (summaryFilter === 'problem') nextFilters.status = '问题点位';
    if (summaryFilter === 'unconfigured') nextFilters.status = '未配置';
    setFilters(nextFilters);
  };
  const activeSummaryFilter = getActivePointSummaryFilter(filters, defaultFilters);
  const deviceIds = ['全部', ...devices.map((device) => device.id)];

  return (
    <section className="panel page-full point-management-page">
      <SectionTitle
        icon={Database}
        title="点位管理"
        action={<ExportButton pageName="点位管理" columns={pointManagementExportColumns} getRows={() => filteredRows} currentUser={currentUser} />}
      />
      <SummaryStrip
        items={[
          { label: '总点位', value: stats.total, active: activeSummaryFilter === 'all', onClick: () => applyStatFilter('all') },
          { label: '正常', value: stats.normal, tone: 'ok', active: activeSummaryFilter === 'normal', onClick: () => applyStatFilter('normal') },
          { label: '异常', value: stats.abnormal, tone: stats.abnormal ? 'bad' : 'ok', active: activeSummaryFilter === 'problem', onClick: () => applyStatFilter('problem') },
          { label: '未配置', value: stats.unconfigured, tone: stats.unconfigured ? 'warn' : 'ok', active: activeSummaryFilter === 'unconfigured', onClick: () => applyStatFilter('unconfigured') },
        ]}
      />
      <div className="filterbar point-management-filter">
        <SearchableFilterField label="设备类型" value={filters.type} options={['全部', '数控机床', '工业机器人', '控制器', '公共机']} onChange={(value) => update('type', value)} />
        <SearchableFilterField label="设备编号" value={filters.device} options={deviceIds} onChange={(value) => update('device', value)} />
        <SearchableFilterField label="点位类型" value={filters.pointType} options={['全部', '数值', '状态', '报警']} onChange={(value) => update('pointType', value)} />
        <SearchableFilterField label="数据来源" value={filters.source} options={['全部', 'MQTT', 'PLC', '机器人控制器']} onChange={(value) => update('source', value)} />
        <SearchableFilterField label="采集状态" value={filters.status} options={['全部', '正常', '超时', '异常', '未配置', '问题点位']} onChange={(value) => update('status', value)} />
        <div className="filter-search-field">
          <Search size={16} />
          <input value={filters.query} onChange={(event) => update('query', event.target.value)} onFocus={(event) => event.target.select()} onMouseUp={(event) => event.preventDefault()} placeholder="搜索设备编号/点位名称/点位编码" />
        </div>
      </div>
      {copyFeedback && <div className="point-copy-toast" role="status">{copyFeedback}</div>}
      {filteredRows.length ? (
        <PointManagementTable
          rows={filteredRows}
          onDetail={setSelectedPointRow}
          onCopyCode={(code) => copyTextWithFeedback(code, setCopyFeedback, '已复制点位编码')}
        />
      ) : (
        <div className="attachment-empty">暂无点位映射数据</div>
      )}
      {selectedPointRow && <PointDetailModal row={selectedPointRow} onClose={() => setSelectedPointRow(null)} />}
    </section>
  );
}

function PointManagementTable({ rows, onDetail, onCopyCode }) {
  const groups = useMemo(() => groupPointRows(rows), [rows]);
  const columns = ['点位名称', '点位编码', '点位类型', '启用状态', '采集状态', '异常原因', '更新时间', '操作'];
  const columnWidths = ['16%', '18%', '12%', '10%', '12%', '16%', '12%', '14%'];
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    setExpandedGroups((current) => {
      const next = {};
      groups.forEach((group) => {
        next[group.deviceId] = current[group.deviceId] ?? true;
      });
      return next;
    });
  }, [groups]);

  const toggleGroup = (deviceId) => {
    setExpandedGroups((current) => ({ ...current, [deviceId]: !current[deviceId] }));
  };

  return (
    <div className="point-group-list">
      {groups.map((group) => {
        const expanded = Boolean(expandedGroups[group.deviceId]);
        const ToggleIcon = expanded ? ChevronDown : ChevronRight;

        return (
          <section className={'point-device-card' + (group.abnormalCount ? ' has-problem' : '')} key={group.deviceId}>
            <button className="point-device-head" type="button" onClick={() => toggleGroup(group.deviceId)} aria-expanded={expanded}>
              <ToggleIcon size={15} />
              <div className="point-device-title">
                <strong>{group.deviceId}｜{group.deviceType}</strong>
                <span>{group.summary}</span>
              </div>
              <div className="point-device-meta">
                <span>{group.rows.length} 个点位</span>
                <span>{group.abnormalCount} 个异常</span>
                <span>最后更新 {group.lastUpdatedAt}</span>
              </div>
            </button>
            {expanded && (
              <div className="table-wrap point-management-table">
                <table>
                  <colgroup>
                    {columnWidths.map((width, index) => (
                      <col key={columns[index] + '-' + width} style={{ width }} />
                    ))}
                  </colgroup>
                  <thead>
                    <tr>
                      {columns.map((column) => <th key={column}>{column}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row) => (
                      <tr className={isProblemPoint(row) ? 'point-row-warning' : ''} key={row.deviceId + '-' + row.code}>
                        <td>{row.name}</td>
                        <td>{row.code}</td>
                        <td>{formatPointTypeWithUnit(row)}</td>
                        <td><StatusText value={row.enableStatus} /></td>
                        <td><StatusText value={row.collectStatus} /></td>
                        <td className="point-issue-reason">{getPointIssueShortReason(row)}</td>
                        <td>{row.updatedAt}</td>
                        <td>
                          <div className="table-actions subtle">
                            <button type="button" onClick={() => onDetail(row)}>查看</button>
                            <button type="button" onClick={() => onCopyCode(row.code)}>复制</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function PointDetailModal({ row, onClose }) {
  const [feedback, setFeedback] = useState('');

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="confirm-modal point-detail-modal" role="dialog" aria-modal="true" aria-labelledby="point-detail-title">
        <div className="confirm-modal-head">
          <strong id="point-detail-title">点位详情</strong>
          <span>{row.deviceId}｜{row.name}</span>
        </div>
        <div className="detail-list dense">
          <Info label="设备编号" value={row.deviceId} />
          <Info label="点位名称" value={row.name} />
          <Info label="点位编码" value={row.code} />
          <Info label="点位类型" value={row.pointType} />
          <Info label="数据来源" value={row.source} />
          <Info label="Topic/地址" value={row.topic} />
          <Info label="单位" value={row.unit} />
          <Info label="采样频率" value={row.frequency} />
          <Info label="启用状态" value={<StatusText value={row.enableStatus} />} />
          <Info label="采集状态" value={<StatusText value={row.collectStatus} />} />
          <Info label="最后采集时间" value={row.lastCollectedAt} />
          <Info label="采集质量" value={row.quality} />
          <Info label="更新时间" value={row.updatedAt} />
          <Info label="异常原因" value={getPointIssueReason(row)} />
          <Info label="建议处理" value={getPointIssueSuggestion(row)} />
        </div>
        {feedback && <div className="inline-feedback modal-feedback">{feedback}</div>}
        <div className="confirm-modal-actions">
          <button type="button" onClick={() => copyTextWithFeedback(row.code, setFeedback, '已复制点位编码')}>复制点位编码</button>
          <button type="button" onClick={() => copyTextWithFeedback(row.topic, setFeedback, '已复制 Topic/地址')}>复制 Topic/地址</button>
          <button type="button" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
}

async function copyTextWithFeedback(text, setFeedback, successText) {
  setFeedback('正在复制...');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise((_, reject) => window.setTimeout(() => reject(new Error('clipboard timeout')), 800)),
    ]);
    setFeedback(successText);
  } catch {
    setFeedback('复制失败，请手动复制');
  }
  window.setTimeout(() => setFeedback(''), 2400);
}

function SearchableFilterField({ label, value, options, onChange, defaultValue = '全部', commitOnType = true }) {
  const [open, setOpen] = useState(false);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const normalizedOptions = useMemo(
    () => options.map((option) => (typeof option === 'string' ? { label: option, value: option } : option)),
    [options]
  );
  const displayValue = normalizedOptions.find((option) => option.value === value)?.label ?? value;
  const [draft, setDraft] = useState(displayValue);
  const visibleOptions = useMemo(() => {
    const keyword = draft.trim().toLowerCase();
    if (showAllOptions || !keyword || keyword === '全部') return normalizedOptions;
    return normalizedOptions.filter((option) => String(option.label + ' ' + option.value).toLowerCase().includes(keyword));
  }, [draft, normalizedOptions, showAllOptions]);

  useEffect(() => {
    setDraft(displayValue);
  }, [displayValue]);

  const commitFirstVisibleOption = () => {
    const firstOption = visibleOptions[0];
    if (!firstOption) {
      setOpen(false);
      return;
    }
    onChange(firstOption.value);
    setDraft(firstOption.label);
    setOpen(false);
  };

  return (
    <label className="filter-field searchable-filter-field">
      <span>{label}</span>
      <div
        className="searchable-select"
        onBlur={() => setTimeout(() => {
          if (!commitOnType && draft !== displayValue) {
            commitFirstVisibleOption();
          } else {
            setOpen(false);
          }
        }, 120)}
      >
        <input
          value={draft}
          onChange={(event) => {
            const nextValue = event.target.value;
            setShowAllOptions(false);
            if (!nextValue.trim()) {
              const nextDefault = defaultValue || '全部';
              setDraft(normalizedOptions.find((option) => option.value === nextDefault)?.label ?? nextDefault);
              onChange(nextDefault);
            } else {
              setDraft(nextValue);
              if (commitOnType) onChange(nextValue);
            }
            setOpen(true);
          }}
          onFocus={(event) => {
            event.target.select();
            setShowAllOptions(true);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (!commitOnType && event.key === 'Enter') {
              event.preventDefault();
              commitFirstVisibleOption();
            }
          }}
          onMouseUp={(event) => event.preventDefault()}
        />
        <button
          type="button"
          aria-label={'选择' + label}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setShowAllOptions(true);
            setOpen((current) => !current);
          }}
        >
          ▾
        </button>
        {open && (
          <div className="searchable-options">
            {visibleOptions.map((option) => (
              <button
                className={option.value === value ? 'active' : ''}
                key={option.value + '-' + option.label}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option.value);
                  setDraft(option.label);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </label>
  );
}

function HistoryComparePage({ allPointRows, selectedDeviceId, setSelectedDeviceId }) {
  const [selectedPointCode, setSelectedPointCode] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('近5分钟');
  const [selectedPointType, setSelectedPointType] = useState(() => getInitialPointTypeForDevice(selectedDeviceId));
  const deviceOptions = useMemo(() => devices.map((device) => device.id), []);
  const selectedDevice = devices.find((device) => device.id === selectedDeviceId) ?? devices[0];
  const selectedDeviceRows = useMemo(
    () => allPointRows.filter(({ device }) => device.id === selectedDeviceId),
    [allPointRows, selectedDeviceId]
  );
  const selectedDevicePointTypes = useMemo(
    () => Array.from(new Set(selectedDeviceRows.map(({ point }) => getPointTypeLabel(point)))),
    [selectedDeviceRows]
  );
  const deviceRows = useMemo(
    () => selectedDeviceRows.filter(({ point }) => getPointTypeLabel(point) === selectedPointType),
    [selectedDeviceRows, selectedPointType]
  );
  const pointOptions = useMemo(
    () => deviceRows.map(({ point }) => ({ label: point.name, value: point.code })),
    [deviceRows]
  );

  useEffect(() => {
    if (!selectedDevicePointTypes.length) {
      setSelectedPointType('');
      setSelectedPointCode('');
    } else if (!selectedDevicePointTypes.includes(selectedPointType)) {
      setSelectedPointType(selectedDevicePointTypes[0]);
      setSelectedPointCode('');
    }
  }, [selectedDevicePointTypes, selectedPointType]);

  useEffect(() => {
    if (!deviceRows.some(({ point }) => point.code === selectedPointCode)) {
      setSelectedPointCode(deviceRows[0]?.point.code ?? '');
    }
  }, [deviceRows, selectedPointCode]);

  const selectedRow = deviceRows.find(({ point }) => point.code === selectedPointCode) ?? deviceRows[0];
  const pointType = selectedRow ? getPointType(selectedRow.point) : getPointTypeFromLabel(selectedPointType);
  const comparison = selectedRow ? getHistoryComparison(selectedRow.point, selectedTimeRange) : null;
  const historyRecords = selectedRow ? getHistoryRecords(selectedRow.point, selectedTimeRange) : [];
  const statusRecords = selectedRow ? getStatusHistoryRecords(selectedRow.point, selectedTimeRange) : [];
  const alarmRecords = selectedRow ? getAlarmHistoryRecords(selectedRow.point, selectedTimeRange) : [];

  return (
    <section className="panel page-full history-compare-page">
      <SectionTitle icon={History} title="历史对比" />
      <div className="filterbar history-filter">
        <SearchableFilterField label="设备编号" value={selectedDeviceId} options={deviceOptions} onChange={setSelectedDeviceId} commitOnType={false} defaultValue={selectedDeviceId} />
        <SearchableFilterField label="点位名称" value={selectedPointCode} options={pointOptions} onChange={setSelectedPointCode} commitOnType={false} defaultValue={pointOptions[0]?.value ?? ''} />
        <SearchableFilterField label="时间范围" value={selectedTimeRange} options={['近5分钟', '近15分钟', '近30分钟', '近1小时']} onChange={setSelectedTimeRange} commitOnType={false} defaultValue="近5分钟" />
        <SearchableFilterField label="点位类型" value={selectedPointType} options={selectedDevicePointTypes} onChange={(value) => {
          setSelectedPointType(value);
          setSelectedPointCode('');
        }} commitOnType={false} defaultValue={selectedDevicePointTypes[0] ?? ''} />
      </div>
      <div className="data-hint">当前为演示数据，真实环境接入时序数据后更新</div>
      <CurrentObjectSummary comparison={comparison} device={selectedDevice} point={selectedRow?.point} timeRange={selectedTimeRange} />
      {selectedRow ? (
        <HistoryPointTemplate
          alarmRecords={alarmRecords}
          comparison={comparison}
          historyRecords={historyRecords}
          point={selectedRow.point}
          pointType={pointType}
          selectedDevice={selectedRow.device}
          selectedTimeRange={selectedTimeRange}
          statusRecords={statusRecords}
        />
      ) : (
        <div className="attachment-empty">{getHistoryEmptyText(selectedDevice, selectedPointType)}</div>
      )}
    </section>
  );
}

function CurrentObjectSummary({ comparison, device, point, timeRange }) {
  if (!device) {
    return <div className="attachment-empty">暂无设备状态数据</div>;
  }
  if (!point || !comparison) {
    return <div className="attachment-empty">当前设备暂无该类型点位，请切换点位类型或设备编号。</div>;
  }
  const task = getCurrentTaskForDevice(device.id);
  const judgement = getCurrentJudgementText(point, comparison, timeRange);

  return (
    <div className="history-object-summary">
      <strong>当前判断：{judgement}</strong>
      <span>{device.id}｜{device.type}｜{task?.id ?? '无当前任务'}｜更新时间 {device.updatedAt}</span>
    </div>
  );
}

function getHistoryEmptyText(device, pointType) {
  if (!device) return '暂无设备状态数据';
  if (!getDevicePointsFor(device).length) return '当前设备暂无点位数据，请检查设备配置';
  if (!pointType) return '当前设备暂无点位数据，请检查设备配置';
  return '当前设备暂无“' + pointType + '”点位，请切换点位类型或设备编号';
}

function HistoryPointTemplate({ alarmRecords, comparison, historyRecords, point, pointType, selectedDevice, selectedTimeRange, statusRecords }) {
  if (pointType === 'status') {
    const statusSummary = getStatusComparison(point, statusRecords);
    const statusAnalysis = getStatusAnalysis(statusSummary);
    return (
      <>
        <div className="history-main-layout">
          <div className="history-trend-block">
            <StatusTimeline records={statusRecords} />
          </div>
          <HistoryAnalysisPanel
            title="状态分析"
            items={[
              { label: '当前状态', value: statusSummary.current },
              { label: '上一状态', value: statusSummary.previous },
              { label: '变化次数', value: statusSummary.changeCount },
              { label: '最近变化时间', value: statusSummary.lastChangedAt },
            ]}
            judgement={statusAnalysis.judgement}
            suggestion={statusAnalysis.suggestion}
          />
        </div>
        <DataTable
          stickyHeader
          maxHeight={360}
          minWidth={780}
          columnWidths={[140, 110, 110, 100, 100, 'auto']}
          columns={['时间', '当前状态', '上一状态', '状态变化', '采集质量', '节点说明']}
          rows={statusRecords.map((row, index) => [row.time, <StatusText value={row.value} />, row.previous, row.changed ? '变化' : '保持', row.quality, getStatusNodeNote(row, index, statusRecords)])}
        />
      </>
    );
  }

  if (pointType === 'alarm') {
    const alarmSummary = getAlarmComparison(point, alarmRecords);
    const alarmAnalysis = getAlarmAnalysis(alarmSummary);
    return (
      <>
        <div className="history-main-layout">
          <div className="history-trend-block">
            <AlarmEventList records={alarmRecords} />
          </div>
          <HistoryAnalysisPanel
            title="报警分析"
            items={[
              { label: '当前报警码', value: alarmSummary.current },
              { label: '上一报警码', value: alarmSummary.previous },
              { label: '触发次数', value: alarmSummary.triggerCount },
              { label: '最近触发时间', value: alarmSummary.lastTriggeredAt },
              { label: '当前报警状态', value: point.status },
            ]}
            judgement={alarmAnalysis.judgement}
            suggestion={alarmAnalysis.suggestion}
          />
        </div>
        <DataTable
          stickyHeader
          maxHeight={360}
          minWidth={780}
          columnWidths={[140, 110, 120, 100, 100, 'auto']}
          columns={['时间', '报警码', '事件', '状态', '采集质量', '节点说明']}
          rows={alarmRecords.map((row, index) => [row.time, row.value, row.event, <StatusText value={row.status} />, row.quality, getAlarmNodeNote(row, index, alarmRecords)])}
        />
      </>
    );
  }

  const numericAnalysis = getNumericAnalysis(point, comparison);
  return (
    <>
      <div className="history-main-layout">
        <div className="history-trend-block">
          <TrendChart device={selectedDevice} point={point} showMini={false} timeRange={selectedTimeRange} />
        </div>
        <HistoryAnalysisPanel
          title="对比分析"
          items={[
            { label: '当前值', value: comparison.current },
            { label: '变化幅度', value: comparison.delta },
            { label: '上一值', value: comparison.previous },
            { label: comparison.compareLabel, value: comparison.average },
            { label: '历史最大', value: comparison.max },
            { label: '历史最小', value: comparison.min },
          ]}
          judgement={numericAnalysis.judgement}
          suggestion={numericAnalysis.suggestion}
        />
      </div>
      <DataTable
        stickyHeader
        maxHeight={360}
        minWidth={780}
        columnWidths={[140, 110, 110, 100, 100, 'auto']}
        columns={['时间', '当前值', '变化量', '状态', '采集质量', '节点说明']}
        rows={historyRecords.map((row, index) => [row.time, row.value, row.delta, <StatusText value={row.status} />, row.quality, row.note ?? getNumericNodeNote(row, index, historyRecords, point)])}
      />
    </>
  );
}

function HistoryAnalysisPanel({ items, judgement, suggestion, title }) {
  const [primaryItems, referenceItems] = items.length > 4 ? [items.slice(0, 2), items.slice(2)] : [items, []];
  return (
    <aside className="history-analysis-panel">
      <h3>{title}</h3>
      <div className="history-analysis-primary">
        {primaryItems.map((item) => (
          <div className="history-analysis-item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      {referenceItems.length > 0 && (
        <div className="history-analysis-reference">
          <span>参考值</span>
          {referenceItems.map((item) => (
            <div key={item.label}>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      )}
      <div className="history-analysis-note">
        <span>判断：{judgement}</span>
        <span>建议：{suggestion}</span>
      </div>
    </aside>
  );
}

function StatusTimeline({ records }) {
  return (
    <div className="history-event-list">
      {records.map((row) => (
        <div className="history-event-row" key={row.time}>
          <strong>{row.time}</strong>
          <span>{row.previous} → {row.value}</span>
          <StatusText value={row.changed ? '已确认' : '正常'} />
        </div>
      ))}
    </div>
  );
}

function AlarmEventList({ records }) {
  return (
    <div className="history-event-list">
      {records.map((row) => (
        <div className="history-event-row" key={row.time}>
          <strong>{row.time}</strong>
          <span>{row.event}｜{row.value}</span>
          <StatusText value={row.status} />
        </div>
      ))}
    </div>
  );
}

export default DevicesPageImpl;
