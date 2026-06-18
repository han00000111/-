import { useSyncExternalStore } from 'react';
import { getRuntimeSnapshot, subscribeRuntime } from './mockRuntimeStore.js';

export function useMockRuntime(selector = (state) => state) {
  return useSyncExternalStore(
    subscribeRuntime,
    () => selector(getRuntimeSnapshot()),
    () => selector(getRuntimeSnapshot()),
  );
}
