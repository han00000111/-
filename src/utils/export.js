export function exportRowsToCsv({ filename, columns, rows }) {
  const header = columns.map((column) => column.header);
  const body = rows.map((row) => columns.map((column) => normalizeExportCell(typeof column.value === 'function' ? column.value(row) : row[column.value])));
  const csv = [header, ...body].map((line) => line.map(escapeCsvCell).join(',')).join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function buildExportFilename(pageName, date = new Date()) {
  return `${pageName}_${getTimestampForFilename(date)}.csv`;
}

export function getTimestampForFilename(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function escapeCsvCell(value) {
  const text = normalizeExportCell(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function normalizeExportCell(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map(normalizeExportCell).join('、');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
