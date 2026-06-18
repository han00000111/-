import { API_CONFIG } from './apiConfig.js';
import { ApiError, normalizeApiError } from './apiError.js';

// 把 query 对象拼到 url（跳过 null/undefined）。
function buildUrl(url, query) {
  const base = `${API_CONFIG.baseUrl || ''}${url}`;
  if (!query || typeof query !== 'object') return base;
  const search = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    search.append(key, String(value));
  });
  const qs = search.toString();
  if (!qs) return base;
  return base.includes('?') ? `${base}&${qs}` : `${base}?${qs}`;
}

// 通用请求：自动拼 baseUrl、JSON 头、超时、query、signal、非 2xx 抛 ApiError。
export async function request(url, options = {}) {
  const {
    method = 'GET',
    query,
    body,
    headers = {},
    signal,
    timeout = API_CONFIG.timeout,
  } = options;

  const fullUrl = buildUrl(url, query);

  // 超时用 AbortController；若外部已传 signal，则同时尊重外部取消。
  const controller = new AbortController();
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null;
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  const init = { method, headers: finalHeaders, signal: controller.signal };
  if (body !== undefined && body !== null) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(fullUrl, init);
  } catch (error) {
    throw normalizeApiError(error, { url: fullUrl });
  } finally {
    if (timer) clearTimeout(timer);
  }

  // 解析响应体（容忍空体 / 非 JSON）
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      // 非 2xx 且非 JSON：用文本作为错误详情
      if (!response.ok) {
        throw new ApiError(`请求失败（${response.status}）`, {
          status: response.status,
          url: fullUrl,
          details: text.slice(0, 500),
        });
      }
      throw new ApiError('响应解析失败：返回内容不是合法 JSON', {
        status: response.status,
        code: 'INVALID_JSON',
        url: fullUrl,
        details: text.slice(0, 500),
      });
    }
  }

  if (!response.ok) {
    throw new ApiError(
      (payload && (payload.message || payload.error)) || `请求失败（${response.status}）`,
      {
        status: response.status,
        code: payload && payload.code,
        details: payload,
        url: fullUrl,
      },
    );
  }

  return payload;
}

export function get(url, options = {}) {
  return request(url, { ...options, method: 'GET' });
}

export function post(url, body, options = {}) {
  return request(url, { ...options, method: 'POST', body });
}

export function put(url, body, options = {}) {
  return request(url, { ...options, method: 'PUT', body });
}

export function del(url, options = {}) {
  return request(url, { ...options, method: 'DELETE' });
}
