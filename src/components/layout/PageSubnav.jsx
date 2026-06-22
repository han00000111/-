import React from 'react';

export function PageSubnav({ label, tabs = [], value, onChange }) {
  if (!tabs.length) return null;

  return (
    <nav className="page-subnav" aria-label={`${label}二级导航`}>
      <span className="page-subnav-label">{label}</span>
      <div className="page-subnav-list" role="tablist" aria-label={`${label}页面`}>
        {tabs.map((tab) => (
          <button
            aria-selected={value === tab.key}
            className={value === tab.key ? 'active' : ''}
            key={tab.key}
            onClick={() => onChange(tab.key)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
