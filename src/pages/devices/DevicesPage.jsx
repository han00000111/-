import React from 'react';

export function DevicesPage({ children }) {
  return (
    <div className="devices-page-route" data-page="devices">
      {children}
    </div>
  );
}
