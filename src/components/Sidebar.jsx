import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, theme, setTheme, stats }) {
  const themes = [
    { id: 'slate', label: 'Slate Dark', icon: '🌑' },
    { id: 'cyberpunk', label: 'Cyberpunk', icon: '💜' },
    { id: 'emerald', label: 'Emerald', icon: '🌿' },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { id: 'analytics', label: 'Analytics', icon: 'bi-bar-chart-line-fill' },
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">💼 Financely</h1>
        <div className="sidebar-badge">Active Session</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Theme</h3>
        <div className="theme-selector">
          {themes.map((t) => (
            <button
              key={t.id}
              className={`theme-btn ${theme === t.id ? 'active' : ''}`}
              onClick={() => setTheme(t.id)}
              title={t.label}
              aria-label={`Switch to ${t.label} theme`}
            >
              {t.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-balance">
          <span className="balance-label">Net Balance</span>
          <span className="balance-value">{formatCurrency(stats.balance)}</span>
        </div>
      </div>
    </aside>
  );
}