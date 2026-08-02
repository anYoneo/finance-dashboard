import React from 'react';

export default function FinancialHeader({ stats, runwayDays, dailyBurnRate }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const isSurplus = stats.balance >= 0;

  return (
    <header style={{
      background: 'rgba(17, 24, 39, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        {/* Brand & System Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--surplus-emerald), #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: '900',
            color: '#090d14',
            boxShadow: '0 0 20px var(--surplus-glow)'
          }}>
            ⚡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                FINANCELy
              </span>
              <span className="signal-badge reserve" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                COMMAND CENTER v2.5
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Institutional Financial Intelligence Engine
            </span>
          </div>
        </div>

        {/* Real-time Health Ticker */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          background: 'var(--bg-core)',
          padding: '0.5rem 1.25rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          {/* Liquidity Runway Ticker */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Estimated Runway
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="mono-val" style={{
                fontWeight: '700',
                fontSize: '1rem',
                color: runwayDays > 30 ? 'var(--surplus-emerald)' : 'var(--amber-reserve)'
              }}>
                {runwayDays} Hari
              </span>
              <div className="pulse-dot" style={{ color: runwayDays > 30 ? 'var(--surplus-emerald)' : 'var(--amber-reserve)' }}></div>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>

          {/* Daily Burn Rate Velocity */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Burn Velocity / Day
            </span>
            <span className="mono-val" style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--burn-crimson)' }}>
              {formatCurrency(dailyBurnRate)}
            </span>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>

          {/* Liquidity Status */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Net Capital State
            </span>
            <span className={`signal-badge ${isSurplus ? 'surplus' : 'burn'}`} style={{ padding: '0.2rem 0.5rem', marginTop: '2px' }}>
              {isSurplus ? 'SURPLUS OPTIMAL' : 'CAPITAL DEFICIT'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-terminal" onClick={() => window.location.reload()}>
            <span>🔄 Sync State</span>
          </button>
        </div>
      </div>
    </header>
  );
}
