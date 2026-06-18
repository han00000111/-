import { useCallback, useEffect, useState } from 'react';

export function useResourceState(loader, deps = [], options = {}) {
  const {
    initialData = null,
    enabled = true,
    delay = 0,
  } = options;

  const [state, setState] = useState({
    data: initialData,
    loading: enabled && initialData == null,
    error: null,
  });

  const load = useCallback(() => {
    if (!enabled) return;
    let disposed = false;
    setState((prev) => ({ ...prev, loading: prev.data == null, error: null }));

    const runLoader = () => Promise.resolve(loader());
    const promise = delay > 0
      ? new Promise((resolve) => {
        window.setTimeout(() => resolve(loader()), delay);
      })
      : runLoader();

    promise
      .then((data) => {
        if (!disposed) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!disposed) setState((prev) => ({ ...prev, loading: false, error }));
      });

    return () => {
      disposed = true;
    };
  }, deps);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  return {
    ...state,
    reload: load,
  };
}
