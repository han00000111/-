import { ApiError } from './apiError.js';

// 统一后端响应解包，兼容两种常见包裹格式与「直接数组/对象」：
//   A: { code: 0, message: 'ok', data: {} }
//   B: { success: true, data: {}, message: 'ok' }
//   C: 直接返回数组或对象（原样返回，不破坏 mock 数据）
export function unwrapResponse(response, context = {}) {
  // null / 基本类型：原样返回
  if (response === null || typeof response !== 'object') {
    return response;
  }

  // 数组：直接返回（如直接返回列表）
  if (Array.isArray(response)) {
    return response;
  }

  // 格式 A：带 code
  if (Object.prototype.hasOwnProperty.call(response, 'code')) {
    if (response.code !== 0) {
      throw new ApiError(response.message || `请求失败（code=${response.code}）`, {
        code: response.code,
        details: response.data,
        url: context.url,
      });
    }
    return response.data;
  }

  // 格式 B：带 success
  if (Object.prototype.hasOwnProperty.call(response, 'success')) {
    if (response.success === false) {
      throw new ApiError(response.message || '请求失败', {
        code: response.code,
        details: response.data,
        url: context.url,
      });
    }
    return response.data;
  }

  // 普通对象：原样返回
  return response;
}
