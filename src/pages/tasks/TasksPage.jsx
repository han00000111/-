import React from 'react';

export function TasksPage({ children }) {
  return (
    <div className="tasks-page-route" data-page="tasks">
      {children}
    </div>
  );
}
