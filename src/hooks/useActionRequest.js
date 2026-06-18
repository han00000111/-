import { useCallback, useRef, useState } from 'react';

function resolveOption(option, args) {
  return typeof option === 'function' ? option(...args) : option;
}

export function useActionRequest(action, options = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const runningRef = useRef(false);

  const run = useCallback(
    async (...args) => {
      if (runningRef.current || resolveOption(options.disabled, args)) return null;

      const confirmOption = options.confirm;
      if (confirmOption) {
        let confirmed = false;
        try {
          confirmed =
            typeof confirmOption === 'function'
              ? await confirmOption(...args)
              : window.confirm(confirmOption);
        } catch (confirmError) {
          setError(options.errorMessage || confirmError);
          try {
            await options.onError?.(confirmError, ...args);
          } catch {
            // 确认回调异常已由当前 hook 接管。
          }
          return null;
        }
        if (!confirmed) return null;
      }

      runningRef.current = true;
      setLoading(true);
      setError(null);

      let result = null;
      let actionError = null;
      try {
        await options.beforeRun?.(...args);
        result = await action(...args);
        const successMessage = resolveOption(options.successMessage, [result, ...args]);
        const storedResult =
          successMessage && result && typeof result === 'object'
            ? { ...result, message: successMessage }
            : successMessage
              ? { value: result, message: successMessage }
              : result;
        setLastResult(storedResult);
        await options.onSuccess?.(storedResult, ...args);
        return storedResult;
      } catch (caughtError) {
        actionError = caughtError;
        setError(options.errorMessage || caughtError);
        try {
          await options.onError?.(caughtError, ...args);
        } catch {
          // 回调异常不继续向页面抛出，避免按钮事件产生未捕获 Promise。
        }
        return null;
      } finally {
        runningRef.current = false;
        setLoading(false);
        try {
          await options.afterRun?.(result, actionError, ...args);
        } catch (afterError) {
          setError(options.errorMessage || afterError);
        }
      }
    },
    [action, options],
  );

  const reset = useCallback(() => {
    setError(null);
    setLastResult(null);
  }, []);

  return {
    run,
    loading,
    error,
    lastResult,
    reset,
  };
}
