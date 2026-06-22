import React from 'react';

export function PageFrame({ mode = 'workbench', page, subpage, children }) {
  return (
    <div className={`page-frame page-frame-${mode}`} data-page={page} data-subpage={subpage}>
      {children}
    </div>
  );
}
