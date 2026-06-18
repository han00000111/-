import React from 'react';
import { ErrorState } from './ErrorState';

export class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('PageErrorBoundary caught render error:', error, info);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pageName !== this.props.pageName && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorState
          title={`${this.props.pageName ?? '页面'}加载失败`}
          message="页面渲染异常，请刷新页面后重试。"
          onRetry={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}

export default PageErrorBoundary;
