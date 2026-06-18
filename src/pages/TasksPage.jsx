import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as Runtime from '../AppRuntime';
import { ActionFeedback, DataStateBlock } from '../components/common';
import { useActionRequest } from '../hooks';
import { useRuntime } from '../runtime';
import { cancelTask, dispatchTask, getAlarms, getVisionResults, pauseTask, resumeTask } from '../services';
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

export function TasksPageImpl({
  selectedTask,
  taskList,
  selectedTaskId,
  setSelectedTaskId,
  onTaskAction,
  currentUser,
  navigation,
  openTaskLogs,
  setActiveDeviceTab,
  setLogFilter,
  setLogTypeFilter,
  setPage,
  setSelectedDeviceId,
}) {
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('全部');
  const [recordScope, setRecordScope] = useState('当前任务');
  const [activeTaskTab, setActiveTaskTab] = useState('任务总览');
  const runtime = useRuntime();
  const liveTaskList = runtime.tasks?.length ? runtime.tasks : taskList;
  const liveSelectedTask =
    liveTaskList.find((task) => task.id === selectedTaskId) ??
    liveTaskList[0] ??
    selectedTask;
  const filteredTasks = useMemo(() => filterTasks(liveTaskList, query, scope), [liveTaskList, query, scope]);
  const visibleSelectedTask = filteredTasks.some((task) => task.id === selectedTaskId) ? selectedTaskId : undefined;
  const currentStepDetail = liveSelectedTask ? getTaskCurrentStepDetail(liveSelectedTask) : null;
  const stats = useMemo(() => getTaskStats(liveTaskList), [liveTaskList]);
  const sourceLogs = runtime.logs ?? [];
  const visibleLogs = useMemo(
    () => (recordScope === '当前任务' ? sourceLogs.filter((row) => row.taskId === liveSelectedTask?.id) : sourceLogs),
    [recordScope, liveSelectedTask?.id, sourceLogs],
  );
  const selectSummaryScope = (nextScope) => {
    setScope(nextScope);
    setQuery('');
    setActiveTaskTab('任务队列');
  };
  const openSelectedDevice = () => {
    if (!liveSelectedTask) return;
    const deviceId = liveSelectedTask.devices.split(',').map((item) => item.trim()).filter(Boolean)[0];
    navigation?.navigateToDevice(deviceId);
  };
  const openSelectedAlarms = () => {
    navigation?.navigateToAlarm();
  };
  const sharedTaskProps = {
    currentStepDetail,
    currentUser,
    filteredTasks,
    navigation,
    onAlarms: openSelectedAlarms,
    onDevice: openSelectedDevice,
    onLogs: openTaskLogs,
    onTaskAction,
    query,
    recordScope,
    scope,
    selectedTask: liveSelectedTask,
    selectedTaskId: visibleSelectedTask,
    setPreviewAttachment,
    setQuery,
    setRecordScope,
    setScope,
    setSelectedTaskId,
    stats,
    taskList: liveTaskList,
    visibleLogs,
  };

  return (
    <div className="page-grid tasks-grid task-management-grid">
      <section className="panel task-summary-panel">
        <SectionTitle icon={ClipboardList} title="任务管理总览" />
        <DataStateBlock compact>
          <SummaryStrip
            items={[
              { label: '任务总数', value: stats.total, active: scope === '全部', onClick: () => selectSummaryScope('全部') },
              { label: '运行中', value: stats.running, tone: 'ok', active: scope === '运行中', onClick: () => selectSummaryScope('运行中') },
              { label: '排队中', value: stats.queued, tone: 'warn', active: scope === '排队中', onClick: () => selectSummaryScope('排队中') },
              { label: '暂停', value: stats.paused, tone: 'warn', active: scope === '暂停', onClick: () => selectSummaryScope('暂停') },
              { label: '失败', value: stats.failed, tone: 'bad', active: scope === '失败', onClick: () => selectSummaryScope('失败') },
              { label: '报警任务', value: stats.alarmTasks, tone: stats.alarmTasks ? 'bad' : 'ok', active: scope === '有报警', onClick: () => selectSummaryScope('有报警') },
            ]}
          />
        </DataStateBlock>
      </section>
      <section className="panel task-management-tabs-panel">
        <SegmentedFilter
          options={['任务总览', '任务队列', '任务详情', '任务配置', '人工接管', '任务记录']}
          value={activeTaskTab}
          onChange={setActiveTaskTab}
        />
      </section>
      <DataStateBlock
        empty={!liveSelectedTask}
        emptyTitle="暂无任务"
      >
        <>
          {activeTaskTab === '任务总览' && <TaskOverviewSection {...sharedTaskProps} />}
          {activeTaskTab === '任务队列' && <TaskQueueSection {...sharedTaskProps} />}
          {activeTaskTab === '任务详情' && <TaskDetailSection {...sharedTaskProps} />}
          {activeTaskTab === '任务配置' && <TaskConfigSection selectedTask={liveSelectedTask} />}
          {activeTaskTab === '人工接管' && <TaskHandoverSection {...sharedTaskProps} />}
          {activeTaskTab === '任务记录' && <TaskRecordsSection {...sharedTaskProps} />}
        </>
      </DataStateBlock>
      {previewAttachment && <AttachmentPreview attachment={previewAttachment} onClose={() => setPreviewAttachment(null)} />}
    </div>
  );
}

function TaskOverviewSection({ currentStepDetail, filteredTasks, selectedTask, setSelectedTaskId, stats, taskList }) {
  const handoverCount = taskList.filter((task) => ['待人工接管', '异常处理中', '待确认'].includes(task.processStatus) || ['暂停', '失败'].includes(task.status)).length;
  return (
    <div className="task-management-layout">
      <section className="panel task-overview-main-panel">
        <SectionTitle icon={ClipboardList} title="任务总览" />
        <div className="detail-list dense task-overview-detail">
          <Info label="当前任务" value={`${selectedTask.id} / ${selectedTask.orderId ?? selectedTask.orderNo ?? '-'}`} />
          <Info
            label="目标设备"
            value={(
              <button className="inline-link-button" type="button" onClick={() => navigation?.navigateToDevice?.(selectedTask.targetDevice ?? getTaskPrimaryDevice(selectedTask))}>
                {selectedTask.targetDevice ?? getTaskPrimaryDevice(selectedTask)}
              </button>
            )}
          />
          <Info label="当前步骤" value={`${currentStepDetail.stepLabel}｜${currentStepDetail.command}`} />
          <Info label="任务状态" value={<StatusText value={selectedTask.status} />} />
          <Info label="处理状态" value={<StatusText value={selectedTask.processStatus ?? '待处理'} />} />
          <Info label="更新时间" value={selectedTask.updatedAt} />
        </div>
      </section>
      <section className="panel task-overview-main-panel">
        <SectionTitle icon={ShieldCheck} title="处理概况" />
        <SummaryStrip
          items={[
            { label: '待处理', value: taskList.filter((task) => task.processStatus === '待处理').length, tone: 'warn' },
            { label: '待确认', value: taskList.filter((task) => task.processStatus === '待确认').length, tone: 'warn' },
            { label: '人工接管', value: handoverCount, tone: handoverCount ? 'bad' : 'ok' },
            { label: '正常处理', value: taskList.filter((task) => task.processStatus === '正常处理').length, tone: 'ok' },
          ]}
        />
      </section>
      <section className="panel task-overview-list-panel">
        <SectionTitle icon={ClipboardList} title="近期任务" />
        <TaskQueue taskList={filteredTasks.slice(0, 6)} selectedTaskId={selectedTask.id} setSelectedTaskId={setSelectedTaskId} />
      </section>
    </div>
  );
}

function TaskQueueSection({ currentUser, filteredTasks, query, scope, selectedTaskId, setQuery, setScope, setSelectedTaskId }) {
  return (
    <div className="task-management-layout">
      <section className="panel task-queue-panel task-queue-full-panel">
        <SectionTitle
          icon={ClipboardList}
          title="任务队列"
          action={<ExportButton pageName="任务管理" columns={taskExportColumns} getRows={() => filteredTasks.map((task) => buildTaskExportRow(task))} currentUser={currentUser} />}
        />
        <SearchSelect
          value={query}
          onChange={setQuery}
          selectValue={scope}
          onSelectChange={setScope}
          options={['全部', '生产任务', '巡检任务', '搬运任务', '上下料任务', '视觉检测任务', '建图任务', '运行中', '排队中', '暂停', '失败', '已中止', '有报警']}
          placeholder="搜索订单编号/任务类型/目标设备/处理状态"
        />
        <TaskQueue taskList={filteredTasks} selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} />
      </section>
    </div>
  );
}

function TaskDetailSection({ currentStepDetail, currentUser, navigation, onAlarms, onDevice, onLogs, onTaskAction, selectedTask, setPreviewAttachment }) {
  const visionRows = getVisionResults()
    .filter((row) => row.relatedTask === selectedTask.id || (row.taskId ?? row.visionTaskId) === selectedTask.visionTaskId)
    .map((row) => normalizeVisionResult({
      ...row,
      visionTaskId: row.taskId ?? row.visionTaskId,
      screenshot: row.snapshotUrl ?? row.screenshot,
      time: row.createdAt ?? row.time,
    }));
  const recentVisionRow = visionRows[0];
  const recentVisionTask = visionTasks.find((task) => task.visionTaskId === recentVisionRow?.visionTaskId) ?? visionTasks.find((task) => task.visionTaskId === selectedTask.visionTaskId) ?? visionTasks[0];
  const recentVisionCamera = cameras.find((camera) => camera.cameraId === recentVisionRow?.cameraId) ?? cameras.find((camera) => camera.cameraId === recentVisionTask?.cameraId) ?? cameras[0];
  const hasVisionRisk = visionRows.some((row) => ['异常', '低置信度', '失败'].includes(row.result) || ['待复核', '处理中', '转人工处理'].includes(row.processStatus));
  const taskAlarms = getAlarms().filter((alarm) => alarm.taskId === selectedTask.id || selectedTask.devices.includes(alarm.deviceId ?? alarm.device));
  return (
    <div className="task-management-layout">
      <section className="panel task-detail-info-panel">
        <SectionTitle icon={ClipboardList} title="基础信息" />
        <div className="detail-list dense">
          <Info label="任务编号" value={selectedTask.id} />
          <Info label="订单编号" value={selectedTask.orderId ?? selectedTask.orderNo ?? '-'} />
          <Info label="任务类型" value={selectedTask.type ?? selectedTask.taskType ?? '生产任务'} />
          <Info label="目标设备" value={selectedTask.targetDevice ?? getTaskPrimaryDevice(selectedTask)} />
          <Info label="处理状态" value={<StatusText value={selectedTask.processStatus ?? '待处理'} />} />
          <Info label="开始时间" value={selectedTask.startedAt} />
        </div>
      </section>
      <section className="panel task-detail-info-panel">
        <SectionTitle icon={MonitorCog} title="定位信息" />
        <div className="detail-list dense">
          <Info label="目标地图" value={selectedTask.targetMap ?? '-'} />
          <Info label="目标路线" value={selectedTask.targetRoute ?? '-'} />
          <Info label="目标点位" value={selectedTask.targetPoint ?? selectedTask.actionPoint ?? '-'} />
          <Info label="取料工位" value={selectedTask.pickupStation ?? '-'} />
          <Info label="放料方案" value={selectedTask.placementPlan ?? '-'} />
          <Info label="开门方式" value={selectedTask.doorMode ?? '-'} />
        </div>
      </section>
      <section className="panel task-workbench-panel task-detail-progress-panel">
        <SectionTitle icon={MonitorCog} title="动作进度" />
        <TaskExecutionWorkbench
          currentStepDetail={currentStepDetail}
          currentUser={currentUser}
          onAlarms={onAlarms}
          onDevice={onDevice}
          onLogs={onLogs}
          onTaskAction={onTaskAction}
          navigation={navigation}
          task={selectedTask}
        />
      </section>
      <section className="panel task-detail-result-panel">
        <SectionTitle icon={MonitorCog} title="视觉结果" />
        {visionRows.length ? (
          <div className="task-vision-result-card">
            <div className="task-vision-thumb">
              <MockVisionFrame camera={recentVisionCamera} result={recentVisionRow} task={recentVisionTask} variant="snapshot" />
            </div>
            <div className="task-vision-result-body">
              {hasVisionRisk && <div className="task-vision-alert">视觉结果存在低置信度、异常或待复核项，请进入视觉监控工作台复核。</div>}
              <DataTable
                compact
                columns={['时间', '相机', '对象', '结果', '置信度', '处理状态', '操作']}
                rows={visionRows.map((row) => [row.createdAt ?? row.updatedAt ?? row.time, row.cameraId, row.name ?? row.object, <StatusText value={row.result} />, row.confidence ?? row.score, <StatusText value={row.status ?? row.processStatus} />, <button type="button" onClick={() => navigation?.navigateToVision?.(row.id ?? row.snapshotUrl ?? getVisionResultKey(row))}>查看截图</button>])}
              />
            </div>
          </div>
        ) : (
          <EmptyState title="当前任务暂无视觉结果" compact />
        )}
      </section>
      <section className="panel task-detail-result-panel">
        <SectionTitle icon={Cpu} title="机械臂执行结果" />
        <div className="detail-list dense">
          <Info
            label="机械臂"
            value={selectedTask.armId && selectedTask.armId !== '-'
              ? <button className="inline-link-button" type="button" onClick={() => navigation?.navigateToArm?.(selectedTask.armId)}>{selectedTask.armId}</button>
              : '-'}
          />
          <Info label="动作点位" value={selectedTask.actionPoint ?? '-'} />
          <Info label="当前动作" value={currentStepDetail.command} />
          <Info label="执行状态" value={<StatusText value={selectedTask.status} />} />
          <Info label="回执状态" value={currentStepDetail.receiptStatus} />
        </div>
      </section>
      <section className="panel task-detail-result-panel">
        <SectionTitle icon={AlertTriangle} title="异常与处理" />
        <DataTable
          compact
          columns={['异常对象', '类型', '状态', '处理建议']}
          rows={(taskAlarms.length ? taskAlarms : [{ device: selectedTask.targetDevice ?? '-', type: '任务状态', status: selectedTask.processStatus ?? '正常处理' }]).map((row) => [
            row.deviceId ?? row.device,
            row.type,
            <StatusText value={row.status} />,
            selectedTask.alarmCount > 0 ? '进入人工接管处理' : '继续自动执行',
          ])}
        />
      </section>
      <section className="panel task-detail-result-panel">
        <SectionTitle icon={History} title="复测记录" />
        <DataTable
          compact
          columns={['复测项', '结果', '时间']}
          rows={[
            ['视觉复核', visionRows.some((row) => row.processStatus === '待复核') ? <StatusText value="待复核" /> : <StatusText value="通过" />, selectedTask.updatedAt],
            ['动作复核', selectedTask.status === '失败' ? <StatusText value="未通过" /> : <StatusText value="通过" />, selectedTask.updatedAt],
          ]}
        />
      </section>
      <section className="panel task-attachment-panel task-detail-attachment-panel">
        <SectionTitle icon={FileClock} title="任务附件" />
        <AttachmentList compact emptyText="当前任务暂无附件" items={taskAttachments[selectedTask.id] ?? []} onPreview={setPreviewAttachment} showAdd={false} />
      </section>
    </div>
  );
}

function TaskConfigSection({ selectedTask }) {
  return (
    <div className="task-management-layout">
      <section className="panel task-config-panel">
        <SectionTitle icon={Settings} title="任务配置" />
        <DataTable
          stickyHeader
          maxHeight={460}
          minWidth={640}
          columnWidths={[140, 'auto', 100, 130]}
          columns={['配置项', '当前配置', '状态', '更新时间']}
          rows={[
            ['任务方案', selectedTask.taskPlan ?? selectedTask.executionMode ?? '标准任务方案', <StatusText value="启用" />, selectedTask.updatedAt],
            ['视觉标识', selectedTask.visionMark ?? selectedTask.visionTaskId ?? '-', <StatusText value={selectedTask.visionTaskId ? '启用' : '未绑定'} />, selectedTask.updatedAt],
            ['动作点位', selectedTask.actionPoint ?? selectedTask.targetPoint ?? '-', <StatusText value="启用" />, selectedTask.updatedAt],
            ['开门方式', selectedTask.doorMode ?? '-', <StatusText value="启用" />, selectedTask.updatedAt],
            ['物料规则', selectedTask.materialRule ?? '按任务类型校验', <StatusText value="启用" />, selectedTask.updatedAt],
            ['放料方案', selectedTask.placementPlan ?? '-', <StatusText value="启用" />, selectedTask.updatedAt],
            ['复核规则', selectedTask.reviewRule ?? '完成后自动复核', <StatusText value="启用" />, selectedTask.updatedAt],
          ]}
        />
      </section>
    </div>
  );
}

function TaskHandoverSection({ currentUser, onAlarms, onDevice, onLogs, onTaskAction, selectedTask, setSelectedTaskId, taskList }) {
  const handoverTasks = taskList.filter((task) => task.alarmCount > 0 || ['待确认', '异常处理中', '待人工接管'].includes(task.processStatus) || ['暂停', '失败'].includes(task.status));
  return (
    <div className="task-management-layout">
      <section className="panel task-handover-list-panel">
        <SectionTitle icon={ShieldCheck} title="人工接管" />
        <DataTable
          stickyHeader
          maxHeight={440}
          minWidth={860}
          columnWidths={[150, 120, 130, 160, 100, 110]}
          columns={['订单编号', '任务类型', '目标设备', '异常/确认项', '任务状态', '处理状态']}
          rows={handoverTasks.map((task) => [
            task.orderId ?? task.orderNo ?? task.id,
            task.type ?? task.taskType ?? '生产任务',
            task.targetDevice ?? getTaskPrimaryDevice(task),
            task.alarmCount > 0 ? `${task.alarmCount} 条异常` : task.command,
            <StatusText value={task.status} />,
            <StatusText value={task.processStatus ?? '待处理'} />,
          ])}
          rowKeys={handoverTasks.map((task) => task.id)}
          selectedKey={selectedTask.id}
          onRowClick={setSelectedTaskId}
        />
      </section>
      <section className="panel task-handover-action-panel">
        <SectionTitle icon={MonitorCog} title="接管处理" />
        <TaskWorkbenchActions
          currentUser={currentUser}
          onAlarms={onAlarms}
          onDevice={onDevice}
          onLogs={onLogs}
          onTaskAction={onTaskAction}
          task={selectedTask}
        />
      </section>
    </div>
  );
}

function TaskRecordsSection({ recordScope, selectedTask, setRecordScope, visibleLogs }) {
  const rows = getTaskManagementRecordRows(selectedTask, visibleLogs);
  return (
    <div className="task-management-layout">
      <section className="panel task-record-panel task-record-full-panel">
        <SectionTitle icon={History} title="任务记录" action={<SegmentedFilter options={['当前任务', '全部']} value={recordScope} onChange={setRecordScope} />} />
        <DataTable
          className="task-record-table"
          stickyHeader
          maxHeight={520}
          minWidth={920}
          columnWidths={[130, 120, 140, 'auto', 100]}
          columns={['时间', '记录分类', '对象', '内容', '状态']}
          emptyText="暂无任务记录"
          rows={rows.map((row) => [row.createdAt ?? row.updatedAt ?? row.time, row.category, row.target ?? row.objectId, row.message ?? row.content, <StatusText value={row.status} />])}
        />
      </section>
    </div>
  );
}
function TaskExecutionWorkbench({ currentStepDetail, currentUser, navigation, onAlarms, onDevice, onLogs, onTaskAction, task }) {
  const stepSummary = getTaskProgressSummary(task);
  return (
    <div className="task-workbench">
      <div className="task-workbench-summary">
        <div>
          <strong>{task.id}</strong>
          <StatusText value={task.status} />
          <span>{stepSummary}｜{currentStepDetail.command}</span>
        </div>
        <p>
          类型：{task.type ?? task.taskType ?? '生产任务'}｜机器人：{task.robotId ?? '-'}｜目标：{[task.targetMap, task.targetRoute, task.targetPoint].filter((item) => item && item !== '-').join(' / ') || '-'}｜关联设备：{task.devices.replaceAll(',', '、')}｜报警 {task.alarmCount} 条｜下发 {currentStepDetail.dispatchStatus}｜回执 {currentStepDetail.receiptStatus}
        </p>
      </div>
      <div className="task-workbench-body">
        <div className="task-progress-panel">
          <h3>工序进度</h3>
          <StepList task={task} onStepNavigate={navigation} />
        </div>
        <TaskWorkbenchActions
          currentUser={currentUser}
          onAlarms={onAlarms}
          onDevice={onDevice}
          onLogs={onLogs}
          onTaskAction={onTaskAction}
          task={task}
        />
      </div>
    </div>
  );
}

function TaskWorkbenchActions({ currentUser, onAlarms, onDevice, onLogs, onTaskAction, task }) {
  const [note, setNote] = useState('');
  const actions = getTaskWorkbenchActions(task.status, task.alarmCount);
  const permissionContext = {
    requireLogin: true,
    isLoggedIn: Boolean(currentUser),
    allowDangerous: currentUser?.role === '管理员',
  };
  const actionRequest = useActionRequest(
    async (action) => {
      let result;
      if (action === '暂停') result = await pauseTask(task.id);
      if (action === '继续执行') result = await resumeTask(task.id);
      if (action === '中止') result = await cancelTask(task.id);
      if (action === '重新下发') result = await dispatchTask(task.id);
      const legacyAction = action === '继续执行' ? '恢复' : action === '重新下发' ? '重试' : action;
      onTaskAction?.(task, legacyAction);
      return result;
    },
    {
      confirm: (action) =>
        action !== '中止' ||
        window.confirm(`确认取消任务 ${task.id}？该操作会中止当前任务。`),
      errorMessage: '操作失败，请稍后重试',
    },
  );
  const runAction = (action) => {
    if (['暂停', '继续执行', '中止', '重新下发'].includes(action)) {
      actionRequest.run(action);
      return;
    }
    if (action === '查看日志') onLogs?.();
    if (action === '查看设备') onDevice?.();
    if (action === '查看报警') onAlarms?.();
    if (action === '标记已处理') {
      setNote('已记录处理结果（演示）');
      window.setTimeout(() => setNote(''), 1800);
    }
  };

  return (
    <div className="task-action-panel">
      <h3>操作面板</h3>
      <div className="button-row">
        {actions.map((action) => {
          const actionKey = {
            暂停: ACTION_KEYS.TASK_PAUSE,
            继续执行: ACTION_KEYS.TASK_RESUME,
            中止: ACTION_KEYS.TASK_CANCEL,
            重新下发: ACTION_KEYS.TASK_RETRY,
          }[action];
          const isExecutionAction = ['暂停', '继续执行', '中止', '重新下发', '标记已处理'].includes(action);
          const permissionOk =
            !isExecutionAction ||
            (hasPermission(currentUser, getTaskWorkbenchActionPermission(action)) &&
              (!actionKey || canOperate(actionKey, permissionContext)));
          return (
            <button
              className={action === '中止' ? 'danger' : ''}
              disabled={actionRequest.loading || !permissionOk}
              key={action}
              onClick={() => runAction(action)}
              title={!permissionOk ? getPermissionReason(currentUser, action) : undefined}
              type="button"
            >
              {getActionIcon(action === '继续执行' ? '恢复' : action)}
              {actionRequest.loading && actionKey ? '处理中' : action}
            </button>
          );
        })}
      </div>
      {actions.some((action) => ['暂停', '继续执行', '中止', '重新下发', '标记已处理'].includes(action)) && !currentUser && (
        <div className="action-disabled-reason">
          {getOperatePermissionReason(ACTION_KEYS.TASK_PAUSE, permissionContext)}
        </div>
      )}
      {note && <div className="inline-feedback">{note}</div>}
      {actions.includes('中止') &&
        !canOperate(ACTION_KEYS.TASK_CANCEL, permissionContext) &&
        currentUser && (
          <div className="action-disabled-reason">
            {getOperatePermissionReason(ACTION_KEYS.TASK_CANCEL, permissionContext)}
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

export default TasksPageImpl;
