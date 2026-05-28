import React from 'react';

export function DevicesPage({ implementation: Implementation, ...props }) {
  return <Implementation {...props} />;
}
