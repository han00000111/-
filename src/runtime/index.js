export { RUNTIME_CONFIG } from './runtimeConfig.js';

// 现有 mock runtime（保留，供 useMockRuntime / services 使用）。
export {
  getRuntimeSnapshot,
  startMockRuntime,
  stopMockRuntime,
  subscribeRuntime,
  createInitialRuntimeState,
} from './mockRuntimeStore.js';
export { useMockRuntime } from './useMockRuntime.js';
export { RUNTIME_EVENT_TYPES, createRuntimeLog } from './runtimeEvents.js';

// 统一 runtime store（mock / static / ws），页面逐步迁移到 useRuntime。
// 注：runtimeStore 的 getRuntimeSnapshot/subscribeRuntime 与 mock 同名，统一通过 useRuntime 访问，避免歧义。
export {
  startRuntime,
  stopRuntime,
  getRuntimeConnectionStatus,
  dispatchRuntimeMessage,
} from './runtimeStore.js';
export { useRuntime, useRuntimeConnectionStatus } from './useRuntime.js';
export { WS_STATUS, createWsRuntimeClient } from './wsRuntimeClient.js';
export {
  RUNTIME_MESSAGE_TYPES,
  normalizeRuntimeMessage,
  applyRuntimeMessage,
} from './runtimeMessageAdapter.js';
