import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as Runtime from '../AppRuntime';
import { ActionFeedback } from '../components/common';
import { useActionRequest } from '../hooks';
import {
  emergencyStopArm,
  executeArmAction,
  resetArm,
} from '../services';
import {
  ACTION_KEYS,
  canOperate,
  getOperatePermissionReason,
} from '../utils/permission';

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
  visionLogs,
  visionModels,
  visionResults,
  visionTabs,
  visionTasks,
} = Runtime;

export function ArmControlPage({ activeArmTab, currentUser, navigation, onArmActionEvent, selectedArmId, selectedArmTemplateId, selectedTeachingPointId, setActiveArmTab, setSelectedArmId, setSelectedArmTemplateId, setSelectedTeachingPointId }) {
  const [arms, setArms] = useState(robotArms);
  const [records, setRecords] = useState(armActionLogs);
  const [receipts, setReceipts] = useState(armCommandReceipts);
  const [teachingPoints, setTeachingPoints] = useState(armTeachingPoints);
  const [teachingLogs, setTeachingLogs] = useState(teachingPointLogs);
  const [templateRows, setTemplateRows] = useState(armActionTemplates);
  const [templateLogs, setTemplateLogs] = useState(armTemplateLogs);
  const [notice, setNotice] = useState('');
  const selectedArm = arms.find((arm) => arm.armId === selectedArmId) ?? arms[0];
  const permissionContext = {
    requireLogin: true,
    isLoggedIn: Boolean(currentUser),
    allowDangerous: currentUser?.role === '管理员',
  };
  const applyArmAction = (action) => {
    const now = formatNowTime();
    const commandId = `CMD-ARM-${Date.now().toString().slice(-6)}`;
    const targetPoint = getArmActionTargetPoint(action);
    const nextStatus =
      action === '急停'
        ? '异常'
        : action === '停止'
          ? '待机'
          : action === '暂停'
            ? '暂停'
            : action === '复位' || action === '回零'
              ? '待机'
              : '运行中';
    const nextToolStatus = action === '打开夹爪'
      ? selectedArm.toolStatus.replace('已关闭', '已打开')
      : action === '关闭夹爪'
        ? selectedArm.toolStatus.replace('已打开', '已关闭')
        : selectedArm.toolStatus;
    const command = {
      id: commandId,
      commandId,
      deviceId: selectedArm.armId,
      objectType: action.includes('夹爪') ? 'tool' : 'arm',
      objectId: action.includes('夹爪') ? selectedArm.toolId : selectedArm.armId,
      commandName: action,
      params: targetPoint === '-' ? 'mock=true' : `target=${targetPoint}`,
      sendResult: '已下发',
      receiptStatus: '已确认',
      stage: '设备已确认',
      relatedTask: selectedArm.currentTask || '无',
      sender: currentUser?.username ?? 'admin',
      sendTime: now,
      receiptTime: addSecondsToTime(now, 2),
      duration: '2.1s',
      failReason: '-',
      suggestion: '机械臂 mock 指令已确认执行。',
      handledBy: '-',
      handledAt: '-',
      targetArm: selectedArm.armId,
    };
    const record = {
      time: now,
      armId: selectedArm.armId,
      actionName: action,
      action,
      targetPoint,
      result: '成功',
      receiptStatus: '已确认',
      relatedTask: selectedArm.currentTask || '无',
      taskId: selectedArm.currentTask || '无',
      operator: currentUser?.username ?? 'admin',
    };
    const log = {
      time: now,
      objectType: command.objectType,
      objectId: command.objectId,
      deviceId: selectedArm.armId,
      taskId: selectedArm.currentTask || '无',
      logType: action.includes('夹爪') ? '末端工具' : '机械臂',
      content: `机械臂动作：${action}`,
      params: targetPoint,
      status: '成功',
      operator: currentUser?.username ?? 'admin',
    };
    setArms((rows) => rows.map((arm) => arm.armId === selectedArm.armId ? {
      ...arm,
      runStatus: nextStatus,
      currentAction: action,
      toolStatus: nextToolStatus,
      emergencyStatus: action === '急停' ? '已触发' : action === '复位' ? '未触发' : arm.emergencyStatus,
      updatedAt: now,
    } : arm));
    setRecords((rows) => [record, ...rows]);
    setReceipts((rows) => [command, ...rows]);
    onArmActionEvent?.({ command, log });
    setNotice(`${action}：${selectedArm.armId}（前端模拟）`);
    window.setTimeout(() => setNotice(''), 1800);
    return command;
  };

  const armActionRequest = useActionRequest(
    async (action, safetyRows = []) => {
      const actionKey =
        action === '急停'
          ? ACTION_KEYS.ARM_EMERGENCY_STOP
          : action === '复位'
            ? ACTION_KEYS.ARM_RESET
            : null;
      if (actionKey && !canOperate(actionKey, permissionContext)) {
        throw new Error(getOperatePermissionReason(actionKey, permissionContext));
      }
      if (!['急停', '复位'].includes(action)) {
        const blockedReason = getArmActionBlockedReason(currentUser, selectedArm, safetyRows);
        if (blockedReason) throw new Error(blockedReason);
      }

      let result;
      if (action === '急停') result = await emergencyStopArm(selectedArm.armId);
      else if (action === '复位') result = await resetArm(selectedArm.armId);
      else result = await executeArmAction(selectedArm.armId, action);
      applyArmAction(action);
      return result;
    },
    {
      confirm: (action) =>
        !['急停', '复位'].includes(action) &&
        !String(action).startsWith('执行')
          ? true
          : window.confirm(`确认向 ${selectedArm.armId} 下发“${action}”指令？`),
      errorMessage: '操作失败，请稍后重试',
    },
  );

  const applyTemplateExecution = (template) => {
    const arm = arms.find((item) => template.armId.includes(item.armId)) ?? selectedArm;
    const safetyRows = getTemplateSafetyRows(template, teachingPoints, arm);
    const blockedReason = getTemplateBlockedReason(currentUser, template, safetyRows, arm);
    if (blockedReason) {
      setNotice(blockedReason);
      window.setTimeout(() => setNotice(''), 1800);
      return null;
    }
    const now = formatNowTime();
    const commandId = `CMD-TPL-${Date.now().toString().slice(-6)}`;
    const relatedTask = arm.currentTask && arm.currentTask !== '无' ? arm.currentTask : 'TASK-008';
    const willFail = template.templateId === 'TPL-PLACE-001';
    const command = {
      id: commandId,
      commandId,
      deviceId: arm.armId,
      objectType: 'arm-template',
      objectId: template.templateId,
      commandName: '执行动作模板',
      params: `template=${template.templateId}`,
      sendResult: '已下发',
      receiptStatus: willFail ? '超时' : '已确认',
      stage: willFail ? '执行超时' : '设备已确认',
      relatedTask,
      sender: currentUser?.username ?? 'admin',
      sendTime: now,
      receiptTime: addSecondsToTime(now, 12),
      duration: willFail ? '-' : '12.4s',
      failReason: willFail ? '模板执行超时' : '-',
      suggestion: willFail ? '已生成机械臂异常，请转人工接管。' : '动作模板已按前端 mock 执行完成。',
      handledBy: '-',
      handledAt: '-',
      targetArm: arm.armId,
    };
    const log = {
      time: now,
      objectType: 'arm-template',
      objectId: template.templateId,
      deviceId: arm.armId,
      taskId: relatedTask,
      logType: '机械臂',
      content: `执行动作模板：${template.templateName}`,
      params: template.templateId,
      status: willFail ? '失败' : '成功',
      operator: currentUser?.username ?? 'admin',
    };
    const actionRecord = {
      time: now,
      armId: arm.armId,
      actionName: `执行动作模板：${template.templateName}`,
      action: `执行动作模板：${template.templateName}`,
      targetPoint: template.steps?.find((step) => step.targetTeachingPoint && step.targetTeachingPoint !== '-')?.targetTeachingPoint ?? '-',
      result: willFail ? '失败' : '成功',
      receiptStatus: willFail ? '超时' : '已确认',
      relatedTask,
      taskId: relatedTask,
      operator: currentUser?.username ?? 'admin',
    };
    const record = {
      time: now,
      templateId: template.templateId,
      templateName: template.templateName,
      armId: arm.armId,
      relatedTask,
      result: willFail ? '失败' : '成功',
      receiptStatus: willFail ? '超时' : '已确认',
      duration: willFail ? '-' : '12.4s',
      operator: currentUser?.username ?? 'admin',
    };
    const alarm = willFail ? {
      name: '机械臂动作模板执行超时',
      device: arm.armId,
      type: '机械臂报警',
      level: '中危',
      status: '处理中',
      time: now,
      jumpTarget: 'arm-control',
      armId: arm.armId,
      relatedTask,
    } : null;
    setReceipts((rows) => [command, ...rows]);
    setRecords((rows) => [actionRecord, ...rows]);
    setTemplateLogs((rows) => [record, ...rows]);
    onArmActionEvent?.({
      command,
      log,
      alarm,
      taskUpdate: alarm ? { taskId: relatedTask, patch: { status: '异常处理中', processStatus: '待人工接管', alarmCount: 1, updatedAt: now } } : null,
    });
    setNotice(`${willFail ? '模板执行失败' : '执行动作模板'}：${template.templateName}（前端模拟）`);
    window.setTimeout(() => setNotice(''), 1800);
    return command;
  };

  const templateActionRequest = useActionRequest(
    async (template) => {
      const arm = arms.find((item) => template.armId.includes(item.armId)) ?? selectedArm;
      const safetyRows = getTemplateSafetyRows(template, teachingPoints, arm);
      const blockedReason = getTemplateBlockedReason(currentUser, template, safetyRows, arm);
      if (blockedReason) throw new Error(blockedReason);
      const result = await executeArmAction(arm.armId, template.templateId);
      applyTemplateExecution(template);
      return result;
    },
    {
      confirm: (template) =>
        window.confirm(`确认执行动作模板“${template.templateName}”？`),
      errorMessage: '操作失败，请稍后重试',
    },
  );

  if (activeArmTab === 'control') return <ArmActionControlPage actionRequest={armActionRequest} arms={arms} currentUser={currentUser} navigation={navigation} records={records} receipts={receipts} runArmAction={armActionRequest.run} selectedArm={selectedArm} setSelectedArmId={setSelectedArmId} notice={notice} />;
  if (activeArmTab === 'teaching') return <ArmTeachingPage currentUser={currentUser} logs={teachingLogs} points={teachingPoints} selectedPointId={selectedTeachingPointId} setLogs={setTeachingLogs} setPoints={setTeachingPoints} setSelectedPointId={setSelectedTeachingPointId} templates={templateRows} notice={notice} setNotice={setNotice} />;
  if (activeArmTab === 'tools') return <EndEffectorPage />;
  if (activeArmTab === 'templates') return <ArmTemplatePage actionRequest={templateActionRequest} arms={arms} currentUser={currentUser} executeTemplate={templateActionRequest.run} logs={templateLogs} navigation={navigation} notice={notice} points={teachingPoints} selectedTemplateId={selectedArmTemplateId} setActiveArmTab={setActiveArmTab} setSelectedTeachingPointId={setSelectedTeachingPointId} setSelectedTemplateId={setSelectedArmTemplateId} setTemplates={setTemplateRows} templates={templateRows} />;
  return <ArmOverviewPage arms={arms} navigation={navigation} records={records} setActiveArmTab={setActiveArmTab} setSelectedArmId={setSelectedArmId} />;
}

function ArmOverviewPage({ arms, navigation, records, setActiveArmTab, setSelectedArmId }) {
  const stats = getArmStats(arms);
  const abnormalArms = arms.filter((arm) => arm.alarmStatus !== '无报警' || arm.runStatus === '异常' || arm.emergencyStatus === '已触发');
  const openControl = (armId) => {
    setSelectedArmId(armId);
    setActiveArmTab('control');
  };
  const openRecords = (armId) => {
    navigation?.navigateToLogs?.(armId, '全部');
  };
  return (
    <div className="arm-overview-workspace">
      <section className="panel arm-overview-summary">
        <SectionTitle icon={Cpu} title="机械臂状态总览" action="前端 mock" />
        <ArmSummaryStrip stats={stats} />
      </section>
      <section className="panel arm-overview-list">
        <SectionTitle icon={TerminalSquare} title="机械臂状态列表" />
        <DataTable
          columns={['机械臂编号', '类型', '在线状态', '运行状态', '当前任务', '末端工具', '急停状态', '报警数', '更新时间', '操作']}
          rows={arms.map((arm) => [
            arm.armId,
            arm.type,
            <StatusText value={arm.onlineStatus ?? arm.online} />,
            <StatusText value={arm.runStatus} />,
            arm.currentTask,
            getArmToolLabel(arm),
            <StatusText value={arm.emergencyStatus} />,
            arm.alarmStatus === '无报警' ? 0 : 1,
            arm.updatedAt,
            <div className="table-actions"><button type="button" onClick={(event) => { event.stopPropagation(); openControl(arm.armId); }}>查看控制</button><button type="button" onClick={(event) => { event.stopPropagation(); openRecords(arm.armId); }}>查看记录</button></div>,
          ])}
          rowKeys={arms.map((arm) => arm.armId)}
          onRowClick={openControl}
        />
      </section>
      <section className="panel arm-overview-exception">
        <SectionTitle icon={AlertTriangle} title="异常机械臂" />
        {abnormalArms.length ? (
          <div className="arm-exception-list">
            {abnormalArms.map((arm) => <ArmMiniCard arm={arm} key={arm.armId} onSelect={() => openControl(arm.armId)} />)}
          </div>
        ) : <div className="arm-empty-state">暂无异常机械臂</div>}
      </section>
      <section className="panel arm-overview-records">
        <SectionTitle icon={History} title="最近动作记录" />
        <ArmRecordTable rows={records.slice(0, 6)} />
      </section>
    </div>
  );
}

function ArmActionControlPage({ actionRequest, arms, currentUser, navigation, records, receipts, runArmAction, selectedArm, setSelectedArmId, notice }) {
  const safetyRows = getArmSafetyRows(selectedArm);
  const blockedReason = getArmActionBlockedReason(currentUser, selectedArm, safetyRows);
  const permissionStatus = getArmPermissionStatus(currentUser);
  const safeCount = safetyRows.filter((row) => row.status === '满足').length;
  const chainRows = armActionSteps.filter((step) => step.armId === selectedArm.armId);
  const visibleRecords = records.filter((row) => row.armId === selectedArm.armId);
  const latestReceipt = receipts.find((row) => row.targetArm === selectedArm.armId || row.deviceId === selectedArm.armId) ?? receipts[0];
  return (
    <div className="arm-action-control">
      <section className="panel arm-action-summary">
        <ArmControlSummary arm={selectedArm} safeCount={safeCount} totalCount={safetyRows.length} />
      </section>
      <div className="arm-action-workbench">
        <section className="panel arm-list-panel">
          <SectionTitle icon={Cpu} title="机械臂列表" action={`${arms.length} 台`} />
          <div className="arm-card-list">
            {arms.map((arm) => <ArmListCard arm={arm} key={arm.armId} selected={arm.armId === selectedArm.armId} onSelect={() => setSelectedArmId(arm.armId)} />)}
          </div>
        </section>
        <section className="panel arm-action-main-panel">
          <SectionTitle icon={TerminalSquare} title="当前机械臂状态" action={selectedArm.armId} />
          <ArmCurrentStatusGroups arm={selectedArm} />
          <div className="arm-action-chain">
            <div className="arm-block-title">动作链</div>
            <div className="arm-chain-list">
              {chainRows.map((step) => <ArmActionStepRow key={`${step.armId}-${step.stepNo}`} step={step} />)}
            </div>
          </div>
        </section>
        <section className="panel arm-action-side-panel">
          <SectionTitle icon={ShieldCheck} title="权限状态" />
          <div className="arm-action-side-body">
            <div className={`arm-permission-result ${permissionStatus.ok ? 'ok' : 'blocked'}`}>{permissionStatus.message}</div>
            <div className="arm-block-title arm-safety-title">安全条件</div>
            <div className={`arm-safety-result ${safeCount === safetyRows.length ? 'ok' : 'blocked'}`}>
              {safeCount === safetyRows.length ? '当前满足执行条件' : `不可执行：${safetyRows.find((row) => row.status !== '满足')?.label ?? '安全条件'} 不满足`}
            </div>
            <div className="arm-safety-list">
              {safetyRows.map((row) => (
                <div className="arm-safety-row" key={row.label}>
                  <span>{row.label}</span>
                  <StatusText value={row.status} />
                </div>
              ))}
            </div>
            <ArmOperationPanel
              blockedReason={blockedReason}
              currentUser={currentUser}
              loading={actionRequest.loading}
              onAction={(action) => runArmAction(action, safetyRows)}
            />
            {notice && <div className="inline-feedback">{notice}</div>}
            <ActionFeedback
              compact
              error={actionRequest.error}
              loading={actionRequest.loading}
              success={actionRequest.lastResult}
              successText={actionRequest.lastResult?.message}
            />
            <ArmReceiptPanel receipt={latestReceipt} onOpen={() => navigation?.navigateToCommand?.(latestReceipt?.id)} />
          </div>
        </section>
      </div>
      <section className="panel arm-action-record-panel">
        <SectionTitle
          icon={History}
          title="当前机械臂动作记录"
          action={<ExportButton pageName={`${selectedArm.armId}动作记录`} columns={armCurrentActionRecordExportColumns} getRows={() => visibleRecords.map(buildArmCurrentActionRecordExportRow)} currentUser={currentUser} />}
        />
        <ArmCurrentRecordTable rows={visibleRecords} />
      </section>
    </div>
  );
}

function ArmTeachingPage({ currentUser, logs, notice, points, selectedPointId, setLogs, setNotice, setPoints, setSelectedPointId, templates }) {
  const [summaryFilter, setSummaryFilter] = useState('全部');
  const [keyword, setKeyword] = useState('');
  const selectedPoint = points.find((point) => point.pointId === selectedPointId) ?? points[0];
  const stats = getTeachingPointStats(points);
  const filteredPoints = filterTeachingPoints(points, summaryFilter, keyword);
  const relatedTemplates = getTemplatesUsingPoint(templates, selectedPoint?.pointId);
  const actionDisabled = !can(currentUser, PERMISSIONS.TASK_ACTION);
  const actionReason = actionDisabled ? permissionReason(currentUser, '示教点维护') : '';

  const recordLog = (point, operation, content, status = '成功') => {
    const row = {
      time: formatNowTime(),
      pointId: point.pointId,
      operation,
      content,
      operator: currentUser?.username ?? 'admin',
      impactScope: relatedTemplates.map((item) => item.templateName).join('、') || '未关联模板',
      status,
    };
    setLogs((rows) => [row, ...rows]);
    setNotice(`${operation}：${point.pointId}（前端模拟）`);
    window.setTimeout(() => setNotice(''), 1600);
  };

  const updatePoint = (patch, operation, content) => {
    setPoints((rows) => rows.map((point) => point.pointId === selectedPoint.pointId ? { ...point, ...patch, updatedAt: formatNowTime() } : point));
    recordLog({ ...selectedPoint, ...patch }, operation, content);
  };

  const deletePoint = () => {
    if (!selectedPoint || actionDisabled) return;
    if (selectedPoint.enabled && relatedTemplates.length && !window.confirm('该示教点已被动作模板引用，确认删除？')) return;
    setPoints((rows) => rows.filter((point) => point.pointId !== selectedPoint.pointId));
    setSelectedPointId(points.find((point) => point.pointId !== selectedPoint.pointId)?.pointId ?? '');
    recordLog(selectedPoint, '删除', '删除示教点');
  };

  if (!selectedPoint) return <section className="panel page-full"><div className="arm-empty-state">暂无示教点数据</div></section>;

  return (
    <div className="arm-teaching-workspace">
      <section className="panel arm-teaching-summary">
        <SectionTitle icon={ClipboardList} title="示教点状态总览" action="点击统计筛选左侧列表" />
        <TeachingSummaryStrip activeFilter={summaryFilter} stats={stats} onSelect={setSummaryFilter} />
      </section>
      <section className="panel arm-teaching-list">
        <SectionTitle icon={Search} title="示教点列表" action={`${filteredPoints.length} 个`} />
        <div className="filterbar arm-workbench-filter">
          <Search size={16} />
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索编号 / 名称 / 机械臂 / 设备 / 类型" />
        </div>
        <SegmentedFilter options={['全部', '开门点', '抓取点', '放料点', '复位点', '已启用', '未校验']} value={summaryFilter} onChange={setSummaryFilter} />
        <div className="arm-card-list">
          {filteredPoints.map((point) => <TeachingPointCard key={point.pointId} point={point} selected={point.pointId === selectedPoint.pointId} onSelect={() => setSelectedPointId(point.pointId)} />)}
        </div>
      </section>
      <section className="panel arm-teaching-detail">
        <SectionTitle icon={TerminalSquare} title="当前示教点详情" action={selectedPoint.pointId} />
        <div className="arm-state-matrix">
          <Info label="示教点编号" value={selectedPoint.pointId} />
          <Info label="示教点名称" value={selectedPoint.pointName} />
          <Info label="动作类型" value={selectedPoint.pointType} />
          <Info label="所属机械臂" value={selectedPoint.armId} />
          <Info label="关联设备 / 工位" value={`${selectedPoint.relatedDevice} / ${selectedPoint.relatedWorkstation}`} />
          <Info label="关联地图点位" value={selectedPoint.relatedMapPoint} />
          <Info label="关联任务步骤" value={selectedPoint.relatedTaskStep} />
          <Info label="启用状态" value={<StatusText value={selectedPoint.enabled ? '已启用' : '未启用'} />} />
          <Info label="校验状态" value={<StatusText value={selectedPoint.verified ? '已校验' : '未校验'} />} />
          <Info label="更新时间" value={selectedPoint.updatedAt} />
          <Info label="备注" value={selectedPoint.remark} />
        </div>
        <div className="arm-action-chain">
          <div className="arm-block-title">姿态参数</div>
          <div className="pose-param-grid">
            {getTeachingPoseParams(selectedPoint).map((item) => (
              <div className="pose-param-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="panel arm-teaching-side">
        <SectionTitle icon={ShieldCheck} title="点位关联与操作" />
        <div className="arm-block-title">关联信息</div>
        <div className="detail-list dense">
          <Info label="关联动作模板" value={relatedTemplates.map((item) => item.templateName).join('、') || '-'} />
          <Info label="关联任务步骤" value={selectedPoint.relatedTaskStep} />
          <Info label="关联视觉标识" value={selectedPoint.relatedVisionMarker} />
          <Info label="关联地图点位" value={selectedPoint.relatedMapPoint} />
          <Info label="影响范围" value={relatedTemplates.length ? `${relatedTemplates.length} 个模板` : '未引用'} />
        </div>
        <div className="arm-operation-panel">
          <div className="arm-block-title">操作按钮</div>
          <div className="button-row arm-operation-buttons">
            <button type="button" disabled={actionDisabled} title={actionReason} onClick={() => updatePoint({}, '保存', '保存当前位置')}>保存当前位置</button>
            <button type="button" disabled={actionDisabled} title={actionReason} onClick={() => updatePoint({}, '编辑', '编辑点位参数')}>编辑点位</button>
            <button type="button" disabled={actionDisabled} title={actionReason} onClick={() => {
              const clone = { ...selectedPoint, pointId: `${selectedPoint.pointId}-COPY`, pointName: `${selectedPoint.pointName}副本`, enabled: false, verified: false, updatedAt: formatNowTime(), usedByTemplates: [] };
              setPoints((rows) => [clone, ...rows]);
              setSelectedPointId(clone.pointId);
              recordLog(clone, '复制', '复制示教点');
            }}>复制点位</button>
            <button className="danger" type="button" disabled={actionDisabled} title={actionReason} onClick={deletePoint}>删除点位</button>
            <button type="button" onClick={() => recordLog(selectedPoint, '预览', '动作预览')}>动作预览</button>
            <button type="button" disabled={actionDisabled} title={actionReason} onClick={() => updatePoint({ verified: true, enabled: true }, '校验', '校验通过')}>校验点位</button>
            <button type="button" disabled={actionDisabled} title={actionReason} onClick={() => recordLog(selectedPoint, '关联', '关联任务步骤')}>关联任务步骤</button>
          </div>
          {actionDisabled && <div className="action-disabled-reason">{actionReason}</div>}
        </div>
        <TeachingSafetyTips point={selectedPoint} relatedTemplates={relatedTemplates} />
        {notice && <div className="inline-feedback">{notice}</div>}
      </section>
      <section className="panel arm-teaching-records">
        <SectionTitle icon={History} title="示教修改记录" />
        <DataTable
          columns={['时间', '示教点', '操作类型', '修改内容', '操作人', '影响范围', '状态']}
          rows={logs.map((row) => [row.time, row.pointId, row.operation, row.content, row.operator, row.impactScope, <StatusText value={row.status} />])}
          className="arm-record-table"
        />
      </section>
    </div>
  );
}

function EndEffectorPage() {
  return (
    <section className="panel page-full end-effector-page">
      <SectionTitle icon={Cpu} title="末端工具" />
      <DataTable columns={['工具编号', '工具类型', '关联机械臂', '安装状态', '开合状态', '吸附状态', '压力 / 真空值', '报警状态', '更新时间', '操作']} rows={endEffectors.map((tool) => [tool.toolId, tool.toolType, tool.armId, tool.installStatus, tool.openCloseStatus, tool.suctionStatus ?? tool.adsorbStatus, tool.pressure, <StatusText value={tool.alarmStatus} />, tool.updatedAt, <div className="table-actions"><button type="button">查看</button><button type="button">测试</button><button type="button">复位</button></div>])} />
    </section>
  );
}

function ArmTemplatePage({ actionRequest, arms, currentUser, executeTemplate, logs, navigation, notice, points, selectedTemplateId, setActiveArmTab, setSelectedTeachingPointId, setSelectedTemplateId, setTemplates, templates }) {
  const [summaryFilter, setSummaryFilter] = useState('全部');
  const [keyword, setKeyword] = useState('');
  const [selectedStepId, setSelectedStepId] = useState(null);
  const selectedTemplate = templates.find((template) => template.templateId === selectedTemplateId) ?? templates[0];
  const stats = getTemplateStats(templates, points);
  const filteredTemplates = filterTemplates(templates, points, summaryFilter, keyword);
  const arm = arms.find((item) => selectedTemplate?.armId.includes(item.armId)) ?? arms[0];
  const safetyRows = getTemplateSafetyRows(selectedTemplate, points, arm);
  const blockedReason = getTemplateBlockedReason(currentUser, selectedTemplate, safetyRows, arm);
  const templateSteps = selectedTemplate?.steps ?? [];
  const selectedStep = templateSteps.find((step) => step.stepId === selectedStepId) ?? templateSteps[0];
  const selectedStepDetail = selectedStep ? getStepDetail(selectedStep, points) : null;

  const updateTemplate = (patch) => {
    setTemplates((rows) => rows.map((template) => template.templateId === selectedTemplate.templateId ? { ...template, ...patch, updatedAt: formatNowTime() } : template));
  };

  if (!selectedTemplate) return <section className="panel page-full"><div className="arm-empty-state">暂无动作模板数据</div></section>;

  return (
    <div className="arm-template-workspace">
      <section className="panel arm-template-summary">
        <SectionTitle icon={ClipboardList} title="模板状态总览" action="点击统计筛选左侧列表" />
        <TemplateSummaryStrip activeFilter={summaryFilter} stats={stats} onSelect={setSummaryFilter} />
      </section>
      <section className="panel arm-template-list">
        <SectionTitle icon={Search} title="模板列表" action={`${filteredTemplates.length} 个`} />
        <div className="filterbar arm-workbench-filter">
          <Search size={16} />
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索编号 / 名称 / 机械臂 / 类型 / 任务" />
        </div>
        <SegmentedFilter options={['全部', '开门', '抓取', '放料', '复位', '已启用', '未启用', '异常']} value={summaryFilter} onChange={setSummaryFilter} />
        <div className="arm-card-list">
          {filteredTemplates.map((template) => <TemplateCard key={template.templateId} points={points} selected={template.templateId === selectedTemplate.templateId} template={template} onSelect={() => setSelectedTemplateId(template.templateId)} />)}
        </div>
      </section>
      <section className="panel arm-template-steps">
        <SectionTitle icon={TerminalSquare} title="当前模板步骤" action={selectedTemplate.templateId} />
        <div className="template-step-list">
          {templateSteps.map((step, index) => {
            const detail = getStepDetail(step, points);
            const stepStatus = getStepConfigStatus(step, points);
            const active = step.stepId === selectedStep?.stepId;
            return (
              <div
                className={`template-step-card ${active ? 'active' : ''}`}
                key={step.stepId}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedStepId(step.stepId)}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedStepId(step.stepId); } }}
              >
                <div className="template-step-head">
                  <div className="template-step-head-main">
                    <span className="template-step-no">第 {index + 1} 步</span>
                    <strong title={step.stepName}>{step.stepName}</strong>
                    <span className="template-step-action">{step.actionType}</span>
                  </div>
                  <StatusText value={stepStatus} />
                </div>
                <div className="template-step-fields">
                  <div className="template-step-field">
                    <span>目标点位</span>
                    {detail.targetPoint === '-'
                      ? <strong>-</strong>
                      : <button className="template-step-link" type="button" title={detail.targetPoint} onClick={(event) => { event.stopPropagation(); setSelectedStepId(step.stepId); setSelectedTeachingPointId(detail.targetPoint); setActiveArmTab('teaching'); }}>{detail.targetPoint}</button>}
                  </div>
                  <div className="template-step-field">
                    <span>视觉标识</span>
                    {detail.visionMarker === '-'
                      ? <strong>-</strong>
                      : <button className="template-step-link" type="button" title={detail.visionMarker} onClick={(event) => { event.stopPropagation(); setSelectedStepId(step.stepId); navigation?.navigateToVision?.('VT-001'); }}>{detail.visionMarker}</button>}
                  </div>
                  <div className="template-step-field">
                    <span>末端工具</span>
                    <strong title={detail.tool}>{detail.tool}</strong>
                  </div>
                  <div className="template-step-field template-step-param">
                    <span>动作参数</span>
                    <strong title={detail.param}>{detail.param}</strong>
                  </div>
                </div>
                <div className="template-step-foot">
                  <div className="template-step-field">
                    <span>校验条件</span>
                    <strong title={detail.condition}>{detail.condition}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="panel arm-template-side">
        <SectionTitle icon={ShieldCheck} title="模板详情与操作" />
        <div className="arm-template-side-body">
        <div className="arm-block-title">模板基础信息</div>
        <div className="detail-list dense">
          <Info label="模板编号" value={selectedTemplate.templateId} />
          <Info label="模板名称" value={selectedTemplate.templateName} />
          <Info label="动作类型" value={selectedTemplate.actionType} />
          <Info label="适用机械臂" value={selectedTemplate.armId} />
          <Info label="关联任务类型" value={selectedTemplate.relatedTaskType} />
          <Info label="步骤数量" value={`${selectedTemplate.stepCount} 步`} />
          <Info label="启用状态" value={<StatusText value={selectedTemplate.enabled ? '已启用' : '未启用'} />} />
          <Info label="更新时间" value={selectedTemplate.updatedAt} />
          <Info label="备注" value={selectedTemplate.remark} />
        </div>
        {selectedStep && (
          <>
            <div className="arm-block-title">当前选中步骤</div>
            <div className="detail-list dense template-selected-step">
              <Info label="步骤名称" value={`第 ${templateSteps.indexOf(selectedStep) + 1} 步 · ${selectedStep.stepName}`} />
              <Info label="目标点位" value={selectedStepDetail.targetPoint} />
              <Info label="视觉标识" value={selectedStepDetail.visionMarker} />
              <Info label="末端工具" value={selectedStepDetail.tool} />
              <Info label="校验条件" value={selectedStepDetail.condition} />
            </div>
          </>
        )}
        <div className="arm-block-title">模板安全条件</div>
        <div className="arm-safety-list">
          {safetyRows.map((row) => <div className="arm-safety-row" key={row.label}><span>{row.label}</span><StatusText value={row.status} /></div>)}
        </div>
        <div className="arm-operation-panel">
          <div className="arm-block-title">模板操作</div>
          <div className="button-row arm-operation-buttons">
            <button type="button" disabled={!can(currentUser, PERMISSIONS.TASK_ACTION)} title={!can(currentUser, PERMISSIONS.TASK_ACTION) ? permissionReason(currentUser, '模板编辑') : undefined}>新增步骤</button>
            <button type="button" disabled={!can(currentUser, PERMISSIONS.TASK_ACTION)} title={!can(currentUser, PERMISSIONS.TASK_ACTION) ? permissionReason(currentUser, '模板编辑') : undefined}>编辑模板</button>
            <button type="button" disabled={!can(currentUser, PERMISSIONS.TASK_ACTION)} onClick={() => {
              const clone = { ...selectedTemplate, templateId: `${selectedTemplate.templateId}-COPY`, templateName: `${selectedTemplate.templateName}副本`, enabled: false, updatedAt: formatNowTime() };
              setTemplates((rows) => [clone, ...rows]);
              setSelectedTemplateId(clone.templateId);
            }}>复制模板</button>
            <button type="button" disabled={!can(currentUser, PERMISSIONS.TASK_ACTION) || (getTemplateHasConfigIssue(selectedTemplate, points) && !selectedTemplate.enabled)} title={getTemplateHasConfigIssue(selectedTemplate, points) ? '模板存在未校验点位或未配置视觉标识' : undefined} onClick={() => updateTemplate({ enabled: !selectedTemplate.enabled })}>{selectedTemplate.enabled ? '停用' : '启用'}</button>
            <button type="button" disabled={actionRequest.loading || Boolean(blockedReason)} title={blockedReason || undefined} onClick={() => executeTemplate(selectedTemplate)}>{actionRequest.loading ? '下发中' : '执行模板'}</button>
            <button type="button" onClick={() => navigation?.navigateToTask?.(getTemplateRelatedTaskId(selectedTemplate))}>查看引用任务</button>
            <button type="button">查看执行记录</button>
          </div>
          {blockedReason && <div className="action-disabled-reason">{blockedReason}</div>}
        </div>
        {notice && <div className="inline-feedback">{notice}</div>}
        <ActionFeedback
          compact
          error={actionRequest.error}
          loading={actionRequest.loading}
          success={actionRequest.lastResult}
          successText={actionRequest.lastResult?.message}
        />
        </div>
      </section>
      <section className="panel arm-template-records">
        <SectionTitle icon={History} title="模板执行记录" />
        <DataTable
          columns={['时间', '模板编号', '模板名称', '机械臂', '关联任务', '执行结果', '回执状态', '耗时', '操作人']}
          rows={logs.map((row) => [row.time, row.templateId, row.templateName, row.armId, row.relatedTask, <StatusText value={row.result} />, <StatusText value={row.receiptStatus} />, row.duration, row.operator])}
          className="arm-record-table"
        />
      </section>
    </div>
  );
}

function TeachingSummaryStrip({ activeFilter, stats, onSelect }) {
  const items = [
    { label: '示教点总数', value: stats.total, filter: '全部' },
    { label: '开门点', value: stats.door, filter: '开门点', tone: 'info' },
    { label: '抓取点', value: stats.pick, filter: '抓取点' },
    { label: '放料点', value: stats.place, filter: '放料点' },
    { label: '复位点', value: stats.reset, filter: '复位点' },
    { label: '未校验', value: stats.unverified, filter: '未校验', tone: stats.unverified ? 'warn' : 'ok' },
    { label: '已启用', value: stats.enabled, filter: '已启用', tone: 'ok' },
  ];
  return <SummaryStrip items={items.map((item) => ({ ...item, active: activeFilter === item.filter, onClick: () => onSelect(item.filter) }))} />;
}

function TeachingPointCard({ point, selected, onSelect }) {
  return (
    <button className={`arm-list-card ${selected ? 'selected' : ''}`} type="button" onClick={onSelect}>
      <div className="arm-list-card-head"><strong>{point.pointId}</strong><StatusText value={point.verified ? '已校验' : '未校验'} /></div>
      <div className="arm-list-card-type">{point.pointName}｜{point.pointType}</div>
      <div className="arm-list-card-status"><StatusText value={point.enabled ? '已启用' : '未启用'} /><span>{point.armId}</span></div>
      <div className="arm-list-card-meta"><span>{point.relatedDevice}</span><time>{point.updatedAt}</time></div>
    </button>
  );
}

function TeachingSafetyTips({ point, relatedTemplates }) {
  const tips = [];
  if (relatedTemplates.length) tips.push(`当前点位已被“${relatedTemplates.map((item) => item.templateName).join('、')}”引用，修改后会影响 ${point.relatedTaskStep}。`);
  if (!point.verified) tips.push('当前点位未校验，不能用于正式任务。');
  const arm = robotArms.find((item) => item.armId === point.armId);
  if ((arm?.onlineStatus ?? arm?.online) !== '在线') tips.push('当前机械臂离线，无法执行动作预览。');
  return (
    <div className="arm-action-chain">
      <div className="arm-block-title">安全提示</div>
      <div className="arm-safety-list">
        {(tips.length ? tips : ['当前点位已校验，可用于动作模板。']).map((tip) => <div className="arm-safety-row" key={tip}><span>{tip}</span></div>)}
      </div>
    </div>
  );
}

function TemplateSummaryStrip({ activeFilter, stats, onSelect }) {
  const items = [
    { label: '模板总数', value: stats.total, filter: '全部' },
    { label: '已启用', value: stats.enabled, filter: '已启用', tone: 'ok' },
    { label: '未启用', value: stats.disabled, filter: '未启用' },
    { label: '开门模板', value: stats.door, filter: '开门', tone: 'info' },
    { label: '抓取模板', value: stats.pick, filter: '抓取' },
    { label: '放料模板', value: stats.place, filter: '放料' },
    { label: '异常模板', value: stats.bad, filter: '异常', tone: stats.bad ? 'bad' : 'ok' },
  ];
  return <SummaryStrip items={items.map((item) => ({ ...item, active: activeFilter === item.filter, onClick: () => onSelect(item.filter) }))} />;
}

function TemplateCard({ points, selected, template, onSelect }) {
  const issue = getTemplateHasConfigIssue(template, points);
  const status = issue ? '配置异常' : template.enabled ? '已启用' : '未启用';
  return (
    <button className={`template-card ${selected ? 'selected' : ''}`} type="button" onClick={onSelect}>
      <div className="template-card-title">
        <strong title={template.templateId}>{template.templateId}</strong>
        <StatusText value={status} />
      </div>
      <div className="template-card-name" title={template.templateName}>{template.templateName}</div>
      <div className="template-card-meta" title={`${template.armId} · ${template.stepCount} 步`}>{template.armId} · {template.stepCount} 步</div>
      <div className="template-card-foot">
        <span className="template-card-type" title={template.relatedTaskType}>{template.relatedTaskType}</span>
        <time>{template.updatedAt}</time>
      </div>
    </button>
  );
}

function getStepEndTool(step, point) {
  if (step.endTool) return step.endTool;
  const toolState = point?.toolState ?? '';
  if (toolState.includes('夹爪')) return '夹爪';
  if (toolState.includes('吸盘')) return '吸盘';
  return '-';
}

function getStepDetail(step, points) {
  const point = points.find((item) => item.pointId === step.targetTeachingPoint);
  return {
    targetPoint: step.targetTeachingPoint || '-',
    visionMarker: step.relatedVisionMarker || '-',
    tool: getStepEndTool(step, point),
    param: step.actionParam || point?.endPose || '-',
    condition: step.condition || '-',
  };
}

function getTeachingPointStats(points) {
  return {
    total: points.length,
    door: points.filter((point) => point.pointType === '开门点').length,
    pick: points.filter((point) => point.pointType === '抓取点').length,
    place: points.filter((point) => point.pointType === '放料点').length,
    reset: points.filter((point) => point.pointType === '复位点').length,
    unverified: points.filter((point) => !point.verified).length,
    enabled: points.filter((point) => point.enabled).length,
  };
}

function filterTeachingPoints(points, filter, keyword) {
  const text = keyword.trim().toLowerCase();
  return points.filter((point) => {
    const matchesKeyword = !text || [point.pointId, point.pointName, point.armId, point.relatedDevice, point.pointType].some((value) => String(value).toLowerCase().includes(text));
    const matchesFilter =
      filter === '全部' ||
      point.pointType === filter ||
      (filter === '已启用' && point.enabled) ||
      (filter === '未校验' && !point.verified);
    return matchesKeyword && matchesFilter;
  });
}

function getTemplatesUsingPoint(templates, pointId) {
  return templates.filter((template) => template.steps?.some((step) => step.targetTeachingPoint === pointId) || template.usedByTemplates?.includes(pointId));
}

function getTeachingPoseParams(point) {
  const jointValues = String(point.jointAngles).match(/-?\d+/g) ?? [];
  const endValues = String(point.endPose).match(/[XYZRxyz][a-z]?\s*-?\d+/g) ?? [];
  const fallback = ['X -', 'Y -', 'Z -', 'Rx -', 'Ry -', 'Rz -'];
  const poseValues = endValues.length ? endValues : fallback;
  return [
    ...[1, 2, 3, 4, 5, 6].map((index) => ({ label: `关节 ${index} 角度`, value: jointValues[index - 1] ? `${jointValues[index - 1]}°` : '-' })),
    ...poseValues.slice(0, 6).map((value) => {
      const [label, number] = value.split(/\s+/);
      return { label: label.toUpperCase(), value: number ?? '-' };
    }),
    { label: '末端工具状态', value: point.toolState },
  ];
}

function getTemplateStats(templates, points) {
  return {
    total: templates.length,
    enabled: templates.filter((template) => template.enabled).length,
    disabled: templates.filter((template) => !template.enabled).length,
    door: templates.filter((template) => template.actionType === '开门').length,
    pick: templates.filter((template) => template.actionType === '抓取').length,
    place: templates.filter((template) => template.actionType === '放料').length,
    bad: templates.filter((template) => getTemplateHasConfigIssue(template, points)).length,
  };
}

function filterTemplates(templates, points, filter, keyword) {
  const text = keyword.trim().toLowerCase();
  return templates.filter((template) => {
    const matchesKeyword = !text || [template.templateId, template.templateName, template.armId, template.actionType, template.relatedTaskType].some((value) => String(value).toLowerCase().includes(text));
    const matchesFilter =
      filter === '全部' ||
      template.actionType === filter ||
      (filter === '已启用' && template.enabled) ||
      (filter === '未启用' && !template.enabled) ||
      (filter === '异常' && getTemplateHasConfigIssue(template, points));
    return matchesKeyword && matchesFilter;
  });
}

function getTemplateHasConfigIssue(template, points) {
  return template.steps?.some((step) => getStepConfigStatus(step, points) !== '已配置') ?? false;
}

function getTemplateRelatedTaskId(template) {
  if (['TPL-DOOR-001', 'TPL-PICK-001', 'TPL-PLACE-001'].includes(template?.templateId)) return 'TASK-008';
  return 'TASK-001';
}

function getStepConfigStatus(step, points) {
  const targetPoint = points.find((point) => point.pointId === step.targetTeachingPoint);
  if (step.targetTeachingPoint !== '-' && !targetPoint) return '未配置';
  if (targetPoint && !targetPoint.verified) return '异常';
  if (step.relatedVisionMarker !== '-' && !step.relatedVisionMarker) return '未配置';
  return step.configStatus === '异常' ? '配置异常' : step.configStatus;
}

function getTemplateSafetyRows(template, points, arm) {
  const hasConfigIssue = getTemplateHasConfigIssue(template, points);
  return [
    { label: '机械臂在线', pass: (arm?.onlineStatus ?? arm?.online) === '在线' },
    { label: '急停未触发', pass: arm?.emergencyStatus === '未触发' },
    { label: '目标点位已校验', pass: !template.steps?.some((step) => points.find((point) => point.pointId === step.targetTeachingPoint && !point.verified)) },
    { label: '视觉标识已配置', pass: !template.steps?.some((step) => step.actionType.includes('视觉') && step.relatedVisionMarker === '-') },
    { label: '末端工具匹配', pass: true },
    { label: '任务允许执行', pass: !hasConfigIssue },
  ].map((row) => ({ ...row, status: row.pass ? '满足' : '不满足' }));
}

function getTemplateBlockedReason(currentUser, template, safetyRows, arm) {
  if (!currentUser) return '无权限：请登录后再执行该操作';
  if (!can(currentUser, PERMISSIONS.TASK_ACTION)) return permissionReason(currentUser, '执行模板');
  if ((arm?.onlineStatus ?? arm?.online) !== '在线') return '机械臂在线 不满足';
  if (arm?.emergencyStatus === '已触发') return '急停未触发 不满足';
  const failed = safetyRows.find((row) => row.status !== '满足');
  return failed ? `${failed.label} 不满足` : '';
}

function ArmControlSummary({ arm, safeCount, totalCount }) {
  const task = arm.currentTask && arm.currentTask !== '无' ? arm.currentTask : '无当前任务';
  return (
    <div className="arm-control-summary-card">
      <span>当前控制对象：</span>
      <strong>{arm.armId}</strong>
      <span>｜{arm.type}</span>
      <StatusText value={arm.runStatus} />
      <span>｜{task}</span>
      <span>｜当前动作：{arm.currentAction || '-'}</span>
      <span className={safeCount === totalCount ? 'summary-safe ok' : 'summary-safe blocked'}>安全条件 {safeCount}/{totalCount} 满足</span>
    </div>
  );
}

function ArmSummaryStrip({ activeFilter = '', stats, onSelect }) {
  const items = [
    { label: '机械臂总数', value: stats.total, filter: '全部' },
    { label: '在线', value: stats.online, filter: '在线', tone: 'ok' },
    { label: '运行中', value: stats.running, filter: '运行中', tone: 'ok' },
    { label: '待机', value: stats.standby, filter: '待机' },
    { label: '异常', value: stats.abnormal, filter: '异常', tone: stats.abnormal ? 'bad' : 'ok' },
    { label: '急停', value: stats.emergency, filter: '急停', tone: stats.emergency ? 'bad' : 'ok' },
    { label: '执行任务', value: stats.tasking, filter: '执行任务', tone: 'info' },
  ];
  return <SummaryStrip items={items.map((item) => ({ ...item, active: activeFilter === item.filter, onClick: onSelect ? () => onSelect(item.filter) : undefined }))} />;
}

function ArmCurrentStatusGroups({ arm }) {
  const groups = [
    {
      title: '运行状态',
      rows: [
        ['控制模式', arm.controlMode],
        ['运行状态', <StatusText value={arm.runStatus} />],
        ['急停状态', <StatusText value={arm.emergencyStatus} />],
        ['报警状态', <StatusText value={arm.alarmStatus} />],
      ],
    },
    {
      title: '任务与动作',
      rows: [
        ['当前任务', arm.currentTask || '无'],
        ['当前动作', arm.currentAction || '-'],
        ['更新时间', arm.updatedAt],
      ],
    },
    {
      title: '末端与姿态',
      rows: [
        ['末端工具', getArmToolLabel(arm)],
        ['夹爪状态', getToolOpenCloseStatus(arm.toolId)],
        ['当前姿态', arm.pose],
      ],
    },
  ];
  return (
    <div className="arm-state-groups">
      {groups.map((group) => (
        <div className="arm-state-group" key={group.title}>
          <div className="arm-state-group-title">{group.title}</div>
          {group.rows.map(([label, value]) => <Info key={label} label={label} value={value} />)}
        </div>
      ))}
    </div>
  );
}

function ArmListCard({ arm, selected, onSelect }) {
  return (
    <button className={`arm-list-card ${selected ? 'selected' : ''}`} type="button" onClick={onSelect}>
      <div className="arm-list-card-head">
        <strong>{arm.armId}</strong>
      </div>
      <div className="arm-list-card-type">{arm.type}</div>
      <div className="arm-list-card-status"><StatusText value={arm.runStatus} /><span>{arm.currentTask}</span></div>
      <div className="arm-list-card-meta"><span>{getArmToolTypeLabel(arm)}</span><time>{arm.updatedAt}</time></div>
    </button>
  );
}

function ArmMiniCard({ arm, onSelect }) {
  return (
    <button className="arm-mini-card" type="button" onClick={onSelect}>
      <strong>{arm.armId}</strong>
      <span>{arm.alarmStatus}</span>
      <StatusText value={arm.runStatus} />
    </button>
  );
}

function ArmActionStepRow({ step }) {
  return (
    <div className={`arm-chain-row ${step.status === '执行中' ? 'active' : ''}`}>
      <span>第 {step.stepNo} 步</span>
      <strong>{step.actionName}</strong>
      <StatusText value={step.status} />
    </div>
  );
}

function ArmOperationPanel({ blockedReason, currentUser, loading, onAction }) {
  const permissionContext = {
    requireLogin: true,
    isLoggedIn: Boolean(currentUser),
    allowDangerous: currentUser?.role === '管理员',
  };
  const groups = [
    { title: '基础控制', actions: ['回零', '暂停', '继续', '停止', '复位', '急停'] },
    { title: '末端工具', actions: ['打开夹爪', '关闭夹爪'] },
    { title: '任务动作', actions: ['移动到开门点', '执行开门动作', '执行抓取动作', '执行放料动作'] },
  ];
  return (
    <div className="arm-operation-panel">
      <div className="arm-block-title">控制操作</div>
      {groups.map((group) => (
        <div className="arm-operation-group" key={group.title}>
          <span>{group.title}</span>
          <div className="button-row arm-operation-buttons">
            {group.actions.map((action) => (
              <button
                className={action === '急停' ? 'danger' : ''}
                key={action}
                type="button"
                disabled={
                  loading ||
                  (!['急停', '复位'].includes(action) && Boolean(blockedReason)) ||
                  (action === '急停' &&
                    !canOperate(ACTION_KEYS.ARM_EMERGENCY_STOP, permissionContext)) ||
                  (action === '复位' &&
                    !canOperate(ACTION_KEYS.ARM_RESET, permissionContext))
                }
                title={action === '急停' ? undefined : blockedReason || undefined}
                onClick={() => onAction(action)}
              >
                {loading ? '处理中' : action}
              </button>
            ))}
          </div>
        </div>
      ))}
      {blockedReason && <div className="action-disabled-reason">{blockedReason}</div>}
      {currentUser &&
        !blockedReason &&
        !canOperate(ACTION_KEYS.ARM_EMERGENCY_STOP, permissionContext) && (
          <div className="action-disabled-reason">
            {getOperatePermissionReason(ACTION_KEYS.ARM_EMERGENCY_STOP, permissionContext)}
          </div>
        )}
    </div>
  );
}

function ArmReceiptPanel({ receipt, onOpen }) {
  return (
    <div className="arm-receipt-panel">
      <div className="arm-block-title">指令回执</div>
      <div className="detail-list dense">
        <Info label="最近指令" value={receipt?.commandName ?? '-'} />
        <Info label="下发结果" value={<StatusText value={receipt?.sendResult ?? '-'} />} />
        <Info label="回执状态" value={<StatusText value={receipt?.receiptStatus ?? '-'} />} />
        <Info label="耗时" value={receipt?.duration ?? '-'} />
        <Info label="关联任务" value={receipt?.relatedTask ?? '-'} />
        <Info label="更新时间" value={receipt?.sendTime ?? '-'} />
      </div>
      <button className="table-link-button" type="button" disabled={!receipt} onClick={onOpen}>查看回执</button>
    </div>
  );
}

function ArmCurrentRecordTable({ rows }) {
  return (
    <DataTable
      columns={['时间', '动作', '目标点位', '结果', '回执状态', '关联任务', '操作人']}
      rows={rows.map((row) => [
        row.time,
        row.actionName ?? row.action,
        row.targetPoint ?? '-',
        <StatusText value={row.result ?? row.status ?? '-'} />,
        <StatusText value={row.receiptStatus ?? row.status ?? '-'} />,
        row.relatedTask ?? row.taskId,
        row.operator ?? '-',
      ])}
      className="arm-record-table"
    />
  );
}

function ArmRecordTable({ rows }) {
  return (
    <DataTable
      columns={['时间', '机械臂', '动作', '目标点位', '结果', '回执状态', '关联任务', '操作人']}
      rows={rows.map((row) => [
        row.time,
        row.armId,
        row.actionName ?? row.action,
        row.targetPoint ?? '-',
        <StatusText value={row.result ?? row.status ?? '-'} />,
        <StatusText value={row.receiptStatus ?? row.status ?? '-'} />,
        row.relatedTask ?? row.taskId,
        row.operator ?? '-',
      ])}
      className="arm-record-table"
    />
  );
}

function getArmStats(arms) {
  return {
    total: arms.length,
    online: arms.filter((arm) => (arm.onlineStatus ?? arm.online) === '在线').length,
    running: arms.filter((arm) => arm.runStatus === '运行中').length,
    standby: arms.filter((arm) => arm.runStatus === '待机').length,
    abnormal: arms.filter((arm) => arm.alarmStatus !== '无报警' || arm.runStatus === '异常').length,
    emergency: arms.filter((arm) => arm.emergencyStatus === '已触发').length,
    tasking: arms.filter((arm) => arm.currentTask && arm.currentTask !== '无').length,
  };
}

function filterArmsBySummary(arms, filter) {
  if (filter === '在线') return arms.filter((arm) => (arm.onlineStatus ?? arm.online) === '在线');
  if (filter === '运行中') return arms.filter((arm) => arm.runStatus === '运行中');
  if (filter === '待机') return arms.filter((arm) => arm.runStatus === '待机');
  if (filter === '异常') return arms.filter((arm) => arm.alarmStatus !== '无报警' || arm.runStatus === '异常');
  if (filter === '急停') return arms.filter((arm) => arm.emergencyStatus === '已触发');
  if (filter === '执行任务') return arms.filter((arm) => arm.currentTask && arm.currentTask !== '无');
  return arms;
}

function getArmToolLabel(arm) {
  const tool = endEffectors.find((item) => item.toolId === arm.toolId);
  return tool ? `${tool.toolType} / ${tool.installStatus}` : arm.toolStatus;
}

function getArmToolTypeLabel(arm) {
  return endEffectors.find((item) => item.toolId === arm.toolId)?.toolType ?? arm.toolStatus;
}

function getToolOpenCloseStatus(toolId) {
  return endEffectors.find((item) => item.toolId === toolId)?.openCloseStatus ?? '-';
}

function getArmSafetyRows(arm) {
  const visionResult = visionResults.find((row) => row.relatedTask === arm.currentTask || row.visionTaskId === 'VT-001');
  const chassisReady = robotStatus.online === '在线' && robotStatus.communicationStatus === '正常' && robotStatus.chassis.obstacleStatus === '通道清空';
  const rows = [
    { label: '机械臂在线', pass: (arm.onlineStatus ?? arm.online) === '在线' },
    { label: '急停未触发', pass: arm.emergencyStatus === '未触发' },
    { label: '底盘已到位', pass: chassisReady },
    { label: '视觉识别成功', pass: visionResult?.result === '通过' },
    { label: '目标点位可达', pass: arm.armId === 'ARM-001' },
    { label: '夹爪状态正常', pass: !String(arm.toolStatus).includes('未闭合') && arm.alarmStatus === '无报警' },
    { label: '当前任务允许操作', pass: arm.controlMode !== '人工接管' },
  ];
  return rows.map((row) => ({ ...row, status: row.pass ? '满足' : '不满足' }));
}

function getArmPermissionStatus(currentUser) {
  if (!currentUser) return { ok: false, message: '权限状态：未登录，执行类操作不可用' };
  if (!can(currentUser, PERMISSIONS.TASK_ACTION)) return { ok: false, message: `权限状态：${permissionReason(currentUser, '机械臂操作')}` };
  return { ok: true, message: '权限状态：当前用户可执行机械臂操作' };
}

function getArmActionBlockedReason(currentUser, arm, safetyRows) {
  if (!currentUser) return '无权限：请登录后再执行该操作';
  if (!can(currentUser, PERMISSIONS.TASK_ACTION)) return permissionReason(currentUser, '机械臂动作');
  if ((arm.onlineStatus ?? arm.online) !== '在线') return '机械臂在线 不满足';
  if (arm.emergencyStatus === '已触发') return '急停未触发 不满足';
  if (arm.controlMode === '人工接管') return '当前任务人工接管，只允许查看';
  const failed = safetyRows.find((row) => row.status !== '满足');
  return failed ? `${failed.label} 不满足` : '';
}

function getArmActionTargetPoint(action) {
  if (action === '移动到开门点' || action === '执行开门动作') return 'DOOR-P01';
  if (action === '执行抓取动作') return 'HANDLE-P01';
  if (action === '执行放料动作') return 'PLACE-P01';
  if (action === '回零' || action === '复位') return 'HOME';
  return '-';
}

function buildArmActionRecordExportRow(row) {
  return {
    时间: row.time,
    机械臂: row.armId,
    动作: row.actionName ?? row.action,
    目标点位: row.targetPoint ?? '-',
    结果: row.result ?? row.status ?? '-',
    回执状态: row.receiptStatus ?? row.status ?? '-',
    关联任务: row.relatedTask ?? row.taskId,
    操作人: row.operator ?? '-',
  };
}

function buildArmCurrentActionRecordExportRow(row) {
  return {
    时间: row.time,
    动作: row.actionName ?? row.action,
    目标点位: row.targetPoint ?? '-',
    结果: row.result ?? row.status ?? '-',
    回执状态: row.receiptStatus ?? row.status ?? '-',
    关联任务: row.relatedTask ?? row.taskId,
    操作人: row.operator ?? '-',
  };
}

export default ArmControlPage;
