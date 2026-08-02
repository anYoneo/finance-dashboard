import React, { useState } from 'react';

const CATEGORIES = ['Belanja', 'Makanan', 'Hiburan', 'Transportasi', 'Pendidikan', 'Kesehatan', 'Lainnya'];
const TYPES = [
  { value: 'expense', label: 'Pengeluaran', icon: '📤' },
  { value: 'income', label: 'Pemasukan', icon: '📥' },
];

export default function TransactionForm({ form, setForm, onSubmit }) {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount) return;
    onSubmit(e);
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Add Transaction</h3>

      <div className="form-group">
        <label htmlFor="tx-name">Description</label>
        <input
          id="tx-name"
          type="text"
          placeholder="e.g. Gaji Bulanan"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          maxLength={150}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tx-amount">Amount (IDR)</label>
        <input
          id="tx-amount"
          type="number"
          placeholder="0"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
          min="1"
          step="1000"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Type</label>
          <div className="custom-select" onClick={() => setShowTypeDropdown(!showTypeDropdown)}>
            <span>{TYPES.find((t) => t.value === form.type)?.label || 'Select'}</span>
            <i className="bi bi-chevron-down"></i>
            {showTypeDropdown && (
              <div className="custom-options">
                {TYPES.map((t) => (
                  <div
                    key={t.value}
                    className={`custom-option ${form.type === t.value ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, type: t.value });
                      setShowTypeDropdown(false);
                    }}
                  >
                    {t.icon} {t.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {form.type === 'expense' && (
          <div className="form-group">
            <label>Category</label>
            <div className="custom-select" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
              <span>{form.category}</span>
              <i className="bi bi-chevron-down"></i>
              {showCategoryDropdown && (
                <div className="custom-options">
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat}
                      className={`custom-option ${form.category === cat ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm({ ...form, category: cat });
                        setShowCategoryDropdown(false);
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="btn-submit">
        <i className="bi bi-plus-circle"></i> Add Transaction
      </button>
    </form>
  );
}