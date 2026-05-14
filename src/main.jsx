import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Cpu,
  Database,
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
import './styles.css';
import {
  alarms,
  auditLogs,
  commandLogs,
  deviceAttachments,
  devicePoints,
  devices,
  interlocks,
  navItems,
  settings,
  stepLogs,
  stepsByTask,
  taskAttachments,
  taskPoints,
  tasks,
  telemetryLogs,
  trendSeries,
} from './mockData';

const iconMap = {
  overview: Gauge,
  devices: Cpu,
  tasks: ClipboardList,
  commands: TerminalSquare,
  alarms: ShieldCheck,
  logs: History,
  settings: Settings,
};

const pageTitle = {
  overview: '总览',
  devices: '设备与点位',
  tasks: '任务执行',
  commands: '指令回执',
  alarms: '报警互锁',
  logs: '日志审计',
  settings: '系统设置',
};

const allLogs = [
  ...commandLogs,
  ...telemetryLogs,
  ...auditLogs,
  ...stepLogs,
].sort((a, b) => b.time.localeCompare(a.time));

function App() {
  const [page, setPage] = useState('overview');
  const [selectedTaskId, setSelectedTaskId] = useState('TASK-001');
  const [selectedDeviceId, setSelectedDeviceId] = useState('CNC-001');
  const [logFilter, setLogFilter] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState('全部');
  const [taskStatusOverrides, setTaskStatusOverrides] = useState({});

  const taskList = useMemo(
    () => tasks.map((task) => ({ ...task, status: taskStatusOverrides[task.id] ?? task.status })),
    [taskStatusOverrides]
  );
  const selectedTask = taskList.find((task) => task.id === selectedTaskId) ?? taskList[0];
  const selectedDevice = devices.find((device) => device.id === selectedDeviceId) ?? devices[0];

  const openTaskDetail = () => setPage('tasks');
  const openTaskLogs = () => {
    setLogFilter(selectedTask.id);
    setLogTypeFilter('全部');
    setPage('logs');
  };
  const openDevice = (deviceId) => {
    setSelectedDeviceId(deviceId);
    setPage('devices');
  };
  const handleTaskAction = (task, action) => {
    const nextStatus = {
      开始: '运行中',
      暂停: '暂停',
      恢复: '运行中',
      中止: '已中止',
      重试: '排队中',
    }[action];

    if (nextStatus) {
      setTaskStatusOverrides((statuses) => ({ ...statuses, [task.id]: nextStatus }));
    }
  };

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <main className={`main ${page === 'overview' ? 'overview-main' : ''}`}>
        <TopBar title={pageTitle[page]} />
        {page === 'overview' && (
          <OverviewPage
            selectedTask={selectedTask}
            taskList={taskList}
            selectedTaskId={selectedTaskId}
            setSelectedTaskId={setSelectedTaskId}
            onTaskAction={handleTaskAction}
            openTaskDetail={openTaskDetail}
            openTaskLogs={openTaskLogs}
            openDevice={openDevice}
            setPage={setPage}
            setLogFilter={setLogFilter}
            setLogTypeFilter={setLogTypeFilter}
            setSelectedDeviceId={setSelectedDeviceId}
          />
        )}
        {page === 'devices' && (
          <DevicesPage
            selectedDevice={selectedDevice}
            selectedDeviceId={selectedDeviceId}
            setSelectedDeviceId={setSelectedDeviceId}
          />
        )}
        {page === 'tasks' && (
          <TasksPage
            selectedTask={selectedTask}
            taskList={taskList}
            selectedTaskId={selectedTaskId}
            setSelectedTaskId={setSelectedTaskId}
            onTaskAction={handleTaskAction}
            openTaskLogs={openTaskLogs}
          />
        )}
        {page === 'commands' && <CommandsPage />}
        {page === 'alarms' && <AlarmsPage />}
        {page === 'logs' && (
          <LogsPage
            filter={logFilter}
            setFilter={setLogFilter}
            typeFilter={logTypeFilter}
            setTypeFilter={setLogTypeFilter}
          />
        )}
        {page === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}

function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">AI</div>
        <div>
          <div className="brand-title">工业智能体数据平台</div>
          <div className="brand-subtitle">现场执行端</div>
        </div>
      </div>
      <nav className="nav">
        {navItems.map((item) => {
          const Icon = iconMap[item.key];
          return (
            <button
              key={item.key}
              className={`nav-item ${page === item.key ? 'active' : ''}`}
              onClick={() => setPage(item.key)}
              type="button"
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function TopBar({ title }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>工业智能体数据平台 · 现场执行端</p>
      </div>
      <div className="link-status">
        <StatusBadge label="工位" status="WS-001" tone="neutral" />
        <StatusBadge label="公共机" status="IPC-001" tone="neutral" />
        <StatusBadge label="后台" status="正常" />
        <StatusBadge label="MQTT" status="正常" />
        <StatusBadge label="日志上传" status="正常" />
        <StatusBadge label="本地缓存" status="7 天" tone="neutral" />
        <span className="time">2025-05-27 10:30:45</span>
      </div>
    </header>
  );
}

function StatusBadge({ label, status, tone = 'ok' }) {
  return (
    <span className={`status-badge ${tone}`}>
      <span>{label}</span>
      <strong>{status}</strong>
    </span>
  );
}

function OverviewPage({
  selectedTask,
  taskList,
  selectedTaskId,
  setSelectedTaskId,
  onTaskAction,
  openTaskDetail,
  openTaskLogs,
  openDevice,
  setPage,
  setLogFilter,
  setLogTypeFilter,
  setSelectedDeviceId,
}) {
  const jumpFromAlarm = (alarm) => {
    if (alarm.jumpTarget === 'logs') {
      setLogFilter(alarm.name);
      setLogTypeFilter('报警');
      setPage('logs');
      return;
    }
    if (alarm.jumpTarget === 'devices') {
      setSelectedDeviceId(alarm.device);
      setPage('devices');
      return;
    }
    setPage('alarms');
  };

  return (
    <div className="page-grid overview-grid">
      <AlarmPriorityBar selectedTask={selectedTask} setPage={setPage} />

      <section className="panel device-panel">
        <SectionTitle icon={Cpu} title="设备状态总览" />
        <DeviceOverviewModule onSelect={openDevice} />
      </section>

      <section className="panel task-panel">
        <SectionTitle icon={ClipboardList} title="任务执行总览" />
        <TaskOverviewModule
          taskList={taskList}
          selectedTask={selectedTask}
          selectedTaskId={selectedTaskId}
          setSelectedTaskId={setSelectedTaskId}
          onTaskAction={onTaskAction}
          onDetail={openTaskDetail}
          onLogs={openTaskLogs}
        />
      </section>

      <section className="panel alarm-detail-panel">
        <SectionTitle icon={AlertTriangle} title="报警与互锁" />
        <AlarmInterlockDetail onAlarmJump={jumpFromAlarm} />
      </section>

      <section className="panel logs-panel">
        <SectionTitle icon={FileClock} title="最近日志" />
        <RecentLogs selectedTaskId={selectedTaskId} setLogFilter={setLogFilter} setLogTypeFilter={setLogTypeFilter} />
      </section>
    </div>
  );
}

function AlarmPriorityBar({ selectedTask, setPage }) {
  const highRiskCount = alarms.filter((alarm) => alarm.level === '高危' && alarm.status !== '已恢复').length;
  const untreatedCount = alarms.filter((alarm) => alarm.status === '未处理').length;
  const highRiskAlarm = alarms.find((alarm) => alarm.level === '高危');
  const affectedDevice = highRiskAlarm?.device ?? '-';
  const affectedTask = selectedTask?.devices?.includes(affectedDevice)
    ? selectedTask.id
    : tasks.find((task) => task.devices.includes(affectedDevice))?.id ?? '-';
  const summary =
    highRiskCount > 0
      ? `高危报警 ${highRiskCount}｜未处理报警 ${untreatedCount}｜影响设备 ${affectedDevice}｜影响任务 ${affectedTask}`
      : `当前无高危报警｜未处理一般报警 ${untreatedCount}`;

  return (
    <section className="panel alarm-strip-panel">
      <div className="alarm-strip">
        <AlertTriangle size={18} />
        <strong>{summary}</strong>
        <button type="button" onClick={() => setPage('alarms')}>
          查看处理
        </button>
      </div>
    </section>
  );
}

function DeviceOverviewModule({ onSelect }) {
  const [filter, setFilter] = useState('全部');
  const stats = useMemo(() => getDeviceStats(devices), []);
  const filteredDevices = useMemo(() => filterDevices(devices, filter), [filter]);

  return (
    <div className="module-content">
      <SummaryStrip
        items={[
          { label: '总设备', value: stats.total },
          { label: '在线', value: stats.online, tone: 'ok' },
          { label: '异常', value: stats.abnormal, tone: 'bad' },
          { label: '离线', value: stats.offline, tone: 'bad' },
          { label: '维护', value: stats.maintenance, tone: 'warn' },
        ]}
      />
      <SegmentedFilter
        options={['全部', '异常', '离线', '运行中', '维护']}
        value={filter}
        onChange={setFilter}
      />
      <DeviceTable devicesForTable={filteredDevices} compact onSelect={onSelect} />
    </div>
  );
}

function TaskOverviewModule({
  taskList,
  selectedTask,
  selectedTaskId,
  setSelectedTaskId,
  onTaskAction,
  onDetail,
  onLogs,
}) {
  const stats = useMemo(() => getTaskStats(taskList), [taskList]);

  return (
    <div className="module-content">
      <SummaryStrip
        items={[
          { label: '总任务', value: stats.total },
          { label: '运行中', value: stats.running, tone: 'ok' },
          { label: '排队中', value: stats.queued, tone: 'warn' },
          { label: '暂停', value: stats.paused, tone: 'warn' },
          { label: '失败', value: stats.failed, tone: 'bad' },
        ]}
      />
      <div className="task-current-summary">
        当前任务：<strong>{selectedTask.id}</strong>｜{selectedTask.status}｜Step {selectedTask.step}｜关联设备 {selectedTask.devices}
      </div>
      <div className="task-overview-layout">
        <TaskQueue taskList={taskList} selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} />
        <CurrentTaskCard task={selectedTask} onTaskAction={onTaskAction} onDetail={onDetail} onLogs={onLogs} />
        <PointTable points={taskPoints[selectedTask.id] ?? []} title="当前任务关联点位" />
      </div>
    </div>
  );
}

function AlarmInterlockDetail({ onAlarmJump }) {
  return (
    <div className="alarm-detail-grid">
      <div>
        <h3>当前报警</h3>
        <DataTable
          columns={['报警名称', '设备', '等级', '状态', '时间']}
          rows={alarms.map((alarm) => [
            alarm.name,
            alarm.device,
            alarm.level,
            <StatusText value={alarm.status} />,
            alarm.time,
          ])}
          rowKeys={alarms.map((alarm) => alarm.name)}
          onRowClick={(key) => onAlarmJump?.(alarms.find((alarm) => alarm.name === key))}
        />
      </div>
      <div>
        <h3>当前任务互锁条件</h3>
        <DataTable
          columns={['条件名称', '设备', '状态', '更新时间']}
          rows={interlocks.map((item) => [item.name, item.device, <StatusText value={item.status} />, item.time])}
        />
      </div>
    </div>
  );
}

function DevicesPage({ selectedDevice, selectedDeviceId, setSelectedDeviceId }) {
  const points = devicePoints[selectedDeviceId] ?? [];
  const [selectedPointCode, setSelectedPointCode] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState(null);

  useEffect(() => {
    setSelectedPointCode(points[0]?.code ?? '');
  }, [selectedDeviceId, points]);

  const selectedPoint = points.find((point) => point.code === selectedPointCode) ?? points[0];

  return (
    <div className="page-grid devices-grid">
      <section className="panel device-list-panel">
        <SectionTitle icon={Cpu} title="设备列表" />
        <div className="compact-device-list">
          {devices.map((device) => (
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
                <span>{device.type}</span>
                <StatusText value={device.online} />
                <StatusText value={device.runStatus} />
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="panel trend-panel">
        <SectionTitle icon={Activity} title="趋势" action="最近 30 秒" />
        <TrendChart device={selectedDevice} />
      </section>
      <section className="panel point-table-panel">
        <SectionTitle icon={Database} title={`${selectedDevice.id} 点位表`} action={`${points.length} 个点位`} />
        <PointTable points={points} selectedPointCode={selectedPoint?.code} onSelectPoint={setSelectedPointCode} />
      </section>
      <section className="panel detail-panel">
        <SectionTitle icon={Search} title="点位详情" action={selectedPoint?.name ?? '-'} />
        <div className="detail-list">
          <Info label="当前值" value={selectedPoint?.value ?? '-'} />
          <Info label="状态" value={selectedPoint?.status ?? '-'} />
          <Info label="正常范围" value={selectedPoint?.code === 'spindle_load' ? '0% - 70%' : '按设备工艺参数'} />
          <Info label="报警阈值" value={selectedPoint?.code === 'spindle_load' ? '> 85%' : '按点位配置'} />
          <Info label="Topic" value={`factory/ws001/${selectedDevice.id}/telemetry`} />
          <Info label="最近异常" value={selectedPoint?.status === '异常' ? `${selectedPoint.name}异常` : `${selectedPoint?.name ?? '点位'}无未处理异常`} />
          <Info label="数据来源" value="MQTT" />
        </div>
      </section>
      <section className="panel attachment-panel">
        <SectionTitle icon={FileClock} title="设备附件" action={selectedDevice.id} />
        <AttachmentList items={deviceAttachments[selectedDevice.id] ?? []} onPreview={setPreviewAttachment} />
      </section>
      <section className="panel collect-log-panel">
        <SectionTitle icon={FileClock} title="采集日志" />
        <SimpleLogTable rows={telemetryLogs} />
      </section>
      {previewAttachment && <AttachmentPreview attachment={previewAttachment} onClose={() => setPreviewAttachment(null)} />}
    </div>
  );
}

function TasksPage({ selectedTask, taskList, selectedTaskId, setSelectedTaskId, onTaskAction, openTaskLogs }) {
  const [previewAttachment, setPreviewAttachment] = useState(null);
  return (
    <div className="page-grid tasks-grid">
      <section className="panel">
        <SectionTitle icon={ClipboardList} title="任务队列" />
        <TaskQueue taskList={taskList} selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} />
      </section>
      <section className="panel task-step-panel">
        <SectionTitle icon={MonitorCog} title="步骤执行" />
        <div className="task-step-layout">
          <StepList taskId={selectedTask.id} />
          <div className="step-detail-compact">
            <TaskActions task={selectedTask} onTaskAction={onTaskAction} onLogs={openTaskLogs} />
            <div className="detail-list">
              <Info label="当前步骤" value={toChineseStep(selectedTask.currentStep)} />
              <Info label="当前指令" value={selectedTask.command} />
              <Info label="下发状态" value="已下发" />
              <Info label="回执状态" value="已确认" />
              <Info label="失败原因" value={selectedTask.status === '失败' ? '设备离线，回执超时' : '无'} />
              <Info label="操作对象" value={`当前任务 ${selectedTask.id}`} />
            </div>
            <AttachmentList compact title="当前任务附件" items={taskAttachments[selectedTask.id] ?? []} onPreview={setPreviewAttachment} />
          </div>
        </div>
      </section>
      <section className="panel wide">
        <SectionTitle icon={History} title="操作记录" />
        <SimpleLogTable rows={stepLogs.filter((row) => row.taskId === selectedTask.id || !row.taskId)} />
      </section>
      {previewAttachment && <AttachmentPreview attachment={previewAttachment} onClose={() => setPreviewAttachment(null)} />}
    </div>
  );
}

function CommandsPage() {
  return (
    <section className="panel page-full">
      <SectionTitle icon={TerminalSquare} title="指令下发与回执" />
      <DataTable
        columns={['时间', '设备', '指令名称', '参数', '下发结果', '回执状态']}
        rows={commandLogs.map((row) => [row.time, row.deviceId, row.content, row.params, row.result, row.status])}
      />
    </section>
  );
}

function AlarmsPage() {
  return (
    <div className="page-grid alarms-grid">
      <section className="panel">
        <SectionTitle icon={AlertTriangle} title="报警列表" />
        <DataTable
          columns={['报警名称', '设备', '类型', '等级', '状态', '更新时间']}
          rows={alarms.map((row) => [row.name, row.device, row.type, row.level, <StatusText value={row.status} />, row.time])}
        />
      </section>
      <section className="panel">
        <SectionTitle icon={ShieldCheck} title="互锁条件" />
        <InterlockTable />
      </section>
      <section className="panel wide">
        <SectionTitle icon={History} title="处理记录" />
        <SimpleLogTable rows={allLogs.filter((row) => row.logType === '报警' || row.logType === '审计')} />
      </section>
    </div>
  );
}

function LogsPage({ filter, setFilter, typeFilter, setTypeFilter }) {
  const filtered = filterLogs(allLogs, typeFilter, filter);
  return (
    <section className="panel page-full">
      <SectionTitle icon={History} title="日志审计" />
      <SegmentedFilter options={['全部', '指令', '报警', '任务', '审计', '设备']} value={typeFilter} onChange={setTypeFilter} />
      <div className="filterbar">
        <Search size={17} />
        <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="输入任务、设备、状态筛选" />
        {filter && (
          <button type="button" onClick={() => setFilter('')}>
            清除
          </button>
        )}
      </div>
      <LogTable rows={filtered} />
    </section>
  );
}

function SettingsPage() {
  const [connectionStatus, setConnectionStatus] = useState({});
  const [settingsModal, setSettingsModal] = useState(null);
  const linkRows = [
    { key: 'backend', label: '后台地址', value: 'https://platform.local', status: connectionStatus.backend ?? '正常', action: '测试连接' },
    { key: 'mqtt', label: 'MQTT Broker', value: 'mqtt://10.10.1.20:1883', status: connectionStatus.mqtt ?? '正常', action: '测试连接' },
    { key: 'upload', label: '日志上传', value: '开启', status: connectionStatus.upload ?? '正常', action: '查看队列' },
    { key: 'cache', label: '本地缓存', value: '7 天', status: connectionStatus.cache ?? '正常', action: '清理缓存' },
  ];

  const runSettingAction = (row) => {
    if (row.action === '测试连接') {
      setConnectionStatus((current) => ({ ...current, [row.key]: '检测中' }));
      window.setTimeout(() => {
        setConnectionStatus((current) => ({ ...current, [row.key]: '正常' }));
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
            { label: '当前用户', value: 'admin', desc: '现场端登录用户' },
            { label: '本地缓存周期', value: '7 天', desc: '断网缓存保留周期' },
          ]).map((item) => (
            <div className="setting-item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.desc}</small>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <SectionTitle icon={TerminalSquare} title="链路配置" />
        <DataTable
          columns={['配置项', '当前值', '状态', '操作']}
          rows={linkRows.map((row) => [
            row.label,
            row.value,
            <StatusText value={row.status} />,
            <button className="table-action" type="button" onClick={() => runSettingAction(row)}>
              {row.action}
            </button>,
          ])}
        />
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

function SectionTitle({ icon: Icon, title, action }) {
  const [collapsed, setCollapsed] = useState(false);
  const togglePanel = (event) => {
    const nextCollapsed = !collapsed;
    setCollapsed(nextCollapsed);
    const panel = event.currentTarget.closest('.panel');
    if (panel) {
      panel.dataset.collapsed = String(nextCollapsed);
    }
  };

  return (
    <div className="section-title">
      <div>
        <Icon size={18} />
        <h2>{title}</h2>
      </div>
      <div className="section-actions">
        {action && <span>{action}</span>}
        <button type="button" onClick={togglePanel} aria-label={collapsed ? '展开卡片' : '收起卡片'}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </div>
  );
}

function SummaryStrip({ items }) {
  return (
    <div className="summary-strip">
      {items.map((item) => (
        <div className={`summary-item ${item.tone ?? ''}`} key={item.label}>
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
      columns={['任务编号', '状态', '步骤', '关联设备', '报警', '更新时间']}
      rows={taskList.map((task) => [
        task.id,
        <StatusText value={task.status} />,
        task.step,
        task.devices,
        task.alarmCount,
        task.updatedAt,
      ])}
      rowKeys={taskList.map((task) => task.id)}
      selectedKey={selectedTaskId}
      onRowClick={setSelectedTaskId}
    />
  );
}

function CurrentTaskCard({ task, onTaskAction, onDetail, onLogs }) {
  return (
    <div className="current-task">
      <div className="current-task-head">
        <span>当前任务</span>
        <strong>{task.id}</strong>
      </div>
      <div className="detail-list dense">
        <Info label="状态" value={task.status} />
        <Info label="当前步骤" value={toChineseStep(task.currentStep)} />
        <Info label="关联设备" value={task.devices} />
        <Info label="当前指令" value={task.command} />
        <Info label="下发状态" value="已下发" />
        <Info label="回执状态" value="已确认" />
        <Info label="开始时间" value={task.startedAt} />
      </div>
      <TaskActions task={task} onTaskAction={onTaskAction} onDetail={onDetail} onLogs={onLogs} />
    </div>
  );
}

function TaskActions({ task, onTaskAction, onDetail, onLogs }) {
  const [confirmAbort, setConfirmAbort] = useState(false);
  const interlockCheck = getInterlockCheck();
  const config = getTaskActionConfig(task.status);
  const runAction = (action) => onTaskAction?.(task, action);
  const visibleActions = config.actions;

  const confirmAbortTask = () => {
    runAction('中止');
    setConfirmAbort(false);
  };

  return (
    <div className="action-area">
      <div>对当前任务 {task.id} 操作</div>
      <div className="button-row">
        {visibleActions.map((action) => {
          const needsInterlock = ['开始', '恢复'].includes(action);
          const disabled = needsInterlock && !interlockCheck.ok;
          return (
            <button
              className={action === '中止' ? 'danger' : ''}
              disabled={disabled}
              key={action}
              onClick={() => (action === '中止' ? setConfirmAbort(true) : runAction(action))}
              type="button"
              title={disabled ? interlockCheck.reason : undefined}
            >
              {getActionIcon(action)}
              {action}
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
      {confirmAbort && (
        <div className="modal-backdrop" role="presentation">
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby={`abort-title-${task.id}`}>
            <div className="confirm-modal-head">
              <strong id={`abort-title-${task.id}`}>确认中止当前任务</strong>
              <span>{task.id}</span>
            </div>
            <p>中止后任务状态将变为“已中止”，该操作会写入审计记录。</p>
            <div className="confirm-modal-actions">
              <button type="button" onClick={() => setConfirmAbort(false)}>
                取消
              </button>
              <button className="danger" type="button" onClick={confirmAbortTask}>
                确认中止
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AttachmentList({ items, onPreview, title, compact = false }) {
  if (!items.length) {
    return <div className="attachment-empty">暂无附件</div>;
  }

  return (
    <div className={`attachment-list ${compact ? 'compact' : ''}`}>
      {title && <h3>{title}</h3>}
      {items.map((item) => (
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
        <div className="confirm-modal-actions">
          <button type="button" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

function PointTable({ points, title, selectedPointCode, onSelectPoint }) {
  return (
    <div className="point-block">
      {title && <h3>{title}</h3>}
      <DataTable
        columns={['设备', '点位名称', '点位编码', '当前值', '状态', '质量', '更新时间']}
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
      <SegmentedFilter options={['全部', '指令', '报警', '任务', '审计', '设备']} value={type} onChange={setType} />
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

function StepList({ taskId }) {
  const steps = stepsByTask[taskId] ?? [];
  return (
    <div className="step-list">
      {steps.map((step) => (
        <div className={`step-item ${step.status === '执行中' ? 'current' : ''}`} key={step.id}>
          <span>{toChineseStep(step.id)}</span>
          <strong>{step.name}</strong>
          <StatusText value={step.status} />
        </div>
      ))}
    </div>
  );
}

function InterlockTable() {
  return (
    <DataTable
      columns={['互锁条件', '关联设备', '状态', '更新时间']}
      rows={interlocks.map((item) => [item.name, item.device, <StatusText value={item.status} />, item.time])}
    />
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
      { name: '任务节拍', values: [42, 41, 40, 39, 38, 38, 37, 37, 36, 36, 35, 35, 34], unit: 's' },
    ];
  }
  return trendSeries.map((series) => ({
    ...series,
    unit: series.name.includes('转速') ? 'rpm' : series.name.includes('进给') ? 'mm/min' : '%',
  }));
}

function formatTrendValue(series) {
  const value = series.values.at(-1);
  if (!series.unit) return value;
  return `${value} ${series.unit}`;
}

function TrendChart({ device }) {
  const seriesList = getTrendSeriesForDevice(device);
  const max = Math.max(...seriesList.flatMap((series) => series.values));
  const min = Math.min(...seriesList.flatMap((series) => series.values));
  const range = max - min || 1;
  const toPoints = (values) =>
    values
      .map((value, index) => {
        const x = 44 + index * 31;
        const y = 126 - ((value - min) / range) * 80;
        return `${x},${y}`;
      })
      .join(' ');
  const pointPosition = (value, index) => ({
    x: 44 + index * 31,
    y: 126 - ((value - min) / range) * 80,
  });

  return (
    <div className="trend-layout">
      <svg className="trend-chart main-trend" viewBox="0 0 510 150" role="img" aria-label={`${device?.id ?? '设备'}多点位趋势主图`}>
        <path className="axis" d="M44 126H442" />
        <path className="axis" d="M44 26V126" />
        <path className="grid-line" d="M44 86H442" />
        <path className="grid-line" d="M44 46H442" />
        {seriesList.map((series, seriesIndex) => (
          <g className={`trend-series series-${seriesIndex}`} key={series.name}>
            <polyline points={toPoints(series.values)} />
            {series.values.map((value, index) => {
              const { x, y } = pointPosition(value, index);
              return <circle key={`${series.name}-${index}`} cx={x} cy={y} r="3" />;
            })}
            <text className="trend-value-label" x="454" y={pointPosition(series.values.at(-1), series.values.length - 1).y + 4}>
              {formatTrendValue(series)}
            </text>
          </g>
        ))}
        <g className="trend-legend">
          {seriesList.map((series, index) => (
            <g className={`series-${index}`} key={series.name} transform={`translate(${54 + index * 120}, 18)`}>
              <line x1="0" x2="18" y1="0" y2="0" />
              <text x="24" y="4">
                {series.name}
              </text>
            </g>
          ))}
        </g>
        <text className="trend-time" x="390" y="142">
          09:11:18
        </text>
      </svg>
      <div className="mini-trends">
        {seriesList.map((series, index) => (
          <MiniTrend key={series.name} series={series} seriesIndex={index} />
        ))}
      </div>
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
        columns={['时间', '对象', '类型', '内容', '状态']}
        rows={rows.map((row) => [row.time, row.objectId ?? row.deviceId, row.logType, row.content, row.status])}
      />
    );
  }
  return (
    <DataTable
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

function DataTable({ columns, rows, rowKeys = [], selectedKey, onRowClick, className = '', compact = false }) {
  return (
    <div className={`table-wrap ${className} ${compact ? 'compact-table' : ''}`}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const key = rowKeys[index] ?? index;
            return (
              <tr
                className={`${selectedKey === key ? 'selected' : ''} ${onRowClick ? 'clickable' : ''}`}
                key={key}
                onClick={() => onRowClick?.(key)}
              >
                {row.map((cell, cellIndex) => (
                  <td key={`${key}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatusText({ value }) {
  const tone =
    ['正常', '在线', '运行中', '已确认', '已下发', '已关闭', '已锁紧', '未触发', '良好', '完成', '已恢复'].includes(value)
      ? 'ok'
      : ['偏高', '暂停', '排队中', '处理中', '维护中', '等待前置条件', '检测中'].includes(value)
        ? 'warn'
        : ['失败', '离线', '停止', '报警', '未处理', '异常', '已中止'].includes(value)
          ? 'bad'
          : 'neutral';
  return <span className={`status-text ${tone}`}>{value}</span>;
}

function Info({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
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

function getTaskStats(list) {
  return {
    total: list.length,
    running: list.filter((task) => task.status === '运行中').length,
    queued: list.filter((task) => task.status === '排队中').length,
    paused: list.filter((task) => task.status === '暂停').length,
    failed: list.filter((task) => task.status === '失败').length,
  };
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

function getTaskActionConfig(status) {
  const config = {
    排队中: ['开始'],
    运行中: ['暂停', '中止'],
    暂停: ['恢复', '中止'],
    失败: ['重试'],
    已完成: [],
    已中止: [],
  };
  return { actions: config[status] ?? [] };
}

function getActionIcon(action) {
  if (action === '开始') return <Play size={15} />;
  if (action === '暂停') return <Pause size={15} />;
  if (action === '恢复' || action === '重试') return <RotateCcw size={15} />;
  if (action === '中止') return <Square size={15} />;
  return null;
}

function toChineseStep(stepId) {
  const number = Number(String(stepId).split('-')[1]);
  return Number.isFinite(number) ? `第 ${number} 步` : stepId;
}

createRoot(document.getElementById('root')).render(<App />);
