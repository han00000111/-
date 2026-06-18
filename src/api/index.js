// API 客户端统一出口。当前仅为骨架，service 默认仍走 mock（见 API_CONFIG.useMockService）。
// 用法与切换说明见 docs/api-client.md、docs/service-adapter-plan.md。
export * from './apiConfig.js';
export * from './apiError.js';
export * from './httpClient.js';
export * from './responseAdapter.js';
