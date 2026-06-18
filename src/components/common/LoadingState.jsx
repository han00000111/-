export function LoadingState({ text = '加载中', compact = false, rows = 3 }) {
  const lineCount = Math.max(1, rows);

  return (
    <div className={`data-state loading-state${compact ? ' compact' : ''}`}>
      <div className="data-state-inner">
        <div className="data-state-title">{text}</div>
        <div className="skeleton-lines" aria-hidden="true">
          {Array.from({ length: lineCount }).map((_, index) => (
            <span className="skeleton-line" key={index} style={{ width: `${100 - index * 12}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingState;
