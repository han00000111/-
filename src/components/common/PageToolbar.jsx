import React from 'react';

export function PageToolbar({ className = '', children }) {
  return <div className={`page-toolbar ${className}`.trim()}>{children}</div>;
}
