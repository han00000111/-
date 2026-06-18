export function ErrorState({
  title = '加载失败',
  message = '数据暂时无法获取，请稍后重试。',
  onRetry,
  compact = false,
}) {
  return (
    <div className={`data-state error-state${compact ? ' compact' : ''}`}>
      <div className="data-state-inner">
        <div className="data-state-title">{title}</div>
        <div className="data-state-desc">{message}</div>
        {onRetry && (
          <div className="data-state-actions">
            <button type="button" onClick={onRetry}>重试</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
