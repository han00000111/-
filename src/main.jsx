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
      重新运行: '排队中',
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
        {page === 'alarms' && (
          <AlarmsPage
            setPage={setPage}
            setSelectedTaskId={setSelectedTaskId}
            setSelectedDeviceId={setSelectedDeviceId}
            setLogFilter={setLogFilter}
            setLogTypeFilter={setLogTypeFilter}
          />
        )}
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

      <div className="overview-column">
        <section className="panel device-panel">
          <SectionTitle icon={Cpu} title="设备状态总览" />
          <DeviceOverviewModule onSelect={openDevice} />
        </section>

        <section className="panel alarm-detail-panel">
          <SectionTitle icon={AlertTriangle} title="报警与互锁" />
          <AlarmInterlockDetail onAlarmJump={jumpFromAlarm} />
        </section>
      </div>

      <div className="overview-column">
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

        <section className="panel logs-panel">
          <SectionTitle icon={FileClock} title="最近日志" />
          <RecentLogs selectedTaskId={selectedTaskId} setLogFilter={setLogFilter} setLogTypeFilter={setLogTypeFilter} />
        </section>
      </div>
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
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('全部');
  const stats = useMemo(() => getDeviceStats(devices), []);
  const filteredDevices = useMemo(() => filterDeviceRows(filterDevices(devices, filter), query, scope), [filter, query, scope]);
  const scopeOptions = ['全部', '数控机床', '工业机器人', '控制器', '公共机', '在线', '离线', '运行中', '维护中', '异常'];

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
      <SearchSelect value={query} onChange={setQuery} selectValue={scope} onSelectChange={setScope} options={scopeOptions} placeholder="搜索设备编号/类型/状态" />
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
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('全部');
  const stats = useMemo(() => getTaskStats(taskList), [taskList]);
  const filteredTasks = useMemo(() => filterTasks(taskList, query, scope), [taskList, query, scope]);
  const visibleSelectedTask = filteredTasks.some((task) => task.id === selectedTaskId) ? selectedTaskId : undefined;

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
      <SearchSelect
        value={query}
        onChange={setQuery}
        selectValue={scope}
        onSelectChange={setScope}
        options={['全部', '运行中', '排队中', '暂停', '失败', '已中止', '有报警']}
        placeholder="搜索任务编号/设备/状态"
      />
      <div className="task-overview-layout">
        <TaskQueue taskList={filteredTasks} selectedTaskId={visibleSelectedTask} setSelectedTaskId={setSelectedTaskId} />
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
  const [deviceSearch, setDeviceSearch] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('全部');
  const points = useMemo(() => getDevicePointsFor(selectedDevice), [selectedDevice]);
  const [selectedPointCode, setSelectedPointCode] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState(null);
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

  return (
    <div className="page-grid devices-grid">
      <section className="panel device-list-panel">
        <SectionTitle icon={Cpu} title="设备列表" />
        <div className="device-search-row">
          <Search size={16} />
          <input
            list="device-search-options"
            onChange={(event) => setDeviceSearch(event.target.value)}
            placeholder="搜索设备编号/类型/状态"
            value={deviceSearch}
          />
          <datalist id="device-search-options">
            {devices.map((device) => (
              <option key={device.id} value={device.id} />
            ))}
          </datalist>
          <select value={deviceFilter} onChange={(event) => setDeviceFilter(event.target.value)}>
            {deviceFilterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="compact-device-list">
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
                <span>{device.type}</span>
                <StatusText value={device.online} />
                <StatusText value={device.runStatus} />
              </div>
            </button>
          ))}
          {!filteredDevices.length && <div className="attachment-empty">无匹配设备</div>}
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
        <SectionTitle icon={Search} title={getPointDetailTitle(selectedPoint)} action={selectedPoint?.name ?? '-'} />
        <PointDetail point={selectedPoint} device={selectedDevice} />
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
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('全部');
  const filteredTasks = useMemo(() => filterTasks(taskList, query, scope), [taskList, query, scope]);
  const visibleSelectedTask = filteredTasks.some((task) => task.id === selectedTaskId) ? selectedTaskId : undefined;

  return (
    <div className="page-grid tasks-grid">
      <section className="panel">
        <SectionTitle icon={ClipboardList} title="任务队列" />
        <SearchSelect
          value={query}
          onChange={setQuery}
          selectValue={scope}
          onSelectChange={setScope}
          options={['全部', '运行中', '排队中', '暂停', '失败', '已中止', '有报警']}
          placeholder="搜索任务编号/设备/状态"
        />
        <TaskQueue taskList={filteredTasks} selectedTaskId={visibleSelectedTask} setSelectedTaskId={setSelectedTaskId} />
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
  const [keyword, setKeyword] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('全部');
  const deviceOptions = ['全部', ...Array.from(new Set(commandLogs.map((row) => row.deviceId)))];
  const filteredRows = commandLogs.filter((row) => {
    const text = keyword.trim().toLowerCase();
    const matchesDevice = deviceFilter === '全部' || row.deviceId === deviceFilter;
    const matchesKeyword =
      !text || [row.time, row.deviceId, row.content, row.params, row.result, row.status].some((value) => value.toLowerCase().includes(text));
    return matchesDevice && matchesKeyword;
  });

  return (
    <section className="panel page-full">
      <SectionTitle icon={TerminalSquare} title="指令下发与回执" />
      <div className="filterbar command-filterbar">
        <Search size={17} />
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索指令名称、参数、状态" />
        <select value={deviceFilter} onChange={(event) => setDeviceFilter(event.target.value)}>
          {deviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {(keyword || deviceFilter !== '全部') && (
          <button
            type="button"
            onClick={() => {
              setKeyword('');
              setDeviceFilter('全部');
            }}
          >
            清除
          </button>
        )}
      </div>
      <DataTable
        columns={['时间', '设备', '指令名称', '参数', '下发结果', '回执状态']}
        rows={filteredRows.map((row) => [row.time, row.deviceId, row.content, row.params, row.result, row.status])}
      />
    </section>
  );
}

function AlarmsPage({ setPage, setSelectedTaskId, setSelectedDeviceId, setLogFilter, setLogTypeFilter }) {
  const [selectedAlarmName, setSelectedAlarmName] = useState(alarms[0]?.name ?? '');
  const [alarmFilter, setAlarmFilter] = useState('全部');
  const filteredAlarms = useMemo(() => filterAlarms(alarms, alarmFilter), [alarmFilter]);
  const selectedAlarm = alarms.find((alarm) => alarm.name === selectedAlarmName) ?? alarms[0];
  const relatedLogs = getAlarmRelatedLogs(selectedAlarm);

  useEffect(() => {
    if (filteredAlarms[0] && !filteredAlarms.some((alarm) => alarm.name === selectedAlarmName)) {
      setSelectedAlarmName(filteredAlarms[0].name);
    }
  }, [alarmFilter, filteredAlarms, selectedAlarmName]);

  return (
    <div className="page-grid alarms-grid alarms-layout">
      <section className="panel alarm-overview-panel">
        <AlarmOverviewBar alarms={alarms} filter={alarmFilter} onFilterChange={setAlarmFilter} />
      </section>
      <section className="panel alarm-card-panel">
        <SectionTitle icon={AlertTriangle} title="报警卡片列表" action={`${filteredAlarms.length} 条`} />
        <AlarmCardList alarms={filteredAlarms} selectedAlarmName={selectedAlarmName} onSelect={setSelectedAlarmName} />
      </section>
      <section className="panel alarm-current-panel">
        <SectionTitle icon={MonitorCog} title="当前报警详情与处理" />
        <AlarmActionPanel
          alarm={selectedAlarm}
          onNavigate={(target, payload) => {
            if (target === 'tasks' && payload) {
              setSelectedTaskId(payload);
              setPage('tasks');
            }
            if (target === 'devices' && payload) {
              setSelectedDeviceId(payload);
              setPage('devices');
            }
            if (target === 'logs') {
              setLogFilter(payload);
              setLogTypeFilter('全部');
              setPage('logs');
            }
          }}
        />
      </section>
      <section className="panel interlock-matrix-panel">
        <SectionTitle icon={ShieldCheck} title="互锁状态总览" />
        <InterlockTable />
      </section>
      <section className="panel alarm-record-panel">
        <SectionTitle icon={History} title="处理记录" action={selectedAlarm?.name ?? '-'} />
        <SimpleLogTable rows={relatedLogs} />
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
      <div className="current-task-body">
        <TaskActions task={task} onTaskAction={onTaskAction} onDetail={onDetail} onLogs={onLogs} />
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
        <span>暂无附件</span>
        {adding ? (
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
        ) : (
          <button type="button" onClick={() => setAdding(true)}>
            添加附件
          </button>
        )}
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

function AlarmOverviewBar({ alarms: alarmRows, filter, onFilterChange }) {
  const stats = getAlarmOverviewStats(alarmRows);
  return (
    <div className="alarm-overview-strip">
      <div className="alarm-overview-stats">
        <span>高危 <strong>{stats.high}</strong></span>
        <span>未处理 <strong>{stats.unhandled}</strong></span>
        <span>处理中 <strong>{stats.processing}</strong></span>
        <span>已恢复 <strong>{stats.recovered}</strong></span>
        <span>阻塞任务 <strong>{stats.blockedTasks}</strong></span>
      </div>
      <SegmentedFilter options={['全部', '未处理', '处理中', '已恢复', '高危', '阻塞任务']} value={filter} onChange={onFilterChange} />
    </div>
  );
}

function AlarmCardList({ alarms: alarmRows, selectedAlarmName, onSelect }) {
  if (!alarmRows.length) {
    return <div className="attachment-empty">无匹配报警</div>;
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
              {alarm.device}｜{alarm.type}｜{alarm.status}｜{alarm.time}
            </div>
            {context.task !== '无' && <div className="alarm-card-task">关联任务：{context.task}</div>}
          </button>
        );
      })}
    </div>
  );
}

function AlarmActionPanel({ alarm, onNavigate }) {
  const [action, setAction] = useState('');
  useEffect(() => {
    setAction('');
  }, [alarm?.name]);

  if (!alarm) {
    return <div className="attachment-empty">请选择报警</div>;
  }

  const context = getAlarmHandlingContext(alarm);
  const actions = getAlarmActionsByStatus(alarm.status);
  const runAction = (label) => {
    if (label === '查看任务') {
      if (context.task === '无') {
        setAction('当前报警无关联任务');
        return;
      }
      onNavigate?.('tasks', context.task);
      return;
    }
    if (label === '查看日志') {
      onNavigate?.('logs', alarm.name === '日志上传失败' ? '日志上传' : alarm.name);
      return;
    }
    setAction(`${label}：${alarm.name} / ${alarm.device}`);
  };

  return (
    <div className="alarm-action-panel">
      <div className="alarm-process-summary">
        <span>当前报警处理｜{alarm.level}｜{alarm.status}</span>
        <strong>{alarm.name}</strong>
        <p>
          {alarm.device}
          {context.task !== '无' ? `｜关联任务 ${context.task}` : ''}
          ｜{alarm.time}
        </p>
      </div>
      <div className="alarm-process-body">
        <div className="alarm-handling-context">
          <Info label="影响判断" value={context.impact} />
          <Info label="处理建议" value={context.suggestion} />
          <Info label="最近记录" value={context.latestRecord} />
        </div>
        <div className="alarm-action-buttons">
          <h3>处理操作</h3>
          {actions.map((label) => (
            <button key={label} type="button" onClick={() => runAction(label)}>
              {label}
            </button>
          ))}
        </div>
      </div>
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
      <Info label="建议处理" value={alarm.suggestion} />
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
  const [filter, setFilter] = useState('全部');
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [actionResult, setActionResult] = useState('');
  const rows = useMemo(() => getInterlockMatrixRows(), []);
  const stats = useMemo(() => getInterlockStats(rows), [rows]);
  const visibleRows = useMemo(() => filterInterlockRows(rows, filter), [rows, filter]);
  const selectedRow = visibleRows.find((row) => row.id === selectedDeviceId) ?? visibleRows[0] ?? rows[0];

  useEffect(() => {
    if (visibleRows[0] && !visibleRows.some((row) => row.id === selectedDeviceId)) {
      setSelectedDeviceId(visibleRows[0].id);
    }
  }, [selectedDeviceId, visibleRows]);

  const runAction = (label) => {
    setActionResult(`${label}：${selectedRow?.id ?? '-'}，互锁真实状态未被人工改写`);
  };

  return (
    <div className="interlock-overview">
      <div className="interlock-summary">
        <span>涉及设备 <strong>{stats.total}</strong></span>
        <span>满足 <strong>{stats.satisfied}</strong></span>
        <span>不满足 <strong>{stats.unsatisfied}</strong></span>
        <span>阻塞任务 <strong>{stats.blockedTasks}</strong></span>
      </div>
      <SegmentedFilter options={['全部', '不满足', '阻塞任务', '已满足']} value={filter} onChange={setFilter} />
      <DataTable
        columns={['设备', '防护门', '夹具', '急停', '机器人安全区', '总体状态', '影响任务', '更新时间']}
        rows={visibleRows.map((row) => [
          row.id,
          renderInterlockValue(row.door),
          renderInterlockValue(row.fixture),
          renderInterlockValue(row.estop),
          renderInterlockValue(row.robotArea),
          <StatusText value={row.overall} />,
          row.overall === '不满足' ? row.affectedTask : '-',
          row.updatedAt,
        ])}
        rowKeys={visibleRows.map((row) => row.id)}
        selectedKey={selectedRow?.id}
        onRowClick={(id) => {
          setSelectedDeviceId(id);
          setActionResult('');
        }}
      />
      {selectedRow && (
        <div className="interlock-detail-panel">
          <div className="detail-list dense">
            <Info label="当前选中设备" value={`${selectedRow.id} / ${selectedRow.type}`} />
            <Info label="阻塞原因" value={selectedRow.blockReason} />
            <Info label="影响任务" value={selectedRow.affectedTask} />
            <Info label="建议处理" value={selectedRow.suggestion} />
            <Info label="最近更新时间" value={selectedRow.updatedAt} />
          </div>
          <div className="button-row interlock-actions">
            {['刷新状态', '查看关联任务', '记录处理结果'].map((label) => (
              <button key={label} type="button" onClick={() => runAction(label)}>
                {label}
              </button>
            ))}
          </div>
          {actionResult && <div className="alarm-action-result">{actionResult}</div>}
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
  return tasks.find((task) => task.devices.includes(deviceId))?.id ?? '无';
}

function getAlarmOverviewStats(alarmRows) {
  return {
    high: alarmRows.filter((alarm) => alarm.level === '高危').length,
    unhandled: alarmRows.filter((alarm) => alarm.status === '未处理').length,
    processing: alarmRows.filter((alarm) => alarm.status === '处理中').length,
    recovered: alarmRows.filter((alarm) => alarm.status === '已恢复').length,
    blockedTasks: new Set(alarmRows.map((alarm) => getAlarmHandlingContext(alarm).task).filter((task) => task !== '无')).size,
  };
}

function filterAlarms(alarmRows, filter) {
  if (filter === '高危') return alarmRows.filter((alarm) => alarm.level === '高危');
  if (filter === '阻塞任务') return alarmRows.filter((alarm) => getAlarmHandlingContext(alarm).task !== '无');
  if (filter === '全部') return alarmRows;
  return alarmRows.filter((alarm) => alarm.status === filter);
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
  const relatedTask = alarm.name === '日志上传失败' ? '无' : (relatedLog?.taskId || getRelatedTaskForDevice(alarm.device));
  const latestRecord = relatedLog ? `${relatedLog.time} ${relatedLog.content}` : `${alarm.time} ${alarm.status}`;

  if (alarm.name === '日志上传失败') {
    return {
      impact: '日志上传曾失败，当前已恢复，需确认是否存在待补传日志',
      task: '无',
      suggestion: '检查待上传队列，确认补传完成后标记恢复',
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
    未处理: ['确认处理', '派发维修', '查看任务', '查看日志'],
    处理中: ['标记恢复', '派发维修', '查看任务', '查看日志'],
    已恢复: ['确认归档', '查看日志', '查看任务'],
    已关闭: ['查看日志', '查看处理记录'],
  };
  return actionMap[status] ?? ['查看日志', '查看任务'];
}

function getInterlockMatrixRows() {
  return devices
    .map((device) => {
      const points = getDevicePointsFor(device);
      const door = getInterlockPoint(points, 'door_closed');
      const fixture = getInterlockPoint(points, 'fixture_locked');
      const estop = getInterlockPoint(points, 'estop');
      const robotArea = getInterlockPoint(points, 'in_cnc_work_area');
      const interlockPoints = [door, fixture, estop, robotArea].filter((point) => point.value !== '-');
      if (!interlockPoints.length) return null;

      const failed = interlockPoints.filter((point) => !point.ok);
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
    return `检查${point.label}`;
  });
  return `${Array.from(new Set(actions)).join('，')}，刷新点位后再执行任务`;
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

function renderInterlockValue(point) {
  if (!point || point.value === '-') return '-';
  return <span className={`interlock-mini ${point.ok ? 'ok' : 'bad'}`}>{point.value}</span>;
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
  const handleWheel = (event) => {
    const target = event.currentTarget;
    const canScrollX = target.scrollWidth > target.clientWidth;
    if (!canScrollX || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    target.scrollLeft += event.deltaY;
  };

  return (
    <div className={`table-wrap ${className} ${compact ? 'compact-table' : ''}`} onWheel={handleWheel}>
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
    ['正常', '在线', '运行中', '已确认', '已下发', '已关闭', '已锁紧', '未触发', '良好', '完成', '已恢复', '满足', '低危'].includes(value)
      ? 'ok'
      : ['偏高', '暂停', '排队中', '处理中', '维护中', '等待前置条件', '检测中', '中危'].includes(value)
        ? 'warn'
        : ['失败', '离线', '停止', '报警', '未处理', '异常', '已中止', '不满足', '高危'].includes(value)
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
      !text || [task.id, task.status, task.step, task.devices, task.command].some((value) => value.toLowerCase().includes(text));
    const matchesScope = scope === '全部' || task.status === scope || (scope === '有报警' && task.alarmCount > 0);
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
    已中止: ['重新运行'],
  };
  return { actions: config[status] ?? [] };
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

createRoot(document.getElementById('root')).render(<App />);
