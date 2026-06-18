import { getSystemStatus, getTopBarStatus, fetchSystemStatus, fetchTopBarStatus, useResourceState } from '../services';

export function useSystemStatusResource() {
  return useResourceState(fetchSystemStatus, [], {
    initialData: getSystemStatus(),
  });
}

export function useTopBarStatusResource() {
  return useResourceState(fetchTopBarStatus, [], {
    initialData: getTopBarStatus(),
  });
}
