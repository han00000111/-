export const navItems = [
  { key: 'overview', label: '总览' },
  { key: 'devices', label: '设备与点位' },
  { key: 'tasks', label: '任务执行' },
  { key: 'commands', label: '指令回执' },
  { key: 'alarms', label: '报警互锁' },
  { key: 'logs', label: '日志审计' },
  { key: 'settings', label: '系统设置' },
];

export const devices = [
  { id: 'CNC-001', type: '数控机床', online: '在线', runStatus: '运行中', alarmCount: 1, updatedAt: '09:11:18' },
  { id: 'CNC-002', type: '数控机床', online: '在线', runStatus: '待机', alarmCount: 0, updatedAt: '09:11:18' },
  { id: 'CNC-003', type: '数控机床', online: '离线', runStatus: '停止', alarmCount: 1, updatedAt: '09:08:20' },
  { id: 'CNC-004', type: '数控机床', online: '在线', runStatus: '运行中', alarmCount: 0, updatedAt: '09:11:06' },
  { id: 'CNC-005', type: '数控机床', online: '在线', runStatus: '维护中', alarmCount: 1, updatedAt: '09:10:36' },
  { id: 'CNC-006', type: '数控机床', online: '在线', runStatus: '待机', alarmCount: 0, updatedAt: '09:09:58' },
  { id: 'ROBOT-001', type: '工业机器人', online: '在线', runStatus: '运行中', alarmCount: 0, updatedAt: '09:11:18' },
  { id: 'ROBOT-002', type: '工业机器人', online: '在线', runStatus: '待机', alarmCount: 0, updatedAt: '09:10:50' },
  { id: 'PLC-001', type: '控制器', online: '在线', runStatus: '正常', alarmCount: 0, updatedAt: '09:11:18' },
  { id: 'PLC-002', type: '控制器', online: '在线', runStatus: '维护中', alarmCount: 1, updatedAt: '09:10:42' },
  { id: 'PLC-003', type: '控制器', online: '在线', runStatus: '正常', alarmCount: 0, updatedAt: '09:11:02' },
  { id: 'IPC-001', type: '公共机', online: '在线', runStatus: '正常', alarmCount: 0, updatedAt: '09:11:18' },
];

export const tasks = [
  { id: 'TASK-001', status: '运行中', step: '3/8', currentStep: 'STEP-003', devices: 'CNC-001, PLC-001', alarmCount: 1, updatedAt: '09:11:18', command: '启动加工', startedAt: '09:08:15' },
  { id: 'TASK-002', status: '运行中', step: '1/6', currentStep: 'STEP-001', devices: 'CNC-002, ROBOT-001', alarmCount: 0, updatedAt: '09:11:10', command: '等待上料', startedAt: '09:10:02' },
  { id: 'TASK-003', status: '排队中', step: '0/5', currentStep: 'STEP-000', devices: 'CNC-002, PLC-002', alarmCount: 0, updatedAt: '09:10:58', command: '等待执行', startedAt: '-' },
  { id: 'TASK-004', status: '暂停', step: '2/5', currentStep: 'STEP-002', devices: 'CNC-003', alarmCount: 1, updatedAt: '09:10:30', command: '等待人工确认', startedAt: '09:04:26' },
  { id: 'TASK-005', status: '失败', step: '2/7', currentStep: 'STEP-002', devices: 'CNC-003', alarmCount: 2, updatedAt: '09:07:18', command: '回执确认', startedAt: '09:01:14' },
];

const cnc001Points = [
  { device: 'CNC-001', name: '主轴转速', code: 'spindle_speed', pointType: 'numeric', value: '3200 rpm', status: '正常', quality: '良好', updatedAt: '09:11:18' },
  { device: 'CNC-001', name: '进给速度', code: 'feed_rate', pointType: 'numeric', value: '1250 mm/min', status: '正常', quality: '良好', updatedAt: '09:11:18' },
  { device: 'CNC-001', name: '主轴负载', code: 'spindle_load', pointType: 'numeric', value: '68%', status: '偏高', quality: '良好', updatedAt: '09:11:18' },
];

const plc001Points = [
  { device: 'PLC-001', name: '防护门', code: 'door_closed', pointType: 'status', value: '已关闭', status: '正常', quality: '良好', updatedAt: '09:11:18' },
  { device: 'PLC-001', name: '夹具状态', code: 'fixture_locked', pointType: 'status', value: '已锁紧', status: '正常', quality: '良好', updatedAt: '09:11:18' },
  { device: 'PLC-001', name: '急停状态', code: 'estop', pointType: 'status', value: '未触发', status: '正常', quality: '良好', updatedAt: '09:11:18' },
];

export const taskPoints = {
  'TASK-001': [...cnc001Points, ...plc001Points],
  'TASK-002': [
    { device: 'CNC-002', name: '主轴转速', code: 'spindle_speed', pointType: 'numeric', value: '0 rpm', status: '正常', quality: '良好', updatedAt: '09:11:10' },
    { device: 'ROBOT-001', name: '机器人状态', code: 'robot_state', pointType: 'status', value: '等待上料', status: '正常', quality: '良好', updatedAt: '09:11:10' },
    { device: 'ROBOT-001', name: '机器人加工区', code: 'in_cnc_work_area', pointType: 'status', value: '不在加工区', status: '正常', quality: '良好', updatedAt: '09:11:10' },
  ],
  'TASK-003': [
    { device: 'CNC-002', name: '程序状态', code: 'program_status', pointType: 'status', value: '待装载', status: '正常', quality: '良好', updatedAt: '09:10:58' },
  ],
  'TASK-004': [
    { device: 'CNC-003', name: '报警码', code: 'alarm_code', pointType: 'alarm', value: '1007', status: '异常', quality: '良好', updatedAt: '09:10:30' },
  ],
  'TASK-005': [
    { device: 'CNC-003', name: '程序状态', code: 'program_status', pointType: 'status', value: '回执超时', status: '异常', quality: '异常', updatedAt: '09:07:18' },
  ],
};

export const devicePoints = {
  'CNC-001': cnc001Points,
  'CNC-002': [
    { device: 'CNC-002', name: '主轴转速', code: 'spindle_speed', pointType: 'numeric', value: '0 rpm', status: '正常', quality: '良好', updatedAt: '09:11:18' },
    { device: 'CNC-002', name: '进给速度', code: 'feed_rate', pointType: 'numeric', value: '0 mm/min', status: '正常', quality: '良好', updatedAt: '09:11:18' },
  ],
  'CNC-003': [
    { device: 'CNC-003', name: '报警码', code: 'alarm_code', pointType: 'alarm', value: '1007', status: '异常', quality: '良好', updatedAt: '09:08:20' },
    { device: 'CNC-003', name: '程序状态', code: 'program_status', pointType: 'status', value: '停止', status: '异常', quality: '异常', updatedAt: '09:08:20' },
  ],
  'ROBOT-001': [
    { device: 'ROBOT-001', name: '机器人状态', code: 'robot_state', pointType: 'status', value: '运行中', status: '正常', quality: '良好', updatedAt: '09:11:18' },
    { device: 'ROBOT-001', name: '机器人加工区', code: 'in_cnc_work_area', pointType: 'status', value: '不在加工区', status: '正常', quality: '良好', updatedAt: '09:11:18' },
  ],
  'PLC-001': plc001Points,
  'PLC-002': [
    { device: 'PLC-002', name: '防护门', code: 'door_closed', pointType: 'status', value: '已打开', status: '异常', quality: '良好', updatedAt: '09:10:42' },
    { device: 'PLC-002', name: '夹具状态', code: 'fixture_locked', pointType: 'status', value: '已锁紧', status: '正常', quality: '良好', updatedAt: '09:10:42' },
    { device: 'PLC-002', name: '急停状态', code: 'estop', pointType: 'status', value: '未触发', status: '正常', quality: '良好', updatedAt: '09:10:42' },
    { device: 'PLC-002', name: '日志上传链路', code: 'log_upload', pointType: 'status', value: '恢复中', status: '偏高', quality: '不确定', updatedAt: '09:10:42' },
  ],
  'PLC-003': [
    { device: 'PLC-003', name: '防护门', code: 'door_closed', pointType: 'status', value: '已关闭', status: '正常', quality: '良好', updatedAt: '09:11:02' },
    { device: 'PLC-003', name: '夹具状态', code: 'fixture_locked', pointType: 'status', value: '未锁紧', status: '异常', quality: '良好', updatedAt: '09:11:02' },
    { device: 'PLC-003', name: '急停状态', code: 'estop', pointType: 'status', value: '未触发', status: '正常', quality: '良好', updatedAt: '09:11:02' },
  ],
  'ROBOT-002': [
    { device: 'ROBOT-002', name: '机器人状态', code: 'robot_state', pointType: 'status', value: '待机', status: '正常', quality: '良好', updatedAt: '09:10:50' },
    { device: 'ROBOT-002', name: '机器人加工区', code: 'in_cnc_work_area', pointType: 'status', value: '在加工区', status: '异常', quality: '良好', updatedAt: '09:10:50' },
  ],
};

export const alarms = [
  { name: '主轴负载过高', device: 'CNC-001', type: '设备报警', level: '高危', status: '未处理', time: '09:09:45', jumpTarget: 'alarms' },
  { name: '设备连接异常', device: 'CNC-003', type: '设备报警', level: '中危', status: '处理中', time: '09:08:20', jumpTarget: 'devices' },
  { name: '日志上传失败', device: 'IPC-001', type: '系统报警', level: '低危', status: '已恢复', time: '09:06:12', jumpTarget: 'logs' },
];

export const interlocks = [
  { name: '防护门', device: 'PLC-001', status: '已关闭', time: '09:11:18' },
  { name: '夹具状态', device: 'PLC-001', status: '已锁紧', time: '09:11:18' },
  { name: '急停状态', device: 'PLC-001', status: '未触发', time: '09:11:18' },
  { name: '机器人加工区', device: 'ROBOT-001', status: '正常', time: '09:11:18' },
];

export const commandLogs = [
  { time: '09:11:02', objectType: 'task', objectId: 'TASK-001', deviceId: 'CNC-001', taskId: 'TASK-001', logType: '指令', content: '启动加工', params: 'O1001', status: '已确认', result: '已下发' },
  { time: '09:10:58', objectType: 'task', objectId: 'TASK-001', deviceId: 'CNC-001', taskId: 'TASK-001', logType: '指令', content: '调整进给', params: '80%', status: '已确认', result: '已下发' },
  { time: '09:10:20', objectType: 'device', objectId: 'PLC-001', deviceId: 'PLC-001', taskId: 'TASK-001', logType: '指令', content: '夹具锁紧', params: 'true', status: '已确认', result: '已下发' },
];

export const telemetryLogs = [
  { time: '09:11:18', objectType: 'device', objectId: 'CNC-001', deviceId: 'CNC-001', taskId: 'TASK-001', logType: '设备', content: '主轴负载写入成功', params: '-', status: '正常' },
  { time: '09:10:42', objectType: 'device', objectId: 'PLC-002', deviceId: 'PLC-002', taskId: '', logType: '设备', content: '日志上传恢复', params: '-', status: '正常' },
  { time: '09:08:20', objectType: 'device', objectId: 'CNC-003', deviceId: 'CNC-003', taskId: 'TASK-004', logType: '报警', content: '设备通信异常', params: '-', status: '异常' },
];

export const auditLogs = [
  { time: '09:09:45', objectType: 'task', objectId: 'TASK-001', deviceId: 'CNC-001', taskId: 'TASK-001', logType: '报警', content: '主轴负载过高', params: 'alarm_code=1007', status: '未处理', operator: 'system' },
  { time: '09:08:28', objectType: 'task', objectId: 'TASK-004', deviceId: 'CNC-003', taskId: 'TASK-004', logType: '任务', content: '任务暂停，等待人工确认', params: 'admin', status: '暂停', operator: 'admin' },
  { time: '09:07:18', objectType: 'task', objectId: 'TASK-005', deviceId: 'CNC-003', taskId: 'TASK-005', logType: '审计', content: '回执超时，任务失败', params: 'system', status: '失败', operator: 'system' },
];

export const stepLogs = [
  { time: '09:11:02', objectType: 'task', objectId: 'TASK-001', deviceId: 'CNC-001', taskId: 'TASK-001', logType: '任务', content: '下发启动加工', params: '-', status: '已确认' },
  { time: '09:10:58', objectType: 'task', objectId: 'TASK-001', deviceId: 'CNC-001', taskId: 'TASK-001', logType: '任务', content: '调整进给到 80%', params: '80%', status: '已确认' },
  { time: '09:09:45', objectType: 'task', objectId: 'TASK-001', deviceId: 'CNC-001', taskId: 'TASK-001', logType: '报警', content: '生成主轴负载过高报警', params: 'alarm_code=1007', status: '未处理' },
];

export const stepsByTask = {
  'TASK-001': [
    { id: 'STEP-001', name: '夹具锁紧', status: '完成' },
    { id: 'STEP-002', name: '程序装载', status: '完成' },
    { id: 'STEP-003', name: '启动加工', status: '执行中' },
    { id: 'STEP-004', name: '负载监控', status: '等待前置条件' },
  ],
  'TASK-002': [
    { id: 'STEP-001', name: '等待上料', status: '执行中' },
    { id: 'STEP-002', name: '机器人搬运', status: '等待前置条件' },
  ],
  'TASK-003': [{ id: 'STEP-001', name: '等待执行', status: '等待前置条件' }],
  'TASK-004': [
    { id: 'STEP-001', name: '设备检查', status: '完成' },
    { id: 'STEP-002', name: '人工确认', status: '执行中' },
  ],
  'TASK-005': [
    { id: 'STEP-001', name: '程序装载', status: '完成' },
    { id: 'STEP-002', name: '回执确认', status: '失败' },
  ],
};

export const trendSeries = [
  { name: '主轴转速', values: [42, 46, 51, 56, 62, 66, 68, 72, 70, 74, 73, 76, 74] },
  { name: '进给速度', values: [36, 38, 40, 45, 47, 49, 52, 55, 54, 57, 58, 60, 59] },
  { name: '主轴负载', values: [32, 38, 41, 48, 54, 57, 62, 68, 66, 71, 69, 73, 68] },
];

export const settings = [
  { label: '工位编号', value: 'WS-001', desc: '当前单工位编号' },
  { label: '公共机编号', value: 'IPC-001', desc: '现场 Windows 公共机' },
  { label: '后台地址', value: 'https://platform.local', desc: '后台服务连接地址' },
  { label: 'MQTT Broker', value: 'mqtt://10.10.1.20:1883', desc: '消息通道地址' },
  { label: '日志上传', value: '开启', desc: '断网缓存，恢复后补传' },
  { label: '本地缓存', value: '7 天', desc: '现场端离线缓存周期' },
];

export const deviceAttachments = {
  'CNC-001': [
    { type: '图纸', name: 'CNC-001_工装图纸.pdf', version: 'v1.2', target: 'CNC-001', updatedAt: '2025-05-27 09:00', remark: '设备工装安装与定位基准图纸。' },
    { type: '刀具', name: 'T01-T08_刀具清单.xlsx', version: 'v1.0', target: 'CNC-001', updatedAt: '2025-05-27 09:05', remark: '当前加工任务推荐刀具组合。' },
    { type: '夹具', name: '夹具锁紧说明.pdf', version: 'v1.1', target: 'CNC-001', updatedAt: '2025-05-27 09:08', remark: '夹具锁紧顺序和互锁条件说明。' },
    { type: '程序', name: 'O1001.nc', version: '当前', target: 'CNC-001', updatedAt: '2025-05-27 09:10', remark: '当前主加工程序文件。' },
  ],
  'CNC-003': [
    { type: '图纸', name: 'CNC-003_维修基准图.pdf', version: 'v0.9', target: 'CNC-003', updatedAt: '2025-05-26 16:20', remark: '离线排查使用的设备基准图。' },
    { type: '程序', name: 'O3007_backup.nc', version: '备份', target: 'CNC-003', updatedAt: '2025-05-26 16:40', remark: '故障恢复前的程序备份。' },
  ],
};

export const taskAttachments = {
  'TASK-001': [
    { type: '加工图纸', name: 'TASK-001_零件加工图.pdf', version: 'v2.0', target: 'TASK-001', updatedAt: '2025-05-27 08:55', remark: '当前任务零件尺寸与加工要求。' },
    { type: '刀具清单', name: 'TASK-001_刀具清单.xlsx', version: 'v1.3', target: 'TASK-001', updatedAt: '2025-05-27 08:56', remark: '任务执行前需核对刀具编号。' },
    { type: '夹具说明', name: 'TASK-001_夹具装夹说明.pdf', version: 'v1.1', target: 'TASK-001', updatedAt: '2025-05-27 08:57', remark: '装夹位置、防护门和夹具互锁说明。' },
    { type: '程序文件', name: 'O1001.nc', version: '当前', target: 'TASK-001', updatedAt: '2025-05-27 08:58', remark: '当前步骤下发使用的程序。' },
  ],
  'TASK-005': [
    { type: '程序文件', name: 'O5002_failed.nc', version: '失败记录', target: 'TASK-005', updatedAt: '2025-05-27 09:07', remark: '回执超时任务的程序文件。' },
  ],
};
