import React from 'react';

function getErrorText(error, fallback) {
  if (fallback) return fallback;
  if (typeof error === 'string') return error;
  return error?.message || '操作失败，请稍后重试';
}

export function ActionFeedback({
  loading = false,
  error = null,
  success = false,
  loadingText = '处理中...',
  errorText,
  successText = '操作成功',
  compact = false,
}) {
  let tone = '';
  let text = '';

  if (loading) {
    tone = 'loading';
    text = loadingText;
  } else if (error) {
    tone = 'error';
    text = getErrorText(error, errorText);
  } else if (success) {
    tone = 'success';
    text = successText;
  }

  if (!text) return null;

  return (
    <div
      className={`action-feedback ${tone} ${compact ? 'compact' : ''}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {text}
    </div>
  );
}
