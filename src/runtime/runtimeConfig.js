// runtime 配置集中读取环境变量。
// enableMockRuntime 默认开启；显式 'false'（正式构建）时关闭，关闭后页面仍使用 services 静态数据，不白屏。
// runtimeSource 决定实时数据来源：mock（演示动态）/ static（静态 mock，无定时器/ws）/ ws（真实 /ws/runtime）。
// import.meta.env 不存在时全部兜底，保证不报错。
export const RUNTIME_CONFIG = {
  enableMockRuntime: import.meta.env?.VITE_ENABLE_MOCK_RUNTIME !== 'false',
  // 'mock' | 'static' | 'ws'；默认跟随 enableMockRuntime：开启则 mock，否则 static。
  runtimeSource:
    import.meta.env?.VITE_RUNTIME_SOURCE ||
    (import.meta.env?.VITE_ENABLE_MOCK_RUNTIME === 'false' ? 'static' : 'mock'),
  enableWsRuntime: import.meta.env?.VITE_ENABLE_WS_RUNTIME === 'true',
  wsRuntimeUrl: import.meta.env?.VITE_WS_RUNTIME_URL || '',
  wsReconnectMax: Number(import.meta.env?.VITE_WS_RECONNECT_MAX || 5),
  wsReconnectInterval: Number(import.meta.env?.VITE_WS_RECONNECT_INTERVAL || 3000),
  tickMs: Number(import.meta.env?.VITE_MOCK_RUNTIME_TICK_MS || 3000),
  maxLogs: Number(import.meta.env?.VITE_MOCK_RUNTIME_MAX_LOGS || 50),
  simulateErrors: import.meta.env?.VITE_SIMULATE_ERRORS === 'true',
  simulateLoading: import.meta.env?.VITE_SIMULATE_LOADING === 'true',
};
