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

export function SettingsPage({ currentUser, onLoginRequest, onLogout }) {
  const [connectionStatus, setConnectionStatus] = useState({});
  const [checkedAt, setCheckedAt] = useState({});
  const [settingsModal, setSettingsModal] = useState(null);
  const [permissionMessage, setPermissionMessage] = useState('');
  const linkRows = [
    { key: 'backend', label: '后台地址', value: 'https://platform.local', status: connectionStatus.backend ?? '正常', action: '测试连接' },
    { key: 'mqtt', label: 'MQTT Broker', value: 'mqtt://10.10.1.20:1883', status: connectionStatus.mqtt ?? '正常', action: '测试连接' },
    { key: 'upload', label: '日志上传', value: '开启', status: connectionStatus.upload ?? '正常', action: '查看队列' },
    { key: 'cache', label: '本地缓存', value: '7 天', status: connectionStatus.cache ?? '正常', action: '清理缓存' },
  ];

  const runSettingAction = (row) => {
    if (!hasPermission(currentUser, 'system-config')) {
      setPermissionMessage(getPermissionReason(currentUser, '系统配置修改'));
      return;
    }
    setPermissionMessage('');
    if (row.action === '测试连接') {
      setConnectionStatus((current) => ({ ...current, [row.key]: '检测中' }));
      window.setTimeout(() => {
        setConnectionStatus((current) => ({ ...current, [row.key]: '成功' }));
        setCheckedAt((current) => ({ ...current, [row.key]: formatNowTime() }));
      }, 600);
      return;
    }
    setSettingsModal(row.action);
  };

  return (
    <div className="page-grid settings-page">
      <section className="panel">
        <SectionTitle icon={Settings} title="基础信息" />
        <div className="settings-grid">
          {settings.slice(0, 2).concat([
            { label: '当前用户', value: currentUser?.username ?? '未登录' },
            { label: '本地缓存周期', value: '7 天' },
          ]).map((item) => (
            <div className="setting-item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <SectionTitle icon={ShieldCheck} title="账号与权限" />
        <AccountPermissionPanel currentUser={currentUser} onLoginRequest={onLoginRequest} onLogout={onLogout} />
      </section>
      <section className="panel">
        <SectionTitle icon={TerminalSquare} title="链路配置" />
        <div className="link-config-grid">
          {linkRows.map((row) => {
            const noPerm = !hasPermission(currentUser, 'system-config');
            const checking = row.status === '检测中';
            return (
              <div className="link-config-card" key={row.key}>
                <div className="link-config-head">
                  <strong>{row.label}</strong>
                  <StatusText value={row.status} />
                </div>
                <div className="link-config-meta">
                  <span>地址 / 当前值</span>
                  <code className="text-ellipsis" title={row.value}>{row.value}</code>
                </div>
                <div className="link-config-meta">
                  <span>最近检测时间</span>
                  <em>{checkedAt[row.key] ?? '2025-05-27 10:30:45'}</em>
                </div>
                <div className="button-row link-config-actions">
                  <button type="button" disabled={noPerm || checking} title={noPerm ? getPermissionReason(currentUser, '系统配置修改') : undefined} onClick={() => runSettingAction(row)}>
                    {checking ? '检测中…' : row.action}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {permissionMessage && <div className="action-disabled-reason">{permissionMessage}</div>}
      </section>
      <section className="panel">
        <SectionTitle icon={Activity} title="本地运行状态" />
        <div className="runtime-grid">
          {[
            ['后台连接', connectionStatus.backend ?? '正常'],
            ['MQTT', connectionStatus.mqtt ?? '正常'],
            ['日志上传', connectionStatus.upload ?? '正常'],
            ['本地缓存', connectionStatus.cache ?? '正常'],
            ['最近同步时间', '2025-05-27 10:30:45'],
          ].map(([label, value]) => (
            <div className="runtime-item" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
      {settingsModal && <SettingsModal type={settingsModal} onClose={() => setSettingsModal(null)} />}
    </div>
  );
}

function AccountPermissionPanel({ currentUser, onLoginRequest, onLogout }) {
  if (!currentUser) {
    return (
      <div className="account-panel">
        <div className="account-card">
          <UserAvatar />
          <div>
            <strong>当前状态：未登录</strong>
            <span>请登录后进行任务操作、报警处理和系统配置</span>
          </div>
        </div>
        <div className="button-row">
          <button type="button" onMouseDown={(event) => { event.preventDefault(); onLoginRequest?.(); }}>立即登录</button>
          <button type="button" onClick={() => window.alert('未登录只能查看，登录后按角色开放操作权限。')}>权限说明</button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-panel">
      <div className="account-card">
        <UserAvatar user={currentUser} />
        <div>
          <strong>{currentUser.username}</strong>
          <span>{currentUser.role}｜已登录｜最近登录 {currentUser.loginAt}</span>
        </div>
      </div>
      <div className="detail-list dense">
        <Info label="当前登录用户" value={currentUser.username} />
        <Info label="用户角色" value={currentUser.role} />
        <Info label="登录状态" value="已登录" />
        <Info label="最近登录时间" value={currentUser.loginAt} />
        <Info label="权限范围" value={getPermissionScope(currentUser.role)} />
      </div>
      <div className="button-row">
        <button type="button" onMouseDown={(event) => { event.preventDefault(); onLoginRequest?.(); }}>切换用户</button>
        <button type="button" onMouseDown={(event) => { event.preventDefault(); onLogout?.(); }}>退出登录</button>
        <button type="button" onClick={() => window.alert(getPermissionScope(currentUser.role))}>权限说明</button>
      </div>
    </div>
  );
}

function SettingsModal({ type, onClose }) {
  const isQueue = type === '查看队列';
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="confirm-modal attachment-modal" role="dialog" aria-modal="true">
        <div className="confirm-modal-head">
          <strong>{type}</strong>
          <span>系统设置</span>
        </div>
        {isQueue ? (
          <DataTable
            columns={['时间', '类型', '对象', '状态']}
            rows={[
              ['09:10:42', '系统日志', '日志上传恢复', '待上传'],
              ['09:08:20', '遥测日志', '设备通信异常', '待上传'],
            ]}
          />
        ) : (
          <p>确认清理本地缓存？清理后不影响当前在线数据，关键审计日志仍会保留。</p>
        )}
        <div className="confirm-modal-actions">
          <button type="button" onClick={onClose}>
            {isQueue ? '关闭' : '取消'}
          </button>
          {!isQueue && (
            <button className="danger" type="button" onClick={onClose}>
              确认清理
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
