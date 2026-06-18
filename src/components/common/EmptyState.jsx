export function EmptyState({
  title = '暂无数据',
  description,
  action,
  compact = false,
}) {
  return (
    <div className={`data-state empty-state${compact ? ' compact' : ''}`}>
      <div className="data-state-inner">
        <div className="data-state-title">{title}</div>
        {description && <div className="data-state-desc">{description}</div>}
        {action && <div className="data-state-actions">{action}</div>}
      </div>
    </div>
  );
}

export default EmptyState;
