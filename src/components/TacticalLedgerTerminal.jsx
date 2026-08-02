import React, { useState } from 'react';

export default function TacticalLedgerTerminal({ transactions, onAddTransaction, onDeleteTransaction }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: 'Belanja'
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) return;

    onAddTransaction({
      name: form.name,
      amount: amt,
      type: form.type,
      category: form.type === 'income' ? 'Gaji' : form.category
    });

    setForm({ name: '', amount: '', type: 'expense', category: 'Belanja' });
    setShowForm(false);
  };

  return (
    <div className="tactical-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.01em' }}>
            📜 CAPEX & LEDGER OPERATOR
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            High-Density Financial Transaction Registry & Capital Allocation Tool
          </span>
        </div>

        <button className="btn-terminal primary" onClick={() => setShowForm(!showForm)}>
          <span>{showForm ? '❌ Close Terminal' : '➕ Execute Entry'}</span>
        </button>
      </div>

      {/* Entry Operator Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: 'var(--bg-core)',
          padding: '1.25rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              TRANSACTION IDENTIFIER
            </label>
            <input
              type="text"
              className="terminal-input"
              style={{ width: '100%' }}
              placeholder="e.g. AWS Infrastructure Billing"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              NOMINAL CAPITAL (IDR)
            </label>
            <input
              type="number"
              className="terminal-input"
              style={{ width: '100%' }}
              placeholder="500000"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              FLOW TYPE
            </label>
            <select
              className="terminal-input"
              style={{ width: '100%' }}
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Capital Outflow (Expense)</option>
              <option value="income">Capital Inflow (Revenue)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              EXPOSURE CATEGORY
            </label>
            <select
              className="terminal-input"
              style={{ width: '100%' }}
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option value="Belanja">Belanja (Essential)</option>
              <option value="Makanan">Makanan (Variable)</option>
              <option value="Hiburan">Hiburan (Discretionary)</option>
              <option value="Gaji">Gaji (Revenue)</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <button type="submit" className="btn-terminal primary" style={{ height: '38px', justifyContent: 'center' }}>
            <span>Commit Entry</span>
          </button>
        </form>
      )}

      {/* Filter Controls Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="terminal-input"
          style={{ flex: 1, minWidth: '220px' }}
          placeholder="🔍 Filter by keyword..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <select
          className="terminal-input"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Exposure Categories</option>
          <option value="Belanja">Belanja</option>
          <option value="Makanan">Makanan</option>
          <option value="Hiburan">Hiburan</option>
          <option value="Gaji">Gaji</option>
        </select>
      </div>

      {/* High-Density Ledger Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>DATE / STAMP</th>
              <th style={{ padding: '0.75rem 1rem' }}>IDENTIFIER</th>
              <th style={{ padding: '0.75rem 1rem' }}>CATEGORY EXPOSURE</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>CAPITAL MOVEMENT</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No transaction entries registered matching active filters.
                </td>
              </tr>
            ) : (
              filteredTransactions.map(t => {
                const isInflow = t.type === 'income';
                return (
                  <tr key={t.id} style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.2s ease'
                  }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {t.date}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>
                      {t.name}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`signal-badge ${isInflow ? 'surplus' : 'burn'}`} style={{ fontSize: '0.65rem' }}>
                        {t.category}
                      </span>
                    </td>
                    <td className="mono-val" style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'right',
                      fontWeight: '700',
                      color: isInflow ? 'var(--surplus-emerald)' : 'var(--burn-crimson)'
                    }}>
                      {isInflow ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => onDeleteTransaction(t.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--burn-crimson)',
                          cursor: 'pointer',
                          opacity: 0.7,
                          transition: 'opacity 0.2s'
                        }}
                        title="Purge Entry"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
