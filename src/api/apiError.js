// 统一 API 错误结构，页面/调用方不直接处理原生 fetch error。
export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.url = options.url;
  }
}

// 把任意错误（网络错误、超时、HTTP 非 2xx、后端 code/message）归一化为 ApiError。
export function normalizeApiError(error, context = {}) {
  if (error instanceof ApiError) return error;

  // AbortController 触发的超时/取消
  if (error && (error.name === 'AbortError' || error.code === 'ABORT_ERR')) {
    return new ApiError('请求已取消或超时', {
      status: context.status,
      code: 'TIMEOUT_OR_ABORT',
      url: context.url,
      details: error.message,
    });
  }

  // 原生 fetch 网络错误（断网、CORS、DNS 等）通常是 TypeError
  if (error instanceof TypeError) {
    return new ApiError('网络请求失败', {
      status: context.status,
      code: 'NETWORK_ERROR',
      url: context.url,
      details: error.message,
    });
  }

  return new ApiError(error?.message || '未知请求错误', {
    status: context.status,
    code: error?.code,
    url: context.url,
    details: error,
  });
}
