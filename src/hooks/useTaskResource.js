import { useMemo } from 'react';
import {
  fetchCurrentTask,
  fetchTaskRecords,
  fetchTasks,
  fetchTaskSummary,
  getCurrentTask,
  getTaskRecords,
  getTasks,
  getTaskSummary,
  useResourceState,
} from '../services';

function useStableParams(params) {
  const paramsKey = JSON.stringify(params ?? {});
  return useMemo(() => JSON.parse(paramsKey), [paramsKey]);
}

export function useTasksResource(params = {}) {
  const stableParams = useStableParams(params);
  return useResourceState(() => fetchTasks(stableParams), [stableParams], {
    initialData: getTasks(),
  });
}

export function useTaskSummaryResource() {
  return useResourceState(fetchTaskSummary, [], {
    initialData: getTaskSummary(),
  });
}

export function useCurrentTaskResource() {
  return useResourceState(fetchCurrentTask, [], {
    initialData: getCurrentTask(),
  });
}

export function useTaskRecordsResource(params = {}) {
  const stableParams = useStableParams(params);
  return useResourceState(() => fetchTaskRecords(stableParams), [stableParams], {
    initialData: getTaskRecords(),
  });
}
