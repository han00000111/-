// 轻量字段校验工具：仅开发环境输出 warning，不抛异常、不影响生产、不引入第三方库。
function isMissing(value) {
  return value === undefined || value === null || value === '';
}

export function checkRequiredFields(record, fields = []) {
  if (!record || typeof record !== 'object') return fields.slice();
  return fields.filter((field) => isMissing(record[field]));
}

export function checkListFields(list = [], fields = []) {
  if (!Array.isArray(list)) return [];
  return list
    .map((record, index) => ({ index, missing: checkRequiredFields(record, fields) }))
    .filter((item) => item.missing.length > 0);
}

export function warnMissingFields(modelName, record, fields = []) {
  // 仅开发环境提示；任何异常都吞掉，绝不影响运行。
  try {
    if (!import.meta.env?.DEV) return;
    const missing = checkRequiredFields(record, fields);
    if (missing.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(`[schemaCheck] ${modelName} 缺少标准字段: ${missing.join(', ')}`, record);
    }
  } catch {
    // ignore
  }
}
