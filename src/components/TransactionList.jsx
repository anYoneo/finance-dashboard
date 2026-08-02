import React, { useMemo } from 'react';

const FILTER_TABS = ['All', 'Belanja', 'Makanan', 'Hiburan', 'Gaji'];

export default function TransactionList({
  transactions,
  onDelete,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
}) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchQuery, categoryFilter]);

  return (
    <div className="ledger-section">
      <h3 className="section-title">Transaction Ledger</h3>

      <div className="ledger-controls">
        <input
          type="text"
          className="ledger-search"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search transactions"
        />
        <div className="ledger-tabs">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              className={`ledger-tab ${categoryFilter === tab ? 'active' : ''}`}
              onClick={() => setCategoryFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-inbox"></i>
          <p>No transactions found.</p>
        </div>
      ) : (
        <ul className="transaction-list">
          {filtered.map((t) => (
            <li key={t.id} className={`transaction-item ${t.type}`}>
              <div className="tx-info">
                <span className="tx-name">{t.name}</span>
                <span className="tx-meta">{t.category} &middot; {t.date}</span>
              </div>
              <div className="tx-actions">
                <span className={`tx-amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(t.id)}
                  aria-label={`Delete ${t.name}`}
                  title="Delete"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}