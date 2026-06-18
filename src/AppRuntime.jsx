import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Cpu,
  Database,
  Download,
  FileClock,
  Gauge,
  History,
  MonitorCog,
  Pause,
  Play,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Square,
  TerminalSquare,
} from 'lucide-react';
import { ExportConfirmModal } from './components/common/ExportConfirmModal';
import { DataStateBlock } from './components/common/DataStateBlock';
import { EmptyState } from './components/common/EmptyState';
import { ErrorState } from './components/common/ErrorState';
import { LoadingState } from './components/common/LoadingState';
import { PageErrorBoundary } from './components/common/PageErrorBoundary';
import { ActionFeedback } from './components/common/ActionFeedback';
import { useActionRequest } from './hooks/useActionRequest';
import * as Services from './services';
import { useMockRuntime, useRuntime, useRuntimeConnectionStatus } from './runtime';

// 实时通道（/ws/runtime）连接状态 → 顶栏文案与色调。
const REALTIME_BADGE = {
  connected: { text: '正常', tone: 'ok' },
  connecting: { text: '连接中', tone: 'info' },
  reconnecting: { text: '重连中', tone: 'warn' },
  error: { text: '异常', tone: 'bad' },
  closed: { text: '关闭', tone: 'neutral' },
  idle: { text: '未启用', tone: 'neutral' },
};
import { buildExportFilename, exportRowsToCsv } from './utils/export';
import { PERMISSIONS, can, getRoleLevel as getPermissionRoleLevel, permissionReason } from './utils/permissions';
import {
  ACTION_KEYS,
  canOperate,
  getOperatePermissionReason,
} from './utils/permission';
import { getStatusTone, isProblemPoint as isProblemPointByStatus } from './utils/status';

const alarms = Services.getAlarms();
const armActionLogs = Services.getArmRecords();
const armActionSteps = Services.getArmActionSteps();
const armActionTemplates = Services.getArmTemplates();
const armCommandReceipts = Services.getArmCommandReceipts();
const armTeachingPoints = Services.getTeachingPoints();
const armTemplateLogs = Services.getArmTemplateLogs();
const auditLogs = Services.getAuditLogs();
const mapAreas = Services.getMapAreas();
const mapDoors = Services.getMapDoors();
const mapNoGoAreas = Services.getMapNoGoAreas();
const mapObstacles = Services.getMapObstacles();
const mapPoints = Services.getMapPoints();
const mapRoutes = Services.getRoutes();
const mapVirtualWalls = Services.getMapVirtualWalls();
const mapWalls = Services.getMapWalls();
const mappingLogs = Services.getAutoMappingLogs();
const mappingTasks = Services.getMappingTasks();
const maps = Services.getMaps();
const robots = Services.getRobots();
const robotArms = Services.getArms();
const robotStatus = Services.getRobotStatus();
const cameras = Services.getCameras();
const commandLogs = Services.getCommandLogs();
const deviceAttachments = Services.getDeviceAttachments();
const devicePoints = Services.getDevicePointMap();
const devices = Services.getDevices();
const endEffectors = Services.getEndEffectors();
const interlocks = Services.getInterlocks();
const navItems = Services.getNavItems();
const settings = Services.getSettings();
const stepLogs = Services.getStepLogs();
const stepsByTask = Services.getStepsByTask();
const taskAttachments = Services.getTaskAttachments();
const taskPoints = Services.getTaskPoints();
const teachingPointLogs = Services.getTeachingPointLogs();
const tasks = Services.getTasks();
const telemetryLogs = Services.getTelemetryLogs();
const trendSeries = Services.getTrendSeries();
const visionModels = Services.getVisionModels();
const visionLogs = Services.getVisionLogs();
const visionResults = Services.getVisionResults();
const visionTasks = Services.getVisionTasks();

const iconMap = {
  overview: Gauge,
  'robot-monitor': MonitorCog,
  'map-management': Database,
  'arm-control': Cpu,
  'vision-recognition': MonitorCog,
  devices: Cpu,
  tasks: ClipboardList,
  commands: TerminalSquare,
  alarms: ShieldCheck,
  logs: History,
  settings: Settings,
};

const pageTitle = {
  overview: '总览',
  'robot-monitor': '机器人监控',
  'map-management': '地图管理',
  'arm-control': '机械臂控制',
  'vision-recognition': '视觉识别',
  devices: '设备与点位',
  tasks: '任务管理',
  commands: '指令回执',
  alarms: '报警互锁',
  logs: '日志审计',
  settings: '系统设置',
};

const deviceTabs = [
  { key: 'overview', label: '设备总览' },
  { key: 'detail', label: '设备详情' },
  { key: 'points', label: '点位管理' },
  { key: 'history', label: '历史对比' },
];

const mapTabs = [
  { key: 'overview', label: '地图总览' },
  { key: 'editor', label: '地图编辑' },
  { key: 'routes', label: '路线管理' },
  { key: 'mapping', label: '自动建图' },
];

const armTabs = [
  { key: 'overview', label: '机械臂总览' },
  { key: 'control', label: '动作控制' },
  { key: 'teaching', label: '姿态示教' },
  { key: 'tools', label: '末端工具' },
  { key: 'templates', label: '动作模板' },
];

const visionTabs = [
  { key: 'overview', label: '视觉总览' },
  { key: 'cameras', label: '相机配置' },
  { key: 'tasks', label: '识别任务' },
  { key: 'results', label: '识别结果' },
  { key: 'models', label: '模型管理' },
];
const DEVICE_OVERVIEW_SORT_OPTIONS = [
  '异常优先',
  '影响任务优先',
  '离线优先',
  '报警数从高到低',
  '更新时间从新到旧',
  '设备编号升序',
];

const allLogs = [
  ...commandLogs,
  ...telemetryLogs,
  ...auditLogs,
  ...stepLogs,
].sort((a, b) => b.time.localeCompare(a.time));

function Sidebar({ activeArmTab, activeDeviceTab, activeMapTab, activeVisionTab, collapsed, onToggleCollapse, page, setActiveArmTab, setActiveDeviceTab, setActiveMapTab, setActiveVisionTab, setPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
      <div className="brand">
        <div className="brand-mark">AI</div>
        <div>
          <div className="brand-title">机器人综合管理平台</div>
        </div>
      </div>
        <button aria-label={collapsed ? '展开侧边导航' : '收起侧边导航'} className="sidebar-toggle" data-tooltip={collapsed ? '展开' : '收起'} onClick={onToggleCollapse} type="button">
          <span />
        </button>
      </div>
      <nav className="nav">
        {navItems.map((item) => {
          const Icon = iconMap[item.key];
          return (
            <div className="nav-group" key={item.key}>
              <button
                className={`nav-item ${page === item.key ? 'active' : ''}`}
                onClick={() => {
                  if (item.key === 'devices') setActiveDeviceTab('overview');
                  if (item.key === 'map-management') setActiveMapTab('overview');
                  if (item.key === 'arm-control') setActiveArmTab('overview');
                  if (item.key === 'vision-recognition') setActiveVisionTab('overview');
                  setPage(item.key);
                }}
                title={collapsed ? item.label : undefined}
                type="button"
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
              {item.key === 'map-management' && page === 'map-management' && (
                <div className="nav-subtabs" role="tablist" aria-label="地图管理二级页签">
                  {mapTabs.map((tab) => (
                    <button
                      aria-selected={activeMapTab === tab.key}
                      className={activeMapTab === tab.key ? 'active' : ''}
                      key={tab.key}
                      onClick={() => setActiveMapTab(tab.key)}
                      role="tab"
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
              {item.key === 'arm-control' && page === 'arm-control' && (
                <div className="nav-subtabs" role="tablist" aria-label="机械臂控制二级页签">
                  {armTabs.map((tab) => (
                    <button aria-selected={activeArmTab === tab.key} className={activeArmTab === tab.key ? 'active' : ''} key={tab.key} onClick={() => setActiveArmTab(tab.key)} role="tab" type="button">
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
              {item.key === 'vision-recognition' && page === 'vision-recognition' && (
                <div className="nav-subtabs" role="tablist" aria-label="视觉识别二级页签">
                  {visionTabs.map((tab) => (
                    <button aria-selected={activeVisionTab === tab.key} className={activeVisionTab === tab.key ? 'active' : ''} key={tab.key} onClick={() => setActiveVisionTab(tab.key)} role="tab" type="button">
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
              {item.key === 'devices' && page === 'devices' && (
                <div className="nav-subtabs" role="tablist" aria-label="设备与点位二级页签">
                  {deviceTabs.map((tab) => (
                    <button
                      aria-selected={activeDeviceTab === tab.key}
                      className={activeDeviceTab === tab.key ? 'active' : ''}
                      key={tab.key}
                      onClick={() => setActiveDeviceTab(tab.key)}
                      role="tab"
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function TopBar({ title, currentUser, onLoginRequest, onLogout, onAccountSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const runtimeStatus = useRuntime((state) => state.systemStatus);
  const realtimeStatus = useRuntimeConnectionStatus();
  const realtimeBadge = REALTIME_BADGE[realtimeStatus] ?? REALTIME_BADGE.idle;
  const topBarStatus = runtimeStatus ?? {};
  const currentTime = topBarStatus.now;
  const openLogin = () => {
    setMenuOpen(false);
    onLoginRequest?.();
  };
  const closeMenuOnBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setMenuOpen(false);
    }
  };

  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
      </div>
      <div className="link-status">
        <StatusBadge label="工位" status={topBarStatus.workstation ?? 'WS-001'} tone="neutral" />
        <StatusBadge label="公共机" status={topBarStatus.ipc ?? 'IPC-001'} tone="neutral" />
        <StatusBadge label="后台" status={topBarStatus.backend ?? '未知'} />
        <StatusBadge label="MQTT" status={topBarStatus.mqtt ?? '未知'} />
        <StatusBadge label="日志上传" status={topBarStatus.logUpload ?? '未知'} />
        <StatusBadge label="本地缓存" status={topBarStatus.cache ?? '未知'} tone="neutral" />
        <StatusBadge label="实时" status={realtimeBadge.text} tone={realtimeBadge.tone} />
        <div className={`user-entry-wrap ${menuOpen ? 'open' : ''}`} onBlur={closeMenuOnBlur}>
          <button
            className="user-entry"
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              setMenuOpen((open) => !open);
            }}
            aria-expanded={menuOpen}
          >
            <UserAvatar user={currentUser} />
            {currentUser ? (
              <span>
                {currentUser.username}｜{currentUser.role}
              </span>
            ) : (
              <span>未登录</span>
            )}
          </button>
          <div className="user-menu" aria-hidden={!menuOpen}>
            {currentUser ? (
              <>
                <strong>当前用户：{currentUser.username}</strong>
                <span>角色：{currentUser.role}</span>
                <span>登录状态：已登录</span>
                <button type="button" onMouseDown={(event) => { event.preventDefault(); setMenuOpen(false); onAccountSettings?.(); }}>
                  账号设置
                </button>
                <button type="button" onMouseDown={(event) => { event.preventDefault(); openLogin(); }}>
                  切换用户
                </button>
                <button type="button" onMouseDown={(event) => { event.preventDefault(); setMenuOpen(false); onLogout?.(); }}>
                  退出登录
                </button>
              </>
            ) : (
              <>
                <strong>当前状态：未登录</strong>
                <span>登录后可进行任务操作、报警处理和系统配置</span>
                <button type="button" onMouseDown={(event) => { event.preventDefault(); openLogin(); }}>
                  立即登录
                </button>
              </>
            )}
          </div>
        </div>
        <span className="time">{currentTime}</span>
      </div>
    </header>
  );
}

function UserAvatar({ user, avatar }) {
  const value = avatar ?? user?.avatar ?? '默认头像';
  const label = user ? getAvatarLetter(user.role, user.username, value) : '未';
  return <span className={`user-avatar ${user ? 'signed' : ''}`}>{label}</span>;
}

function LoginModal({ currentUser, onSubmit, onClose }) {
  const [form, setForm] = useState({
    username: currentUser?.username ?? '',
    password: '',
    role: currentUser?.role ?? '操作员',
    avatar: currentUser?.avatar ?? '操作员头像',
  });
  const update = (key, value) => setForm((state) => ({ ...state, [key]: value }));

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="confirm-modal login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <div className="confirm-modal-head">
          <strong id="login-title">{currentUser ? '切换用户' : '用户登录'}</strong>
          <span>账号</span>
        </div>
        <div className="login-form">
          <label>
            <span>工号/账号</span>
            <input value={form.username} onChange={(event) => update('username', event.target.value)} placeholder="admin / engineer01" />
          </label>
          <label>
            <span>密码</span>
            <input value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="演示密码" type="password" />
          </label>
          <label>
            <span>角色</span>
            <select value={form.role} onChange={(event) => update('role', event.target.value)}>
              {['操作员', '工程师', '管理员'].map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </label>
          <label>
            <span>头像</span>
            <select value={form.avatar} onChange={(event) => update('avatar', event.target.value)}>
              {['默认头像', '操作员头像', '工程师头像', '管理员头像'].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <div className="avatar-preview">
            <UserAvatar user={{ username: form.username || getDefaultUsername(form.role), role: form.role, avatar: form.avatar }} />
            <span>{form.username || getDefaultUsername(form.role)}｜{form.role}</span>
          </div>
        </div>
        <div className="confirm-modal-actions">
          <button type="button" onMouseDown={(event) => { event.preventDefault(); onClose(); }}>取消</button>
          <button type="button" onMouseDown={(event) => { event.preventDefault(); onSubmit(form); }}>登录</button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ label, status, tone, size = 'md', variant = 'soft', className = '' }) {
  const displayStatus = status ?? '-';
  const resolvedTone = tone || getStatusTone(displayStatus) || 'neutral';
  const classes = ['status-badge', resolvedTone, size, variant, className].filter(Boolean).join(' ');
  return (
    <span className={classes}>
      {label && <span>{label}</span>}
      <strong>{displayStatus}</strong>
    </span>
  );
}

function getVisionResultKey(row) {
  return row?.screenshot || `${row?.time}-${row?.cameraId}-${row?.visionTaskId}`;
}

function getVisionImageTypeByTask(task) {
  if (task?.recognitionType?.includes('姿态')) return 'gripper-pose';
  if (task?.recognitionType?.includes('安全')) return 'safety-area';
  if (task?.recognitionType?.includes('二维码') || task?.recognitionType?.includes('条码')) return 'code-read';
  return 'material-position';
}

function getVisionObjectByTask(task) {
  if (task?.recognitionType?.includes('姿态')) return '夹爪姿态';
  if (task?.recognitionType?.includes('安全')) return '安全区域';
  if (task?.recognitionType?.includes('二维码') || task?.recognitionType?.includes('条码')) return '二维码 / 条码';
  return '物料 A-102';
}

function getDefaultVisionBox(imageType, result) {
  if (imageType === 'gripper-pose') return { x: 44, y: 28, width: 24, height: 34, label: `${result.object} / ${result.confidence}` };
  if (imageType === 'safety-area') return { x: 18, y: 20, width: 64, height: 52, label: `${result.object} / ${result.confidence}` };
  if (imageType === 'code-read') return { x: 58, y: 34, width: 18, height: 18, label: result.object };
  return { x: 36, y: 32, width: 28, height: 24, label: `${result.object} / ${result.confidence}` };
}

function getDefaultVisionRoi(imageType) {
  if (imageType === 'gripper-pose') return { x: 30, y: 18, width: 52, height: 58 };
  if (imageType === 'safety-area') return { x: 12, y: 16, width: 76, height: 62 };
  if (imageType === 'code-read') return { x: 48, y: 24, width: 36, height: 36 };
  return { x: 24, y: 22, width: 56, height: 48 };
}

function normalizeVisionResult(row) {
  const task = visionTasks.find((item) => item.visionTaskId === row.visionTaskId);
  const imageType = row.imageType ?? getVisionImageTypeByTask(task);
  const normalized = {
    ...row,
    imageType,
    frameStatus: row.frameStatus ?? (row.result === '异常' ? 'OFFLINE' : 'SNAPSHOT'),
  };
  return {
    ...normalized,
    bbox: row.bbox ?? getDefaultVisionBox(imageType, normalized),
    roi: row.roi ?? getDefaultVisionRoi(imageType),
  };
}

function getSelectedVisionResult(results, selectedKey, task, camera) {
  return results.find((row) => getVisionResultKey(row) === selectedKey)
    ?? results.find((row) => row.visionTaskId === task?.visionTaskId)
    ?? results.find((row) => row.cameraId === camera?.cameraId)
    ?? normalizeVisionResult(visionResults[0]);
}

function getVisionStats(results) {
  const durations = results
    .map((row) => Number.parseFloat(String(row.duration).replace(' ms', '')))
    .filter((value) => Number.isFinite(value));
  const avgDuration = durations.length ? `${Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)} ms` : '-';
  return {
    cameraTotal: cameras.length,
    online: cameras.filter((camera) => camera.online === '在线').length,
    running: visionTasks.filter((task) => task.status === '识别中').length,
    abnormal: visionTasks.filter((task) => task.status === '异常').length,
    today: results.length,
    badResults: results.filter((row) => ['异常', '低置信度', '失败'].includes(row.result) || row.processStatus === '待复核').length,
    avgDuration,
  };
}

function getVisionBoxStyle(box = {}) {
  return {
    left: `${box.x ?? 0}%`,
    top: `${box.y ?? 0}%`,
    width: `${box.width ?? 0}%`,
    height: `${box.height ?? 0}%`,
  };
}

function getVisionBoxTone(result) {
  if (result.result === '异常' || result.frameStatus === 'OFFLINE') return 'danger';
  if (result.result === '低置信度' || result.processStatus === '待复核') return 'warning';
  if (result.imageType === 'gripper-pose') return 'warning';
  return 'primary';
}

function getVisionSuggestion(result, model) {
  if (result.frameStatus === 'OFFLINE') return { tone: 'danger', title: '相机离线', text: '建议检查相机连接和视觉工控机状态。' };
  if (model?.deployStatus === '加载失败') return { tone: 'danger', title: '模型加载失败', text: '建议检查模型部署状态。' };
  if (result.result === '低置信度') return { tone: 'warning', title: '低置信度', text: '建议人工复核或重新拍照。' };
  if (['异常', '失败'].includes(result.result)) return { tone: 'danger', title: '识别失败', text: '建议重新触发识别或转人工处理。' };
  return { tone: 'ok', title: '识别通过', text: '当前结果可继续流转，必要时可人工复核。' };
}

const JOYSTICK_BASE_SIZE = 120;
const JOYSTICK_MAX_OFFSET = (JOYSTICK_BASE_SIZE / 2) * 0.45;

function getJoystickDirection({ x, y }) {
  const forward = y < -0.25;
  const back = y > 0.25;
  const left = x < -0.25;
  const right = x > 0.25;
  if (forward && left) return '左前';
  if (forward && right) return '右前';
  if (back && left) return '左后';
  if (back && right) return '右后';
  if (forward) return '前进';
  if (back) return '后退';
  if (left) return '左转';
  if (right) return '右转';
  return '停止';
}

function getJoystickMotion(vector) {
  return {
    direction: getJoystickDirection(vector),
    linearSpeed: Math.abs(vector.y) < 0.25 ? 0 : -vector.y * 0.4,
    angularSpeed: Math.abs(vector.x) < 0.25 ? 0 : vector.x * 0.6,
  };
}

function formatMotionValue(value) {
  return Math.abs(value).toFixed(2);
}

function getRobotManualSafetyIssues(status) {
  const issues = [];
  if (status.online !== '在线') issues.push('当前机器人离线');
  if (status.emergencyStatus !== '未触发') issues.push('急停已触发');
  if (status.communicationStatus !== '正常') issues.push('通信异常');
  const currentTask = tasks.find((task) => task.id === status.currentTask);
  const taskAllowsManual = !currentTask
    || ['待人工接管', '异常处理中', '待确认', '设备异常关注'].includes(currentTask.processStatus)
    || ['暂停', '失败', '排队中'].includes(currentTask.status);
  if (!taskAllowsManual) issues.push('当前任务不允许手动接管');
  if (currentTask?.executionMode?.includes('不可中断')) issues.push('机器人正在执行不可中断任务');
  return issues;
}

function VirtualJoystick({ active, angularSpeed, disabled, disabledReason, direction, joystickDragging, joystickVector, linearSpeed, onMoveChange, onMoveEnd, onMoveStart, onRelease, onTakeover }) {
  const baseRef = useRef(null);
  const canDrag = active && !disabled;
  const knobX = `${joystickVector.x * JOYSTICK_MAX_OFFSET}px`;
  const knobY = `${joystickVector.y * JOYSTICK_MAX_OFFSET}px`;

  const getVectorFromEvent = (event) => {
    const base = baseRef.current;
    if (!base) return { x: 0, y: 0 };
    const point = event.touches?.[0] ?? event.changedTouches?.[0] ?? event;
    const rect = base.getBoundingClientRect();
    const dx = point.clientX - rect.left - rect.width / 2;
    const dy = point.clientY - rect.top - rect.height / 2;
    const distance = Math.hypot(dx, dy);
    const ratio = distance > JOYSTICK_MAX_OFFSET ? JOYSTICK_MAX_OFFSET / distance : 1;
    return {
      x: Number(((dx * ratio) / JOYSTICK_MAX_OFFSET).toFixed(3)),
      y: Number(((dy * ratio) / JOYSTICK_MAX_OFFSET).toFixed(3)),
    };
  };

  const startDrag = (event) => {
    if (!canDrag) return;
    event.preventDefault();
    const vector = getVectorFromEvent(event);
    onMoveStart(vector);
  };

  useEffect(() => {
    if (!joystickDragging) return undefined;
    const move = (event) => {
      event.preventDefault();
      onMoveChange(getVectorFromEvent(event));
    };
    const end = () => onMoveEnd();
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
    window.addEventListener('touchcancel', end);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
      window.removeEventListener('touchcancel', end);
    };
  }, [joystickDragging, onMoveChange, onMoveEnd]);

  return (
    <div className={`virtual-joystick-panel ${active ? 'is-expanded' : 'is-collapsed'} ${disabled ? 'is-disabled' : ''}`} aria-label="地图内虚拟摇杆">
      {!active && (
        <>
          <button type="button" className="takeover-button" disabled={disabled} onClick={onTakeover}>手动接管</button>
          {disabled && <span className="virtual-joystick-tip">{disabledReason}</span>}
        </>
      )}
      {active && (
        <>
      <div className="virtual-joystick-base-wrap">
        <div
          ref={baseRef}
          className="virtual-joystick-base"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          role="application"
          aria-disabled={!canDrag}
          aria-label="虚拟摇杆底盘"
        >
          <div className="virtual-joystick-cross" />
          <span className="virtual-joystick-tick top">▲</span>
          <span className="virtual-joystick-tick right">▶</span>
          <span className="virtual-joystick-tick bottom">▼</span>
          <span className="virtual-joystick-tick left">◀</span>
          <div
            className={`virtual-joystick-knob ${joystickDragging ? 'is-dragging' : ''}`}
            style={{ '--knob-x': knobX, '--knob-y': knobY }}
          />
        </div>
      </div>
      <div className="virtual-joystick-direction">
        <span>{direction}</span>
        <span>{formatMotionValue(linearSpeed)} m/s</span>
      </div>
          <button type="button" className="joystick-release-button" onClick={onRelease}>释放</button>
        </>
      )}
    </div>
  );
}
function pointListToString(points) {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
}

function getRoutePolyline(routeId) {
  const route = mapRoutes.find((item) => item.routeId === routeId) ?? mapRoutes[0];
  if (!route) return [];
  return route.pointSequence.map((pointId) => mapPoints.find((point) => point.pointId === pointId)).filter(Boolean);
}

function RobotMapCanvas({ activeRouteId = 'R001', editable = false, robot = robotStatus }) {
  const activeRoutePoints = getRoutePolyline(activeRouteId);
  const ghostRoutes = mapRoutes.filter((route) => route.routeId !== activeRouteId);
  const robotX = robot.x ?? robotStatus.x;
  const robotY = robot.y ?? robotStatus.y;
  const robotTheta = robot.theta ?? robotStatus.theta;

  return (
    <div className={`robot-map-stage ${editable ? 'editable' : ''}`}>
      <svg className="robot-map-svg" viewBox="0 0 620 430" role="img" aria-label="robot map editor">
        <defs>
          <pattern id="map-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" className="map-grid-line" />
          </pattern>
        </defs>
        <rect className="map-grid-bg" width="620" height="430" fill="url(#map-grid)" />

        {mapAreas.map((area) => (
          <g className="map-area-group" key={area.areaId}>
            <polygon className="map-area" points={pointListToString(area.polygon)} style={{ fill: area.color }} />
            <text className="point-label" x={area.polygon[0].x + 12} y={area.polygon[0].y + 22}>{area.name}</text>
          </g>
        ))}

        {mapNoGoAreas.map((area) => (
          <g key={area.areaId}>
            <polygon className="map-no-go" points={pointListToString(area.polygon)} />
            <text className="point-label" x={area.polygon[0].x + 8} y={area.polygon[0].y + 20}>{area.name}</text>
          </g>
        ))}

        {mapObstacles.map((obstacle) => (
          <g key={obstacle.obstacleId}>
            <rect className="map-obstacle" x={obstacle.x} y={obstacle.y} width={obstacle.width} height={obstacle.height} rx="6" />
            <text className="point-label" x={obstacle.x + 8} y={obstacle.y + 20}>{obstacle.name}</text>
          </g>
        ))}

        {mapWalls.map((wall) => (
          <line className="map-wall" key={wall.wallId} x1={wall.start.x} y1={wall.start.y} x2={wall.end.x} y2={wall.end.y} />
        ))}

        {mapDoors.map((door) => (
          <g key={door.doorId}>
            <line className="map-door" x1={door.start.x} y1={door.start.y} x2={door.end.x} y2={door.end.y} />
            <text className="point-label" x={(door.start.x + door.end.x) / 2 + 6} y={(door.start.y + door.end.y) / 2}>{door.name}</text>
          </g>
        ))}

        {mapVirtualWalls.map((wall) => (
          <line className="map-virtual-wall" key={wall.wallId} x1={wall.start.x} y1={wall.start.y} x2={wall.end.x} y2={wall.end.y} />
        ))}

        {ghostRoutes.map((route) => {
          const points = route.pointSequence.map((pointId) => mapPoints.find((point) => point.pointId === pointId)).filter(Boolean);
          return points.length > 1 ? <polyline className="map-route-ghost" key={route.routeId} points={pointListToString(points)} /> : null;
        })}
        {activeRoutePoints.length > 1 && <polyline className="map-route" points={pointListToString(activeRoutePoints)} />}

        {mapPoints.map((point) => {
          const isCharge = point.pointId === 'P004' || point.areaId === 'A004';
          const isDoor = point.pointId === 'P005';
          return (
            <g className={`map-point ${isCharge ? 'charge' : ''} ${isDoor ? 'door' : ''}`} key={point.pointId} transform={`translate(${point.x} ${point.y})`}>
              {isCharge ? (
                <>
                  <path className="map-point-pin" d="M0,-14 C8,-14 13,-8 13,0 C13,10 0,20 0,20 C0,20 -13,10 -13,0 C-13,-8 -8,-14 0,-14 Z" />
                  <circle r="5" />
                </>
              ) : (
                <>
                  <circle r="8" />
                  <rect className="map-point-tag" x="-7" y="-7" width="14" height="14" rx="4" />
                </>
              )}
              <text x="12" y="4">{point.pointId}</text>
            </g>
          );
        })}

        <g className="map-robot" transform={`translate(${robotX} ${robotY}) rotate(${robotTheta})`}>
          <circle className="map-robot-halo" r="18" />
          <circle r="12" />
          <path d="M0,-18 L6,-5 L-6,-5 Z" fill="#fff" opacity="0.9" />
        </g>
        <text className="map-robot-label" x={robotX + 18} y={robotY + 4}>{robot.robotId ?? robotStatus.robotId}</text>
      </svg>
    </div>
  );
}

function MappingPreviewSvg({ progress }) {
  return (
    <div className="mapping-preview-slam">
      <RobotMapCanvas activeRouteId="R001" robot={robotStatus} />
      <div className="mapping-progress-overlay">
        <span>建图进度</span>
        <strong>{progress}%</strong>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, action }) {
  const [collapsed, setCollapsed] = useState(false);
  const togglePanel = (event) => {
    const nextCollapsed = !collapsed;
    setCollapsed(nextCollapsed);
    const collapsibleTarget = event.currentTarget.closest('.collapsible-section, .panel');
    if (collapsibleTarget) {
      collapsibleTarget.dataset.collapsed = String(nextCollapsed);
    }
  };

  return (
    <div className="section-title">
      <div>
        <Icon size={18} />
        <h2>{title}</h2>
      </div>
      <div className="section-actions">
        {action && (typeof action === 'string' || typeof action === 'number' ? <span>{action}</span> : action)}
        <button type="button" className="collapse-icon-button" onClick={togglePanel} aria-label={collapsed ? '展开卡片' : '收起卡片'}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </div>
  );
}

function ExportButton({ pageName, columns, getRows, currentUser, note = '导出范围：当前筛选结果｜导出顺序：当前排序顺序' }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const canExport = can(currentUser, PERMISSIONS.EXPORT_DATA);

  const showFeedback = (message) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2200);
  };

  const openModal = () => {
    const rows = getRows();
    if (!rows.length) {
      showFeedback('当前无可导出数据');
      return;
    }
    setModalOpen(true);
  };

  const confirmExport = (format) => {
    try {
      const rows = getRows();
      if (!rows.length) {
        setModalOpen(false);
        showFeedback('当前无可导出数据');
        return;
      }
      // 第一期 Excel 选项使用 CSV 兼容实现，避免引入额外依赖。
      exportRowsToCsv({
        filename: buildExportFilename(pageName),
        columns,
        rows,
      });
      setModalOpen(false);
      showFeedback(format === 'Excel' ? '导出成功' : '导出成功');
    } catch {
      setModalOpen(false);
      showFeedback('导出失败，请稍后重试');
    }
  };

  return (
    <>
      <button
        className="export-action-button"
        type="button"
        disabled={!canExport}
        title={!canExport ? '请先登录后导出' : undefined}
        onClick={openModal}
      >
        <Download size={15} />
        导出当前结果
      </button>
      {feedback && <div className="export-feedback" role="status">{feedback}</div>}
      {modalOpen && (
        <ExportConfirmModal
          description="将按当前筛选条件和排序结果导出页面数据。"
          note={note}
          onCancel={() => setModalOpen(false)}
          onConfirm={confirmExport}
        />
      )}
    </>
  );
}

function SummaryStrip({ items }) {
  return (
    <div className="summary-strip">
      {items.map((item) => (
        <div
          className={`summary-item ${item.tone ?? ''} ${item.onClick ? 'clickable' : ''} ${item.active ? 'active' : ''}`}
          key={item.label}
          onClick={item.onClick}
          role={item.onClick ? 'button' : undefined}
          aria-pressed={item.onClick ? Boolean(item.active) : undefined}
          tabIndex={item.onClick ? 0 : undefined}
          onKeyDown={(event) => {
            if (item.onClick && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              item.onClick();
            }
          }}
        >
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function SegmentedFilter({ options, value, onChange }) {
  return (
    <div className="segmented-filter">
      {options.map((option) => (
        <button className={value === option ? 'active' : ''} key={option} type="button" onClick={() => onChange(option)}>
          {option}
        </button>
      ))}
    </div>
  );
}

function SearchSelect({ value, onChange, selectValue, onSelectChange, options, placeholder }) {
  return (
    <div className="filterbar compact-filterbar">
      <Search size={16} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      <select value={selectValue} onChange={(event) => onSelectChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {(value || selectValue !== '全部') && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onSelectChange('全部');
          }}
        >
          清除
        </button>
      )}
    </div>
  );
}

function DeviceTable({ compact = false, onSelect, devicesForTable = devices }) {
  return (
    <DataTable
      columns={['设备编号', '类型', '在线状态', '运行状态', '异常数', '更新时间']}
      rows={devicesForTable.map((device) => [
        device.id,
        device.type,
        <StatusText value={device.online} />,
        <StatusText value={device.runStatus} />,
        device.alarmCount,
        device.updatedAt,
      ])}
      rowKeys={devicesForTable.map((device) => device.id)}
      onRowClick={onSelect}
      compact={compact}
    />
  );
}

function TaskQueue({ taskList = tasks, selectedTaskId, setSelectedTaskId }) {
  return (
    <DataTable
      className="task-table"
      stickyHeader
      maxHeight={520}
      columns={['订单编号', '任务类型', '目标设备', '取料工位', '放料方案', '开门方式', '当前步骤', '任务状态', '处理状态', '更新时间']}
      rows={taskList.map((task) => [
        task.orderNo ?? task.id,
        task.taskType ?? '生产任务',
        task.targetDevice ?? getTaskPrimaryDevice(task),
        task.pickupStation ?? '-',
        task.placementPlan ?? '-',
        task.doorMode ?? '-',
        getTaskCurrentStepDetail(task).stepLabel,
        <StatusText value={task.status} />,
        <StatusText value={task.processStatus ?? '待处理'} />,
        task.updatedAt,
      ])}
      rowKeys={taskList.map((task) => task.id)}
      selectedKey={selectedTaskId}
      onRowClick={setSelectedTaskId}
    />
  );
}
function CurrentTaskCard({ task, onTaskAction, currentUser, onDetail, onLogs }) {
  return (
    <div className="current-task">
      <div className="current-task-head">
        <span>当前任务</span>
        <strong>{task.id}</strong>
      </div>
      <div className="current-task-body">
        <TaskActions task={task} onTaskAction={onTaskAction} currentUser={currentUser} onDetail={onDetail} onLogs={onLogs} />
        <div className="detail-list dense current-task-detail">
          <Info label="状态" value={task.status} />
          <Info label="当前步骤" value={toChineseStep(task.currentStep)} />
          <Info label="关联设备" value={task.devices} />
          <Info label="当前指令" value={task.command} />
          <Info label="下发状态" value="已下发" />
          <Info label="回执状态" value="已确认" />
          <Info label="开始时间" value={task.startedAt} />
        </div>
      </div>
    </div>
  );
}

function TaskActions({ task, onTaskAction, currentUser, onDetail, onLogs }) {
  const interlockCheck = getInterlockCheck();
  const config = getTaskActionConfig(task.status);
  const visibleActions = config.actions;
  const permissionContext = {
    requireLogin: true,
    isLoggedIn: Boolean(currentUser),
    allowDangerous: currentUser?.role === '管理员',
  };
  const actionRequest = useActionRequest(
    async (action) => {
      let result;
      if (action === '暂停') result = await Services.pauseTask(task.id);
      if (action === '恢复') result = await Services.resumeTask(task.id);
      if (action === '中止') result = await Services.cancelTask(task.id);
      if (action === '重试') result = await Services.retryTask(task.id);
      if (action === '重新运行' || action === '开始') result = await Services.dispatchTask(task.id);
      onTaskAction?.(task, action);
      return result;
    },
    {
      confirm: (action) =>
        action !== '中止' ||
        window.confirm(`确认中止任务 ${task.id}？中止后需要重新下发才能继续。`),
      errorMessage: '操作失败，请稍后重试',
    },
  );

  return (
    <div className="action-area">
      <div>对当前任务 {task.id} 操作</div>
      <div className="button-row">
        {visibleActions.map((action) => {
          const needsInterlock = ['开始', '恢复'].includes(action);
          const actionKey = {
            暂停: ACTION_KEYS.TASK_PAUSE,
            恢复: ACTION_KEYS.TASK_RESUME,
            中止: ACTION_KEYS.TASK_CANCEL,
            重试: ACTION_KEYS.TASK_RETRY,
            重新运行: ACTION_KEYS.TASK_RETRY,
            开始: ACTION_KEYS.TASK_RETRY,
          }[action];
          const permissionOk =
            hasPermission(currentUser, getTaskActionPermission(action)) &&
            canOperate(actionKey, permissionContext);
          const disabled =
            actionRequest.loading || !permissionOk || (needsInterlock && !interlockCheck.ok);
          return (
            <button
              className={action === '中止' ? 'danger' : ''}
              disabled={disabled}
              key={action}
              onClick={() => actionRequest.run(action)}
              type="button"
              title={!permissionOk ? getPermissionReason(currentUser, action) : needsInterlock && !interlockCheck.ok ? interlockCheck.reason : undefined}
            >
              {getActionIcon(action)}
              {actionRequest.loading ? '处理中' : action}
            </button>
          );
        })}
        {onDetail && (
          <button type="button" onClick={onDetail}>
            查看详情
          </button>
        )}
        {onLogs && (
          <button type="button" onClick={onLogs}>
            查看日志
          </button>
        )}
      </div>
      {!interlockCheck.ok && visibleActions.some((action) => ['开始', '恢复'].includes(action)) && (
        <div className="action-disabled-reason">开始/恢复不可用：{interlockCheck.reason}</div>
      )}
      {visibleActions.some((action) => !hasPermission(currentUser, getTaskActionPermission(action))) && (
        <div className="action-disabled-reason">{getPermissionReason(currentUser, '任务操作')}</div>
      )}
      {visibleActions.some((action) => {
        const actionKey = action === '中止' ? ACTION_KEYS.TASK_CANCEL : ACTION_KEYS.TASK_PAUSE;
        return !canOperate(actionKey, permissionContext);
      }) && (
        <div className="action-disabled-reason">
          {getOperatePermissionReason(
            visibleActions.includes('中止') ? ACTION_KEYS.TASK_CANCEL : ACTION_KEYS.TASK_PAUSE,
            permissionContext,
          )}
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

function DeviceAttachmentManager({ currentUser, device, items, onChange, onPreview }) {
  const [selectedType, setSelectedType] = useState('全部');
  const [modalState, setModalState] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const canCreateOrEdit = can(currentUser, PERMISSIONS.ATTACHMENT_EDIT);
  const canDelete = can(currentUser, PERMISSIONS.ATTACHMENT_DELETE);
  const noMaintainReason = '无权限：当前角色不可维护设备附件';
  const typeOptions = ['全部', '图纸', '刀具', '夹具', '程序'];
  const visibleItems = selectedType === '全部' ? items : items.filter((item) => item.type === selectedType);

  const saveAttachment = (form, editingItem) => {
    const normalized = {
      ...editingItem,
      ...form,
      target: device.id,
      updatedAt: formatNowTime(),
      uploader: editingItem?.uploader ?? currentUser?.username ?? 'admin',
      remark: form.remark || '无',
    };
    const nextItems = editingItem
      ? items.map((item) => (isSameAttachment(item, editingItem) ? normalized : item))
      : [...items, normalized];
    const action = editingItem ? '编辑' : '新增';
    onChange(device.id, nextItems, `${action}${normalized.type} ${normalized.name}`);
    setModalState(null);
  };

  const confirmDelete = () => {
    if (!deleteItem) return;
    const nextItems = items.filter((item) => !isSameAttachment(item, deleteItem));
    onChange(device.id, nextItems, `删除${deleteItem.type} ${deleteItem.name}`);
    setDeleteItem(null);
  };

  return (
    <div className="attachment-list device-attachment-manager">
      <div className="attachment-manager-toolbar">
        <div className="attachment-type-filter">
          {typeOptions.map((type) => (
            <button className={selectedType === type ? 'active' : ''} key={type} type="button" onClick={() => setSelectedType(type)}>
              {type}
            </button>
          ))}
        </div>
        <button type="button" disabled={!canCreateOrEdit} title={!canCreateOrEdit ? noMaintainReason : undefined} onClick={() => setModalState({ mode: 'create', item: null })}>
          新增附件
        </button>
      </div>
      {!canCreateOrEdit && <div className="action-disabled-reason">{noMaintainReason}</div>}
      {visibleItems.length ? (
        <DataTable
          compact
          className="attachment-manage-table"
          columns={['类型', '文件名', '版本', '上传时间', '上传人', '操作']}
          rows={visibleItems.map((item) => [
            item.type,
            item.name,
            item.version,
            getAttachmentUploadTime(item),
            item.uploader ?? 'admin',
            <div className="table-actions">
              <button type="button" onClick={() => onPreview(item)}>查看</button>
              <button type="button" disabled={!canCreateOrEdit} title={!canCreateOrEdit ? noMaintainReason : undefined} onClick={() => setModalState({ mode: 'edit', item })}>编辑</button>
              <button type="button" disabled={!canDelete} title={!canDelete ? noMaintainReason : undefined} onClick={() => setDeleteItem(item)}>删除</button>
            </div>,
          ])}
          rowKeys={visibleItems.map((item) => `${item.type}-${item.name}-${item.version}`)}
        />
      ) : (
        <div className="attachment-empty">暂无附件</div>
      )}
      {modalState && (
        <AttachmentEditModal
          device={device}
          item={modalState.item}
          mode={modalState.mode}
          onCancel={() => setModalState(null)}
          onSave={saveAttachment}
        />
      )}
      {deleteItem && (
        <div className="modal-backdrop" role="presentation">
          <div className="confirm-modal" role="dialog" aria-modal="true">
            <div className="confirm-modal-head">
              <strong>确认删除该附件？</strong>
              <span>{deleteItem.name}</span>
            </div>
            <p>删除后仅从当前演示列表移除，不影响真实文件。</p>
            <div className="confirm-modal-actions">
              <button type="button" onClick={() => setDeleteItem(null)}>取消</button>
              <button className="danger" type="button" onClick={confirmDelete}>确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AttachmentEditModal({ device, item, mode, onCancel, onSave }) {
  const [form, setForm] = useState({
    type: item?.type ?? '图纸',
    name: item?.name ?? '',
    version: item?.version ?? 'v1.0',
    target: item?.target ?? device.id,
    remark: item?.remark ?? '',
  });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="confirm-modal attachment-modal" role="dialog" aria-modal="true">
        <div className="confirm-modal-head">
          <strong>{mode === 'edit' ? '编辑附件' : '新增附件'}</strong>
          <span>{device.id}</span>
        </div>
        <div className="attachment-edit-form">
          <label>
            <span>附件类型</span>
            <select value={form.type} onChange={(event) => update('type', event.target.value)}>
              {['图纸', '刀具', '夹具', '程序', '其他'].map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label>
            <span>文件名</span>
            <input value={form.name} onChange={(event) => update('name', event.target.value)} />
          </label>
          <label>
            <span>版本号</span>
            <input value={form.version} onChange={(event) => update('version', event.target.value)} />
          </label>
          <label>
            <span>关联设备</span>
            <input disabled value={form.target} onChange={(event) => update('target', event.target.value)} />
          </label>
          <label>
            <span>备注</span>
            <input value={form.remark} onChange={(event) => update('remark', event.target.value)} placeholder="可选" />
          </label>
          <div className="attachment-file-mock">
            <span>文件选择</span>
            <button type="button">选择文件（模拟）</button>
          </div>
        </div>
        <div className="confirm-modal-actions">
          <button type="button" onClick={onCancel}>取消</button>
          <button type="button" disabled={!form.name.trim()} onClick={() => onSave(form, item)}>保存</button>
        </div>
      </div>
    </div>
  );
}

function isSameAttachment(left, right) {
  return left.type === right.type && left.name === right.name && left.version === right.version;
}

function getAttachmentUploadTime(item) {
  const value = item.updatedAt ?? '';
  return value.includes(' ') ? value.split(' ').at(-1) : value;
}

function AttachmentList({ items, onPreview, title, compact = false, emptyText = '暂无附件', showAdd = true }) {
  const [selectedType, setSelectedType] = useState('全部');
  const [addedItems, setAddedItems] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newAttachment, setNewAttachment] = useState({ type: '图纸', name: '', version: 'v1.0' });
  const allItems = [...items, ...addedItems];

  const submitAttachment = () => {
    const name = newAttachment.name.trim();
    if (!name) return;
    setAddedItems((current) => [
      ...current,
      {
        type: newAttachment.type,
        name,
        version: newAttachment.version || 'v1.0',
        target: title ?? '当前对象',
        updatedAt: '当前时间',
        remark: '现场手动添加的附件记录。',
      },
    ]);
    setNewAttachment({ type: '图纸', name: '', version: 'v1.0' });
    setAdding(false);
  };

  if (!allItems.length) {
    return (
      <div className="attachment-empty with-action">
        <span>{emptyText}</span>
        {showAdd && adding ? (
          <div className="attachment-add-form">
            <select value={newAttachment.type} onChange={(event) => setNewAttachment((current) => ({ ...current, type: event.target.value }))}>
              {['图纸', '刀具', '夹具', '程序文件'].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input value={newAttachment.name} onChange={(event) => setNewAttachment((current) => ({ ...current, name: event.target.value }))} placeholder="附件名称" />
            <button type="button" onClick={submitAttachment}>
              添加
            </button>
          </div>
        ) : showAdd ? (
          <button type="button" onClick={() => setAdding(true)}>
            添加附件
          </button>
        ) : null}
      </div>
    );
  }

  const typeOptions = ['全部', ...Array.from(new Set(allItems.map((item) => item.type)))];
  const visibleItems = selectedType === '全部' ? allItems : allItems.filter((item) => item.type === selectedType);

  return (
    <div className={`attachment-list ${compact ? 'compact' : ''}`}>
      {title && <h3>{title}</h3>}
      <div className="attachment-type-filter">
        {typeOptions.map((type) => (
          <button className={selectedType === type ? 'active' : ''} key={type} type="button" onClick={() => setSelectedType(type)}>
            {type}
          </button>
        ))}
      </div>
      {visibleItems.map((item) => (
        <button className="attachment-row" key={`${item.type}-${item.name}`} type="button" onClick={() => onPreview(item)}>
          <span>{item.type}</span>
          <strong>{item.name}</strong>
          <em>{item.version}</em>
          <b>查看</b>
        </button>
      ))}
    </div>
  );
}

function AttachmentPreview({ attachment, onClose }) {
  const [actionText, setActionText] = useState('');
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="confirm-modal attachment-modal" role="dialog" aria-modal="true" aria-labelledby="attachment-title">
        <div className="confirm-modal-head">
          <strong id="attachment-title">附件预览</strong>
          <span>{attachment.type}</span>
        </div>
        <div className="detail-list attachment-detail">
          <Info label="文件名" value={attachment.name} />
          <Info label="版本" value={attachment.version} />
          <Info label="适用对象" value={attachment.target} />
          <Info label="更新时间" value={attachment.updatedAt} />
          <Info label="备注" value={attachment.remark} />
        </div>
        {actionText && <div className="attachment-action-note">{actionText}</div>}
        <div className="confirm-modal-actions">
          <button type="button" onClick={() => setActionText(`已打开预览：${attachment.name}`)}>
            预览
          </button>
          <button type="button" onClick={() => setActionText(`已定位到附件类型：${attachment.type}`)}>
            定位附件
          </button>
          <button type="button" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

function AlarmOverviewBar({ alarms: alarmRows, summary, filter, onFilterChange }) {
  const stats = { ...getAlarmOverviewStats(alarmRows), ...(summary ?? {}) };
  const urgencyText = getAlarmUrgencyText(alarmRows);
  return (
    <div className="alarm-overview-strip">
      <div className="alarm-overview-stats">高危 {stats.high}｜未处理 {stats.unhandled}｜处理中 {stats.processing}｜待归档 {stats.waitingArchive}｜已归档 {stats.archived}｜阻塞任务 {stats.blockedTasks}</div>
      <div className="alarm-emergency-line">{urgencyText}</div>
      <SegmentedFilter options={['当前待办', '全部', '未处理', '处理中', '待归档', '已归档', '高危', '阻塞任务']} value={filter} onChange={onFilterChange} />
    </div>
  );
}

function AlarmCardList({ alarms: alarmRows, filter, selectedAlarmName, onSelect }) {
  if (!alarmRows.length) {
    return <div className="attachment-empty">{filter === '当前待办' ? '暂无待处理报警' : '无匹配报警'}</div>;
  }

  return (
    <div className="alarm-card-list">
      {alarmRows.map((alarm) => {
        const context = getAlarmHandlingContext(alarm);
        return (
          <button
            className={`alarm-card ${selectedAlarmName === alarm.name ? 'selected' : ''}`}
            key={alarm.name}
            type="button"
            onClick={() => onSelect(alarm.name)}
          >
            <div className="alarm-card-title">
              <StatusText value={alarm.level} />
              <strong>{alarm.name}</strong>
            </div>
            <div className="alarm-card-meta">
              {alarm.device}｜{alarm.status}｜{alarm.time}
            </div>
            <div className="alarm-card-task">{context.task}</div>
          </button>
        );
      })}
    </div>
  );
}

function AlarmActionPanel({ alarm, onNavigate, onRecord, currentUser }) {
  const [action, setAction] = useState('');
  const permissionContext = {
    requireLogin: true,
    isLoggedIn: Boolean(currentUser),
    allowDangerous: currentUser?.role === '管理员',
  };
  const actionRequest = useActionRequest(
    async (label) => {
      const alarmId = alarm.id ?? alarm.name;
      let result;
      if (label === '确认处理') result = await Services.acknowledgeAlarm(alarmId);
      if (label === '标记恢复') result = await Services.recoverAlarm(alarmId);
      if (label === '忽略报警') result = await Services.ignoreAlarm(alarmId);
      const actionResult = getAlarmActionResult(label, alarm);
      const record = {
        time: formatNowTime(),
        objectId: alarm.device,
        logType: '报警处理',
        content: actionResult.content,
        status: actionResult.status,
      };
      onRecord?.(record, actionResult.nextStatus);
      setAction(`${label}：${alarm.name} / ${alarm.device}`);
      return result;
    },
    {
      confirm: (label) =>
        !['标记恢复', '忽略报警'].includes(label) ||
        window.confirm(`确认${label}“${alarm.name}”？`),
      errorMessage: '操作失败，请稍后重试',
    },
  );
  useEffect(() => {
    setAction('');
  }, [alarm?.name]);

  if (!alarm) {
    return <div className="attachment-empty">当前无待处理报警</div>;
  }

  const context = getAlarmHandlingContext(alarm);
  const actions = getAlarmActionsByStatus(alarm.status);
  const operation = getAlarmOperationContext(alarm, context);
  const runAction = (label) => {
    if (label === '查看任务') {
      if (context.task === '无') {
        setAction('当前报警无关联任务');
        return;
      }
      onNavigate?.('tasks', context.task);
      return;
    }
    if (label === '查看设备') {
      if (alarm.jumpTarget === 'robot-monitor') {
        onNavigate?.('robot-monitor', alarm.robotId ?? alarm.device);
        return;
      }
      if (alarm.jumpTarget === 'map-management') {
        onNavigate?.('map-management', alarm.device);
        return;
      }
      if (alarm.jumpTarget === 'arm-control') {
        onNavigate?.('arm-control', alarm.armId ?? alarm.device);
        return;
      }
      if (alarm.jumpTarget === 'vision-recognition') {
        onNavigate?.('vision-recognition', alarm.visionTaskId ?? alarm.cameraId ?? alarm.device);
        return;
      }
      onNavigate?.('devices', alarm.device);
      return;
    }
    if (label === '查看日志') {
      onNavigate?.('logs', alarm.name === '日志上传失败' ? '日志上传' : alarm.name);
      return;
    }
    if (label === '查看处理记录') {
      setAction(`已定位处理记录：${alarm.name}`);
      return;
    }
    actionRequest.run(label);
  };

  return (
    <div className="alarm-action-panel">
      <div className="alarm-process-summary">
        <span>当前对象</span>
        <p>{alarm.device}｜{context.task}｜{alarm.level}｜{alarm.status}</p>
      </div>
      <div className="alarm-workbench-body">
        <div className="alarm-workbench-cards">
          <div className="workbench-info-card">
            <span>影响判断</span>
            <strong>{context.impact}</strong>
          </div>
          <div className="workbench-info-card">
            <span>处理建议</span>
            <strong>{context.suggestion}</strong>
          </div>
          <div className="workbench-info-card">
            <span>{operation.reason ? '不可操作原因' : '操作前置'}</span>
            <strong>{operation.reason || operation.precondition}</strong>
          </div>
        </div>
        <div className="workbench-record">最近记录：{context.latestRecord}</div>
        <div className="alarm-action-buttons">
          <h3>处理操作</h3>
          {actions.map((label) => {
            const actionKey =
              label === '确认处理'
                ? ACTION_KEYS.ALARM_ACK
                : label === '标记恢复'
                  ? ACTION_KEYS.ALARM_RECOVER
                  : null;
            const permissionOk =
              hasPermission(currentUser, getAlarmActionPermission(label)) &&
              (!actionKey || canOperate(actionKey, permissionContext));
            return (
              <button key={label} type="button" disabled={actionRequest.loading || !permissionOk || isAlarmActionDisabled(label, operation)} title={!permissionOk ? getPermissionReason(currentUser, label) : undefined} onClick={() => runAction(label)}>
                {actionRequest.loading ? '处理中' : label}
              </button>
            );
          })}
        </div>
      </div>
      {actions.some((label) => !hasPermission(currentUser, getAlarmActionPermission(label))) && <div className="action-disabled-reason">{getPermissionReason(currentUser, '报警处理')}</div>}
      {actions.includes('标记恢复') &&
        !canOperate(ACTION_KEYS.ALARM_RECOVER, permissionContext) && (
          <div className="action-disabled-reason">
            {getOperatePermissionReason(ACTION_KEYS.ALARM_RECOVER, permissionContext)}
          </div>
        )}
      <ActionFeedback
        compact
        error={actionRequest.error}
        loading={actionRequest.loading}
        success={actionRequest.lastResult}
        successText={actionRequest.lastResult?.message}
      />
      {action && <div className="alarm-action-result">{action}</div>}
    </div>
  );
}

function PointDetail({ point, device }) {
  if (!point) {
    return <div className="attachment-empty">请选择点位</div>;
  }

  const pointType = getPointType(point);
  if (pointType === 'alarm') return <AlarmPointDetail point={point} device={device} />;
  if (pointType === 'status') return <StatusPointDetail point={point} device={device} />;
  return <NumericPointDetail point={point} device={device} />;
}

function KeyPointOverview({ compareRange = '5分钟均值', device }) {
  const keyPoints = getCriticalPointsForDevice(device);
  if (!keyPoints.length) return <div className="attachment-empty">暂无关键点位数据</div>;

  return (
    <div className="key-point-list" aria-label="关键点位">
      {keyPoints.map((point) => {
        const trend = getPointTrendInfo(point, compareRange);
        return (
          <div className="key-point-item" key={point.code}>
            <span className="key-point-name">{point.name}</span>
            <strong className="key-point-value">{point.value}</strong>
            <span className={`key-point-status ${getPointStatusTone(point.status)}`}>
              {getPointStatusIcon(point.status)} {point.status}
            </span>
            <span className="key-point-trend" title={`较${compareRange}变化`}>
              {trend.icon} {trend.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function NumericPointDetail({ point, device }) {
  return (
    <div className="detail-list">
      <Info label="当前值" value={point.value} />
      <Info label="正常范围" value={getNumericNormalRange(point)} />
      <Info label="报警阈值" value={getNumericThreshold(point)} />
      <Info label="单位" value={getPointUnit(point)} />
      <Info label="采样频率" value="1 Hz" />
      <Info label="数据来源" value="MQTT" />
      <Info label="趋势入口" value={`${device.id} 趋势图`} />
    </div>
  );
}

function StatusPointDetail({ point }) {
  const interlockOk = isInterlockSatisfied(point);
  return (
    <div className="detail-list">
      <Info label="当前状态" value={point.value} />
      <Info label="是否满足互锁" value={interlockOk ? '满足' : '不满足'} />
      <Info label="影响动作" value={interlockOk ? '允许任务执行' : '禁止开始/恢复任务'} />
      <Info label="关联任务" value={getRelatedTaskForDevice(point.device)} />
      <Info label="更新时间" value={point.updatedAt} />
      <Info label="数据来源" value="MQTT" />
    </div>
  );
}

function AlarmPointDetail({ point, device }) {
  const alarm = getAlarmPointDetail(point, device);
  if (alarm.code === '0') {
    return (
      <div className="detail-list">
        <Info label="报警码" value="0" />
        <Info label="报警状态" value="无报警" />
        <Info label="所属设备" value={device.id} />
        <Info label="更新时间" value={point.updatedAt} />
        <Info label="数据来源" value="MQTT" />
      </div>
    );
  }

  return (
    <div className="detail-list">
      <Info label="报警码" value={alarm.code} />
      <Info label="报警名称" value={alarm.name} />
      <Info label="报警等级" value={alarm.level} />
      <Info label="所属设备" value={alarm.device} />
      <Info label="当前状态" value={alarm.status} />
      <Info label="发生时间" value={alarm.time} />
      <Info label="关联任务" value={alarm.task} />
      <Info label="影响说明" value={alarm.impact} />
      <Info label="处理建议" value={alarm.suggestion} />
      <Info label="数据来源" value="MQTT" />
      <Info label="处理入口" value="报警互锁页" />
    </div>
  );
}

function PointTable({ points, title, selectedPointCode, onSelectPoint }) {
  return (
    <div className="point-block">
      {title && <h3>{title}</h3>}
      <DataTable
        columns={['设备', '点位名称', '点位编码', '当前值', '业务状态', '采集质量', '更新时间']}
        rows={points.map((point) => [
          point.device,
          point.name,
          point.code,
          point.value,
          <StatusText value={point.status} />,
          point.quality,
          point.updatedAt,
        ])}
        rowKeys={points.map((point) => point.code)}
        selectedKey={selectedPointCode}
        onRowClick={onSelectPoint}
      />
    </div>
  );
}

function RecentLogs({ selectedTaskId, setLogFilter, setLogTypeFilter }) {
  const [type, setType] = useState('全部');
  const rows = filterLogs(allLogs, type, '').slice(0, 6);
  return (
    <>
      <SegmentedFilter options={['全部', '指令', '报警', '任务', '审计', '设备', '机器人', '地图', '路线', '建图', '巡检', '底盘', '机械臂', '末端工具', '视觉识别', '相机', '模型']} value={type} onChange={setType} />
      <div className="log-scope-note">
        当前任务日志入口：{selectedTaskId}
        <button
          type="button"
          onClick={() => {
            setLogFilter(selectedTaskId);
            setLogTypeFilter('全部');
          }}
        >
          按当前任务筛选
        </button>
      </div>
      <LogTable rows={rows} />
    </>
  );
}

function StepList({ task, onStepNavigate }) {
  const steps = getTaskStepPreview(task);
  if (!steps.length) {
    return <div className="step-empty">暂无工序信息，请检查任务配置。</div>;
  }

  const openStep = (step) => {
    const target = step.target || '';
    if (target.startsWith('TP-')) {
      onStepNavigate?.navigateToTeachingPoint?.(target);
      return;
    }
    if (step.stepType === 'robot') {
      onStepNavigate?.navigateToRobot?.(target || task.robotId || 'AMR-001');
      return;
    }
    if (step.stepType === 'vision') {
      onStepNavigate?.navigateToVision?.(target || task.visionTaskId || 'VT-001');
      return;
    }
    if (step.stepType === 'arm') {
      onStepNavigate?.navigateToArm?.(target || task.armId || 'ARM-001');
      return;
    }
    if (step.stepType === 'device' || target) {
      onStepNavigate?.navigateToDevice?.(target || task.targetDevice);
      return;
    }
    if (step.stepType === 'task') onStepNavigate?.navigateToTask?.(target || task.id);
  };
  const openTemplateTeachingPoint = (step) => {
    const pointId = getStepTemplateTeachingPoint(step);
    if (pointId) onStepNavigate?.navigateToTeachingPoint?.(pointId);
  };

  return (
    <div className="step-list">
      {steps.map((step) => {
        const clickable = ['robot', 'arm', 'vision', 'device', 'task'].includes(step.stepType) || Boolean(step.target);
        const targetLabel = getStepNavigateLabel(step);
        const teachingPointId = getStepTemplateTeachingPoint(step);
        return (
          <div
            aria-disabled={!clickable}
            className={`step-item ${step.isCurrent ? 'current' : ''} ${clickable ? 'clickable' : ''}`}
            key={step.id}
            onClick={() => {
              if (clickable) openStep(step);
            }}
            onKeyDown={(event) => {
              if (!clickable || !['Enter', ' '].includes(event.key)) return;
              event.preventDefault();
              openStep(step);
            }}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
          >
            <span>{toChineseStep(step.id)}</span>
            <strong>{step.name}</strong>
            <div className="step-jump-actions">
              {clickable && (
                <button
                  className="step-jump-link"
                  onClick={(event) => {
                    event.stopPropagation();
                    openStep(step);
                  }}
                  type="button"
                >
                  {targetLabel}
                </button>
              )}
              {step.templateName && (
                <button
                  className="step-template-link"
                  onClick={(event) => {
                    event.stopPropagation();
                    onStepNavigate?.navigateToArmTemplate?.(step.templateId);
                  }}
                  type="button"
                >
                  {step.templateName}
                </button>
              )}
              {teachingPointId && (
                <button
                  className="step-template-link"
                  onClick={(event) => {
                    event.stopPropagation();
                    openTemplateTeachingPoint(step);
                  }}
                  type="button"
                >
                  {teachingPointId}
                </button>
              )}
            </div>
            <StatusText value={step.displayStatus} />
          </div>
        );
      })}
    </div>
  );
}

function getStepNavigateLabel(step) {
  if (step.target?.startsWith('TP-')) return `查看示教点 ${step.target}`;
  const labelMap = {
    robot: '查看机器人',
    vision: '查看视觉',
    arm: '查看机械臂',
    device: '查看设备',
    task: '查看任务',
  };
  return labelMap[step.stepType] ?? '查看关联对象';
}

function getStepTemplateTeachingPoint(step) {
  if (!step.templateId) return '';
  const template = armActionTemplates.find((item) => item.templateId === step.templateId);
  return template?.steps?.find((item) => item.targetTeachingPoint && item.targetTeachingPoint !== '-')?.targetTeachingPoint ?? '';
}

function InterlockTable({ highlightedDeviceIds = [], sourceInterlocks, onNavigate, onRecord, currentUser }) {
  const [filter, setFilter] = useState('全部');
  const [matrixExpanded, setMatrixExpanded] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [actionResult, setActionResult] = useState('');
  const [refreshingId, setRefreshingId] = useState('');
  const [flashId, setFlashId] = useState('');
  const [refreshError, setRefreshError] = useState('');
  const [refreshedAtByDevice, setRefreshedAtByDevice] = useState({});
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [recordDraft, setRecordDraft] = useState({ type: '刷新确认', result: '已确认', remark: '' });
  const rows = useMemo(() => getInterlockMatrixRows(sourceInterlocks), [sourceInterlocks]);
  const displayRows = useMemo(() => rows.map((row) => ({ ...row, updatedAt: refreshedAtByDevice[row.id] ?? row.updatedAt })), [rows, refreshedAtByDevice]);
  const stats = useMemo(() => getInterlockStats(displayRows), [displayRows]);
  const visibleRows = useMemo(() => filterInterlockRows(displayRows, filter), [displayRows, filter]);
  const relatedRows = useMemo(() => displayRows.filter((row) => highlightedDeviceIds.includes(row.id) || highlightedDeviceIds.includes(row.affectedTask)), [displayRows, highlightedDeviceIds]);
  const relatedInterlock = getRelatedInterlockSummary(relatedRows);
  const highlightedId = highlightedDeviceIds.find((id) => visibleRows.some((row) => row.id === id));
  const selectedRow = visibleRows.find((row) => row.id === selectedDeviceId) ?? visibleRows.find((row) => row.id === highlightedId) ?? visibleRows[0] ?? displayRows[0];

  useEffect(() => {
    if (highlightedId) {
      setSelectedDeviceId(highlightedId);
      setActionResult('');
    }
  }, [highlightedId]);

  useEffect(() => {
    if (visibleRows[0] && !visibleRows.some((row) => row.id === selectedDeviceId)) {
      setSelectedDeviceId(visibleRows[0].id);
    }
  }, [selectedDeviceId, visibleRows]);

  const refreshStatus = () => {
    if (!selectedRow || !hasPermission(currentUser, 'interlock-refresh')) return;
    setActionResult('');
    setRefreshError('');
    setRefreshingId(selectedRow.id);
    window.setTimeout(() => {
      if (selectedRow.id === 'CNC-003') {
        setRefreshError('刷新失败：设备连接异常');
      } else {
        setRefreshedAtByDevice((current) => ({ ...current, [selectedRow.id]: formatNowTime() }));
        setFlashId(selectedRow.id);
        window.setTimeout(() => setFlashId(''), 900);
      }
      setRefreshingId('');
    }, 650);
  };

  const viewRelatedTask = () => {
    if (!selectedRow?.affectedTask || ['-', '无当前任务'].includes(selectedRow.affectedTask)) return;
    onNavigate?.(selectedRow.affectedTask);
  };

  const saveHandlingRecord = () => {
    if (!selectedRow || !hasPermission(currentUser, 'record-handle')) return;
    const content = recordDraft.remark.trim() || getInterlockRecordContent(selectedRow, recordDraft);
    onRecord?.({
      time: formatNowTime(),
      objectId: selectedRow.id,
      deviceId: selectedRow.id,
      taskId: ['-', '无当前任务'].includes(selectedRow.affectedTask) ? '' : selectedRow.affectedTask,
      logType: selectedRow.overall === '满足' ? '互锁复核' : '互锁处理',
      content,
      status: recordDraft.result,
    });
    setRecordModalOpen(false);
    setActionResult('处理结果已记录');
    setRecordDraft({ type: '刷新确认', result: '已确认', remark: '' });
  };
  const hasRelatedTask = selectedRow?.affectedTask && !['-', '无当前任务'].includes(selectedRow.affectedTask);
  const isSatisfied = selectedRow?.overall === '满足';

  return (
    <div className="interlock-overview">
      <div className="interlock-related-summary">
        <strong>{relatedInterlock}</strong>
        <button className="collapse-icon-button" type="button" aria-label={matrixExpanded ? '收起互锁矩阵' : '展开互锁矩阵'} onClick={() => setMatrixExpanded((expanded) => !expanded)}>
          {matrixExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      {matrixExpanded && (
        <>
          <div className="interlock-summary">
            <span>涉及设备 <strong>{stats.total}</strong></span>
            <span>满足 <strong>{stats.satisfied}</strong></span>
            <span>不满足 <strong>{stats.unsatisfied}</strong></span>
            <span>阻塞任务 <strong>{stats.blockedTasks}</strong></span>
          </div>
          <SegmentedFilter options={['全部', '不满足', '阻塞任务', '已满足']} value={filter} onChange={setFilter} />
          {visibleRows.length ? (
            <DataTable
              stickyHeader
              maxHeight={340}
              minWidth={900}
              columnWidths={[110, 110, 'auto', 100, 130, 160, 100]}
              columns={['设备编号', '设备类型', '互锁摘要', '总体状态', '影响任务', '阻塞原因', '更新时间']}
              rows={visibleRows.map((row) => [
                row.id,
                row.type,
                getInterlockShortSummary(row),
                <StatusText value={row.overall} />,
                row.overall === '不满足' ? row.affectedTask : '-',
                row.overall === '不满足' ? row.blockReason : '-',
                row.updatedAt,
              ])}
              rowKeys={visibleRows.map((row) => row.id)}
              selectedKey={selectedRow?.id}
              highlightedKey={flashId}
              onRowClick={(id) => {
                setSelectedDeviceId(id);
                setActionResult('');
                setRefreshError('');
              }}
            />
          ) : (
            <div className="attachment-empty">{filter === '阻塞任务' ? '暂无阻塞任务' : '当前互锁均满足'}</div>
          )}
        </>
      )}
      {selectedRow && (
        <div className="interlock-detail-panel">
          <div className="interlock-detail-card">
            <div className="interlock-detail-head">
              <strong>{selectedRow.id}｜{selectedRow.type}</strong>
              <StatusText value={selectedRow.overall === '满足' ? '互锁满足' : '互锁不满足'} />
            </div>
            <div className="interlock-point-grid">
              <span>防护门：{selectedRow.door.value}</span>
              <span>夹具状态：{selectedRow.fixture.value}</span>
              <span>急停状态：{selectedRow.estop.value}</span>
              <span>机器人安全区：{selectedRow.robotArea.value}</span>
            </div>
            {isSatisfied ? (
              <>
                <div className="interlock-detail-block">
                  <span>互锁判断</span>
                  <strong>无阻塞，当前不影响任务执行。</strong>
                </div>
                <div className="interlock-detail-block">
                  <span>关联任务</span>
                  <strong>{hasRelatedTask ? selectedRow.affectedTask : '无'}</strong>
                </div>
              </>
            ) : (
              <>
                <div className="interlock-detail-block">
                  <span>阻塞原因</span>
                  <strong>{selectedRow.blockReason}</strong>
                </div>
                <div className="interlock-detail-block">
                  <span>影响任务</span>
                  <strong>{selectedRow.affectedTask}</strong>
                </div>
                <div className="interlock-detail-block">
                  <span>处理建议</span>
                  <strong>{selectedRow.suggestion}</strong>
                </div>
              </>
            )}
            <div className="interlock-detail-block">
              <span>最近更新时间</span>
              <strong>{selectedRow.updatedAt}</strong>
            </div>
            {refreshError && <div className="action-disabled-reason">{refreshError}</div>}
            {actionResult && <div className="alarm-action-result">{actionResult}</div>}
            {!hasPermission(currentUser, 'interlock-refresh') && <div className="action-disabled-reason">{getPermissionReason(currentUser, '刷新互锁')}</div>}
          </div>
          <div className="button-row interlock-actions">
            <button type="button" disabled={refreshingId === selectedRow.id || !hasPermission(currentUser, 'interlock-refresh')} onClick={refreshStatus}>
              {refreshingId === selectedRow.id ? '刷新中...' : '刷新状态'}
            </button>
            {isSatisfied ? (
              <>
                <button type="button" onClick={() => setActionResult('已定位当前互锁相关记录')}>
                  查看记录
                </button>
                <button className="secondary" type="button" disabled={!hasPermission(currentUser, 'record-handle')} onClick={() => setRecordModalOpen(true)}>
                  记录处理结果
                </button>
                <button type="button" disabled>
                  {hasRelatedTask ? '查看关联任务' : '无关联任务'}
                </button>
              </>
            ) : (
              <>
                <button type="button" disabled={!hasRelatedTask} onClick={viewRelatedTask}>
                  {hasRelatedTask ? '查看关联任务' : '无关联任务'}
                </button>
                <button className="primary" type="button" disabled={!hasPermission(currentUser, 'record-handle')} onClick={() => setRecordModalOpen(true)}>
                  记录处理结果
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {recordModalOpen && selectedRow && (
        <div className="modal-backdrop" role="presentation">
          <div className="confirm-modal interlock-record-modal" role="dialog" aria-modal="true" aria-labelledby="interlock-record-title">
            <div className="confirm-modal-head">
              <strong id="interlock-record-title">记录处理结果</strong>
              <span>{selectedRow.id}</span>
            </div>
            <div className="interlock-record-form">
              <Info label="处理对象" value={`${selectedRow.id}｜${selectedRow.type}`} />
              <label>
                <span>处理类型</span>
                <select value={recordDraft.type} onChange={(event) => setRecordDraft((current) => ({ ...current, type: event.target.value }))}>
                  {['刷新确认', '人工复核', '现场处理', '误报确认'].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>处理结果</span>
                <select value={recordDraft.result} onChange={(event) => setRecordDraft((current) => ({ ...current, result: event.target.value }))}>
                  {['已确认', '已恢复', '需维修', '暂不处理'].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>备注</span>
                <textarea value={recordDraft.remark} onChange={(event) => setRecordDraft((current) => ({ ...current, remark: event.target.value }))} placeholder="可选，填写现场处理说明" />
              </label>
            </div>
            <div className="confirm-modal-actions">
              <button type="button" onClick={() => setRecordModalOpen(false)}>
                取消
              </button>
              <button type="button" onClick={saveHandlingRecord}>
                确认保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getTrendSeriesForDevice(device) {
  if (device?.type === '控制器') {
    return [
      { name: '防护门', values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], unit: '闭' },
      { name: '夹具状态', values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], unit: '锁' },
      { name: '急停状态', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], unit: '未触发' },
    ];
  }
  if (device?.type === '工业机器人') {
    return [
      { name: '机器人负载', values: [20, 24, 28, 32, 31, 36, 40, 43, 46, 45, 48, 50, 49], unit: '%' },
      { name: '加工区状态', values: [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0], unit: '' },
      { name: '单件用时', values: [42, 41, 40, 39, 38, 38, 37, 37, 36, 36, 35, 35, 34], unit: 's' },
    ];
  }
  return trendSeries.map((series) => ({
    ...series,
    unit: series.name.includes('转速') ? 'rpm' : series.name.includes('进给') ? 'mm/min' : '%',
  }));
}

function getHistoryPreviewDevices(selectedDevice) {
  if (!selectedDevice) return getRepresentativeDevicesByType();
  const sameTypeDevices = devices.filter((device) => device.type === selectedDevice.type);
  return [
    selectedDevice,
    ...sameTypeDevices.filter((device) => device.id !== selectedDevice.id),
  ].slice(0, 4);
}

function getTrendSeriesForPoint(point, range) {
  const parsed = parsePointValue(point.value);
  const count = range === '近1小时' ? 13 : range === '近30分钟' ? 10 : range === '近15分钟' ? 8 : 6;
  const trend = getPointTrendInfo(point, rangeToCompareLabel(range));
  const direction = trend.icon === '↓' ? -1 : trend.icon === '↑' ? 1 : 0;
  const step = direction * Math.max(Math.abs(parsed.value) * 0.015, parsed.value === 0 ? 0 : 1);
  const values = Array.from({ length: count }, (_, index) => parsed.value - (count - index - 1) * step);
  return [{
    name: point.name,
    values,
    unit: parsed.unit,
  }];
}

function rangeToCompareLabel(range) {
  if (range === '近15分钟') return '15分钟均值';
  if (range === '近30分钟') return '30分钟均值';
  if (range === '近1小时') return '1小时均值';
  return '5分钟均值';
}

function getPointTypeFromLabel(label) {
  if (label === '状态') return 'status';
  if (label === '报警') return 'alarm';
  return 'numeric';
}

function getInitialPointTypeForDevice(deviceId) {
  const device = devices.find((item) => item.id === deviceId) ?? devices[0];
  const firstPoint = getDevicePointsFor(device)[0];
  return getPointTypeLabel(firstPoint);
}

function getDevicePointsFor(device) {
  if (!device) return [];
  const configured = devicePoints[device.id];
  if (configured) return configured;
  if (device.type === '工业机器人') {
    return [
      { device: device.id, name: '机器人状态', code: 'robot_state', pointType: 'status', value: device.runStatus, status: '正常', quality: '良好', updatedAt: device.updatedAt },
      { device: device.id, name: '加工区状态', code: 'in_cnc_work_area', pointType: 'status', value: '不在加工区', status: '正常', quality: '良好', updatedAt: device.updatedAt },
    ];
  }
  if (device.type === '控制器') {
    return [
      { device: device.id, name: '通信状态', code: 'comm_status', pointType: 'status', value: device.online, status: device.online === '在线' ? '正常' : '异常', quality: '良好', updatedAt: device.updatedAt },
      { device: device.id, name: '互锁状态', code: 'interlock_state', pointType: 'status', value: device.runStatus, status: '正常', quality: '良好', updatedAt: device.updatedAt },
    ];
  }
  return [
    { device: device.id, name: '主轴转速', code: 'spindle_speed', pointType: 'numeric', value: device.runStatus === '运行中' ? '3000 rpm' : '0 rpm', status: '正常', quality: '良好', updatedAt: device.updatedAt },
    { device: device.id, name: '进给速度', code: 'feed_rate', pointType: 'numeric', value: device.runStatus === '运行中' ? '1180 mm/min' : '0 mm/min', status: '正常', quality: '良好', updatedAt: device.updatedAt },
    { device: device.id, name: '主轴负载', code: 'spindle_load', pointType: 'numeric', value: device.alarmCount > 0 ? '72%' : '41%', status: device.alarmCount > 0 ? '偏高' : '正常', quality: '良好', updatedAt: device.updatedAt },
  ];
}

function getPointType(point) {
  if (!point) return 'numeric';
  if (point.pointType) return point.pointType;
  if (point.code === 'alarm_code') return 'alarm';
  if (['spindle_speed', 'feed_rate', 'spindle_load', 'air_pressure'].includes(point.code)) return 'numeric';
  return 'status';
}

function getPointTypeLabel(point) {
  const labels = {
    numeric: '数值',
    status: '状态',
    alarm: '报警',
  };
  return labels[getPointType(point)] ?? '状态';
}

function taskHasDevice(task, deviceId) {
  return task.devices.split(',').map((item) => item.trim()).includes(deviceId);
}

function getCurrentTaskForDevice(deviceId) {
  return tasks.find((task) => taskHasDevice(task, deviceId));
}

function getRepresentativeDevicesByType() {
  const seenTypes = new Set();
  return devices.filter((device) => {
    if (seenTypes.has(device.type)) return false;
    seenTypes.add(device.type);
    return true;
  });
}

function getDeviceOverviewRow(device) {
  const currentTask = getCurrentTaskForDevice(device.id);
  const points = getDevicePointsFor(device);
  const interlockStatus = getDeviceInterlockStatus(device, points);
  const keyAbnormalCount = getKeyPointAbnormalCount(device);
  const mappingSummary = getPointMappingSummary(device);
  return {
    id: device.id,
    type: device.type,
    online: device.online,
    runStatus: device.runStatus,
    currentTask: currentTask?.id ?? '无',
    alarmCount: device.alarmCount,
    interlockStatus,
    keyAbnormalCount,
    collectStatus: mappingSummary.collectStatus,
    coreStatus: getDeviceCoreStatus(device, { interlockStatus, keyAbnormalCount, mappingSummary }),
    lastHeartbeat: device.online === '离线' ? '超时' : device.updatedAt,
    updatedAt: device.updatedAt,
    problemSummary: getDeviceProblemSummary(device, { interlockStatus, keyAbnormalCount, mappingSummary }),
    statusSummary: getDeviceStatusSummary(device, { interlockStatus, keyAbnormalCount, mappingSummary }),
    suggestion: getDeviceSuggestion(device, { interlockStatus, keyAbnormalCount, mappingSummary }),
    priority: getDeviceAttentionPriority(device, { interlockStatus, keyAbnormalCount, mappingSummary }),
  };
}

function getDeviceOverviewStats(rows) {
  return {
    total: rows.length,
    online: rows.filter((row) => row.online === '在线').length,
    running: rows.filter((row) => row.runStatus === '运行中').length,
    abnormal: rows.filter(isDeviceNeedAttention).length,
    offline: rows.filter((row) => row.online === '离线').length,
    maintenance: rows.filter((row) => row.runStatus === '维护中').length,
  };
}

function filterDeviceOverviewRows(rows, filter) {
  if (filter === '异常') return rows.filter(isDeviceNeedAttention);
  if (filter === '离线') return rows.filter((row) => row.online === '离线');
  if (filter === '运行中') return rows.filter((row) => row.runStatus === '运行中');
  if (filter === '维护') return rows.filter((row) => row.runStatus === '维护中');
  if (filter === '有任务') return rows.filter((row) => row.currentTask !== '无');
  return rows;
}

function sortDeviceOverviewRows(rows) {
  return [...rows].sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id));
}

function sortDeviceOverviewDetailRows(rows, sortMode) {
  const sortedRows = [...rows];
  const byUpdateDesc = (left, right) => getDeviceUpdatedTimeValue(right) - getDeviceUpdatedTimeValue(left);
  const byAbnormal = (left, right) => getDeviceDetailAbnormalPriority(left) - getDeviceDetailAbnormalPriority(right) || byUpdateDesc(left, right);
  const byNaturalId = (left, right) => left.id.localeCompare(right.id, 'zh-Hans-CN', { numeric: true });

  if (sortMode === '影响任务优先') {
    return sortedRows.sort((left, right) => Number(right.currentTask !== '无') - Number(left.currentTask !== '无') || byAbnormal(left, right));
  }
  if (sortMode === '离线优先') {
    return sortedRows.sort((left, right) => Number(right.online === '离线') - Number(left.online === '离线') || Number(right.currentTask !== '无') - Number(left.currentTask !== '无') || byUpdateDesc(left, right));
  }
  if (sortMode === '报警数从高到低') {
    return sortedRows.sort((left, right) => right.alarmCount - left.alarmCount || byAbnormal(left, right));
  }
  if (sortMode === '更新时间从新到旧') {
    return sortedRows.sort((left, right) => byUpdateDesc(left, right) || byNaturalId(left, right));
  }
  if (sortMode === '设备编号升序') {
    return sortedRows.sort(byNaturalId);
  }
  return sortedRows.sort(byAbnormal);
}

function getDeviceDetailAbnormalPriority(row) {
  const hasTask = row.currentTask !== '无';
  if (row.online === '离线' && hasTask) return 0;
  if (row.interlockStatus === '不满足' && hasTask) return 1;
  if (row.alarmCount > 0 && hasTask) return 2;
  if (row.keyAbnormalCount > 0) return 3;
  if (row.online === '离线') return 4;
  if (row.interlockStatus === '不满足') return 5;
  if (row.alarmCount > 0 || row.collectStatus === '需检查') return 6;
  if (row.runStatus === '维护中' || row.runStatus === '待机') return 7;
  return 8;
}

function getDeviceUpdatedTimeValue(row) {
  const [hour = 0, minute = 0, second = 0] = String(row.updatedAt).split(':').map(Number);
  return hour * 3600 + minute * 60 + second;
}

function isDeviceNeedAttention(row) {
  return row.online === '离线' || row.alarmCount > 0 || row.interlockStatus === '不满足' || row.keyAbnormalCount > 0 || row.collectStatus === '需检查';
}

function getDeviceOverviewSummaryText(rows, attentionRows) {
  const taskImpacted = attentionRows.filter((row) => row.currentTask !== '无').length;
  if (!attentionRows.length) return '状态结论：当前设备整体正常，无需优先处理。';
  return `状态结论：${attentionRows.length} 台设备异常，其中 ${taskImpacted} 台影响任务执行，优先检查 ${attentionRows[0].id}。`;
}

function getDeviceTypeOverviewRows(rows) {
  const groups = rows.reduce((result, row) => {
    if (!result.has(row.type)) {
      result.set(row.type, { type: row.type, total: 0, running: 0, abnormal: 0, offline: 0, maintenance: 0 });
    }
    const group = result.get(row.type);
    group.total += 1;
    if (row.runStatus === '运行中') group.running += 1;
    if (isDeviceNeedAttention(row)) group.abnormal += 1;
    if (row.online === '离线') group.offline += 1;
    if (row.runStatus === '维护中') group.maintenance += 1;
    return result;
  }, new Map());
  return Array.from(groups.values());
}

function getDeviceAttentionPriority(device, context) {
  const hasTask = Boolean(getCurrentTaskForDevice(device.id));
  if (device.online === '离线' && hasTask) return 0;
  if (context.interlockStatus === '不满足' && hasTask) return 1;
  if (device.alarmCount > 0) return 2;
  if (context.keyAbnormalCount > 0) return 3;
  if (context.mappingSummary.collectStatus === '需检查') return 4;
  if (device.online === '离线') return 5;
  if (context.interlockStatus === '不满足') return 6;
  if (device.runStatus === '维护中' || device.runStatus === '待机') return 7;
  return 8;
}

function getDeviceCoreStatus(device, context) {
  if (device.online === '离线') return '离线';
  if (context.interlockStatus === '不满足') return '互锁不满足';
  if (device.alarmCount > 0 || context.keyAbnormalCount > 0 || context.mappingSummary.collectStatus === '需检查') return '异常';
  return device.runStatus;
}

function getDeviceProblemSummary(device, context) {
  const items = [];
  if (device.online === '离线') items.push('离线');
  if (context.mappingSummary.collectStatus === '需检查') items.push('点位超时');
  if (context.interlockStatus === '不满足') items.push('互锁不满足');
  if (context.keyAbnormalCount > 0) items.push(getKeyPointProblemText(device));
  if (device.alarmCount > 0) items.push(`${device.alarmCount} 条报警`);
  return items.length ? Array.from(new Set(items)).slice(0, 3).join(' / ') : '运行正常';
}

function getDeviceStatusSummary(device, context) {
  if (device.online === '离线') return context.mappingSummary.collectStatus === '需检查' ? '离线，点位超时' : '离线';
  if (context.interlockStatus === '不满足') return '互锁不满足，影响任务';
  if (context.keyAbnormalCount > 0) return getKeyPointProblemText(device);
  if (device.alarmCount > 0) return `${device.alarmCount} 条报警待处理`;
  return '运行正常';
}

function getKeyPointProblemText(device) {
  if (device.type === '数控机床') return '主轴负载偏高';
  if (device.type === '控制器') return '防护门异常';
  if (['机械臂', '夹爪', '吸盘'].includes(device.type)) return '机械臂点位异常';
  if (['相机', '光源', '视觉工控机', '视觉服务'].includes(device.type)) return '视觉点位异常';
  if (['工业机器人', '移动机器人', '机器人底盘', '激光雷达', '充电桩', '地图服务', '导航服务'].includes(device.type)) return '机器人点位异常';
  return '关键点位异常';
}

function getDeviceSuggestion(device, context) {
  if (device.online === '离线' || context.mappingSummary.collectStatus === '需检查') return '检查设备连接';
  if (context.interlockStatus === '不满足') return device.type === '控制器' ? '检查防护门' : '复核互锁条件';
  if (context.keyAbnormalCount > 0) {
    if (['机械臂', '夹爪', '吸盘'].includes(device.type)) return '复核机械臂与末端工具状态';
    if (['相机', '光源', '视觉工控机', '视觉服务'].includes(device.type)) return '复核相机与视觉服务状态';
    return ['工业机器人', '移动机器人', '机器人底盘', '激光雷达', '充电桩', '地图服务', '导航服务'].includes(device.type) ? '复核机器人状态' : '检查关键点位';
  }
  if (device.alarmCount > 0) return '查看报警处理';
  return '持续观察';
}

function getDeviceInterlockStatus(device, points = getDevicePointsFor(device)) {
  if (device.online === '离线') return '不满足';
  const interlockPoints = points.filter((point) => ['door_closed', 'fixture_locked', 'estop', 'in_cnc_work_area'].includes(point.code));
  if (!interlockPoints.length) return device.alarmCount > 0 ? '不满足' : '满足';
  return interlockPoints.every(isInterlockSatisfied) ? '满足' : '不满足';
}

function getKeyPointAbnormalCount(device) {
  return getCriticalPointsForDevice(device).filter((point) => point.status !== '正常').length;
}

function getCriticalPointsForDevice(device) {
  const pointsByCode = new Map(getDevicePointsFor(device).map((point) => [point.code, point]));
  const ensurePoint = (point) => {
    if (!pointsByCode.has(point.code)) pointsByCode.set(point.code, point);
  };

  if (device.type === '数控机床') {
    ensurePoint({ device: device.id, name: '程序状态', code: 'program_status', pointType: 'status', value: device.runStatus === '运行中' ? '执行中' : device.runStatus, status: device.online === '离线' ? '异常' : '正常', quality: '良好', updatedAt: device.updatedAt });
    ensurePoint({ device: device.id, name: '报警码', code: 'alarm_code', pointType: 'alarm', value: device.alarmCount > 0 ? '1007' : '0', status: device.alarmCount > 0 ? '异常' : '正常', quality: '良好', updatedAt: device.updatedAt });
    return ['spindle_speed', 'feed_rate', 'spindle_load', 'program_status', 'alarm_code'].map((code) => pointsByCode.get(code)).filter(Boolean);
  }

  if (device.type === '控制器') {
    ensurePoint({ device: device.id, name: '气压', code: 'air_pressure', pointType: 'numeric', value: device.alarmCount > 0 ? '0.42 MPa' : '0.61 MPa', status: device.alarmCount > 0 ? '偏低' : '正常', quality: '良好', updatedAt: device.updatedAt });
    return ['door_closed', 'fixture_locked', 'estop', 'air_pressure'].map((code) => pointsByCode.get(code)).filter(Boolean);
  }

  if (['工业机器人', '移动机器人', '机器人底盘', '激光雷达', '充电桩', '地图服务', '导航服务'].includes(device.type)) {
    ensurePoint({ device: device.id, name: '机器人状态', code: 'robot_state', pointType: 'status', value: device.runStatus, status: device.alarmCount > 0 ? '异常' : '正常', quality: '良好', updatedAt: device.updatedAt });
    ensurePoint({ device: device.id, name: '安全区状态', code: 'safe_area', pointType: 'status', value: '安全', status: '正常', quality: '良好', updatedAt: device.updatedAt });
    return ['robot_position', 'battery', 'localization_status', 'communication_status', 'emergency_status', 'navigation_status', 'mapping_status', 'current_map', 'current_route', 'lidar_status', 'speed', 'odom_status', 'charge_status', 'robot_state', 'safe_area', 'in_cnc_work_area'].map((code) => pointsByCode.get(code)).filter(Boolean);
  }

  if (['机械臂', '夹爪', '吸盘'].includes(device.type)) {
    ensurePoint({ device: device.id, name: '机械臂运行状态', code: 'arm_run_status', pointType: 'status', value: device.runStatus, status: device.alarmCount > 0 ? '异常' : '正常', quality: device.online === '离线' ? '异常' : '良好', updatedAt: device.updatedAt });
    return ['arm_online', 'arm_run_status', 'joint_angles', 'end_pose', 'gripper_status', 'vacuum_value'].map((code) => pointsByCode.get(code)).filter(Boolean);
  }

  if (['相机', '光源', '视觉工控机', '视觉服务'].includes(device.type)) {
    ensurePoint({ device: device.id, name: '视觉运行状态', code: 'vision_run_status', pointType: 'status', value: device.runStatus, status: device.alarmCount > 0 ? '异常' : '正常', quality: device.online === '离线' ? '异常' : '良好', updatedAt: device.updatedAt });
    return ['camera_online', 'capture_status', 'recognition_status', 'recognition_result', 'model_version', 'recognition_duration', 'vision_run_status'].map((code) => pointsByCode.get(code)).filter(Boolean);
  }

  if (device.type === '公共机') {
    ensurePoint({ device: device.id, name: '日志上传链路', code: 'log_upload', pointType: 'status', value: '正常', status: '正常', quality: '良好', updatedAt: device.updatedAt });
    ensurePoint({ device: device.id, name: '本地缓存', code: 'local_cache', pointType: 'status', value: '7 天', status: '正常', quality: '良好', updatedAt: device.updatedAt });
    ensurePoint({ device: device.id, name: 'MQTT 连接', code: 'mqtt_link', pointType: 'status', value: device.online, status: device.online === '在线' ? '正常' : '异常', quality: '良好', updatedAt: device.updatedAt });
    return ['log_upload', 'local_cache', 'mqtt_link'].map((code) => pointsByCode.get(code)).filter(Boolean);
  }

  return getDevicePointsFor(device).slice(0, 4);
}

function getPointMappingSummary(device) {
  const rows = getPointManagementRows(getDevicePointsFor(device).map((point) => ({ device, point })));
  const abnormal = rows.filter(isProblemPoint).length;
  return {
    total: rows.length,
    enabled: rows.filter((row) => row.enableStatus === '启用').length,
    abnormal,
    source: rows[0]?.source ?? 'MQTT',
    collectStatus: abnormal ? '需检查' : '正常',
  };
}

function getDeviceHistorySummary(device) {
  return getCriticalPointsForDevice(device)
    .filter((point) => getPointType(point) === 'numeric')
    .slice(0, 4)
    .map((point) => {
      const comparison = getHistoryComparison(point);
      return {
        name: point.name,
        current: comparison.current,
        previous: comparison.previous,
        average: comparison.average,
        delta: comparison.delta,
        status: point.status,
      };
    });
}

function getPointManagementRows(allPointRows) {
  return allPointRows.map(({ device, point }) => ({
    deviceId: device.id,
    deviceType: device.type,
    name: point.name,
    code: point.code,
    pointType: getPointTypeLabel(point),
    source: getPointSource(device),
    topic: getPointTopic(device, point),
    unit: getPointUnit(point),
    frequency: getPointFrequency(point),
    enableStatus: getPointEnableStatus(point),
    collectStatus: getPointCollectStatus(device, point),
    lastCollectedAt: point.updatedAt,
    quality: point.quality ?? '良好',
    updatedAt: point.updatedAt,
  }));
}

function groupPointRows(rows) {
  const grouped = rows.reduce((result, row) => {
    if (!result.has(row.deviceId)) {
      result.set(row.deviceId, {
        deviceId: row.deviceId,
        deviceType: row.deviceType,
        rows: [],
      });
    }
    result.get(row.deviceId).rows.push(row);
    return result;
  }, new Map());

  return Array.from(grouped.values())
    .map((group) => {
      const sortedRows = [...group.rows].sort(comparePointRows);
      return {
        ...group,
        rows: sortedRows,
        summary: getPointGroupSummary(sortedRows),
        abnormalCount: sortedRows.filter(isProblemPoint).length,
        lastUpdatedAt: sortedRows.map((row) => row.updatedAt).sort().at(-1) ?? '-',
        priority: Math.min(...sortedRows.map(getPointRowPriority)),
      };
    })
    .sort((left, right) => left.priority - right.priority || left.deviceId.localeCompare(right.deviceId));
}

function comparePointRows(left, right) {
  return getPointRowPriority(left) - getPointRowPriority(right) || left.name.localeCompare(right.name);
}

function getPointRowPriority(row) {
  if (['超时', '异常', '未配置'].includes(row.collectStatus)) return 0;
  if (row.enableStatus === '停用') return 2;
  return 1;
}

function isProblemPoint(row) {
  return isProblemPointByStatus(row);
}

function getPointGroupSummary(rows) {
  if (rows.some(isProblemPoint)) return '异常';
  if (rows.every((row) => row.enableStatus === '停用')) return '全部停用';
  return '采集正常';
}

function getPointIssueReason(row) {
  if (row.collectStatus === '超时') return '最后更新时间过久';
  if (row.collectStatus === '异常') return '点位状态异常或采集质量异常';
  if (row.collectStatus === '未配置') return '缺少点位编码或点位名称';
  return '-';
}

function getPointIssueShortReason(row) {
  if (row.collectStatus === '超时') return '更新过久';
  if (row.collectStatus === '异常') return '状态异常';
  if (row.collectStatus === '未配置') return '配置缺失';
  return '-';
}

function getPointIssueSuggestion(row) {
  if (row.collectStatus === '超时') return '检查采集链路和最后更新时间';
  if (row.collectStatus === '异常') return '查看点位详情并核对采集质量';
  if (row.collectStatus === '未配置') return '补齐点位编码或点位名称';
  return '无需处理';
}

function formatPointTypeWithUnit(row) {
  if (row.pointType === '数值' && row.unit !== '无') return `${row.pointType}｜${row.unit}`;
  return row.pointType;
}

function filterPointManagementRows(rows, filters) {
  const keyword = filters.query.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesType = matchesFilterValue(row.deviceType, filters.type);
    const matchesDevice = matchesFilterValue(row.deviceId, filters.device);
    const matchesPointType = matchesFilterValue(row.pointType, filters.pointType);
    const matchesSource = matchesFilterValue(row.source, filters.source);
    const matchesEnableStatus = matchesFilterValue(row.enableStatus, filters.enableStatus);
    const matchesStatus = filters.status === '问题点位' ? isProblemPoint(row) : matchesFilterValue(row.collectStatus, filters.status);
    const matchesKeyword = !keyword || [row.deviceId, row.name, row.code].some((value) => String(value).toLowerCase().includes(keyword));
    return matchesType && matchesDevice && matchesPointType && matchesSource && matchesEnableStatus && matchesStatus && matchesKeyword;
  });
}

function getActivePointSummaryFilter(filters, defaultFilters) {
  const baseKeys = ['type', 'device', 'pointType', 'source', 'query'];
  const hasExtraFilter = baseKeys.some((key) => filters[key] !== defaultFilters[key]);
  if (hasExtraFilter) return '';
  if (filters.enableStatus !== '全部') return '';
  if (filters.status === '正常') return 'normal';
  if (filters.status === '问题点位') return 'problem';
  if (filters.status === '未配置') return 'unconfigured';
  if (filters.status === '全部') return 'all';
  return '';
}

function matchesFilterValue(value, filterValue) {
  const normalizedFilter = String(filterValue).trim().toLowerCase();
  if (!normalizedFilter || normalizedFilter === '全部') return true;
  return String(value).toLowerCase().includes(normalizedFilter);
}

function getPointManagementStats(rows) {
  return {
    total: rows.length,
    enabled: rows.filter((row) => row.enableStatus === '启用').length,
    normal: rows.filter((row) => row.collectStatus === '正常').length,
    abnormal: rows.filter(isProblemPoint).length,
    unconfigured: rows.filter((row) => row.collectStatus === '未配置').length,
  };
}

function getPointSource(device) {
  if (device.type === '控制器') return 'PLC';
  if (['工业机器人', '移动机器人', '机器人底盘', '激光雷达', '充电桩', '地图服务', '导航服务'].includes(device.type)) return '机器人控制器';
  return 'MQTT';
}

function getPointTopic(device, point) {
  if (device.type === '控制器') return `DB/${device.id}/${point.code}`;
  if (device.type === '工业机器人') return `robot/${device.id}/${point.code}`;
  return `factory/${device.id}/${point.code}`;
}

function getPointFrequency(point) {
  if (getPointType(point) === 'numeric') return '1 Hz';
  if (getPointType(point) === 'alarm') return '事件触发';
  return '2 Hz';
}

function getPointEnableStatus(point) {
  return point.code && point.name ? '启用' : '停用';
}

function getPointCollectStatus(device, point) {
  if (!point.code || !point.name) return '未配置';
  if (device.online === '离线') return '超时';
  if (point.status === '异常' || point.quality === '异常') return '异常';
  return '正常';
}

function getPointTrendInfo(point, compareRange = '5分钟均值') {
  const baseChange = {
    spindle_speed: 3,
    feed_rate: 1,
    spindle_load: 9,
    air_pressure: -2,
  }[point.code] ?? 0;
  const factor = {
    '5分钟均值': 1,
    '30分钟均值': 1.7,
    '1小时均值': 2.4,
  }[compareRange] ?? 1;
  const change = Math.round(baseChange * factor);
  const icon = change > 0 ? '↑' : change < 0 ? '↓' : '→';
  return {
    icon,
    text: `${Math.abs(change)}%`,
  };
}

function getPointStatusIcon(status) {
  if (status === '正常') return '✓';
  if (status === '偏低') return '↓';
  if (['偏高', '异常', '报警', '未处理'].includes(status)) return '⚠';
  return '→';
}

function getPointStatusTone(status) {
  if (status === '正常') return 'ok';
  if (['偏高', '偏低'].includes(status)) return 'warn';
  if (['异常', '报警', '未处理'].includes(status)) return 'bad';
  return 'neutral';
}

function getPointValueComparison(point) {
  const [, numberText = '0', unit = ''] = String(point.value).match(/^(-?\d+(?:\.\d+)?)(.*)$/) ?? [];
  const currentNumber = Number(numberText);
  const step = {
    spindle_speed: 180,
    feed_rate: 70,
    spindle_load: 4,
    air_pressure: 0.1,
  }[point.code] ?? 1;
  const delta = currentNumber === 0 ? 0 : step;
  const historyNumber = currentNumber - delta;
  const format = (value) => `${Number.isInteger(value) ? value : value.toFixed(1)}${unit}`;

  return {
    current: point.value,
    history: format(historyNumber),
    delta: `${delta >= 0 ? '+' : ''}${Number.isInteger(delta) ? delta : delta.toFixed(1)}${unit}`,
  };
}

function getHistoryComparison(point, range = '近5分钟') {
  const parsed = parsePointValue(point.value);
  const compareLabel = rangeToCompareLabel(range);
  const trend = getPointTrendInfo(point, compareLabel);
  const percent = Number(trend.text.replace('%', ''));
  const direction = trend.icon === '↓' ? -1 : trend.icon === '↑' ? 1 : 0;
  const previousNumber = direction === 0 ? parsed.value : parsed.value / (1 + (direction * percent) / 100);
  const averageNumber = direction === 0 ? parsed.value : parsed.value / (1 + (direction * percent) / 200);
  const maxNumber = Math.max(parsed.value, previousNumber, averageNumber) * 1.04;
  const minNumber = Math.min(parsed.value, previousNumber, averageNumber) * 0.96;
  return {
    current: point.value,
    previous: formatPointNumber(previousNumber, parsed.unit),
    average: formatPointNumber(averageNumber, parsed.unit),
    max: formatPointNumber(maxNumber, parsed.unit),
    min: formatPointNumber(minNumber, parsed.unit),
    delta: `${trend.icon} ${trend.text}`,
    compareLabel,
  };
}

function getComparisonDirection(delta = '') {
  if (delta.includes('↑')) return 'up';
  if (delta.includes('↓')) return 'down';
  return 'flat';
}

function getCurrentJudgementText(point, comparison, timeRange) {
  const compareLabel = rangeToCompareLabel(timeRange);
  const direction = getComparisonDirection(comparison.delta);
  if (getPointType(point) === 'alarm') {
    return point.value && String(point.value) !== '0'
      ? `当前报警码 ${point.value} 仍未恢复，建议查看报警详情。`
      : '当前无报警码，所选时间范围内未发现持续报警。';
  }
  if (getPointType(point) === 'status') {
    return point.status === '正常'
      ? `当前状态为 ${point.value}，近${compareLabel.replace('均值', '')}保持稳定。`
      : `当前状态为 ${point.value}，存在异常变化，建议检查关联机构。`;
  }
  if (point.status === '偏高' || point.status === '异常') {
    return `${point.name} ${point.value}，较${compareLabel}${comparison.delta.replace('↑', '上升').replace('↓', '下降').replace('→', '持平')}，存在升高趋势，建议关注加工负载。`;
  }
  const trendText = direction === 'up' ? '上升' : direction === 'down' ? '下降' : '持平';
  return `${point.name} ${point.value}，较${compareLabel}${trendText} ${comparison.delta.replace(/[↑↓→]\s*/, '')}，仍处于正常范围。`;
}

function getNumericNodeNote(row, index, rows, point) {
  if (index === 0) return '起始点';
  if (index === rows.length - 1) {
    if (point.status === '偏高' || point.status === '异常') return '接近阈值';
    return '达到当前值';
  }
  if (row.delta.startsWith('+')) return '持续上升';
  if (row.delta.startsWith('-')) return '持续下降';
  return '保持稳定';
}

function getStatusNodeNote(row, index, rows) {
  if (index === 0) return '起始点';
  if (row.changed) return '状态变化';
  if (index === rows.length - 1) return '达到当前状态';
  return '保持';
}

function getAlarmNodeNote(row, index, rows) {
  if (index === 0) return '起始点';
  if (row.value !== '0' && row.event.includes('触发')) return '报警触发';
  if (index === rows.length - 1 && row.value === '0') return '状态恢复';
  return '无报警';
}

function getHistoryRecords(point, range = '近5分钟') {
  const parsed = parsePointValue(point.value);
  const trend = getPointTrendInfo(point, rangeToCompareLabel(range));
  const direction = trend.icon === '↓' ? -1 : trend.icon === '↑' ? 1 : 0;
  const times = getHistoryTimes(point.updatedAt, range);
  return times.map((time, index) => {
    const step = direction * Math.max(parsed.value * 0.015, 1);
    const value = parsed.value - (times.length - index - 1) * step;
    const previous = index === 0 ? value : value - step;
    const delta = value - previous;
    return {
      time,
      value: formatPointNumber(value, parsed.unit),
      delta: formatPointDelta(delta, parsed.unit),
      status: point.status,
      quality: point.quality,
    };
  });
}

function getStatusHistoryRecords(point, range = '近5分钟') {
  const times = getHistoryTimes(point.updatedAt, range);
  const hasIssue = point.status !== '正常';
  return times.map((time, index) => {
    const changed = hasIssue && index === times.length - 2;
    const previous = changed ? getPreviousStatusValue(point) : point.value;
    return {
      time,
      value: point.value,
      previous,
      changed,
      quality: point.quality,
    };
  });
}

function getAlarmHistoryRecords(point, range = '近5分钟') {
  const times = getHistoryTimes(point.updatedAt, range);
  const currentCode = String(point.value ?? '0');
  return times.map((time, index) => {
    const triggered = currentCode !== '0' && index >= Math.max(0, times.length - 2);
    return {
      time,
      value: triggered ? currentCode : '0',
      event: triggered ? '报警触发' : '无报警',
      status: triggered ? point.status : '正常',
      quality: point.quality,
    };
  });
}

function getStatusComparison(point, records) {
  const changes = records.filter((row) => row.changed);
  const lastChange = changes.at(-1);
  return {
    current: point.value,
    previous: lastChange?.previous ?? point.value,
    changeCount: changes.length,
    lastChangedAt: lastChange?.time ?? '无',
  };
}

function getPreviousStatusValue(point) {
  if (point.code === 'fixture_locked') return '已锁紧';
  if (point.code === 'door_closed') return '已关闭';
  if (point.code === 'estop') return '未触发';
  if (point.code === 'in_cnc_work_area') return '不在加工区';
  if (point.code === 'comm_status' || point.code === 'mqtt_link') return '在线';
  return '正常';
}

function getAlarmComparison(point, records) {
  const triggered = records.filter((row) => row.value !== '0');
  return {
    current: point.value,
    previous: records.at(-2)?.value ?? '0',
    triggerCount: triggered.length,
    lastTriggeredAt: triggered.at(-1)?.time ?? '无',
  };
}

function getNumericAnalysis(point, comparison) {
  const compareLabel = comparison.compareLabel ?? '5分钟均值';
  if (comparison.delta.startsWith('↑')) {
    return {
      judgement: `当前值高于${compareLabel}，存在上升趋势。`,
      suggestion: point.status === '偏高' ? '关注加工负载变化，必要时检查进给参数。' : '持续观察趋势变化，确认工艺参数稳定。',
    };
  }
  if (comparison.delta.startsWith('↓')) {
    return {
      judgement: `当前值低于${compareLabel}，存在下降趋势。`,
      suggestion: '关注设备输出变化，必要时检查气压、速度或状态配置。',
    };
  }
  return {
    judgement: `当前值与${compareLabel}基本持平。`,
    suggestion: '维持当前参数，继续观察采集质量。',
  };
}

function getStatusAnalysis(summary) {
  return {
    judgement: summary.changeCount ? '当前状态在所选时间范围内发生变化。' : '当前状态在所选时间范围内保持稳定。',
    suggestion: summary.changeCount ? '核对最近变化时间，确认现场动作是否符合预期。' : '继续关注状态点位采集质量。',
  };
}

function getAlarmAnalysis(summary) {
  return {
    judgement: Number(summary.triggerCount) > 0 ? '所选时间范围内存在报警触发记录。' : '所选时间范围内未发现报警触发。',
    suggestion: Number(summary.triggerCount) > 0 ? '优先确认报警码含义和关联设备状态。' : '保持监控，必要时扩大时间范围复查。',
  };
}

function getHistoryTimes(updatedAt, range) {
  const count = range === '近1小时' ? 8 : range === '近30分钟' ? 7 : range === '近15分钟' ? 6 : 5;
  const current = updatedAt || '09:11:18';
  const baseMinute = Number(current.slice(3, 5)) || 11;
  const second = current.slice(6, 8) || '18';
  return Array.from({ length: count }, (_, index) => {
    const minute = Math.max(0, baseMinute - (count - index - 1));
    return `09:${String(minute).padStart(2, '0')}:${second}`;
  });
}

function parsePointValue(value) {
  const [, numberText = '0', unit = ''] = String(value).match(/^(-?\d+(?:\.\d+)?)(.*)$/) ?? [];
  return { value: Number(numberText), unit };
}

function formatPointNumber(value, unit) {
  const display = Number.isInteger(value) ? value : value.toFixed(1);
  return `${display}${unit}`;
}

function formatPointDelta(value, unit) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatPointNumber(value, unit)}`;
}

function getPointDetailTitle(point) {
  const pointType = getPointType(point);
  if (pointType === 'alarm') return '报警码详情';
  if (pointType === 'status') return '状态点位详情';
  return '数值点位详情';
}

function getAlarmPointDetail(point, device) {
  const code = String(point.value ?? '0');
  if (code === '1007') {
    return {
      code,
      name: '设备通信异常',
      level: '中危',
      device: 'CNC-003',
      status: '处理中',
      time: '09:08:20',
      task: 'TASK-004',
      impact: '设备通信异常，当前任务暂停',
      suggestion: '检查设备连接，确认恢复后复位报警',
    };
  }

  return {
    code,
    name: code === '0' ? '无报警' : '未知报警',
    level: code === '0' ? '-' : '待确认',
    device: device.id,
    status: code === '0' ? '无报警' : point.status,
    time: point.updatedAt,
    task: code === '0' ? '-' : getRelatedTaskForDevice(device.id),
    impact: code === '0' ? '无影响' : '需人工确认报警影响',
    suggestion: code === '0' ? '无需处理' : '按报警互锁页流程处理',
  };
}

function getNumericNormalRange(point) {
  if (point.code === 'spindle_load') return '0% - 70%';
  if (point.code === 'spindle_speed') return '0 - 5000 rpm';
  if (point.code === 'feed_rate') return '0 - 2000 mm/min';
  return '按设备工艺参数';
}

function getNumericThreshold(point) {
  if (point.code === 'spindle_load') return '> 85%';
  if (point.code === 'spindle_speed') return '> 4800 rpm';
  if (point.code === 'feed_rate') return '> 1800 mm/min';
  return '按点位配置';
}

function getPointUnit(point) {
  const value = String(point.value ?? '');
  if (value.includes('mm/min')) return 'mm/min';
  if (value.includes('rpm')) return 'rpm';
  if (value.includes('%')) return '%';
  return '无';
}

function isInterlockSatisfied(point) {
  if (point.code === 'door_closed') return point.value === '已关闭';
  if (point.code === 'fixture_locked') return point.value === '已锁紧';
  if (point.code === 'estop') return point.value === '未触发';
  if (point.code === 'in_cnc_work_area') return point.value === '不在加工区' || point.value === '正常';
  return point.status === '正常';
}

function getRelatedTaskForDevice(deviceId) {
  return tasks.find((task) => taskHasDevice(task, deviceId))?.id ?? '无';
}

function getAlarmOverviewStats(alarmRows) {
  return {
    high: alarmRows.filter((alarm) => alarm.level === '高危' && alarm.status !== '已归档').length,
    unhandled: alarmRows.filter((alarm) => alarm.status === '未处理').length,
    processing: alarmRows.filter((alarm) => alarm.status === '处理中').length,
    waitingArchive: alarmRows.filter((alarm) => alarm.status === '已恢复').length,
    archived: alarmRows.filter((alarm) => alarm.status === '已归档').length,
    blockedTasks: new Set(alarmRows.filter((alarm) => alarm.status !== '已归档').map((alarm) => getAlarmHandlingContext(alarm).task).filter((task) => task !== '无')).size,
  };
}

function filterAlarms(alarmRows, filter) {
  if (filter === '当前待办') return alarmRows.filter((alarm) => ['未处理', '处理中', '已恢复'].includes(alarm.status));
  if (filter === '待归档') return alarmRows.filter((alarm) => alarm.status === '已恢复');
  if (filter === '已归档') return alarmRows.filter((alarm) => alarm.status === '已归档');
  if (filter === '高危') return alarmRows.filter((alarm) => alarm.level === '高危' && alarm.status !== '已归档');
  if (filter === '阻塞任务') return alarmRows.filter((alarm) => alarm.status !== '已归档' && getAlarmHandlingContext(alarm).task !== '无');
  if (filter === '全部') return alarmRows;
  return alarmRows.filter((alarm) => alarm.status === filter);
}

function getAlarmUrgencyText(alarmRows) {
  const highRiskAlarm = alarmRows.find((alarm) => alarm.level === '高危' && alarm.status !== '已恢复' && alarm.status !== '已归档');
  if (highRiskAlarm) {
    return `紧急：${alarmRows.filter((alarm) => alarm.level === '高危' && alarm.status !== '已恢复' && alarm.status !== '已归档').length} 条高危报警待处理`;
  }
  const lowRiskRecovered = alarmRows.filter((alarm) => alarm.level === '低危' && alarm.status === '已恢复').length;
  return `当前无高危报警｜${lowRiskRecovered} 条低危报警待归档`;
}

function filterHandlingLogs(rows, filter) {
  if (filter === '全部') return rows;
  return rows.filter((row) => row.logType?.includes(filter) || row.logType === filter);
}

function isRecordRelatedToAlarm(record, alarm) {
  if (!record || !alarm) return false;
  const context = getAlarmHandlingContext(alarm);
  return (
    record.objectId === alarm.device ||
    record.deviceId === alarm.device ||
    record.taskId === context.task ||
    String(record.content ?? '').includes(alarm.name)
  );
}

function getAlarmRelatedDeviceIds(alarm) {
  if (!alarm) return [];
  const context = getAlarmHandlingContext(alarm);
  const task = tasks.find((item) => item.id === context.task);
  const ids = [alarm.device, ...(task?.devices.split(',').map((item) => item.trim()) ?? [])];
  return Array.from(new Set(ids));
}

function getAlarmRelatedLogs(alarm) {
  if (!alarm) return [];
  if (alarm.name === '日志上传失败') {
    return [{ time: '09:06:12', objectId: 'IPC-001', logType: '系统报警', content: '日志上传恢复', status: '已恢复' }];
  }

  const context = getAlarmHandlingContext(alarm);
  const rows = allLogs.filter((row) => {
    const matchesName = row.content === alarm.name || row.content.includes(alarm.name);
    const matchesDevice = row.deviceId === alarm.device || row.objectId === alarm.device;
    const matchesTask = context.task !== '无' && row.taskId === context.task;
    const matchesLogType = row.logType === '报警' || row.logType === '审计' || row.logType === '任务';
    return matchesLogType && (matchesName || matchesDevice || matchesTask);
  });
  return rows.length ? rows : [{ time: alarm.time, objectId: alarm.device, logType: alarm.type, content: alarm.name, status: alarm.status }];
}

function getAlarmHandlingContext(alarm) {
  const relatedLog = allLogs.find((log) => log.content === alarm.name || log.deviceId === alarm.device || log.objectId === alarm.device);
  const relatedTask = alarm.relatedTask || (alarm.name === '日志上传失败' ? '无' : (relatedLog?.taskId || getRelatedTaskForDevice(alarm.device)));
  const latestRecord = relatedLog ? `${relatedLog.time} ${relatedLog.content}` : `${alarm.time} ${alarm.status}`;

  if (alarm.name === '日志上传失败') {
    return {
      impact: '日志上传曾失败，当前已恢复，需确认是否存在待补传日志',
      task: '无',
      suggestion: '检查待补传日志，确认无残留后归档',
      latestRecord: '09:06:12 日志上传恢复',
    };
  }

  if (alarm.name === '设备连接异常') {
    return {
      impact: '设备通信异常，相关任务可能暂停或等待人工确认',
      task: relatedTask === '无' ? 'TASK-004' : relatedTask,
      suggestion: '检查设备连接，通信恢复后记录处理结果',
      latestRecord,
    };
  }

  if (alarm.type === '机器人报警') {
    return {
      impact: `机器人${alarm.robotId ?? alarm.device}异常，可能影响巡检、建图或返航充电`,
      task: relatedTask === '无' ? '无' : relatedTask,
      suggestion: '优先进入机器人监控查看底盘、定位、雷达和急停状态',
      latestRecord,
    };
  }

  if (alarm.type === '机械臂报警' || alarm.type === '末端工具报警') {
    return {
      impact: `${alarm.armId ?? alarm.device} 异常，可能影响上下料、抓取或动作模板执行`,
      task: relatedTask === '无' ? 'TASK-008' : relatedTask,
      suggestion: '进入机械臂控制查看急停、关节状态、末端工具和最近指令回执',
      latestRecord,
    };
  }

  if (alarm.type === '视觉报警') {
    return {
      impact: `${alarm.cameraId ?? alarm.device} 异常，可能影响视觉检测、定位识别或安全区域判断`,
      task: relatedTask === '无' ? 'TASK-009' : relatedTask,
      suggestion: '进入视觉识别查看相机在线、识别任务、模型状态和最近识别结果',
      latestRecord,
    };
  }

  if (alarm.name === '主轴负载过高') {
    return {
      impact: '主轴负载超过阈值，可能影响当前加工稳定性',
      task: relatedTask === '无' ? 'TASK-001' : relatedTask,
      suggestion: '确认切削参数和设备负载，必要时降低进给或暂停任务',
      latestRecord: '09:11:18 主轴负载写入成功',
    };
  }

  return {
    impact: '需确认报警对设备和任务的影响范围',
    task: relatedTask,
    suggestion: '按现场报警处理流程确认并记录处理结果',
    latestRecord,
  };
}

function getAlarmActionsByStatus(status) {
  const actionMap = {
    未处理: ['确认处理', '忽略报警', '派发维修', '查看设备', '查看任务', '查看日志'],
    处理中: ['标记恢复', '忽略报警', '派发维修', '查看设备', '查看任务', '查看日志'],
    已恢复: ['确认归档', '查看设备', '查看日志', '查看任务'],
    已归档: ['查看设备', '查看日志', '查看处理记录'],
  };
  return actionMap[status] ?? ['查看设备', '查看日志', '查看任务'];
}

function getAlarmOperationContext(alarm, context) {
  const task = tasks.find((item) => item.id === context.task);
  const device = devices.find((item) => item.id === alarm.device);
  const relatedIds = getAlarmRelatedDeviceIds(alarm);
  const relatedInterlocks = getInterlockMatrixRows().filter((row) => relatedIds.includes(row.id) || row.affectedTask === context.task);
  const blocker = relatedInterlocks.find((row) => row.overall === '不满足');
  const reason = device?.online === '离线'
    ? `${alarm.device} 离线，无法恢复任务`
    : blocker
      ? blocker.blockReason
      : '';
  return {
    reason,
    precondition: `任务${task?.status ?? '无关联'}｜${reason ? '互锁不满足' : '互锁满足'}`,
  };
}

function isAlarmActionDisabled(label, operation) {
  const guardedActions = ['标记恢复', '确认处理', '派发维修'];
  return Boolean(operation.reason && guardedActions.includes(label));
}

function getAlarmActionResult(label, alarm) {
  const map = {
    确认处理: { status: '处理中', nextStatus: '处理中', content: `已确认${alarm.name}` },
    派发维修: { status: '处理中', nextStatus: '处理中', content: `已派发维修：${alarm.name}` },
    标记恢复: { status: '已恢复', nextStatus: '已恢复', content: `${alarm.name}已标记恢复` },
    忽略报警: { status: '已忽略', nextStatus: '已忽略', content: `${alarm.name}已忽略` },
    确认归档: { status: '已归档', nextStatus: '已归档', content: `${alarm.name}已归档` },
  };
  return map[label] ?? { status: alarm.status, nextStatus: '', content: `${label}：${alarm.name}` };
}

function formatNowTime() {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

function addSecondsToTime(time, seconds) {
  const [hour = '09', minute = '00', second = '00'] = time.split(':');
  const nextSecond = Number(second) + seconds;
  return `${hour}:${minute}:${String(nextSecond).padStart(2, '0')}`;
}

function getInterlockMatrixRows(sourceInterlocks) {
  if (Array.isArray(sourceInterlocks)) {
    const satisfiedStatuses = new Set(['已关闭', '已锁紧', '未触发', '正常', '满足']);
    const pointKeyByName = {
      防护门: 'door',
      夹具状态: 'fixture',
      急停状态: 'estop',
      机器人加工区: 'robotArea',
      机器人安全区: 'robotArea',
    };
    const createPoint = (label) => ({ label, value: '-', ok: true, time: '-' });
    const groups = new Map();

    sourceInterlocks.forEach((item) => {
      const id = item.device ?? item.deviceId ?? 'UNKNOWN';
      if (!groups.has(id)) {
        groups.set(id, {
          id,
          type: id.startsWith('PLC') ? '控制器' : '互锁设备',
          door: createPoint('防护门'),
          fixture: createPoint('夹具状态'),
          estop: createPoint('急停状态'),
          robotArea: createPoint('机器人安全区'),
          updatedAt: item.time ?? item.updatedAt ?? '-',
        });
      }
      const group = groups.get(id);
      const key = pointKeyByName[item.name];
      if (key) {
        group[key] = {
          label: item.name,
          value: item.status,
          ok: satisfiedStatuses.has(item.status),
          time: item.time ?? item.updatedAt ?? '-',
        };
      }
      group.updatedAt = item.time ?? item.updatedAt ?? group.updatedAt;
    });

    return [...groups.values()].map((row) => {
      const points = [row.door, row.fixture, row.estop, row.robotArea].filter((point) => point.value !== '-');
      const failed = points.filter((point) => !point.ok);
      return {
        ...row,
        overall: failed.length ? '不满足' : '满足',
        affectedTask: '-',
        blockReason: failed.length ? failed.map((point) => `${point.label}为${point.value}`).join('；') : '无阻塞',
        suggestion: failed.length ? getInterlockSuggestion(failed) : '当前互锁满足，无需处理',
      };
    });
  }

  return devices
    .map((device) => {
      const points = getDevicePointsFor(device);
      const door = getInterlockPoint(points, 'door_closed');
      const fixture = getInterlockPoint(points, 'fixture_locked');
      const estop = getInterlockPoint(points, 'estop');
      const robotArea = getInterlockPoint(points, 'in_cnc_work_area');
      const interlockPoints = [door, fixture, estop, robotArea].filter((point) => point.value !== '-');
      if (!interlockPoints.length && device.online !== '离线') return null;

      const failed = interlockPoints.filter((point) => !point.ok);
      if (device.online === '离线') {
        failed.push({ label: '设备状态', value: '离线', ok: false, time: device.updatedAt });
      }
      const overall = failed.length ? '不满足' : '满足';
      const relatedTask = getRelatedTaskForDevice(device.id);
      const affectedTask = overall === '不满足' ? (relatedTask === '无' ? '无当前任务' : relatedTask) : '-';
      const updatedAt = getLatestInterlockTime(interlockPoints, device.updatedAt);

      return {
        id: device.id,
        type: device.type,
        door,
        fixture,
        estop,
        robotArea,
        overall,
        affectedTask,
        updatedAt,
        blockReason: failed.length ? failed.map((point) => `${point.label}为${point.value}`).join('；') : '无阻塞',
        suggestion: failed.length ? getInterlockSuggestion(failed) : '当前互锁满足，无需处理',
      };
    })
    .filter(Boolean);
}

function getInterlockPoint(points, code) {
  const labelMap = {
    door_closed: '防护门',
    fixture_locked: '夹具状态',
    estop: '急停状态',
    in_cnc_work_area: '机器人安全区',
  };
  const point = points.find((item) => item.code === code);
  if (!point) return { label: labelMap[code], value: '-', ok: true, time: '-' };
  return {
    label: labelMap[code],
    value: point.value,
    ok: isInterlockSatisfied(point),
    time: point.updatedAt,
  };
}

function getLatestInterlockTime(points, fallback) {
  const times = points.map((point) => point.time).filter((time) => time && time !== '-');
  return times.sort((a, b) => b.localeCompare(a))[0] ?? fallback;
}

function getInterlockSuggestion(failedPoints) {
  const actions = failedPoints.map((point) => {
    if (point.label === '防护门') return '关闭防护门';
    if (point.label === '夹具状态') return '锁紧夹具';
    if (point.label === '急停状态') return '检查急停回路';
    if (point.label === '机器人安全区') return '确认机器人退出加工区';
    if (point.label === '设备状态') return '恢复设备通信';
    return `检查${point.label}`;
  });
  return `${Array.from(new Set(actions)).join('，')}，刷新点位后再执行任务`;
}

function getInterlockShortSummary(row) {
  const shortLabel = (point) => {
    if (!point || point.value === '-') return '-';
    if (point.label === '防护门') return point.ok ? '门关' : '门未关';
    if (point.label === '夹具状态') return point.ok ? '夹具锁' : '夹具未锁';
    if (point.label === '急停状态') return point.ok ? '急停未触发' : '急停触发';
    if (point.label === '机器人安全区') return point.ok ? '不在加工区' : '在加工区';
    return point.value;
  };
  return [row.door, row.fixture, row.estop, row.robotArea].map(shortLabel).filter((item) => item !== '-').join('｜') || '-';
}

function getInterlockRecordContent(row, draft) {
  if (row.overall === '满足') {
    return draft.type === '刷新确认' ? '确认互锁满足，无需处理' : `${draft.type}：确认互锁满足`;
  }
  if (draft.result === '已恢复') return `${row.blockReason}已处理，等待刷新确认`;
  if (draft.result === '需维修') return `${row.blockReason}，需维修跟进`;
  return `${draft.type}：${row.blockReason}`;
}

function getInterlockStats(rows) {
  return {
    total: rows.length,
    satisfied: rows.filter((row) => row.overall === '满足').length,
    unsatisfied: rows.filter((row) => row.overall === '不满足').length,
    blockedTasks: new Set(rows.filter((row) => row.affectedTask !== '-' && row.affectedTask !== '无当前任务').map((row) => row.affectedTask)).size,
  };
}

function filterInterlockRows(rows, filter) {
  if (filter === '不满足') return rows.filter((row) => row.overall === '不满足');
  if (filter === '阻塞任务') return rows.filter((row) => row.affectedTask !== '-' && row.affectedTask !== '无当前任务');
  if (filter === '已满足') return rows.filter((row) => row.overall === '满足');
  return rows;
}

function getRelatedInterlockSummary(rows) {
  if (!rows.length) return '关联互锁：无关联互锁';
  const blocked = rows.find((row) => row.overall === '不满足');
  if (!blocked) return '关联互锁：满足';
  return `关联互锁：不满足｜阻塞原因：${blocked.blockReason}`;
}

function renderInterlockValue(point) {
  if (!point || point.value === '-') return '-';
  return <span className={`interlock-mini ${point.ok ? 'ok' : 'bad'}`}>{point.value}</span>;
}

function formatTrendValue(series) {
  const value = series.values.at(-1);
  if (!series.unit) return value;
  return `${value} ${series.unit}`;
}

function getNumericChartGuides(point, values, timeRange = '近5分钟') {
  if (!point || getPointType(point) !== 'numeric') return [];
  const parsed = parsePointValue(point.value);
  const comparison = getHistoryComparison(point, timeRange);
  const averageValue = parsePointValue(comparison.average).value;
  const thresholdText = getNumericThreshold(point);
  const thresholdValue = parsePointValue(thresholdText.replace(/[><= ]/g, '')).value;
  const normalRange = getNumericNormalRange(point);
  const [normalMinText, normalMaxText] = normalRange.split('-').map((item) => item?.trim());
  const normalMin = parsePointValue(normalMinText).value;
  const normalMax = parsePointValue(normalMaxText).value;
  return [
    Number.isFinite(normalMin) && Number.isFinite(normalMax) ? { type: 'range', label: '正常范围', min: normalMin, max: normalMax } : null,
    Number.isFinite(averageValue) ? { type: 'line', label: comparison.compareLabel, value: averageValue } : null,
    Number.isFinite(thresholdValue) ? { type: 'line', label: '报警阈值', value: thresholdValue } : null,
    { type: 'line', label: '当前值', value: parsed.value, hidden: true },
  ].filter(Boolean);
}

function TrendChart({ device, point, timeRange = '近5分钟', showMini = true }) {
  const seriesList = point ? getTrendSeriesForPoint(point, timeRange) : getTrendSeriesForDevice(device);
  const averageLabel = rangeToCompareLabel(timeRange);
  const chartLeft = 44;
  const chartRight = 414;
  const labelX = 424;
  const chartGuides = getNumericChartGuides(point, seriesList[0]?.values ?? [], timeRange);
  const guideValues = chartGuides.flatMap((guide) => guide.type === 'range' ? [guide.min, guide.max] : [guide.value]);
  const max = Math.max(...seriesList.flatMap((series) => series.values), ...guideValues);
  const min = Math.min(...seriesList.flatMap((series) => series.values), ...guideValues);
  const range = max - min || 1;
  const yForValue = (value) => 126 - ((value - min) / range) * 80;
  const toPoints = (values) =>
    values
      .map((value, index) => {
        const x = chartLeft + index * 29;
        const y = yForValue(value);
        return `${x},${y}`;
      })
      .join(' ');
  const pointPosition = (value, index) => ({
    x: chartLeft + index * 29,
    y: yForValue(value),
  });
  const rightLabels = [];
  chartGuides.forEach((guide) => {
    if (guide.type === 'line' && !guide.hidden) {
      rightLabels.push({
        key: guide.label,
        label: guide.label,
        tone: guide.label.includes('报警') ? 'threshold-line' : 'average-line',
        y: yForValue(guide.value),
      });
    }
  });
  seriesList.forEach((series, seriesIndex) => {
    rightLabels.push({
      key: `${series.name}-current`,
      label: formatTrendValue(series),
      tone: `series-${seriesIndex} current-value-label`,
      y: pointPosition(series.values.at(-1), series.values.length - 1).y,
    });
  });
  const adjustedRightLabels = rightLabels
    .sort((a, b) => a.y - b.y)
    .reduce((labels, label) => {
      const previous = labels.at(-1);
      const y = previous ? Math.max(label.y, previous.y + 12) : label.y;
      labels.push({ ...label, y: Math.min(128, y) });
      return labels;
    }, []);

  return (
    <div className="trend-layout">
      <svg className="trend-chart main-trend" viewBox="0 0 510 150" role="img" aria-label={`${device?.id ?? '设备'}多点位趋势主图`}>
        <path className="axis" d={`M${chartLeft} 126H${chartRight}`} />
        <path className="axis" d={`M${chartLeft} 26V126`} />
        <path className="grid-line" d={`M${chartLeft} 86H${chartRight}`} />
        <path className="grid-line" d={`M${chartLeft} 46H${chartRight}`} />
        {chartGuides.map((guide) => {
          if (guide.type === 'range') {
            const y1 = yForValue(guide.max);
            const y2 = yForValue(guide.min);
            return <rect className="normal-range-band" key={guide.label} x={chartLeft} y={Math.min(y1, y2)} width={chartRight - chartLeft} height={Math.abs(y2 - y1)} />;
          }
          if (guide.hidden) return null;
          return (
            <g className={`reference-line ${guide.label.includes('报警') ? 'threshold-line' : 'average-line'}`} key={guide.label}>
              <line x1={chartLeft} x2={chartRight} y1={yForValue(guide.value)} y2={yForValue(guide.value)} />
            </g>
          );
        })}
        {seriesList.map((series, seriesIndex) => (
          <g className={`trend-series series-${seriesIndex}`} key={series.name}>
            <polyline points={toPoints(series.values)} />
            {series.values.map((value, index) => {
              const { x, y } = pointPosition(value, index);
              return <circle key={`${series.name}-${index}`} cx={x} cy={y} r="3" />;
            })}
          </g>
        ))}
        {adjustedRightLabels.map((label) => (
          <text className={`trend-value-label ${label.tone}`} x={labelX} y={label.y + 4} key={label.key}>
            {label.label}
          </text>
        ))}
        <g className="trend-legend">
          {seriesList.map((series, index) => (
            <g className={`series-${index}`} key={series.name} transform={`translate(${54 + index * 120}, 18)`}>
              <line x1="0" x2="18" y1="0" y2="0" />
              <text x="24" y="4">
                {point ? '当前值' : series.name}
              </text>
            </g>
          ))}
          {point && getPointType(point) === 'numeric' && (
            <>
              <g className="average-line" transform="translate(174, 18)">
                <line x1="0" x2="18" y1="0" y2="0" />
                <text x="24" y="4">{averageLabel}</text>
              </g>
              <g className="threshold-line" transform="translate(314, 18)">
                <line x1="0" x2="18" y1="0" y2="0" />
                <text x="24" y="4">报警阈值</text>
              </g>
            </>
          )}
        </g>
        <text className="trend-time" x="390" y="142">
          09:11:18
        </text>
      </svg>
      {showMini && (
        <div className="mini-trends">
          {seriesList.map((series, index) => (
            <MiniTrend key={series.name} series={series} seriesIndex={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function MiniTrend({ series, seriesIndex }) {
  const maxValue = Math.max(...series.values);
  const minValue = Math.min(...series.values);
  const points = series.values
    .map((value, index) => {
      const x = 10 + index * 13;
      const y = 54 - ((value - minValue) / (maxValue - minValue || 1)) * 36;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="mini-trend-card">
      <div>
        <span>{series.name}</span>
        <strong>{formatTrendValue(series)}</strong>
      </div>
      <svg className={`mini-trend series-${seriesIndex}`} viewBox="0 0 180 64" role="img" aria-label={`${series.name}小趋势`}>
        <path d="M10 56H170" />
        <polyline points={points} />
      </svg>
    </div>
  );
}

function SimpleLogTable({ rows }) {
  return <LogTable rows={rows} simple />;
}

function LogTable({ rows, simple = false }) {
  if (simple) {
    return (
      <DataTable
        stickyHeader
        maxHeight={300}
        minWidth={680}
        columnWidths={[120, 140, 100, 'auto', 100]}
        emptyText="暂无日志记录"
        columns={['时间', '对象', '类型', '内容', '状态']}
        rows={rows.map((row) => [row.time, row.objectId ?? row.deviceId, row.logType, row.content, row.status])}
      />
    );
  }
  return (
    <DataTable
      stickyHeader
      maxHeight={560}
      minWidth={900}
      columnWidths={[130, 160, 110, 'auto', 140, 100]}
      emptyText="暂无日志记录"
      columns={['时间', '设备/对象', '日志类型', '内容/指令名称', '参数', '状态']}
      rows={rows.map((row) => [
        row.time,
        row.objectId ?? row.deviceId,
        row.logType,
        row.content,
        row.params ?? '-',
        <StatusText value={row.status} />,
      ])}
    />
  );
}

function DataTable({
  columns,
  rows = [],
  rowKeys = [],
  selectedKey,
  highlightedKey,
  highlightedKeys = [],
  onRowClick,
  className = '',
  compact = false,
  maxHeight,
  emptyText = '暂无数据',
  stickyHeader = false,
  columnWidths = [],
  minWidth = 620,
  rowClassName,
  loading = false,
  error = null,
  onRetry,
  errorTitle,
  errorMessage,
}) {
  const handleWheel = (event) => {
    const target = event.currentTarget;
    const canScrollX = target.scrollWidth > target.clientWidth;
    if (!event.shiftKey || !canScrollX || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    target.scrollLeft += event.deltaY;
  };

  const wrapClassName = ['table-wrap', className, compact ? 'compact-table' : '', stickyHeader ? 'is-sticky-header' : '']
    .filter(Boolean)
    .join(' ');
  const shouldRenderStatusCell = (column, cell) => {
    if (React.isValidElement(cell) || cell == null || typeof cell !== 'string') return false;
    const value = cell.trim();
    if (!value || value === '-' || value.length > 18) return false;
    return /状态|级别|结果|风险|启用|互锁|回执|下发|校验|在线|运行/.test(String(column));
  };

  return (
    <div
      className={wrapClassName}
      onWheel={handleWheel}
      style={{ maxHeight, '--table-min-width': `${minWidth}px` }}
    >
      <table>
        <thead>
          <tr>
            {columns.map((column, columnIndex) => (
              <th key={column} style={columnWidths[columnIndex] ? { width: columnWidths[columnIndex] } : undefined}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading || error ? (
            <tr className="table-empty-row">
              <td colSpan={columns.length}>
                <DataStateBlock
                  loading={loading}
                  error={error}
                  loadingText="加载中"
                  errorTitle={errorTitle}
                  errorMessage={errorMessage}
                  onRetry={onRetry}
                  compact
                >
                  {null}
                </DataStateBlock>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr className="table-empty-row">
              <td colSpan={columns.length}>
                <EmptyState title={emptyText} compact />
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const key = rowKeys[index] ?? index;
              const extraRowClass = typeof rowClassName === 'function' ? rowClassName(row, index, key) : rowClassName;
              return (
                <tr
                  className={[
                    selectedKey === key ? 'selected' : '',
                    highlightedKey === key || highlightedKeys.includes(key) ? 'row-flash' : '',
                    onRowClick ? 'clickable' : '',
                    extraRowClass || '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={key}
                  onClick={() => onRowClick?.(key)}
                >
                  {row.map((cell, cellIndex) => {
                    const title = typeof cell === 'string' || typeof cell === 'number' ? String(cell) : undefined;
                    const renderedCell = shouldRenderStatusCell(columns[cellIndex], cell) ? <StatusBadge status={cell} size="sm" /> : cell;
                    return <td key={`${key}-${cellIndex}`} title={title}>{renderedCell}</td>;
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusText({ value }) {
  return <StatusBadge status={value} size="sm" className="status-text" />;
}

function getStatusVisualTone(value) {
  const text = String(value ?? '');
  if (['运行中', '执行中', '识别中', '处理中', '下发中', '建图中'].some((status) => text.includes(status))) return 'info';
  if (['待执行', '待回执', '待确认', '排队中', '待处理', '待下发', '暂停'].some((status) => text.includes(status))) return 'warn';
  if (['异常', '失败', '离线', '急停', '超时', '不满足', '未处理'].some((status) => text.includes(status))) return 'bad';
  if (['待机', '已处理', '无', '已归档', '已记录', '-'].includes(text)) return 'neutral';
  if (['正常', '在线', '已完成', '已确认', '已恢复', '成功', '满足', '良好', '启用'].some((status) => text.includes(status))) return 'ok';
  return getStatusTone(value);
}

function Info({ label, value }) {
  const shouldRenderStatusValue =
    !React.isValidElement(value)
    && typeof value === 'string'
    && value.trim()
    && value.trim() !== '-'
    && value.trim().length <= 18
    && /状态|级别|结果|风险|启用|互锁|回执|下发|校验|在线|运行/.test(String(label));

  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{shouldRenderStatusValue ? <StatusBadge status={value} size="sm" /> : value}</strong>
    </div>
  );
}

const logExportColumns = [
  { header: '时间', value: '时间' },
  { header: '对象', value: '对象' },
  { header: '类型', value: '类型' },
  { header: '操作人', value: '操作人' },
  { header: '内容', value: '内容' },
  { header: '状态', value: '状态' },
  { header: '来源', value: '来源' },
  { header: '关联设备', value: '关联设备' },
  { header: '关联任务', value: '关联任务' },
];

const commandReceiptExportColumns = [
  { header: '时间', value: '时间' },
  { header: '设备', value: '设备' },
  { header: '指令编号', value: '指令编号' },
  { header: '指令名称', value: '指令名称' },
  { header: '参数', value: '参数' },
  { header: '下发结果', value: '下发结果' },
  { header: '回执状态', value: '回执状态' },
  { header: '耗时', value: '耗时' },
  { header: '关联任务', value: '关联任务' },
  { header: '失败原因', value: '失败原因' },
  { header: '处理结果', value: '处理结果' },
];

const armActionRecordExportColumns = [
  { header: '时间', value: '时间' },
  { header: '机械臂', value: '机械臂' },
  { header: '动作', value: '动作' },
  { header: '目标点位', value: '目标点位' },
  { header: '结果', value: '结果' },
  { header: '回执状态', value: '回执状态' },
  { header: '关联任务', value: '关联任务' },
  { header: '操作人', value: '操作人' },
];

const armCurrentActionRecordExportColumns = [
  { header: '时间', value: '时间' },
  { header: '动作', value: '动作' },
  { header: '目标点位', value: '目标点位' },
  { header: '结果', value: '结果' },
  { header: '回执状态', value: '回执状态' },
  { header: '关联任务', value: '关联任务' },
  { header: '操作人', value: '操作人' },
];

const alarmExportColumns = [
  { header: '报警名称', value: '报警名称' },
  { header: '关联设备', value: '关联设备' },
  { header: '报警等级', value: '报警等级' },
  { header: '报警状态', value: '报警状态' },
  { header: '触发时间', value: '触发时间' },
  { header: '恢复时间', value: '恢复时间' },
  { header: '处理人', value: '处理人' },
  { header: '处理动作', value: '处理动作' },
  { header: '关联任务', value: '关联任务' },
  { header: '互锁条件', value: '互锁条件' },
  { header: '互锁状态', value: '互锁状态' },
  { header: '处理记录', value: '处理记录' },
];

const pointManagementExportColumns = [
  { header: '设备编号', value: 'deviceId' },
  { header: '设备类型', value: 'deviceType' },
  { header: '点位名称', value: 'name' },
  { header: '点位编码', value: 'code' },
  { header: '点位类型', value: 'pointType' },
  { header: '数据来源', value: 'source' },
  { header: 'Topic/地址', value: 'topic' },
  { header: '单位', value: 'unit' },
  { header: '采样频率', value: 'frequency' },
  { header: '启用状态', value: 'enableStatus' },
  { header: '采集状态', value: 'collectStatus' },
  { header: '更新时间', value: 'updatedAt' },
  { header: '异常原因', value: getPointIssueShortReason },
];

const taskExportColumns = [
  { header: '订单编号', value: '订单编号' },
  { header: '任务编号', value: '任务编号' },
  { header: '任务类型', value: '任务类型' },
  { header: '目标设备', value: '目标设备' },
  { header: '取料工位', value: '取料工位' },
  { header: '放料方案', value: '放料方案' },
  { header: '开门方式', value: '开门方式' },
  { header: '当前步骤', value: '当前步骤' },
  { header: '任务状态', value: '任务状态' },
  { header: '处理状态', value: '处理状态' },
  { header: '机器人编号', value: '机器人编号' },
  { header: '机械臂编号', value: '机械臂编号' },
  { header: '视觉任务', value: '视觉任务' },
  { header: '目标点位', value: '目标点位' },
  { header: '执行模式', value: '执行模式' },
  { header: '关联设备', value: '关联设备' },
  { header: '下发指令', value: '下发指令' },
  { header: '报警数', value: '报警数' },
  { header: '开始时间', value: '开始时间' },
  { header: '更新时间', value: '更新时间' },
  { header: '失败原因', value: '失败原因' },
  { header: '操作记录', value: '操作记录' },
];
function buildLogExportRow(row) {
  return {
    时间: row.time,
    对象: row.objectId ?? row.deviceId ?? '',
    类型: row.logType ?? '',
    操作人: row.operator ?? row.params ?? '',
    内容: row.content ?? '',
    状态: row.status ?? '',
    来源: row.objectType ?? '',
    关联设备: row.deviceId ?? '',
    关联任务: row.taskId ?? '',
  };
}

function buildCommandReceiptExportRow(row, commands) {
  const command = commands.find((item) => item.id === row.commandId);
  return {
    时间: row.time,
    设备: row.deviceId,
    指令编号: row.commandId,
    指令名称: row.commandName,
    参数: row.params,
    下发结果: row.sendResult,
    回执状态: row.receiptStatus,
    耗时: row.duration,
    关联任务: row.relatedTask,
    失败原因: command?.failReason && command.failReason !== '-' ? command.failReason : '',
    处理结果: row.content,
  };
}

function buildAlarmExportRow(alarm, handlingRecords) {
  const context = getAlarmHandlingContext(alarm);
  const deviceInterlocks = getInterlockMatrixRows().filter((row) => getAlarmRelatedDeviceIds(alarm).includes(row.id) || row.affectedTask === context.task);
  const latestRecord = handlingRecords.find((record) => isRecordRelatedToAlarm(record, alarm));
  return {
    报警名称: alarm.name,
    关联设备: alarm.device,
    报警等级: alarm.level,
    报警状态: alarm.status,
    触发时间: alarm.time,
    恢复时间: alarm.status === '已恢复' || alarm.status === '已归档' ? alarm.time : '',
    处理人: latestRecord?.params ?? '',
    处理动作: latestRecord?.content ?? '',
    关联任务: context.task,
    互锁条件: deviceInterlocks.map((row) => row.blockers || row.name).join('；'),
    互锁状态: deviceInterlocks.map((row) => `${row.id}:${row.overall}`).join('；'),
    处理记录: latestRecord?.content ?? context.latestRecord,
  };
}

function buildTaskExportRow(task) {
  const stepDetail = getTaskCurrentStepDetail(task);
  const relatedLogs = stepLogs.filter((row) => row.taskId === task.id);
  return {
    订单编号: task.orderNo ?? task.id,
    任务编号: task.id,
    任务类型: task.taskType ?? '生产任务',
    目标设备: task.targetDevice ?? getTaskPrimaryDevice(task),
    取料工位: task.pickupStation ?? '-',
    放料方案: task.placementPlan ?? '-',
    开门方式: task.doorMode ?? '-',
    当前步骤: stepDetail.stepLabel,
    任务状态: task.status,
    处理状态: task.processStatus ?? '待处理',
    机器人编号: task.robotId ?? '-',
    机械臂编号: task.armId ?? '-',
    视觉任务: task.visionTaskId ?? '-',
    目标点位: task.targetPoint ?? '-',
    执行模式: task.executionMode ?? '-',
    关联设备: task.devices,
    下发指令: stepDetail.command,
    报警数: task.alarmCount,
    开始时间: task.startedAt,
    更新时间: task.updatedAt,
    失败原因: stepDetail.failureReason,
    操作记录: relatedLogs.map((row) => `${row.time} ${row.content}`).join('；'),
  };
}

function getTaskPrimaryDevice(task) {
  return task.targetDevice ?? task.devices?.split(',').map((item) => item.trim()).filter(Boolean)[0] ?? '-';
}

function getTaskRecordCategory(logType) {
  if (['任务', '视觉识别'].includes(logType)) return '任务记录';
  if (['机械臂', '指令'].includes(logType)) return '动作记录';
  if (['报警', '异常'].includes(logType)) return '异常记录';
  if (['审计'].includes(logType)) return '处理记录';
  if (['模型', '参数'].includes(logType)) return '参数修改记录';
  return '调试记录';
}

function getTaskManagementRecordRows(task, logs) {
  const stepDetail = getTaskCurrentStepDetail(task);
  const derivedRows = [
    { time: task.startedAt || '-', category: '任务记录', objectId: task.id, content: `${task.taskType ?? '生产任务'}启动，订单 ${task.orderNo ?? '-'}`, status: task.status },
    { time: task.updatedAt, category: '动作记录', objectId: task.actionPoint ?? task.currentStep, content: stepDetail.command, status: task.status },
    { time: task.updatedAt, category: '处理记录', objectId: task.targetDevice ?? getTaskPrimaryDevice(task), content: task.processStatus ?? '待处理', status: task.processStatus ?? '待处理' },
    { time: task.updatedAt, category: '参数修改记录', objectId: task.taskPlan ?? '任务方案', content: task.reviewRule ?? '按默认复核规则执行', status: '已记录' },
    { time: task.updatedAt, category: '调试记录', objectId: task.visionMark ?? task.visionTaskId ?? task.id, content: task.alarmCount > 0 ? '存在异常，建议人工复核' : '未发现阻塞项', status: task.alarmCount > 0 ? '待确认' : '正常' },
  ];
  const exceptionRows = task.alarmCount > 0
    ? [{ time: task.updatedAt, category: '异常记录', objectId: task.targetDevice ?? getTaskPrimaryDevice(task), content: `${task.alarmCount} 条异常待处理`, status: task.processStatus ?? '异常处理中' }]
    : [];
  return [...derivedRows, ...exceptionRows, ...logs.map((row) => ({
    time: row.time,
    category: getTaskRecordCategory(row.logType),
    objectId: row.objectId ?? row.deviceId,
    content: row.content,
    status: row.status,
  }))];
}
function getDeviceStats(list) {
  return {
    total: list.length,
    online: list.filter((device) => device.online === '在线').length,
    abnormal: list.filter((device) => device.alarmCount > 0).length,
    offline: list.filter((device) => device.online === '离线').length,
    maintenance: list.filter((device) => device.runStatus === '维护中').length,
  };
}

function filterDevices(list, filter) {
  if (filter === '异常') return list.filter((device) => device.alarmCount > 0);
  if (filter === '离线') return list.filter((device) => device.online === '离线');
  if (filter === '运行中') return list.filter((device) => device.runStatus === '运行中');
  if (filter === '维护') return list.filter((device) => device.runStatus === '维护中');
  return list;
}

function filterDeviceRows(list, query, scope) {
  const text = query.trim().toLowerCase();
  return list.filter((device) => {
    const matchesQuery =
      !text || [device.id, device.type, device.online, device.runStatus].some((value) => value.toLowerCase().includes(text));
    const matchesScope =
      scope === '全部' ||
      device.type === scope ||
      device.online === scope ||
      device.runStatus === scope ||
      (scope === '异常' && device.alarmCount > 0);
    return matchesQuery && matchesScope;
  });
}

function filterTasks(list, query, scope) {
  const text = query.trim().toLowerCase();
  return list.filter((task) => {
    const matchesQuery =
      !text || [task.id, task.orderNo, task.taskType, task.targetDevice, task.pickupStation, task.placementPlan, task.doorMode, task.processStatus, task.robotId, task.armId, task.visionTaskId, task.targetMap, task.targetRoute, task.targetPoint, task.executionMode, task.status, task.step, task.devices, task.command].some((value) => String(value ?? '').toLowerCase().includes(text));
    const matchesScope = scope === '全部' || task.status === scope || task.taskType === scope || task.processStatus === scope || (scope === '有报警' && task.alarmCount > 0);
    return matchesQuery && matchesScope;
  });
}
function getTaskStats(list) {
  return {
    total: list.length,
    running: list.filter((task) => task.status === '运行中').length,
    queued: list.filter((task) => task.status === '排队中').length,
    paused: list.filter((task) => task.status === '暂停').length,
    failed: list.filter((task) => task.status === '失败').length,
    alarmTasks: list.filter((task) => task.alarmCount > 0).length,
  };
}

function getTaskProgressSummary(task) {
  const { current, total } = parseTaskProgress(task.step);
  if (!total) return toChineseStep(task.currentStep);
  return `第 ${current} / ${total} 步`;
}

function getTaskWorkbenchActions(status, alarmCount) {
  if (status === '运行中') return ['暂停', '中止', '查看日志', '查看设备', '查看报警'];
  if (status === '暂停') return ['继续执行', '中止', '查看日志'];
  if (status === '失败') return ['重新下发', '查看日志', '查看报警', '标记已处理'];
  const actions = ['查看日志', '查看设备'];
  if (alarmCount > 0) actions.push('查看报警');
  return actions;
}

function getTaskWorkbenchActionPermission(action) {
  if (action === '暂停') return 'task-pause';
  if (action === '标记已处理') return 'record-handle';
  return 'task-control';
}

function filterLogs(rows, type, query) {
  return rows.filter((row) => {
    const typeMatched = type === '全部' || row.logType === type;
    const queryMatched = !query || Object.values(row).join(' ').includes(query);
    return typeMatched && queryMatched;
  });
}

function getInterlockCheck() {
  const required = {
    防护门: '已关闭',
    夹具状态: '已锁紧',
    急停状态: '未触发',
    机器人加工区: '正常',
  };
  const failed = interlocks.find((item) => required[item.name] && item.status !== required[item.name]);
  if (!failed) return { ok: true, reason: '' };
  return { ok: false, reason: `${failed.name}为${failed.status}` };
}

function getDefaultUsername(role) {
  if (role === '工程师') return 'engineer01';
  if (role === '管理员') return 'admin';
  return 'operator01';
}

function getAvatarLetter(role, username, avatar) {
  if (avatar === '管理员头像' || role === '管理员') return 'M';
  if (avatar === '工程师头像' || role === '工程师') return 'E';
  if (avatar === '操作员头像' || role === '操作员') return 'O';
  return String(username || 'U').slice(0, 1).toUpperCase();
}

function getRoleLevel(user) {
  return getPermissionRoleLevel(user);
}

function hasPermission(user, permission) {
  const mappedPermission = {
    view: PERMISSIONS.VIEW,
    'alarm-handle': PERMISSIONS.ALARM_HANDLE,
    'task-pause': PERMISSIONS.TASK_PAUSE,
    'interlock-refresh': PERMISSIONS.INTERLOCK_REFRESH,
    'record-handle': PERMISSIONS.RECORD_HANDLE,
    'command-send': PERMISSIONS.COMMAND_RETRY,
    'device-debug': PERMISSIONS.TASK_ACTION,
    'task-control': PERMISSIONS.TASK_ACTION,
    'system-config': PERMISSIONS.SETTINGS_EDIT,
    export: PERMISSIONS.EXPORT_DATA,
  }[permission] ?? permission;
  return can(user, mappedPermission);
}

function getTaskActionPermission(action) {
  if (action === '暂停') return 'task-pause';
  if (['查看详情', '查看日志'].includes(action)) return 'view';
  return 'task-control';
}

function getAlarmActionPermission(label) {
  if (['查看任务', '查看日志', '查看处理记录'].includes(label)) return 'view';
  return 'alarm-handle';
}

function getPermissionReason(user, action) {
  return permissionReason(user, action);
}

function getPermissionScope(role) {
  if (role === '管理员') return '查看、报警处理、任务控制、指令下发、设备调试、系统配置';
  if (role === '工程师') return '查看、报警处理、任务控制、指令下发、设备调试';
  if (role === '操作员') return '查看、报警处理、任务暂停、刷新互锁、查看日志';
  return '仅查看';
}

function getTaskActionConfig(status) {
  const config = {
    排队中: ['开始'],
    运行中: ['暂停', '中止'],
    暂停: ['恢复', '中止'],
    失败: ['重试'],
    已完成: [],
    已中止: ['重新运行'],
  };
  return { actions: config[status] ?? [] };
}

const defaultProcessStepNames = ['等待上料', '机器人搬运', '夹具锁紧', '启动加工', '加工监控', '下料完成', '质量确认', '任务归档'];

function getTaskActionOverride(task, action, nextStatus) {
  const steps = buildTaskProcessSteps(task);
  const firstStep = steps[0];
  const { current, total } = parseTaskProgress(task.step);
  const totalSteps = Math.max(total, steps.length);

  if (['开始', '恢复'].includes(action)) {
    const nextStepNumber = Math.max(current, 1);
    const currentStep = steps[nextStepNumber - 1] ?? firstStep;
    return {
      status: nextStatus,
      step: `${nextStepNumber}/${totalSteps || 1}`,
      currentStep: currentStep?.id ?? 'STEP-001',
      command: currentStep?.name ?? '等待上料',
      startedAt: task.startedAt === '-' ? formatNowTime() : task.startedAt,
    };
  }

  if (['重试', '重新运行'].includes(action)) {
    return {
      status: nextStatus,
      step: `0/${totalSteps || 1}`,
      currentStep: 'STEP-000',
      command: '等待开始',
    };
  }

  return { status: nextStatus };
}

function parseTaskProgress(stepText) {
  const [currentText, totalText] = String(stepText ?? '0/0').split('/');
  const current = Number(currentText);
  const total = Number(totalText);
  return {
    current: Number.isFinite(current) ? current : 0,
    total: Number.isFinite(total) ? total : 0,
  };
}

function buildTaskProcessSteps(task) {
  const configuredSteps = stepsByTask[task.id] ?? [];
  if (!configuredSteps.length) return [];

  const { current, total } = parseTaskProgress(task.step);
  const stepCount = Math.max(configuredSteps.length, total);
  return Array.from({ length: stepCount }, (_, index) => {
    const stepNumber = index + 1;
    const configuredStep = configuredSteps[index];
    const fallbackStep = {
      id: `STEP-${String(stepNumber).padStart(3, '0')}`,
      name: defaultProcessStepNames[index] ?? `工序 ${stepNumber}`,
    };
    const name = configuredStep?.name && configuredStep.name !== '等待执行' ? configuredStep.name : fallbackStep.name;
    return { ...fallbackStep, ...configuredStep, name };
  });
}

function getTaskStepPreview(task) {
  const steps = buildTaskProcessSteps(task);
  if (!steps.length) return [];

  const { current } = parseTaskProgress(task.step);
  const effectiveCurrent = getEffectiveCurrentStepNumber(task.status, current);
  return steps.map((step, index) => {
    const stepNumber = index + 1;
    const displayStatus = getTaskStepDisplayStatus(task.status, effectiveCurrent, stepNumber, step.status);
    return {
      ...step,
      displayStatus,
      isCurrent: ['运行中', '暂停', '失败'].includes(task.status) && effectiveCurrent === stepNumber,
    };
  });
}

function getEffectiveCurrentStepNumber(taskStatus, currentStepNumber) {
  if (['运行中', '暂停', '失败'].includes(taskStatus)) {
    return Math.max(currentStepNumber, 1);
  }
  return currentStepNumber;
}

function getTaskStepDisplayStatus(taskStatus, currentStepNumber, stepNumber, configuredStatus) {
  if (taskStatus === '运行中') {
    if (stepNumber < currentStepNumber) return '已完成';
    if (stepNumber === currentStepNumber) return '执行中';
    return '待执行';
  }

  if (taskStatus === '排队中') {
    return stepNumber === 1 ? '等待开始' : '待执行';
  }

  if (taskStatus === '暂停') {
    if (stepNumber < currentStepNumber) return '已完成';
    if (stepNumber === currentStepNumber) return '暂停中';
    return '待执行';
  }

  if (taskStatus === '失败') {
    if (stepNumber < currentStepNumber) return '已完成';
    if (stepNumber === currentStepNumber) return '失败';
    return '未执行';
  }

  if (taskStatus === '已完成') return '已完成';

  if (taskStatus === '已中止') {
    if (currentStepNumber > 0 && stepNumber < currentStepNumber) return '已完成';
    return '已跳过';
  }

  return configuredStatus ?? '待执行';
}

function getTaskCurrentStepDetail(task) {
  const steps = getTaskStepPreview(task);
  const { current } = parseTaskProgress(task.step);
  const effectiveCurrent = getEffectiveCurrentStepNumber(task.status, current);
  const selectedStep = steps.find((step) => step.isCurrent) ?? steps[effectiveCurrent > 0 ? effectiveCurrent - 1 : 0];
  const command = !task.command || task.command === '等待执行' ? selectedStep?.name : task.command;

  return {
    stepLabel: selectedStep ? toChineseStep(selectedStep.id) : toChineseStep(task.currentStep),
    command: command || '-',
    dispatchStatus: task.status === '排队中' ? '待下发' : '已下发',
    receiptStatus: task.status === '排队中' ? '待确认' : '已确认',
    failureReason: task.status === '失败' ? '设备离线，回执超时' : '无',
  };
}

function getActionIcon(action) {
  if (action === '开始') return <Play size={15} />;
  if (action === '暂停') return <Pause size={15} />;
  if (action === '恢复' || action === '重试' || action === '重新运行') return <RotateCcw size={15} />;
  if (action === '中止') return <Square size={15} />;
  return null;
}

function toChineseStep(stepId) {
  const number = Number(String(stepId).split('-')[1]);
  return Number.isFinite(number) ? `第 ${number} 步` : stepId;
}

export {
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
  DataStateBlock,
  LoadingState,
  ErrorState,
  EmptyState,
  PageErrorBoundary,
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
};
