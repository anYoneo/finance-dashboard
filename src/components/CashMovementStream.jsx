import React from 'react';

export default function CashMovementStream({ stats, savingsGoal }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const grossInflow = stats.income;
  const operationalOutflow = stats.expense;
  const reserveAllocation = savingsGoal.current;
  const unallocatedNetBalance = stats.balance;

  const outflowPercent = grossInflow > 0 ? Math.min(100, (operationalOutflow / grossInflow) * 100) : 0;
  const reservePercent = grossInflow > 0 ? Math.min(100, (reserveAllocation / grossInflow) * 100) : 0;
  const netPercent = Math.max(0, 100 - outflowPercent - reservePercent);

  return (
    <div className="tactical-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.01em' }}>
            🌊 CASH MOVEMENT HYDRO-STREAM
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Sequential Capital Waterfall: Inflow → Operational Burn → Reserve Pool → Net Capital
          </span>
        </div>
        <span className="signal-badge reserve">
          WATERFALL MODEL
        </span>
      </div>

      {/* Visual Stream Bar */}
      <div style={{
        height: '28px',
        width: '100%',
        background: 'var(--bg-core)',
        borderRadius: '8px',
        display: 'flex',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
        padding: '3px'
      }}>
        {/* Outflow Stream */}
        <div style={{
          width: `${outflowPercent}%`,
          background: 'linear-gradient(90deg, var(--burn-crimson), #e11d48)',
          borderRadius: '4px 0 0 4px',
          transition: 'width 0.5s ease',
          position: 'relative'
        }} title={`Outflow: ${outflowPercent.toFixed(1)}%`}></div>

        {/* Reserve Stream */}
        <div style={{
          width: `${reservePercent}%`,
          background: 'linear-gradient(90deg, var(--amber-reserve), #d97706)',
          transition: 'width 0.5s ease'
        }} title={`Reserve: ${reservePercent.toFixed(1)}%`}></div>

        {/* Net Unallocated Stream */}
        <div style={{
          width: `${netPercent}%`,
          background: 'linear-gradient(90deg, var(--surplus-emerald), #059669)',
          borderRadius: '0 4px 4px 0',
          transition: 'width 0.5s ease'
        }} title={`Net Unallocated: ${netPercent.toFixed(1)}%`}></div>
      </div>

      {/* Hydro Stream Node Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        {/* Node 1: Gross Inflow */}
        <div style={{
          background: 'var(--bg-core)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>1. GROSS INFLOW</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--surplus-emerald)', fontFamily: 'var(--font-mono)' }}>100% BASE</span>
          </div>
          <div className="mono-val" style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--surplus-emerald)' }}>
            {formatCurrency(grossInflow)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'block' }}>
            Total revenue & income streams
          </span>
        </div>

        {/* Node 2: Operational Burn */}
        <div style={{
          background: 'var(--bg-core)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>2. OPERATIONAL OUTFLOW</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--burn-crimson)', fontFamily: 'var(--font-mono)' }}>-{outflowPercent.toFixed(1)}%</span>
          </div>
          <div className="mono-val" style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--burn-crimson)' }}>
            {formatCurrency(operationalOutflow)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'block' }}>
            Essential & discretionary expenses
          </span>
        </div>

        {/* Node 3: Tactical Reserve */}
        <div style={{
          background: 'var(--bg-core)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>3. TACTICAL RESERVE</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--amber-reserve)', fontFamily: 'var(--font-mono)' }}>ALLOCATED</span>
          </div>
          <div className="mono-val" style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--amber-reserve)' }}>
            {formatCurrency(reserveAllocation)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'block' }}>
            Dedicated long-term vault
          </span>
        </div>

        {/* Node 4: Net Liquidity Remaining */}
        <div style={{
          background: 'var(--bg-core)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>4. NET CAPITAL REMAINING</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--cyan-velocity)', fontFamily: 'var(--font-mono)' }}>AVAILABLE</span>
          </div>
          <div className="mono-val" style={{ fontSize: '1.3rem', fontWeight: '700', color: unallocatedNetBalance >= 0 ? 'var(--text-primary)' : 'var(--burn-crimson)' }}>
            {formatCurrency(unallocatedNetBalance)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'block' }}>
            Unencumbered working balance
          </span>
        </div>
      </div>
    </div>
  );
}
