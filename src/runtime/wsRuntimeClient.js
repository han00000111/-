// 纯 WebSocket 连接层：只管连接 / 重连 / 回调，不关心页面与数据结构。
// 设计目标：url 为空不连接、连接失败不抛到页面、重连有限次数、disconnect 后不再重连、
// 浏览器不支持 WebSocket 时安全降级。不引入任何第三方库。

export const WS_STATUS = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  CLOSED: 'closed',
  ERROR: 'error',
};

export function createWsRuntimeClient(options = {}) {
  const {
    url = '',
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectMax = 5,
    reconnectInterval = 3000,
  } = options;

  let socket = null;
  let status = WS_STATUS.IDLE;
  let reconnectCount = 0;
  let reconnectTimer = null;
  let manualClosed = false;

  const setStatus = (next) => {
    status = next;
  };

  const clearReconnectTimer = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  const scheduleReconnect = () => {
    if (manualClosed) return;
    if (reconnectCount >= reconnectMax) {
      setStatus(WS_STATUS.ERROR);
      return;
    }
    reconnectCount += 1;
    setStatus(WS_STATUS.RECONNECTING);
    clearReconnectTimer();
    reconnectTimer = setTimeout(() => {
      openSocket();
    }, reconnectInterval);
  };

  function openSocket() {
    // url 为空：不连接，保持 idle，绝不重连。
    if (!url) {
      setStatus(WS_STATUS.IDLE);
      return;
    }
    // 浏览器不支持 WebSocket：安全降级为 error，不抛异常。
    if (typeof WebSocket === 'undefined') {
      setStatus(WS_STATUS.ERROR);
      return;
    }

    setStatus(WS_STATUS.CONNECTING);
    try {
      socket = new WebSocket(url);
    } catch (error) {
      setStatus(WS_STATUS.ERROR);
      onError?.(error);
      scheduleReconnect();
      return;
    }

    socket.onopen = (event) => {
      reconnectCount = 0;
      setStatus(WS_STATUS.CONNECTED);
      onOpen?.(event);
    };

    socket.onmessage = (event) => {
      onMessage?.(event.data);
    };

    socket.onerror = (event) => {
      // 不向页面抛错，只回调 + 走重连逻辑。
      setStatus(WS_STATUS.ERROR);
      onError?.(event);
    };

    socket.onclose = (event) => {
      onClose?.(event);
      if (manualClosed) {
        setStatus(WS_STATUS.CLOSED);
        return;
      }
      scheduleReconnect();
    };
  }

  function connect() {
    manualClosed = false;
    reconnectCount = 0;
    openSocket();
  }

  function disconnect() {
    manualClosed = true;
    clearReconnectTimer();
    if (socket) {
      try {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close();
      } catch {
        // 忽略关闭异常
      }
      socket = null;
    }
    setStatus(WS_STATUS.CLOSED);
  }

  function send(data) {
    if (!socket || status !== WS_STATUS.CONNECTED) return false;
    try {
      socket.send(typeof data === 'string' ? data : JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  function getStatus() {
    return status;
  }

  return { connect, disconnect, send, getStatus };
}
