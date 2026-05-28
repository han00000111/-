import React from 'react';

export function TasksPage({ implementation: Implementation, ...props }) {
  return <Implementation {...props} />;
}
