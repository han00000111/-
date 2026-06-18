import { useSyncExternalStore } from 'react';
import { getRuntimeSnapshot, subscribeRuntime } from './runtimeStore.js';

// 统一 runtime 订阅 hook（基于 runtimeStore，自动按 runtimeSource 选择 mock/static/ws）。
// 首次订阅时 startRuntime；selector 返回稳定值以避免不必要重渲染。
export function useRuntime(selector = (state) => state) {
  return useSyncExternalStore(
    subscribeRuntime,
    () => selector(getRuntimeSnapshot()),
    () => selector(getRuntimeSnapshot()),
  );
}

// 便捷选择器：实时通道连接状态。
export function useRuntimeConnectionStatus() {
  return useRuntime((state) => state.connectionStatus);
}
