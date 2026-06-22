import React from 'react';

export function AppShell({
  sidebar,
  topbar,
  subnav,
  collapsed = false,
  mainClassName = '',
  children,
}) {
  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {sidebar}
      <div className="app-main-column">
        <main className={`main ${mainClassName}`.trim()}>
          {topbar}
          {subnav}
          {children}
        </main>
      </div>
    </div>
  );
}
