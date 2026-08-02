import React, { useMemo } from 'react';

export default function SavingsGoal({ savingsGoal, setSavingsGoal, onTabungClick }) {
  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const savingsPercent = useMemo(() => {
    const percent = Math.round((savingsGoal.current / savingsGoal.target) * 100);
    return Math.min(percent, 100);
  }, [savingsGoal]);

  const dashOffset = useMemo(() => {
    const radius = 55;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (savingsPercent / 100) * circumference;
    return offset;
  }, [savingsPercent]);

  return (
    <div className="glass-card savings-goal-card">
      <div className="goal-header">
        <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}><i className="bi bi-piggy-bank me-2"></i>Savings Goal</span>
        <button onClick={onTabungClick} className="btn-tabung-premium" title="Tambahkan dana ke tabungan">
          <i className="bi bi-plus-lg"></i> Tabung
        </button>
      </div>
      
      <div className="progress-ring-container">
        <svg width="130" height="130">
          <circle className="progress-ring-bg" cx="65" cy="65" r="55"></circle>
          <circle 
            className="progress-ring-bar" 
            cx="65" cy="65" r="55" 
            strokeDasharray="345.57" 
            strokeDashoffset={dashOffset}
          ></circle>
        </svg>
        <div className="progress-text">
          {savingsPercent}%
          <span>Tercapai</span>
        </div>
      </div>

      <div className="goal-footer">
        <div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Terkumpul</div>
          <div style={{ fontWeight: 700 }}>{formatIDR(savingsGoal.current)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Target</div>
          <div style={{ fontWeight: 700 }}>{formatIDR(savingsGoal.target)}</div>
        </div>
      </div>
    </div>
  );
}