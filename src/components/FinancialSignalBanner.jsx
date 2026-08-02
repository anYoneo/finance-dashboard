import React from 'react';

export default function FinancialSignalBanner({ stats, savingsGoal, runwayDays }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const netSavingsRatio = stats.income > 0 
    ? Math.round(((stats.income - stats.expense) / stats.income) * 100) 
    : 0;

  // Generate Dynamic Narrative
  let signalTitle = "OPERATIONAL BALANCE STABLE";
  let signalNarrative = "Financial inflows and operational burn are synchronized. Cash reserves maintain target baseline.";
  let signalBadgeClass = "surplus";
  let actionAdvice = "Consider allocating surplus liquidity to tactical reserve investments.";

  if (stats.expense > stats.income) {
    signalTitle = "HIGH CAPITAL EXPOSURE DETECTED";
    signalNarrative = `Outflows exceed total inflow by ${formatCurrency(stats.expense - stats.income)}. Immediate expense throttling recommended.`;
    signalBadgeClass = "burn";
    actionAdvice = "Audit discretionary expense buckets to stabilize net burn velocity.";
  } else if (netSavingsRatio > 30) {
    signalTitle = "STRONG CAPITAL RETENTION";
    signalNarrative = `Retaining ${netSavingsRatio}% of gross inflow. Estimated runway expanded to ${runwayDays} days.`;
    signalBadgeClass = "surplus";
    actionAdvice = "Current trajectory supports scaling tactical savings target ahead of schedule.";
  } else if (savingsGoal.current < savingsGoal.target * 0.4) {
    signalTitle = "RESERVE ALLOCATION BELOW PAR";
    signalNarrative = `Tactical reserve stands at ${Math.round((savingsGoal.current / savingsGoal.target) * 100)}% of target. Additional capital deployment advised.`;
    signalBadgeClass = "reserve";
    actionAdvice = "Schedule automated allocation from active balance into reserve pool.";
  }

  return (
    <div className="tactical-panel" style={{
      background: signalBadgeClass === 'burn' 
        ? 'linear-gradient(135deg, rgba(255, 59, 92, 0.08), rgba(17, 24, 39, 0.9))' 
        : 'linear-gradient(135deg, rgba(0, 245, 160, 0.08), rgba(17, 24, 39, 0.9))',
      borderLeft: `4px solid ${
        signalBadgeClass === 'burn' ? 'var(--burn-crimson)' : 
        signalBadgeClass === 'reserve' ? 'var(--amber-reserve)' : 'var(--surplus-emerald)'
      }`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`signal-badge ${signalBadgeClass}`}>
              <span className="pulse-dot"></span> FINANCIAL SIGNAL INTEL
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              REF: SIG-2026-08
            </span>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.01em', marginTop: '0.2rem' }}>
            {signalTitle}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {signalNarrative}
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.4rem',
            padding: '0.4rem 0.8rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: 'var(--cyan-velocity)',
            fontFamily: 'var(--font-mono)'
          }}>
            <span>💡 RECOMMENDED ACTION:</span>
            <span style={{ color: 'var(--text-primary)' }}>{actionAdvice}</span>
          </div>
        </div>

        {/* Narrative Metrics Context */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          background: 'var(--bg-core)',
          padding: '1rem',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          minWidth: '260px'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>RETENTION RATIO</span>
            <span className="mono-val" style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--surplus-emerald)' }}>
              +{netSavingsRatio}%
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>NET LIQUIDITY</span>
            <span className="mono-val" style={{ fontSize: '1.1rem', fontWeight: '700', color: stats.balance >= 0 ? 'var(--text-primary)' : 'var(--burn-crimson)' }}>
              {formatCurrency(stats.balance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
