import React from 'react';

export default function StatCards({ stats }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  const cards = [
    { label: 'Total Balance', value: stats.balance, icon: 'bi-wallet2', className: 'balance' },
    { label: 'Total Income', value: stats.income, icon: 'bi-graph-up-arrow', className: 'income' },
    { label: 'Total Expenses', value: stats.expense, icon: 'bi-graph-down-arrow', className: 'expense' },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div key={card.className} className={`summary-card ${card.className}`}>
          <div className="summary-icon"><i className={`bi ${card.icon}`}></i></div>
          <div className="summary-info">
            <span className="summary-label">{card.label}</span>
            <span className="summary-value">{formatCurrency(card.value)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}