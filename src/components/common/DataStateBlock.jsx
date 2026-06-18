import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';

export function DataStateBlock({
  loading,
  error,
  empty,
  loadingText,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorMessage,
  onRetry,
  compact = false,
  children,
}) {
  if (loading) return <LoadingState text={loadingText} compact={compact} />;
  if (error) {
    return (
      <ErrorState
        title={errorTitle}
        message={errorMessage ?? (typeof error === 'string' ? error : undefined)}
        onRetry={onRetry}
        compact={compact}
      />
    );
  }
  if (empty) return <EmptyState title={emptyTitle} description={emptyDescription} compact={compact} />;
  return children;
}

export default DataStateBlock;
