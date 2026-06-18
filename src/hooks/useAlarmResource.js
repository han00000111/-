import { useMemo } from 'react';
import {
  fetchActiveAlarms,
  fetchAlarms,
  fetchAlarmSummary,
  fetchInterlocks,
  getActiveAlarms,
  getAlarms,
  getAlarmSummary,
  getInterlocks,
  useResourceState,
} from '../services';

function useStableParams(params) {
  const paramsKey = JSON.stringify(params ?? {});
  return useMemo(() => JSON.parse(paramsKey), [paramsKey]);
}

export function useAlarmsResource(params = {}) {
  const stableParams = useStableParams(params);
  return useResourceState(() => fetchAlarms(stableParams), [stableParams], {
    initialData: getAlarms(),
  });
}

export function useActiveAlarmsResource() {
  return useResourceState(fetchActiveAlarms, [], {
    initialData: getActiveAlarms(),
  });
}

export function useAlarmSummaryResource() {
  return useResourceState(fetchAlarmSummary, [], {
    initialData: getAlarmSummary(),
  });
}

export function useInterlocksResource() {
  return useResourceState(fetchInterlocks, [], {
    initialData: getInterlocks(),
  });
}
