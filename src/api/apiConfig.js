// 集中管理 API 配置（读取 Vite 环境变量）。
// 默认仍使用 mock service；没有真实 API 地址时不报错，production 也可继续 mock。
export const API_CONFIG = {
  // 真实后端基础地址；为空时配合 useMockService=true 走本地 mock。
  baseUrl: import.meta.env?.VITE_API_BASE_URL || '',
  // 仅当显式设为 'false' 时才使用真实请求，否则默认 mock。
  useMockService: import.meta.env?.VITE_USE_MOCK_SERVICE !== 'false',
  // 请求超时（毫秒），默认 10s。
  timeout: Number(import.meta.env?.VITE_REQUEST_TIMEOUT || 10000),
};
