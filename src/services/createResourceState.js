export function createSuccessState(data) {
  return {
    data,
    loading: false,
    error: null,
    updatedAt: Date.now(),
  };
}

export function createLoadingState(data = null) {
  return {
    data,
    loading: true,
    error: null,
    updatedAt: Date.now(),
  };
}

export function createErrorState(error, data = null) {
  return {
    data,
    loading: false,
    error,
    updatedAt: Date.now(),
  };
}

export function isEmptyData(data) {
  if (Array.isArray(data)) return data.length === 0;
  if (data == null) return true;
  if (typeof data === 'object') return Object.keys(data).length === 0;
  return false;
}
