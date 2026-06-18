// 统一 runtime 数据源 store（mock / static / ws）。
// - mock：委托现有 mockRuntimeStore，保持演示动态效果（不重复启动定时器）。
// - static：用 services 静态初始数据，不启定时器、不连 ws。
// - ws：用静态初始数据打底 + 连接 /ws/runtime，收到消息经 applyRuntimeMessage 增量更新；
//        连接失败/无 url 时保留初始数据，绝不白屏，不无限重连。
// 不删除、不替换 mockRuntimeStore / useMockRuntime；页面可逐步迁移到 useRuntime。
import { RUNTIME_CONFIG } from './runtimeConfig.js';
import {
  getRuntimeSnapshot as getMockRuntimeSnapshot,
  subscribeRuntime as subscribeMockRuntime,
  createInitialRuntimeState,
} from './mockRuntimeStore.js';
import { normalizeRuntimeMessage, applyRuntimeMessage } from './runtimeMessageAdapter.js';
import { createWsRuntimeClient, WS_STATUS } from './wsRuntimeClient.js';

const listeners = new Set();
let started = false;
let mode = 'mock';
let dataState = null;
let connectionStatus = WS_STATUS.IDLE;
let currentSnapshot = null;
let mockUnsub = null;
let wsClient = null;
let statusPoll = null;

function buildSnapshot() {
  currentSnapshot = { ...(dataState || {}), connectionStatus };
}

function notify() {
  buildSnapshot();
  listeners.forEach((listener) => listener());
}

function setStatus(next) {
  if (connectionStatus === next) return;
  connectionStatus = next;
  notify();
}

function syncWsStatus() {
  if (wsClient) setStatus(wsClient.getStatus());
}

function startMode() {
  mode = RUNTIME_CONFIG.runtimeSource;

  if (mode === 'mock') {
    dataState = getMockRuntimeSnapshot();
    connectionStatus = WS_STATUS.IDLE; // 演示动态由 mock 提供，ws 通道未启用
    mockUnsub = subscribeMockRuntime(() => {
      dataState = getMockRuntimeSnapshot();
      notify();
    });
    buildSnapshot();
    return;
  }

  if (mode === 'ws') {
    dataState = createInitialRuntimeState();
    connectionStatus = WS_STATUS.IDLE;
    wsClient = createWsRuntimeClient({
      url: RUNTIME_CONFIG.wsRuntimeUrl,
      reconnectMax: RUNTIME_CONFIG.wsReconnectMax,
      reconnectInterval: RUNTIME_CONFIG.wsReconnectInterval,
      onMessage: (raw) => {
        const message = normalizeRuntimeMessage(raw);
        if (!message) return;
        dataState = applyRuntimeMessage(dataState, message);
        notify();
      },
      onOpen: () => setStatus(WS_STATUS.CONNECTED),
      onClose: () => syncWsStatus(),
      onError: () => syncWsStatus(),
    });
    // 仅在启用且有 url 时连接；否则保持 idle（未启用），不连接、不重连。
    if (RUNTIME_CONFIG.enableWsRuntime && RUNTIME_CONFIG.wsRuntimeUrl) {
      wsClient.connect();
      statusPoll = setInterval(syncWsStatus, 500);
    }
    buildSnapshot();
    return;
  }

  // static（默认兜底）：静态初始数据，无定时器、无 ws。
  dataState = createInitialRuntimeState();
  connectionStatus = WS_STATUS.IDLE;
  buildSnapshot();
}

export function startRuntime() {
  if (started) return; // 防重复
  started = true;
  startMode();
}

export function stopRuntime() {
  if (!started) return;
  started = false;
  if (mockUnsub) {
    mockUnsub();
    mockUnsub = null;
  }
  if (wsClient) {
    wsClient.disconnect();
    wsClient = null;
  }
  if (statusPoll) {
    clearInterval(statusPoll);
    statusPoll = null;
  }
  connectionStatus = WS_STATUS.IDLE;
}

export function getRuntimeSnapshot() {
  if (!currentSnapshot) {
    const data =
      RUNTIME_CONFIG.runtimeSource === 'mock'
        ? getMockRuntimeSnapshot()
        : createInitialRuntimeState();
    currentSnapshot = { ...data, connectionStatus };
  }
  return currentSnapshot;
}

export function subscribeRuntime(listener) {
  listeners.add(listener);
  startRuntime();
  // 全局 runtime 可持续运行：页面卸载不立即 stop，避免频繁 start/stop（尤其 ws 重连）。
  return () => {
    listeners.delete(listener);
  };
}

export function getRuntimeConnectionStatus() {
  return connectionStatus;
}

// 供外部/测试手动注入一条实时消息（mock/static 下也可用于联调）。
export function dispatchRuntimeMessage(message) {
  const normalized = normalizeRuntimeMessage(message);
  if (!normalized) return;
  if (!dataState) {
    dataState =
      RUNTIME_CONFIG.runtimeSource === 'mock'
        ? getMockRuntimeSnapshot()
        : createInitialRuntimeState();
  }
  dataState = applyRuntimeMessage(dataState, normalized);
  notify();
}
