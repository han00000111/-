export const navItems = [
  { key: 'overview', label: '总览' },
  { key: 'robot-monitor', label: '机器人监控' },
  { key: 'map-management', label: '地图管理' },
  { key: 'arm-control', label: '机械臂控制' },
  { key: 'vision-recognition', label: '视觉识别' },
  { key: 'tasks', label: '任务管理' },
  { key: 'devices', label: '设备与点位' },
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
  { id: 'AMR-001', type: '移动机器人', online: '在线', runStatus: '巡检中', alarmCount: 1, updatedAt: '09:12:08' },
  { id: 'CHASSIS-001', type: '机器人底盘', online: '在线', runStatus: '导航中', alarmCount: 0, updatedAt: '09:12:08' },
  { id: 'LIDAR-001', type: '激光雷达', online: '在线', runStatus: '正常', alarmCount: 0, updatedAt: '09:12:06' },
  { id: 'CHARGE-001', type: '充电桩', online: '在线', runStatus: '空闲', alarmCount: 0, updatedAt: '09:11:56' },
  { id: 'MAP-SVC-001', type: '地图服务', online: '在线', runStatus: '正常', alarmCount: 0, updatedAt: '09:11:58' },
  { id: 'NAV-SVC-001', type: '导航服务', online: '在线', runStatus: '正常', alarmCount: 0, updatedAt: '09:12:02' },
  { id: 'ARM-001', type: '机械臂', online: '在线', runStatus: '运行中', alarmCount: 0, updatedAt: '09:14:12' },
  { id: 'ARM-002', type: '机械臂', online: '在线', runStatus: '待机', alarmCount: 0, updatedAt: '09:13:48' },
  { id: 'ARM-003', type: '机械臂', online: '离线', runStatus: '异常', alarmCount: 2, updatedAt: '09:10:22' },
  { id: 'GRIPPER-001', type: '夹爪', online: '在线', runStatus: '已打开', alarmCount: 0, updatedAt: '09:14:02' },
  { id: 'SUCTION-001', type: '吸盘', online: '在线', runStatus: '真空保持', alarmCount: 0, updatedAt: '09:13:40' },
  { id: 'CAM-001', type: '相机', online: '在线', runStatus: '识别中', alarmCount: 0, updatedAt: '09:14:08' },
  { id: 'CAM-002', type: '相机', online: '在线', runStatus: '待触发', alarmCount: 1, updatedAt: '09:13:50' },
  { id: 'CAM-003', type: '相机', online: '离线', runStatus: '异常', alarmCount: 1, updatedAt: '09:10:12' },
  { id: 'LGT-001', type: '光源', online: '在线', runStatus: '正常', alarmCount: 0, updatedAt: '09:14:00' },
  { id: 'VISION-IPC-001', type: '视觉工控机', online: '在线', runStatus: '正常', alarmCount: 0, updatedAt: '09:14:05' },
  { id: 'VISION-SVC-001', type: '视觉服务', online: '在线', runStatus: '模型加载失败', alarmCount: 1, updatedAt: '09:12:58' },
  { id: 'PLC-001', type: '控制器', online: '在线', runStatus: '正常', alarmCount: 0, updatedAt: '09:11:18' },
  { id: 'PLC-002', type: '控制器', online: '在线', runStatus: '维护中', alarmCount: 1, updatedAt: '09:10:42' },
  { id: 'PLC-003', type: '控制器', online: '在线', runStatus: '正常', alarmCount: 0, updatedAt: '09:11:02' },
  { id: 'IPC-001', type: '公共机', online: '在线', runStatus: '正常', alarmCount: 0, updatedAt: '09:11:18' },
];

export const tasks = [
  { id: 'TASK-001', orderNo: 'ORD-20250608-001', taskType: '生产任务', targetDevice: 'CNC-001', pickupStation: 'WS-001 取料位', placementPlan: '机床夹具 A 面', doorMode: 'PLC 自动开门', processStatus: '待处理', status: '运行中', step: '3/8', currentStep: 'STEP-003', devices: 'CNC-001, PLC-001', alarmCount: 1, updatedAt: '09:11:18', command: '启动加工', startedAt: '09:08:15', taskPlan: '标准加工方案', visionMark: '零件二维码 + 夹具基准', actionPoint: 'CNC-001-A03', materialRule: '按订单刀具清单校验', reviewRule: '首件复核 + 异常复测' },
  { id: 'TASK-002', orderNo: 'ORD-20250608-002', taskType: '上下料任务', targetDevice: 'CNC-002', pickupStation: 'WS-002 待上料', placementPlan: '托盘 2 号位', doorMode: '机器人到位后开门', processStatus: '正常处理', status: '运行中', step: '1/6', currentStep: 'STEP-001', devices: 'CNC-002, ROBOT-001', alarmCount: 0, updatedAt: '09:11:10', command: '等待上料', startedAt: '09:10:02', taskPlan: '机器人上下料方案', visionMark: '托盘角点定位', actionPoint: 'ROBOT-001-P12', materialRule: '单件单托盘', reviewRule: '放料后视觉复核' },
  { id: 'TASK-003', orderNo: 'ORD-20250608-003', taskType: '搬运任务', targetDevice: 'CNC-002', pickupStation: '缓存区 A', placementPlan: 'CNC-002 待加工区', doorMode: '不开门', processStatus: '待确认', status: '排队中', step: '0/5', currentStep: 'STEP-000', devices: 'CNC-002, PLC-002', alarmCount: 0, updatedAt: '09:10:58', command: '等待执行', startedAt: '-', taskPlan: '短距搬运方案', visionMark: '料框编号识别', actionPoint: 'AMR-P05', materialRule: '同批次物料合并', reviewRule: '到位拍照确认' },
  { id: 'TASK-004', orderNo: 'ORD-20250608-004', taskType: '巡检任务', targetDevice: 'CNC-003', pickupStation: '无', placementPlan: '无', doorMode: '人工确认开门', processStatus: '待人工接管', status: '暂停', step: '2/5', currentStep: 'STEP-002', devices: 'CNC-003', alarmCount: 1, updatedAt: '09:10:30', command: '等待人工确认', startedAt: '09:04:26', taskPlan: '设备巡检方案', visionMark: '设备铭牌识别', actionPoint: 'CNC-003-I01', materialRule: '无物料', reviewRule: '人工确认后恢复' },
  { id: 'TASK-005', orderNo: 'ORD-20250608-005', taskType: '生产任务', targetDevice: 'CNC-003', pickupStation: 'WS-003 取料位', placementPlan: '机床夹具 B 面', doorMode: 'PLC 自动开门', processStatus: '异常处理中', status: '失败', step: '2/7', currentStep: 'STEP-002', devices: 'CNC-003', alarmCount: 2, updatedAt: '09:07:18', command: '回执确认', startedAt: '09:01:14', taskPlan: '返修加工方案', visionMark: '零件二维码', actionPoint: 'CNC-003-B02', materialRule: '返修件单独放料', reviewRule: '失败后必须复测' },
  { id: 'TASK-006', orderNo: 'ORD-20250608-006', taskType: '巡检任务', targetDevice: 'AMR-001', pickupStation: '无', placementPlan: '无', doorMode: '不开门', processStatus: '待人工接管', robotId: 'AMR-001', armId: '-', visionTaskId: 'VT-003', targetMap: '一号厂区地图', targetRoute: '主通道巡检路线', targetPoint: '充电桩', executionMode: '循环巡检 + 安全区域判断', status: '异常处理中', step: '2/4', currentStep: 'STEP-002', devices: 'AMR-001, CAM-003, NAV-SVC-001', alarmCount: 2, updatedAt: '09:12:08', command: '安全区域判断异常', startedAt: '09:05:00', taskPlan: '主通道巡检方案', visionMark: '安全区域模型 SAFE-v1.2', actionPoint: 'R001 / P002', materialRule: '无物料', reviewRule: '视觉异常后转人工确认' },
  { id: 'TASK-007', orderNo: 'ORD-20250608-007', taskType: '建图任务', targetDevice: 'AMR-001', pickupStation: '无', placementPlan: '地图 M003', doorMode: '不开门', processStatus: '待回执', robotId: 'AMR-001', armId: '-', visionTaskId: '-', targetMap: '车间A自动扫描地图', targetRoute: '建图轨迹 MAP_TASK_001', targetPoint: '设备区入口', executionMode: '手动建图', status: '排队中', step: '0/3', currentStep: 'STEP-000', devices: 'AMR-001, MAP-SVC-001', alarmCount: 1, updatedAt: '09:11:40', command: '等待建图回执', startedAt: '-', taskPlan: '车间A自动建图任务', visionMark: '无', actionPoint: 'M003 / MAP_TASK_001', materialRule: '无物料', reviewRule: '保存地图前检查建图日志' },
  { id: 'TASK-008', orderNo: 'ORD-20250608-008', taskType: '上下料任务', targetDevice: 'CNC-002', pickupStation: '料仓 A-03', placementPlan: 'CNC-002 上料位', doorMode: '视觉确认后开门', processStatus: '设备异常关注', robotId: 'AMR-001', armId: 'ARM-001', visionTaskId: 'VT-001', targetMap: '一号厂区地图', targetRoute: '设备区短巡检', targetPoint: 'CNC-002 上料位', executionMode: '视觉引导 + 机械臂抓取', status: '运行中', step: '3/8', currentStep: 'STEP-003', devices: 'AMR-001, ARM-001, CAM-001, CNC-002', alarmCount: 1, updatedAt: '09:14:12', command: '机械臂移动到抓取位', startedAt: '09:12:00', taskPlan: 'AMR + 机械臂上下料方案', visionMark: '物料定位模型 LOC-MAT-v2.3', actionPoint: 'ARM-001-TP-002', materialRule: '夹爪闭合前二次确认', reviewRule: '抓取与放置后各复测一次' },
  { id: 'TASK-009', orderNo: 'ORD-20250608-009', taskType: '视觉检测任务', targetDevice: 'CNC-002', pickupStation: '无', placementPlan: '无', doorMode: '不开门', processStatus: '待确认', robotId: '-', armId: '-', visionTaskId: 'VT-004', targetMap: '-', targetRoute: '-', targetPoint: 'CNC-002 上料位', executionMode: '相机触发识别', status: '排队中', step: '0/3', currentStep: 'STEP-000', devices: 'CAM-001, VISION-SVC-001', alarmCount: 0, updatedAt: '09:13:20', command: '等待识别', startedAt: '-', taskPlan: '单相机检测方案', visionMark: '二维码 / 条码模型 CODE-v1.1', actionPoint: 'CAM-001-FOV', materialRule: '检测任务不绑定物料', reviewRule: '低置信度转人工确认' },
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
  { label: '平台名称', value: '机器人综合管理平台', desc: '当前系统显示名称' },
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
  'TASK-006': [
    { type: '巡检路线', name: '主通道巡检路线_R001.json', version: 'v1.4', target: 'TASK-006', updatedAt: '2025-05-27 09:05', remark: 'AMR-001 当前巡检路线。' },
    { type: '视觉截图', name: 'CAM-003_安全区域异常.png', version: '当前', target: 'TASK-006', updatedAt: '2025-05-27 09:10', remark: '安全区域判断异常截图。' },
  ],
  'TASK-007': [
    { type: '建图日志', name: 'MAP_TASK_001_build.log', version: '当前', target: 'TASK-007', updatedAt: '2025-05-27 09:11', remark: '车间A自动建图过程日志。' },
    { type: '地图草稿', name: 'M003_preview.png', version: '草稿', target: 'TASK-007', updatedAt: '2025-05-27 09:11', remark: '未保存地图预览。' },
  ],
  'TASK-008': [
    { type: '动作模板', name: '设备开门模板_TPL-DOOR-001.json', version: 'v1.0', target: 'TASK-008', updatedAt: '2025-05-27 09:12', remark: '上下料开门动作模板。' },
    { type: '视觉结果', name: 'VT-001_物料定位结果.json', version: '当前', target: 'TASK-008', updatedAt: '2025-05-27 09:14', remark: '物料位置识别结果。' },
  ],
  'TASK-009': [
    { type: '识别配置', name: 'VT-004_CODE-v1.1.json', version: 'v1.1', target: 'TASK-009', updatedAt: '2025-05-27 09:13', remark: '二维码 / 条码识别配置。' },
  ],
};

// robotPlatformMockPatch: 机器人综合管理平台第一版前端 mock 扩展。
export const robots = [
  { robotId: 'AMR-001', name: 'HERMES 移动底座 01', status: '在线', battery: 82, currentMap: '一号厂区地图', currentPoint: '主通道中段', currentTask: 'TASK-006', mode: '自动巡检', communicationStatus: '正常', localizationStatus: '正常', lidarStatus: '正常', emergencyStatus: '未触发', updatedAt: '09:12:08' },
  { robotId: 'AMR-002', name: 'HERMES 移动底座 02', status: '在线', battery: 64, currentMap: '二号仓储地图', currentPoint: '充电桩', currentTask: '无', mode: '待机', communicationStatus: '正常', localizationStatus: '正常', lidarStatus: '正常', emergencyStatus: '未触发', updatedAt: '09:10:44' },
];

export const robotStatus = {
  robotId: 'AMR-001',
  name: 'HERMES 移动底座 01',
  online: '在线',
  currentMap: '一号厂区地图',
  currentPoint: '主通道中段',
  currentTask: 'TASK-006',
  battery: 82,
  localizationStatus: '正常',
  communicationStatus: '正常',
  lidarStatus: '正常',
  emergencyStatus: '未触发',
  mode: '自动巡检',
  speed: '0.42 m/s',
  x: 285,
  y: 166,
  theta: 90,
  targetRoute: '主通道巡检路线',
  chassis: {
    chargeStatus: '待机',
    motorStatus: '正常',
    odomStatus: '正常',
    obstacleStatus: '通道清空',
    navStatus: '导航中',
    mappingStatus: '空闲',
  },
};

export const maps = [
  { mapId: 'M001', mapName: '一号厂区地图', isDefault: true, width: 240, height: 180, resolution: 0.05, pointCount: 5, routeCount: 2, updatedAt: '2026-06-08 09:08' },
  { mapId: 'M002', mapName: '二号仓储地图', isDefault: false, width: 180, height: 150, resolution: 0.05, pointCount: 4, routeCount: 1, updatedAt: '2026-06-07 16:30' },
  { mapId: 'M003', mapName: '车间A自动扫描地图', isDefault: false, width: 220, height: 160, resolution: 0.04, pointCount: 3, routeCount: 1, updatedAt: '2026-06-08 08:45' },
];

export const mapAreas = [
  { areaId: 'A001', name: '设备区', color: '#dbeafe', polygon: [{ x: 72, y: 118 }, { x: 246, y: 118 }, { x: 246, y: 246 }, { x: 72, y: 246 }] },
  { areaId: 'A002', name: '主通道', color: '#dcfce7', polygon: [{ x: 246, y: 72 }, { x: 526, y: 72 }, { x: 526, y: 184 }, { x: 246, y: 184 }] },
  { areaId: 'A003', name: '仓储区', color: '#fef3c7', polygon: [{ x: 336, y: 206 }, { x: 526, y: 206 }, { x: 526, y: 336 }, { x: 336, y: 336 }] },
  { areaId: 'A004', name: '充电区', color: '#f3e8ff', polygon: [{ x: 92, y: 282 }, { x: 230, y: 282 }, { x: 230, y: 362 }, { x: 92, y: 362 }] },
];

export const mapPoints = [
  { pointId: 'P001', mapId: 'M001', name: '设备区入口', type: '巡检点', x: 190, y: 150, theta: 90, areaId: 'A001' },
  { pointId: 'P002', mapId: 'M001', name: '主通道中段', type: '巡检点', x: 360, y: 160, theta: 0, areaId: 'A002' },
  { pointId: 'P003', mapId: 'M001', name: '仓储区门口', type: '巡检点', x: 405, y: 280, theta: 180, areaId: 'A003' },
  { pointId: 'P004', mapId: 'M001', name: '充电桩', type: '充电点', x: 175, y: 325, theta: 270, areaId: 'A004' },
  { pointId: 'P005', mapId: 'M001', name: '安全门', type: '门', x: 292, y: 214, theta: 0, areaId: 'A002' },
];

export const mapWalls = [
  { wallId: 'W001', start: { x: 48, y: 52 }, end: { x: 568, y: 52 } },
  { wallId: 'W002', start: { x: 568, y: 52 }, end: { x: 568, y: 374 } },
  { wallId: 'W003', start: { x: 568, y: 374 }, end: { x: 48, y: 374 } },
  { wallId: 'W004', start: { x: 48, y: 374 }, end: { x: 48, y: 52 } },
  { wallId: 'W005', start: { x: 246, y: 118 }, end: { x: 246, y: 246 } },
  { wallId: 'W006', start: { x: 336, y: 206 }, end: { x: 526, y: 206 } },
];

export const mapDoors = [
  { doorId: 'D001', name: '设备区门', start: { x: 246, y: 154 }, end: { x: 246, y: 196 } },
  { doorId: 'D002', name: '充电区入口', start: { x: 176, y: 282 }, end: { x: 224, y: 282 } },
];

export const mapVirtualWalls = [
  { wallId: 'VW001', start: { x: 432, y: 252 }, end: { x: 488, y: 252 } },
];

export const mapNoGoAreas = [
  { areaId: 'NG001', name: '临时禁行区', polygon: [{ x: 360, y: 218 }, { x: 445, y: 218 }, { x: 445, y: 275 }, { x: 360, y: 275 }] },
];

export const mapObstacles = [
  { obstacleId: 'O001', name: '料框', x: 392, y: 128, width: 66, height: 52 },
  { obstacleId: 'O002', name: '检修车', x: 252, y: 252, width: 48, height: 42 },
];

export const mapRoutes = [
  { routeId: 'R001', routeName: '主通道巡检路线', mapId: 'M001', pointSequence: ['P001', 'P002', 'P003', 'P004'], mode: '循环巡检', estimatedDuration: '18 分钟', status: '启用' },
  { routeId: 'R002', routeName: '设备区短巡检', mapId: 'M001', pointSequence: ['P001', 'P005', 'P004'], mode: '单次执行', estimatedDuration: '8 分钟', status: '启用' },
  { routeId: 'R003', routeName: '仓储补给路线', mapId: 'M002', pointSequence: ['P101', 'P102', 'P103'], mode: '搬运', estimatedDuration: '12 分钟', status: '停用' },
];

export const mappingTasks = [
  { mappingTaskId: 'MAP_TASK_001', robotId: 'AMR-001', mapName: '车间A自动扫描地图', status: '待开始', progress: 0, startedAt: '-', updatedAt: '09:11:40', resultStatus: '未保存' },
  { mappingTaskId: 'MAP_TASK_000', robotId: 'AMR-002', mapName: '二号仓储地图', status: '已完成', progress: 100, startedAt: '2026-06-07 15:40', updatedAt: '2026-06-07 16:30', resultStatus: '已保存' },
];

export const mappingLogs = [
  '09:11:40 自动建图页面已就绪',
  '09:11:42 已选择底座：AMR-001',
  '09:11:45 等待开始扫描',
];

export const robotCommandLogs = [
  { time: '09:12:08', objectType: 'robot', objectId: 'AMR-001', deviceId: 'AMR-001', taskId: 'TASK-006', logType: '机器人', content: '底盘状态变化：进入自动巡检', params: 'mode=auto', status: '正常' },
  { time: '09:11:56', objectType: 'map', objectId: 'M001', deviceId: 'MAP-SVC-001', taskId: '', logType: '地图', content: '地图保存：一号厂区地图', params: 'resolution=0.05', status: '成功' },
  { time: '09:11:44', objectType: 'route', objectId: 'R001', deviceId: 'NAV-SVC-001', taskId: 'TASK-006', logType: '路线', content: '路线编辑：主通道巡检路线', params: '4 points', status: '成功' },
  { time: '09:11:40', objectType: 'mapping', objectId: 'MAP_TASK_001', deviceId: 'AMR-001', taskId: 'TASK-007', logType: '建图', content: '建图开始等待', params: '车间A自动扫描地图', status: '待开始' },
  { time: '09:10:30', objectType: 'patrol', objectId: 'TASK-006', deviceId: 'AMR-001', taskId: 'TASK-006', logType: '巡检', content: '巡检开始：主通道巡检路线', params: 'R001', status: '运行中' },
  { time: '09:09:58', objectType: 'chassis', objectId: 'AMR-001', deviceId: 'AMR-001', taskId: '', logType: '底盘', content: '手动接管已退出', params: 'operator01', status: '成功' },
];

Object.assign(devicePoints, {
  'AMR-001': [
    { device: 'AMR-001', name: '机器人位置', code: 'robot_position', pointType: 'status', value: 'X285 Y166', status: '正常', quality: '良好', updatedAt: '09:12:08' },
    { device: 'AMR-001', name: '电量', code: 'battery', pointType: 'numeric', value: '82%', status: '正常', quality: '良好', updatedAt: '09:12:08' },
    { device: 'AMR-001', name: '定位状态', code: 'localization_status', pointType: 'status', value: '正常', status: '正常', quality: '良好', updatedAt: '09:12:08' },
    { device: 'AMR-001', name: '通信状态', code: 'communication_status', pointType: 'status', value: '正常', status: '正常', quality: '良好', updatedAt: '09:12:08' },
    { device: 'AMR-001', name: '急停状态', code: 'emergency_status', pointType: 'status', value: '未触发', status: '正常', quality: '良好', updatedAt: '09:12:08' },
    { device: 'AMR-001', name: '导航状态', code: 'navigation_status', pointType: 'status', value: '导航中', status: '正常', quality: '良好', updatedAt: '09:12:08' },
    { device: 'AMR-001', name: '建图状态', code: 'mapping_status', pointType: 'status', value: '空闲', status: '正常', quality: '良好', updatedAt: '09:12:08' },
    { device: 'AMR-001', name: '当前地图', code: 'current_map', pointType: 'status', value: '一号厂区地图', status: '正常', quality: '良好', updatedAt: '09:12:08' },
    { device: 'AMR-001', name: '当前路线', code: 'current_route', pointType: 'status', value: '主通道巡检路线', status: '正常', quality: '良好', updatedAt: '09:12:08' },
  ],
  'CHASSIS-001': [
    { device: 'CHASSIS-001', name: '速度', code: 'speed', pointType: 'numeric', value: '0.42 m/s', status: '正常', quality: '良好', updatedAt: '09:12:08' },
    { device: 'CHASSIS-001', name: '里程计状态', code: 'odom_status', pointType: 'status', value: '正常', status: '正常', quality: '良好', updatedAt: '09:12:08' },
    { device: 'CHASSIS-001', name: '急停状态', code: 'emergency_status', pointType: 'status', value: '未触发', status: '正常', quality: '良好', updatedAt: '09:12:08' },
  ],
  'LIDAR-001': [
    { device: 'LIDAR-001', name: '激光雷达状态', code: 'lidar_status', pointType: 'status', value: '正常', status: '正常', quality: '良好', updatedAt: '09:12:06' },
  ],
  'CHARGE-001': [
    { device: 'CHARGE-001', name: '充电桩状态', code: 'charge_status', pointType: 'status', value: '空闲', status: '正常', quality: '良好', updatedAt: '09:11:56' },
  ],
  'MAP-SVC-001': [
    { device: 'MAP-SVC-001', name: '当前地图', code: 'current_map', pointType: 'status', value: '一号厂区地图', status: '正常', quality: '良好', updatedAt: '09:11:58' },
    { device: 'MAP-SVC-001', name: '建图状态', code: 'mapping_status', pointType: 'status', value: '待开始', status: '正常', quality: '良好', updatedAt: '09:11:58' },
  ],
  'NAV-SVC-001': [
    { device: 'NAV-SVC-001', name: '当前路线', code: 'current_route', pointType: 'status', value: '主通道巡检路线', status: '正常', quality: '良好', updatedAt: '09:12:02' },
    { device: 'NAV-SVC-001', name: '导航状态', code: 'navigation_status', pointType: 'status', value: '导航中', status: '正常', quality: '良好', updatedAt: '09:12:02' },
  ],
});

taskPoints['TASK-006'] = devicePoints['AMR-001'];
taskPoints['TASK-007'] = devicePoints['MAP-SVC-001'];

tasks.forEach((task) => {
  if (!task.taskType) task.taskType = task.id === 'TASK-002' ? '搬运任务' : '生产任务';
  task.robotId ??= task.id === 'TASK-002' ? 'ROBOT-001' : '-';
  task.targetMap ??= '-';
  task.targetRoute ??= '-';
  task.targetPoint ??= '-';
  task.executionMode ??= '自动';
});
Object.assign(stepsByTask, {
  'TASK-006': [
    { id: 'STEP-001', name: '下发巡检路线', status: '完成', stepType: 'robot', target: 'AMR-001' },
    { id: 'STEP-002', name: '安全区域判断', status: '执行中', stepType: 'vision', target: 'VT-003' },
    { id: 'STEP-003', name: '仓储区巡检', status: '等待前置条件', stepType: 'robot', target: 'AMR-001' },
    { id: 'STEP-004', name: '返航充电', status: '等待前置条件', stepType: 'device', target: 'CHARGE-001' },
  ],
  'TASK-007': [
    { id: 'STEP-001', name: '选择底座', status: '等待前置条件', stepType: 'robot', target: 'AMR-001' },
    { id: 'STEP-002', name: '开始建图', status: '等待前置条件', stepType: 'device', target: 'MAP-SVC-001' },
    { id: 'STEP-003', name: '保存地图', status: '等待前置条件', stepType: 'device', target: 'MAP-SVC-001' },
  ],
});

[
  { name: '定位丢失', device: 'AMR-001', type: '机器人报警', level: '高危', status: '未处理', time: '09:12:08', jumpTarget: 'robot-monitor', robotId: 'AMR-001', relatedTask: 'TASK-006' },
  { name: '底盘离线', device: 'CHASSIS-001', type: '机器人报警', level: '高危', status: '已恢复', time: '09:04:12', jumpTarget: 'robot-monitor', robotId: 'AMR-001', relatedTask: 'TASK-006' },
  { name: '电量过低', device: 'AMR-002', type: '机器人报警', level: '中危', status: '已恢复', time: '08:58:20', jumpTarget: 'robot-monitor', robotId: 'AMR-002', relatedTask: '无' },
  { name: '激光雷达异常', device: 'LIDAR-001', type: '机器人报警', level: '中危', status: '已恢复', time: '08:51:40', jumpTarget: 'devices', robotId: 'AMR-001', relatedTask: 'TASK-006' },
  { name: '急停触发', device: 'AMR-001', type: '机器人报警', level: '高危', status: '已恢复', time: '08:45:10', jumpTarget: 'robot-monitor', robotId: 'AMR-001', relatedTask: '无' },
  { name: '导航失败', device: 'NAV-SVC-001', type: '机器人报警', level: '中危', status: '处理中', time: '08:42:18', jumpTarget: 'robot-monitor', robotId: 'AMR-001', relatedTask: 'TASK-006' },
  { name: '建图失败', device: 'MAP-SVC-001', type: '机器人报警', level: '中危', status: '已恢复', time: '08:31:16', jumpTarget: 'map-management', robotId: 'AMR-001', relatedTask: 'TASK-007' },
  { name: '路径阻塞', device: 'AMR-001', type: '机器人报警', level: '中危', status: '处理中', time: '08:28:22', jumpTarget: 'robot-monitor', robotId: 'AMR-001', relatedTask: 'TASK-006' },
  { name: '充电失败', device: 'CHARGE-001', type: '机器人报警', level: '中危', status: '已恢复', time: '08:20:00', jumpTarget: 'devices', robotId: 'AMR-002', relatedTask: '无' },
].forEach((alarm) => {
  if (!alarms.some((row) => row.name === alarm.name && row.device === alarm.device)) alarms.push(alarm);
});

[
  { time: '09:12:08', objectType: 'robot', objectId: 'AMR-001', deviceId: 'AMR-001', taskId: 'TASK-006', logType: '指令', content: '开始巡检', params: 'map=M001 route=R001', status: '待回执', result: '已下发' },
  { time: '09:11:50', objectType: 'robot', objectId: 'AMR-001', deviceId: 'AMR-001', taskId: 'TASK-006', logType: '指令', content: '暂停巡检', params: 'reason=manual', status: '已确认', result: '已下发' },
  { time: '09:11:44', objectType: 'robot', objectId: 'AMR-001', deviceId: 'AMR-001', taskId: 'TASK-006', logType: '指令', content: '继续巡检', params: 'route=R001', status: '已确认', result: '已下发' },
  { time: '09:11:30', objectType: 'robot', objectId: 'AMR-001', deviceId: 'AMR-001', taskId: 'TASK-006', logType: '指令', content: '停止巡检', params: 'safe_stop=true', status: '已确认', result: '已下发' },
  { time: '09:11:20', objectType: 'robot', objectId: 'AMR-001', deviceId: 'AMR-001', taskId: '无', logType: '指令', content: '返航充电', params: 'charge=P004', status: '已确认', result: '已下发' },
  { time: '09:11:10', objectType: 'mapping', objectId: 'MAP_TASK_001', deviceId: 'AMR-001', taskId: 'TASK-007', logType: '指令', content: '开始建图', params: 'mapName=车间A自动扫描地图', status: '待回执', result: '已下发' },
  { time: '09:10:56', objectType: 'mapping', objectId: 'MAP_TASK_001', deviceId: 'AMR-001', taskId: 'TASK-007', logType: '指令', content: '暂停建图', params: 'progress=35%', status: '已确认', result: '已下发' },
  { time: '09:10:42', objectType: 'mapping', objectId: 'MAP_TASK_001', deviceId: 'AMR-001', taskId: 'TASK-007', logType: '指令', content: '继续建图', params: 'progress=35%', status: '已确认', result: '已下发' },
  { time: '09:10:28', objectType: 'mapping', objectId: 'MAP_TASK_001', deviceId: 'AMR-001', taskId: 'TASK-007', logType: '指令', content: '停止建图', params: 'generate_preview=true', status: '超时', result: '已下发' },
  { time: '09:10:16', objectType: 'map', objectId: 'M003', deviceId: 'MAP-SVC-001', taskId: 'TASK-007', logType: '指令', content: '保存地图', params: 'map=M003', status: '失败', result: '下发失败' },
  { time: '09:10:02', objectType: 'robot', objectId: 'AMR-001', deviceId: 'AMR-001', taskId: '无', logType: '指令', content: '手动速度控制', params: 'linear=0.20 angular=0.0', status: '已确认', result: '已下发' },
].forEach((log) => commandLogs.push(log));

robotCommandLogs.forEach((log) => telemetryLogs.push(log));
[
  { time: '09:08:18', objectType: 'mapping', objectId: 'MAP_TASK_001', deviceId: 'AMR-001', taskId: 'TASK-007', logType: '建图', content: '建图暂停', params: 'operator01', status: '成功', operator: 'operator01' },
  { time: '09:07:30', objectType: 'mapping', objectId: 'MAP_TASK_000', deviceId: 'AMR-002', taskId: '', logType: '建图', content: '建图保存', params: '二号仓储地图', status: '成功', operator: 'map-admin' },
  { time: '09:06:20', objectType: 'patrol', objectId: 'TASK-006', deviceId: 'AMR-001', taskId: 'TASK-006', logType: '巡检', content: '巡检结束', params: 'R001', status: '成功', operator: 'system' },
  { time: '09:05:20', objectType: 'chassis', objectId: 'AMR-001', deviceId: 'AMR-001', taskId: '', logType: '底盘', content: '急停触发', params: 'estop=true', status: '异常', operator: 'system' },
].forEach((log) => auditLogs.push(log));

// armVisionMockPatch: 机械臂控制与视觉识别第一版前端 mock 扩展。
export const robotArms = [
  {
    armId: 'ARM-001',
    name: '上下料开门机械臂',
    type: '六轴机械臂',
    onlineStatus: '在线',
    online: '在线',
    runStatus: '运行中',
    controlMode: '自动',
    currentTask: 'TASK-001',
    currentAction: '上抬把手',
    toolId: 'TOOL-001',
    toolStatus: '夹爪已安装 / 已打开',
    pose: 'X420 Y118 Z264 / Rx180 Ry0 Rz90',
    emergencyStatus: '未触发',
    alarmStatus: '无报警',
    updatedAt: '09:11:18',
  },
  {
    armId: 'ARM-002',
    name: '搬运协作机械臂',
    type: '协作机械臂',
    onlineStatus: '在线',
    online: '在线',
    runStatus: '待机',
    controlMode: '人工接管',
    currentTask: '无',
    currentAction: '安全位待机',
    toolId: 'TOOL-002',
    toolStatus: '吸盘已安装 / 真空保持',
    pose: 'X190 Y330 Z140 / Rx180 Ry0 Rz0',
    emergencyStatus: '未触发',
    alarmStatus: '无报警',
    updatedAt: '09:10:42',
  },
  {
    armId: 'ARM-003',
    name: '三号机械臂',
    type: '六轴机械臂',
    onlineStatus: '离线',
    online: '离线',
    runStatus: '异常',
    controlMode: '-',
    currentTask: '无',
    currentAction: '无',
    toolId: 'GRIPPER-003',
    toolStatus: '异常',
    pose: '-',
    emergencyStatus: '未知',
    alarmStatus: '机械臂离线',
    updatedAt: '09:10:22',
  },
];

export const endEffectors = [
  { toolId: 'TOOL-001', toolType: '夹爪', armId: 'ARM-001', installStatus: '已安装', openCloseStatus: '已打开', suctionStatus: '-', adsorbStatus: '-', pressure: '0.42 MPa', currentTask: 'TASK-001', alarmStatus: '无报警', updatedAt: '09:11:18' },
  { toolId: 'TOOL-002', toolType: '吸盘', armId: 'ARM-002', installStatus: '已安装', openCloseStatus: '-', suctionStatus: '已吸附', adsorbStatus: '已吸附', pressure: '-68 kPa', currentTask: '无', alarmStatus: '无报警', updatedAt: '09:10:42' },
  { toolId: 'TOOL-003', toolType: '磁吸', armId: 'ARM-001', installStatus: '未安装', openCloseStatus: '-', suctionStatus: '-', adsorbStatus: '-', pressure: '-', currentTask: '无', alarmStatus: '无报警', updatedAt: '09:00:12' },
  { toolId: 'TOOL-004', toolType: '扫码枪', armId: 'ARM-002', installStatus: '备用', openCloseStatus: '-', suctionStatus: '-', adsorbStatus: '-', pressure: '-', currentTask: '无', alarmStatus: '无报警', updatedAt: '08:58:30' },
  { toolId: 'GRIPPER-003', toolType: '夹爪', armId: 'ARM-003', installStatus: '异常', openCloseStatus: '-', suctionStatus: '-', adsorbStatus: '-', pressure: '-', currentTask: '无', alarmStatus: '机械臂离线', updatedAt: '09:10:22' },
];

export const armActionSteps = [
  { armId: 'ARM-001', taskId: 'TASK-001', stepNo: 1, actionName: '视觉识别把手', targetPoint: 'CAM-001', status: '已完成' },
  { armId: 'ARM-001', taskId: 'TASK-001', stepNo: 2, actionName: '机械臂移动到开门点', targetPoint: 'DOOR-P01', status: '已完成' },
  { armId: 'ARM-001', taskId: 'TASK-001', stepNo: 3, actionName: '上抬把手', targetPoint: 'HANDLE-P01', status: '执行中' },
  { armId: 'ARM-001', taskId: 'TASK-001', stepNo: 4, actionName: '外拉开门', targetPoint: 'DOOR-P02', status: '待执行' },
  { armId: 'ARM-001', taskId: 'TASK-001', stepNo: 5, actionName: '确认门已打开', targetPoint: 'CAM-002', status: '待执行' },
  { armId: 'ARM-002', taskId: '无', stepNo: 1, actionName: '退回安全位', targetPoint: 'SAFE-P01', status: '已完成' },
  { armId: 'ARM-002', taskId: '无', stepNo: 2, actionName: '等待人工释放', targetPoint: '-', status: '待执行' },
  { armId: 'ARM-003', taskId: '无', stepNo: 1, actionName: '等待离线恢复', targetPoint: '-', status: '失败' },
];

export const armTeachingPoints = [
  { pointId: 'TP-DOOR-001', pointName: '开门预备位', pointType: '开门点', armId: 'ARM-001', relatedDevice: 'CNC-001', relatedWorkstation: '设备门区', relatedMapPoint: 'DOOR-P01', relatedTaskStep: 'TASK-001 / 设备开门', relatedVisionMarker: 'MARKER-HANDLE-001', jointAngles: 'J1 12 / J2 -34 / J3 58 / J4 0 / J5 42 / J6 90', endPose: 'X410 Y120 Z260 / Rx180 Ry0 Rz90', toolState: '夹爪打开', enabled: true, verified: true, updatedAt: '09:12:20', remark: '门把手识别后的预备点', usedByTemplates: ['TPL-DOOR-001'] },
  { pointId: 'TP-HANDLE-001', pointName: '把手上抬点', pointType: '开门点', armId: 'ARM-001', relatedDevice: 'CNC-001', relatedWorkstation: '设备门区', relatedMapPoint: 'HANDLE-P01', relatedTaskStep: 'TASK-001 / 上抬把手', relatedVisionMarker: 'MARKER-HANDLE-001', jointAngles: 'J1 16 / J2 -42 / J3 66 / J4 0 / J5 38 / J6 90', endPose: 'X435 Y132 Z118 / Rx180 Ry0 Rz90', toolState: '夹爪闭合', enabled: true, verified: true, updatedAt: '09:11:40', remark: '夹爪夹持把手后上抬', usedByTemplates: ['TPL-DOOR-001'] },
  { pointId: 'TP-DOOR-OPEN-001', pointName: '外拉开门点', pointType: '开门点', armId: 'ARM-001', relatedDevice: 'CNC-001', relatedWorkstation: '设备门区', relatedMapPoint: 'DOOR-P02', relatedTaskStep: 'TASK-001 / 外拉开门', relatedVisionMarker: 'MARKER-DOOR-001', jointAngles: 'J1 18 / J2 -38 / J3 62 / J4 4 / J5 40 / J6 92', endPose: 'X462 Y146 Z126 / Rx180 Ry0 Rz94', toolState: '夹爪闭合', enabled: true, verified: true, updatedAt: '09:11:18', remark: '门把手外拉轨迹终点', usedByTemplates: ['TPL-DOOR-001'] },
  { pointId: 'TP-PICK-001', pointName: '取料抓取点', pointType: '抓取点', armId: 'ARM-001', relatedDevice: '取料工位-A', relatedWorkstation: 'WS-001', relatedMapPoint: 'PICK-P01', relatedTaskStep: 'TASK-008 / 夹爪抓取', relatedVisionMarker: 'MARKER-TRAY-001', jointAngles: 'J1 8 / J2 -44 / J3 61 / J4 0 / J5 36 / J6 88', endPose: 'X388 Y162 Z102 / Rx180 Ry0 Rz88', toolState: '夹爪打开', enabled: false, verified: false, updatedAt: '09:10:18', remark: '未完成负载校验，暂不能用于正式任务', usedByTemplates: ['TPL-PICK-001'] },
  { pointId: 'TP-PLACE-001', pointName: '放料点', pointType: '放料点', armId: 'ARM-001', relatedDevice: '放料架-01', relatedWorkstation: 'WS-001', relatedMapPoint: 'PLACE-P01', relatedTaskStep: 'TASK-008 / 转运放料', relatedVisionMarker: 'MARKER-PLACE-001', jointAngles: 'J1 -22 / J2 -30 / J3 54 / J4 0 / J5 46 / J6 0', endPose: 'X190 Y330 Z140 / Rx180 Ry0 Rz0', toolState: '夹爪闭合', enabled: true, verified: true, updatedAt: '09:08:30', remark: '放料架一号位', usedByTemplates: ['TPL-PLACE-001'] },
  { pointId: 'TP-RESET-001', pointName: '夹爪复位点', pointType: '复位点', armId: 'ARM-002', relatedDevice: '安全区', relatedWorkstation: '维护位', relatedMapPoint: 'SAFE-P01', relatedTaskStep: '通用复位', relatedVisionMarker: '-', jointAngles: 'J1 0 / J2 -20 / J3 50 / J4 0 / J5 35 / J6 0', endPose: 'X210 Y260 Z220 / Rx180 Ry0 Rz0', toolState: '吸盘释放', enabled: true, verified: true, updatedAt: '08:58:30', remark: '人工接管前安全姿态', usedByTemplates: ['TPL-RESET-001'] },
];

export const armActionTemplates = [
  { templateId: 'TPL-DOOR-001', templateName: '设备开门模板', actionType: '开门', armId: 'ARM-001', relatedTaskType: '上下料任务', taskType: '上下料任务', enabled: true, stepCount: 5, updatedAt: '09:13:12', remark: '用于 CNC 设备门把手识别、上抬和外拉开门', steps: [
    { stepId: 'S1', stepName: '视觉识别把手', actionType: '视觉确认', targetTeachingPoint: '-', relatedVisionMarker: 'MARKER-HANDLE-001', condition: '识别成功', timeout: '5s', failurePolicy: '失败转人工', configStatus: '已配置' },
    { stepId: 'S2', stepName: '移动到开门点', actionType: '机械臂移动', targetTeachingPoint: 'TP-DOOR-001', relatedVisionMarker: '-', condition: '点位已校验', timeout: '8s', failurePolicy: '重试 1 次', configStatus: '已配置' },
    { stepId: 'S3', stepName: '上抬把手', actionType: '机械臂动作', targetTeachingPoint: 'TP-HANDLE-001', relatedVisionMarker: '-', condition: '夹爪状态正常', timeout: '6s', failurePolicy: '重试 1 次', configStatus: '已配置' },
    { stepId: 'S4', stepName: '外拉开门', actionType: '机械臂动作', targetTeachingPoint: 'TP-DOOR-OPEN-001', relatedVisionMarker: '-', condition: '门体未锁定', timeout: '6s', failurePolicy: '失败转人工', configStatus: '已配置' },
    { stepId: 'S5', stepName: '确认门已打开', actionType: '视觉确认', targetTeachingPoint: '-', relatedVisionMarker: 'MARKER-DOOR-001', condition: '识别通过', timeout: '5s', failurePolicy: '失败报警', configStatus: '已配置' },
  ] },
  { templateId: 'TPL-PICK-001', templateName: '料盘抓取模板', actionType: '抓取', armId: 'ARM-001', relatedTaskType: '上下料任务', taskType: '上下料任务', enabled: true, stepCount: 4, updatedAt: '09:08:34', remark: '取料工位视觉定位后夹爪抓取', steps: [
    { stepId: 'S1', stepName: '视觉定位料盘', actionType: '视觉确认', targetTeachingPoint: '-', relatedVisionMarker: 'MARKER-TRAY-001', condition: '识别成功', timeout: '5s', failurePolicy: '失败转人工', configStatus: '已配置' },
    { stepId: 'S2', stepName: '移动到抓取点', actionType: '机械臂移动', targetTeachingPoint: 'TP-PICK-001', relatedVisionMarker: '-', condition: '点位已校验', timeout: '8s', failurePolicy: '重试 1 次', configStatus: '异常' },
    { stepId: 'S3', stepName: '关闭夹爪', actionType: '末端工具', targetTeachingPoint: 'TP-PICK-001', relatedVisionMarker: '-', condition: '夹爪状态正常', timeout: '4s', failurePolicy: '失败报警', configStatus: '异常' },
    { stepId: 'S4', stepName: '抬升复核', actionType: '机械臂动作', targetTeachingPoint: 'TP-PICK-001', relatedVisionMarker: 'MARKER-GRIP-001', condition: '抓取稳定', timeout: '6s', failurePolicy: '失败转人工', configStatus: '异常' },
  ] },
  { templateId: 'TPL-PLACE-001', templateName: '物料放置模板', actionType: '放料', armId: 'ARM-001', relatedTaskType: '上下料任务', taskType: '上下料任务', enabled: false, stepCount: 4, updatedAt: '09:04:18', remark: '转运到放料架一号位', steps: [
    { stepId: 'S1', stepName: '移动到放料点', actionType: '机械臂移动', targetTeachingPoint: 'TP-PLACE-001', relatedVisionMarker: '-', condition: '点位已校验', timeout: '8s', failurePolicy: '重试 1 次', configStatus: '已配置' },
    { stepId: 'S2', stepName: '打开夹爪', actionType: '末端工具', targetTeachingPoint: 'TP-PLACE-001', relatedVisionMarker: '-', condition: '夹爪状态正常', timeout: '4s', failurePolicy: '失败报警', configStatus: '已配置' },
    { stepId: 'S3', stepName: '退出放料区', actionType: '机械臂动作', targetTeachingPoint: 'TP-RESET-001', relatedVisionMarker: '-', condition: '路径安全', timeout: '6s', failurePolicy: '重试 1 次', configStatus: '已配置' },
    { stepId: 'S4', stepName: '视觉确认放料', actionType: '视觉确认', targetTeachingPoint: '-', relatedVisionMarker: 'MARKER-PLACE-001', condition: '识别通过', timeout: '5s', failurePolicy: '失败报警', configStatus: '已配置' },
  ] },
  { templateId: 'TPL-RESET-001', templateName: '夹爪复位模板', actionType: '复位', armId: 'ARM-001, ARM-002', relatedTaskType: '通用', taskType: '通用', enabled: true, stepCount: 3, updatedAt: '08:52:16', remark: '夹爪和机械臂退回安全位', steps: [
    { stepId: 'S1', stepName: '停止当前动作', actionType: '安全控制', targetTeachingPoint: '-', relatedVisionMarker: '-', condition: '允许复位', timeout: '3s', failurePolicy: '失败报警', configStatus: '已配置' },
    { stepId: 'S2', stepName: '移动到复位点', actionType: '机械臂移动', targetTeachingPoint: 'TP-RESET-001', relatedVisionMarker: '-', condition: '点位已校验', timeout: '8s', failurePolicy: '重试 1 次', configStatus: '已配置' },
    { stepId: 'S3', stepName: '释放末端工具', actionType: '末端工具', targetTeachingPoint: 'TP-RESET-001', relatedVisionMarker: '-', condition: '工具在线', timeout: '4s', failurePolicy: '失败报警', configStatus: '已配置' },
  ] },
];

export const teachingPointLogs = [
  { time: '09:12:20', pointId: 'TP-HANDLE-001', operation: '编辑', content: '调整 Z +5mm', operator: 'admin', impactScope: '设备开门模板', status: '成功' },
  { time: '09:10:18', pointId: 'TP-PICK-001', operation: '校验', content: '校验未通过，等待负载复核', operator: 'engineer', impactScope: '取料动作', status: '待处理' },
  { time: '09:08:30', pointId: 'TP-PLACE-001', operation: '新增', content: '新增放料点', operator: 'admin', impactScope: '放料方案二', status: '成功' },
];

export const armTemplateLogs = [
  { time: '09:13:12', templateId: 'TPL-DOOR-001', templateName: '设备开门模板', armId: 'ARM-001', relatedTask: 'TASK-001', result: '成功', receiptStatus: '已确认', duration: '12.4s', operator: 'admin' },
  { time: '09:08:30', templateId: 'TPL-PICK-001', templateName: '料盘抓取模板', armId: 'ARM-001', relatedTask: 'TASK-001', result: '成功', receiptStatus: '已确认', duration: '8.1s', operator: 'admin' },
  { time: '09:04:18', templateId: 'TPL-PLACE-001', templateName: '物料放置模板', armId: 'ARM-001', relatedTask: 'TASK-004', result: '失败', receiptStatus: '超时', duration: '-', operator: 'engineer' },
];

export const armActionLogs = [
  { time: '09:11:02', armId: 'ARM-001', actionName: '移动到开门点', action: '移动到开门点', targetPoint: 'DOOR-P01', result: '成功', receiptStatus: '已确认', relatedTask: 'TASK-001', taskId: 'TASK-001', operator: 'admin' },
  { time: '09:10:58', armId: 'ARM-001', actionName: '打开夹爪', action: '打开夹爪', targetPoint: '-', result: '成功', receiptStatus: '已确认', relatedTask: 'TASK-001', taskId: 'TASK-001', operator: 'admin' },
  { time: '09:10:20', armId: 'ARM-001', actionName: '上抬把手', action: '上抬把手', targetPoint: 'HANDLE-P01', result: '执行中', receiptStatus: '待回执', relatedTask: 'TASK-001', taskId: 'TASK-001', operator: 'admin' },
  { time: '09:09:42', armId: 'ARM-002', actionName: '退回安全位', action: '退回安全位', targetPoint: 'SAFE-P01', result: '成功', receiptStatus: '已确认', relatedTask: '无', taskId: '无', operator: 'engineer01' },
  { time: '09:10:22', armId: 'ARM-003', actionName: '等待离线恢复', action: '等待离线恢复', targetPoint: '-', result: '失败', receiptStatus: '超时', relatedTask: '无', taskId: '无', operator: 'system' },
];

export const armCommandReceipts = [
  { id: 'CMD-ARM-001', commandId: 'CMD-ARM-001', deviceId: 'ARM-001', objectType: 'arm', objectId: 'ARM-001', commandName: '执行开门动作', params: 'template=AT-001 target=DOOR-P01', sendResult: '已下发', receiptStatus: '已确认', stage: '设备已确认', relatedTask: 'TASK-001', sender: 'admin', sendTime: '09:11:02', receiptTime: '09:11:04', duration: '2.1s', failReason: '-', suggestion: '设备已确认执行，当前无需处理。', handledBy: '-', handledAt: '-', targetArm: 'ARM-001' },
];

export const cameras = [
  { cameraId: 'CAM-001', cameraName: '上料位相机', position: 'CNC-002 上料位', relatedDevice: 'CNC-002 / WS-001', ip: '10.10.2.21', resolution: '1920x1080', fps: '30 fps', exposure: '6 ms', light: '环形光 LGT-001', online: '在线', updatedAt: '09:14:08' },
  { cameraId: 'CAM-002', cameraName: '抓取复核相机', position: '机械臂末端', relatedDevice: 'ARM-001 / WS-001', ip: '10.10.2.22', resolution: '1280x720', fps: '60 fps', exposure: '4 ms', light: '同轴光 LGT-002', online: '在线', updatedAt: '09:13:54' },
  { cameraId: 'CAM-003', cameraName: '安全区域相机', position: '主通道', relatedDevice: 'AMR-001 / 主通道', ip: '10.10.2.23', resolution: '1920x1080', fps: '25 fps', exposure: '8 ms', light: '区域光 LGT-003', online: '离线', updatedAt: '09:10:12' },
];

export const visionTasks = [
  { visionTaskId: 'VT-001', taskName: '物料位置识别', recognitionType: '物体定位', cameraId: 'CAM-001', relatedDevice: 'CNC-002', workstation: 'WS-001', relatedRobotTask: 'TASK-008', modelVersion: 'LOC-MAT-v2.3', triggerMode: '任务步骤触发', status: '识别中' },
  { visionTaskId: 'VT-002', taskName: '抓取结果确认', recognitionType: '姿态识别', cameraId: 'CAM-002', relatedDevice: 'ARM-001', workstation: 'WS-001', relatedRobotTask: 'TASK-008', modelVersion: 'GRIP-v1.8', triggerMode: '机械臂动作后触发', status: '待触发' },
  { visionTaskId: 'VT-003', taskName: '安全区域判断', recognitionType: '安全区域判断', cameraId: 'CAM-003', relatedDevice: 'AMR-001', workstation: '主通道', relatedRobotTask: 'TASK-006', modelVersion: 'SAFE-v1.2', triggerMode: '周期触发', status: '异常' },
  { visionTaskId: 'VT-004', taskName: '二维码读取', recognitionType: '二维码 / 条码识别', cameraId: 'CAM-001', relatedDevice: 'CNC-002', workstation: 'WS-001', relatedRobotTask: 'TASK-009', modelVersion: 'CODE-v1.1', triggerMode: '人工触发', status: '待执行' },
];

export const visionResults = [
  { time: '09:14:08', cameraId: 'CAM-001', visionTaskId: 'VT-001', object: '物料 A-102', result: '通过', confidence: '96%', duration: '128 ms', relatedTask: 'TASK-008', relatedDevice: 'CNC-002', screenshot: 'mock://vision/CAM-001/001', processStatus: '已上传', imageType: 'material-position', frameStatus: 'SNAPSHOT', bbox: { x: 36, y: 32, width: 28, height: 24, label: '物料 A-102 / 96%' }, roi: { x: 24, y: 22, width: 56, height: 48 } },
  { time: '09:13:50', cameraId: 'CAM-002', visionTaskId: 'VT-002', object: '夹爪姿态', result: '低置信度', confidence: '62%', duration: '156 ms', relatedTask: 'TASK-008', relatedDevice: 'ARM-001', screenshot: 'mock://vision/CAM-002/002', processStatus: '待复核', imageType: 'gripper-pose', frameStatus: 'SNAPSHOT', bbox: { x: 44, y: 28, width: 24, height: 34, label: '夹爪姿态 / 62%' }, roi: { x: 30, y: 18, width: 52, height: 58 } },
  { time: '09:10:12', cameraId: 'CAM-003', visionTaskId: 'VT-003', object: '安全区域', result: '异常', confidence: '0%', duration: '-', relatedTask: 'TASK-006', relatedDevice: 'AMR-001', screenshot: 'mock://vision/CAM-003/offline', processStatus: '处理中', imageType: 'safety-area', frameStatus: 'OFFLINE', bbox: { x: 18, y: 20, width: 64, height: 52, label: '安全区域异常 / 0%' }, roi: { x: 12, y: 16, width: 76, height: 62 } },
  { time: '09:13:20', cameraId: 'CAM-001', visionTaskId: 'VT-004', object: '二维码 / 条码', result: '待执行', confidence: '-', duration: '-', relatedTask: 'TASK-009', relatedDevice: 'CNC-002', screenshot: 'mock://vision/CAM-001/code', processStatus: '待识别', imageType: 'code-read', frameStatus: 'LIVE', bbox: { x: 58, y: 34, width: 18, height: 18, label: '二维码区域' }, roi: { x: 48, y: 24, width: 36, height: 36 } },
];

export const visionModels = [
  { modelName: '物料定位模型', modelType: '物体定位', version: 'LOC-MAT-v2.3', task: '物料位置识别', deployStatus: '已部署', updatedAt: '09:00:00', accuracy: '98.2%', remark: '用于上料位物料中心点定位' },
  { modelName: '抓取姿态模型', modelType: '姿态识别', version: 'GRIP-v1.8', task: '抓取结果确认', deployStatus: '已部署', updatedAt: '08:50:12', accuracy: '94.6%', remark: '用于夹爪闭合后的姿态复核' },
  { modelName: '安全区域模型', modelType: '安全区域判断', version: 'SAFE-v1.2', task: '安全区域判断', deployStatus: '加载失败', updatedAt: '08:42:00', accuracy: '92.0%', remark: '相机离线时无法运行' },
];

export const visionLogs = [
  { time: '09:14:08', objectType: 'vision', objectId: 'VT-001', deviceId: 'CAM-001', taskId: 'TASK-008', logType: '视觉识别', content: '识别任务执行：物料位置识别', params: 'LOC-MAT-v2.3', status: '成功' },
  { time: '09:13:50', objectType: 'camera', objectId: 'CAM-002', deviceId: 'CAM-002', taskId: 'TASK-008', logType: '相机', content: '相机拍照：抓取复核相机', params: '1280x720', status: '成功' },
  { time: '09:12:58', objectType: 'model', objectId: 'SAFE-v1.2', deviceId: 'VISION-SVC-001', taskId: 'TASK-006', logType: '模型', content: '模型加载失败：安全区域模型', params: 'SAFE-v1.2', status: '异常' },
];

Object.assign(devicePoints, {
  'ARM-001': [
    { device: 'ARM-001', name: '机械臂在线状态', code: 'arm_online', pointType: 'status', value: '在线', status: '正常', quality: '良好', updatedAt: '09:14:12' },
    { device: 'ARM-001', name: '机械臂运行状态', code: 'arm_run_status', pointType: 'status', value: '运行中', status: '正常', quality: '良好', updatedAt: '09:14:12' },
    { device: 'ARM-001', name: '关节角度', code: 'joint_angles', pointType: 'status', value: '12,-34,58,0,42,90', status: '正常', quality: '良好', updatedAt: '09:14:12' },
    { device: 'ARM-001', name: '末端坐标', code: 'end_pose', pointType: 'status', value: 'X410 Y120 Z260', status: '正常', quality: '良好', updatedAt: '09:14:12' },
    { device: 'ARM-001', name: '夹爪状态', code: 'gripper_status', pointType: 'status', value: '已打开', status: '正常', quality: '良好', updatedAt: '09:14:02' },
  ],
  'ARM-002': [
    { device: 'ARM-002', name: '机械臂在线状态', code: 'arm_online', pointType: 'status', value: '在线', status: '正常', quality: '良好', updatedAt: '09:13:48' },
    { device: 'ARM-002', name: '机械臂运行状态', code: 'arm_run_status', pointType: 'status', value: '待机', status: '正常', quality: '良好', updatedAt: '09:13:48' },
    { device: 'ARM-002', name: '末端坐标', code: 'end_pose', pointType: 'status', value: 'X190 Y330 Z140', status: '正常', quality: '良好', updatedAt: '09:13:48' },
    { device: 'ARM-002', name: '吸盘真空值', code: 'vacuum_value', pointType: 'numeric', value: '-68 kPa', status: '正常', quality: '良好', updatedAt: '09:13:40' },
  ],
  'ARM-003': [
    { device: 'ARM-003', name: '机械臂在线状态', code: 'arm_online', pointType: 'status', value: '离线', status: '异常', quality: '异常', updatedAt: '09:10:22' },
    { device: 'ARM-003', name: '夹爪状态', code: 'gripper_status', pointType: 'status', value: '未闭合', status: '异常', quality: '异常', updatedAt: '09:10:22' },
  ],
  'GRIPPER-001': [
    { device: 'GRIPPER-001', name: '夹爪状态', code: 'gripper_status', pointType: 'status', value: '已打开', status: '正常', quality: '良好', updatedAt: '09:14:02' },
  ],
  'SUCTION-001': [
    { device: 'SUCTION-001', name: '吸盘真空值', code: 'vacuum_value', pointType: 'numeric', value: '-68 kPa', status: '正常', quality: '良好', updatedAt: '09:13:40' },
  ],
  'CAM-001': [
    { device: 'CAM-001', name: '相机在线状态', code: 'camera_online', pointType: 'status', value: '在线', status: '正常', quality: '良好', updatedAt: '09:14:08' },
    { device: 'CAM-001', name: '拍照状态', code: 'capture_status', pointType: 'status', value: '已拍照', status: '正常', quality: '良好', updatedAt: '09:14:08' },
    { device: 'CAM-001', name: '识别状态', code: 'recognition_status', pointType: 'status', value: '识别中', status: '正常', quality: '良好', updatedAt: '09:14:08' },
    { device: 'CAM-001', name: '识别结果', code: 'recognition_result', pointType: 'status', value: '通过', status: '正常', quality: '良好', updatedAt: '09:14:08' },
    { device: 'CAM-001', name: '模型版本', code: 'model_version', pointType: 'status', value: 'LOC-MAT-v2.3', status: '正常', quality: '良好', updatedAt: '09:14:08' },
    { device: 'CAM-001', name: '识别耗时', code: 'recognition_duration', pointType: 'numeric', value: '128 ms', status: '正常', quality: '良好', updatedAt: '09:14:08' },
  ],
  'CAM-002': [
    { device: 'CAM-002', name: '相机在线状态', code: 'camera_online', pointType: 'status', value: '在线', status: '正常', quality: '良好', updatedAt: '09:13:50' },
    { device: 'CAM-002', name: '识别结果', code: 'recognition_result', pointType: 'status', value: '低置信度', status: '偏高', quality: '不确定', updatedAt: '09:13:50' },
    { device: 'CAM-002', name: '识别耗时', code: 'recognition_duration', pointType: 'numeric', value: '156 ms', status: '正常', quality: '良好', updatedAt: '09:13:50' },
  ],
  'CAM-003': [
    { device: 'CAM-003', name: '相机在线状态', code: 'camera_online', pointType: 'status', value: '离线', status: '异常', quality: '异常', updatedAt: '09:10:12' },
  ],
  'VISION-SVC-001': [
    { device: 'VISION-SVC-001', name: '模型版本', code: 'model_version', pointType: 'status', value: 'SAFE-v1.2', status: '异常', quality: '异常', updatedAt: '09:12:58' },
    { device: 'VISION-SVC-001', name: '识别状态', code: 'recognition_status', pointType: 'status', value: '模型加载失败', status: '异常', quality: '异常', updatedAt: '09:12:58' },
  ],
});

taskPoints['TASK-008'] = [...(devicePoints['ARM-001'] ?? []), ...(devicePoints['CAM-001'] ?? [])];
taskPoints['TASK-009'] = devicePoints['CAM-001'];

stepsByTask['TASK-008'] = [
  { id: 'STEP-001', name: '底盘移动到工位', status: '完成', stepType: 'robot', target: 'AMR-001' },
  { id: 'STEP-002', name: '视觉识别物料位置', status: '完成', stepType: 'vision', target: 'VT-001' },
  { id: 'STEP-003', name: '设备开门', status: '执行中', stepType: 'arm', target: 'ARM-001', templateId: 'TPL-DOOR-001', templateName: '设备开门模板' },
  { id: 'STEP-004', name: '夹爪抓取', status: '等待前置条件', stepType: 'arm', target: 'ARM-001', templateId: 'TPL-PICK-001', templateName: '料盘抓取模板' },
  { id: 'STEP-005', name: '视觉确认抓取结果', status: '等待前置条件', stepType: 'vision', target: 'VT-002' },
  { id: 'STEP-006', name: '转运放料', status: '等待前置条件', stepType: 'arm', target: 'ARM-001', templateId: 'TPL-PLACE-001', templateName: '物料放置模板' },
  { id: 'STEP-007', name: '视觉确认放置结果', status: '等待前置条件', stepType: 'vision', target: 'VT-002' },
  { id: 'STEP-008', name: '任务完成', status: '等待前置条件', stepType: 'task', target: 'TASK-008' },
];
stepsByTask['TASK-009'] = [
  { id: 'STEP-001', name: '相机拍照', status: '等待前置条件', stepType: 'vision', target: 'CAM-001' },
  { id: 'STEP-002', name: '开始识别', status: '等待前置条件', stepType: 'vision', target: 'VT-004' },
  { id: 'STEP-003', name: '上传识别结果', status: '等待前置条件', stepType: 'vision', target: 'VT-004' },
];

[
  { name: '机械臂离线', device: 'ARM-003', type: '机械臂报警', level: '高危', status: '未处理', time: '09:10:22', jumpTarget: 'arm-control', armId: 'ARM-003', relatedTask: '无' },
  { name: '机械臂急停', device: 'ARM-001', type: '机械臂报警', level: '高危', status: '已恢复', time: '08:58:10', jumpTarget: 'arm-control', armId: 'ARM-001', relatedTask: 'TASK-008' },
  { name: '机械臂运动超限', device: 'ARM-001', type: '机械臂报警', level: '中危', status: '已恢复', time: '08:54:20', jumpTarget: 'arm-control', armId: 'ARM-001', relatedTask: 'TASK-008' },
  { name: '机械臂碰撞风险', device: 'ARM-002', type: '机械臂报警', level: '中危', status: '处理中', time: '08:50:16', jumpTarget: 'arm-control', armId: 'ARM-002', relatedTask: '无' },
  { name: '夹爪未闭合', device: 'GRIPPER-001', type: '末端工具报警', level: '中危', status: '处理中', time: '09:13:50', jumpTarget: 'arm-control', armId: 'ARM-001', relatedTask: 'TASK-008' },
  { name: '吸附失败', device: 'SUCTION-001', type: '末端工具报警', level: '中危', status: '已恢复', time: '08:44:12', jumpTarget: 'arm-control', armId: 'ARM-002', relatedTask: '无' },
  { name: '相机离线', device: 'CAM-003', type: '视觉报警', level: '中危', status: '未处理', time: '09:10:12', jumpTarget: 'vision-recognition', cameraId: 'CAM-003', relatedTask: 'TASK-006' },
  { name: '拍照失败', device: 'CAM-002', type: '视觉报警', level: '中危', status: '已恢复', time: '08:49:30', jumpTarget: 'vision-recognition', cameraId: 'CAM-002', relatedTask: 'TASK-008' },
  { name: '识别失败', device: 'VISION-SVC-001', type: '视觉报警', level: '中危', status: '处理中', time: '08:46:34', jumpTarget: 'vision-recognition', cameraId: 'CAM-001', relatedTask: 'TASK-009' },
  { name: '置信度过低', device: 'CAM-002', type: '视觉报警', level: '低危', status: '处理中', time: '09:13:50', jumpTarget: 'vision-recognition', cameraId: 'CAM-002', relatedTask: 'TASK-008' },
  { name: '模型加载失败', device: 'VISION-SVC-001', type: '视觉报警', level: '高危', status: '未处理', time: '09:12:58', jumpTarget: 'vision-recognition', cameraId: 'CAM-003', relatedTask: 'TASK-006' },
  { name: '视觉服务异常', device: 'VISION-SVC-001', type: '视觉报警', level: '中危', status: '已恢复', time: '08:40:20', jumpTarget: 'vision-recognition', cameraId: 'CAM-001', relatedTask: '无' },
].forEach((alarm) => {
  if (!alarms.some((row) => row.name === alarm.name && row.device === alarm.device)) alarms.push(alarm);
});

[
  { name: '机械臂急停未触发', device: 'ARM-001', status: '满足', time: '09:14:12' },
  { name: '底盘已到位', device: 'AMR-001', status: '满足', time: '09:14:00' },
  { name: '目标区域无人员', device: 'CAM-003', status: '不满足', time: '09:10:12' },
  { name: '夹爪状态正常', device: 'GRIPPER-001', status: '满足', time: '09:14:02' },
  { name: '视觉识别结果通过', device: 'CAM-001', status: '满足', time: '09:14:08' },
  { name: '相机在线', device: 'CAM-003', status: '不满足', time: '09:10:12' },
  { name: '识别结果未超时', device: 'VISION-SVC-001', status: '满足', time: '09:14:08' },
].forEach((item) => {
  if (!interlocks.some((row) => row.name === item.name && row.device === item.device)) interlocks.push(item);
});

[
  { time: '09:14:12', objectType: 'arm', objectId: 'ARM-001', deviceId: 'ARM-001', taskId: 'TASK-008', logType: '指令', content: '机械臂移动', params: 'TP-002', status: '待回执', result: '已下发' },
  { time: '09:14:02', objectType: 'tool', objectId: 'GRIPPER-001', deviceId: 'GRIPPER-001', taskId: 'TASK-008', logType: '指令', content: '夹爪打开', params: 'open=true', status: '已确认', result: '已下发' },
  { time: '09:13:58', objectType: 'tool', objectId: 'GRIPPER-001', deviceId: 'GRIPPER-001', taskId: 'TASK-008', logType: '指令', content: '夹爪关闭', params: 'close=true', status: '超时', result: '已下发' },
  { time: '09:13:42', objectType: 'arm', objectId: 'ARM-001', deviceId: 'ARM-001', taskId: 'TASK-008', logType: '指令', content: '执行动作模板', params: 'AT-001', status: '已确认', result: '已下发' },
  { time: '09:13:20', objectType: 'arm', objectId: 'ARM-001', deviceId: 'ARM-001', taskId: 'TASK-008', logType: '指令', content: '机械臂回零', params: 'home', status: '已确认', result: '已下发' },
  { time: '09:13:10', objectType: 'arm', objectId: 'ARM-001', deviceId: 'ARM-001', taskId: 'TASK-008', logType: '指令', content: '机械臂暂停', params: 'pause', status: '已确认', result: '已下发' },
  { time: '09:13:04', objectType: 'arm', objectId: 'ARM-001', deviceId: 'ARM-001', taskId: 'TASK-008', logType: '指令', content: '机械臂停止', params: 'stop', status: '已确认', result: '已下发' },
  { time: '09:12:50', objectType: 'camera', objectId: 'CAM-001', deviceId: 'CAM-001', taskId: 'TASK-008', logType: '指令', content: '相机拍照', params: 'single', status: '已确认', result: '已下发' },
  { time: '09:12:42', objectType: 'vision', objectId: 'VT-001', deviceId: 'CAM-001', taskId: 'TASK-008', logType: '指令', content: '开始识别', params: 'VT-001', status: '已确认', result: '已下发' },
  { time: '09:12:30', objectType: 'model', objectId: 'LOC-MAT-v2.3', deviceId: 'VISION-SVC-001', taskId: 'TASK-008', logType: '指令', content: '切换模型', params: 'LOC-MAT-v2.3', status: '已确认', result: '已下发' },
  { time: '09:12:20', objectType: 'vision', objectId: 'VT-001', deviceId: 'CAM-001', taskId: 'TASK-008', logType: '指令', content: '上传识别结果', params: 'result=pass', status: '已确认', result: '已下发' },
].forEach((log) => commandLogs.push(log));

[
  { time: '09:14:12', objectType: 'arm', objectId: 'ARM-001', deviceId: 'ARM-001', taskId: 'TASK-008', logType: '机械臂', content: '机械臂动作：移动到抓取位', params: 'TP-002', status: '正常' },
  { time: '09:14:02', objectType: 'tool', objectId: 'GRIPPER-001', deviceId: 'GRIPPER-001', taskId: 'TASK-008', logType: '末端工具', content: '夹爪开合：打开夹爪', params: 'open=true', status: '成功' },
  { time: '09:13:42', objectType: 'arm-template', objectId: 'AT-001', deviceId: 'ARM-001', taskId: 'TASK-008', logType: '机械臂', content: '动作模板执行：视觉定位抓取', params: 'AT-001', status: '成功' },
].forEach((log) => telemetryLogs.push(log));
visionLogs.forEach((log) => telemetryLogs.push(log));
[
  { time: '09:13:28', objectType: 'model', objectId: 'LOC-MAT-v2.3', deviceId: 'VISION-SVC-001', taskId: 'TASK-008', logType: '模型', content: '模型切换：物料定位模型', params: 'LOC-MAT-v2.3', status: '成功', operator: 'vision-admin' },
  { time: '09:12:58', objectType: 'alarm', objectId: '模型加载失败', deviceId: 'VISION-SVC-001', taskId: 'TASK-006', logType: '审计', content: '异常处理：模型加载失败已派发', params: 'system', status: '处理中', operator: 'system' },
].forEach((log) => auditLogs.push(log));

stepLogs.push(
  { time: '09:14:08', objectType: 'task', objectId: 'TASK-008', deviceId: 'CAM-001', taskId: 'TASK-008', logType: '视觉识别', content: '第 2 步：视觉识别物料位置完成', params: 'VT-001', status: '完成' },
  { time: '09:14:12', objectType: 'task', objectId: 'TASK-008', deviceId: 'ARM-001', taskId: 'TASK-008', logType: '机械臂', content: '第 3 步：机械臂移动到抓取位', params: 'TP-002', status: '执行中' },
);
