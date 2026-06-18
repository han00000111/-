import { useMemo } from 'react';
import {
  fetchActiveDeviceIssues,
  fetchDevices,
  fetchDeviceSummary,
  fetchDeviceTypes,
  getActiveDeviceIssues,
  getDevices,
  getDeviceSummary,
  getDeviceTypes,
  useResourceState,
} from '../services';

function useStableParams(params) {
  const paramsKey = JSON.stringify(params ?? {});
  return useMemo(() => JSON.parse(paramsKey), [paramsKey]);
}

export function useDevicesResource(params = {}) {
  const stableParams = useStableParams(params);
  return useResourceState(() => fetchDevices(stableParams), [stableParams], {
    initialData: getDevices(),
  });
}

export function useDeviceSummaryResource() {
  return useResourceState(fetchDeviceSummary, [], {
    initialData: getDeviceSummary(),
  });
}

export function useActiveDeviceIssuesResource() {
  return useResourceState(fetchActiveDeviceIssues, [], {
    initialData: getActiveDeviceIssues(),
  });
}

export function useDeviceTypesResource() {
  return useResourceState(fetchDeviceTypes, [], {
    initialData: getDeviceTypes(),
  });
}
