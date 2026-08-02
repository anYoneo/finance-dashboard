import React from 'react';

export default function ExposureRiskMatrix({ transactions }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Group Expenses into Risk Bands
  const categories = {
    Belanja: { name: 'Essential Operations (Belanja)', risk: 'Low Risk', color: 'var(--cyan-velocity)', amount: 0 },
    Makanan: { name: 'Variable Living (Makanan)', risk: 'Medium Risk', color: 'var(--amber-reserve)', amount: 0 },
    Hiburan: { name: 'Discretionary Outflow (Hiburan)', risk: 'High Exposure', color: 'var(--burn-crimson)', amount: 0 },
    Lainnya: { name: 'Uncategorized (Lainnya)', risk: 'Neutral', color: 'var(--text-muted)', amount: 0 }
  };

  let totalExpense = 0;
  transactions.forEach(t => {
    if (t.type === 'expense') {
      totalExpense += t.amount;
      if (categories[t.category]) {
        categories[t.category].amount += t.amount;
      } else {
        categories['Lainnya'].amount += t.amount;
      }
    }
  });

  return (
    <div className="tactical-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.01em' }}>
            🎯 EXPENSE RISK BAND MATRIX
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Categorical Exposure Analysis & Outflow Risk Allocation
          </span>
        </div>
        <span className="signal-badge burn">
          TOTAL BURN: {formatCurrency(totalExpense)}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {Object.keys(categories).map(catKey => {
          const cat = categories[catKey];
          const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;

          return (
            <div key={catKey} style={{
              background: 'var(--bg-core)',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }}></div>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{cat.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {cat.risk}
                  </span>
                  <span className="mono-val" style={{ fontWeight: '700', fontSize: '1rem', color: cat.color }}>
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
              </div>

              {/* Progress Band */}
              <div style={{
                height: '8px',
                width: '100%',
                background: 'var(--bg-surface)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${percentage}%`,
                  background: cat.color,
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                <span>Exposure Share</span>
                <span className="mono-val">{percentage.toFixed(1)}% of total burn</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
