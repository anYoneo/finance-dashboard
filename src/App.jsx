import React, { useState, useMemo, useEffect } from 'react';
import FinancialHeader from './components/FinancialHeader';
import FinancialSignalBanner from './components/FinancialSignalBanner';
import CashMovementStream from './components/CashMovementStream';
import ExposureRiskMatrix from './components/ExposureRiskMatrix';
import TacticalLedgerTerminal from './components/TacticalLedgerTerminal';

function App() {
  // 1. Savings Reserve State (Persistent)
  const [savingsGoal, setSavingsGoal] = useState(() => {
    try {
      const saved = localStorage.getItem('financely_savings');
      return saved ? JSON.parse(saved) : { target: 20000000, current: 7500000 };
    } catch (e) {
      console.error(e);
      return { target: 20000000, current: 7500000 };
    }
  });

  // 2. Transactions State (Persistent)
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('financely_transactions');
      return saved ? JSON.parse(saved) : [
        { id: 1, name: 'Gaji Bulanan Utama', amount: 18500000, type: 'income', category: 'Gaji', date: '2026-08-01' },
        { id: 2, name: 'Belanja Logistik Infrastructure', amount: 1200000, type: 'expense', category: 'Belanja', date: '2026-08-02' },
        { id: 3, name: 'Executive Catering & Meals', amount: 450000, type: 'expense', category: 'Makanan', date: '2026-08-03' },
        { id: 4, name: 'Cloud Server & Subscriptions', amount: 186000, type: 'expense', category: 'Hiburan', date: '2026-08-04' },
        { id: 5, name: 'Freelance Advisory Fee', amount: 3500000, type: 'income', category: 'Gaji', date: '2026-08-05' }
      ];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('financely_savings', JSON.stringify(savingsGoal));
  }, [savingsGoal]);

  useEffect(() => {
    localStorage.setItem('financely_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // 3. Financial Metrics & Runway Calculations
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });

    return {
      income,
      expense,
      balance: income - expense - savingsGoal.current
    };
  }, [transactions, savingsGoal.current]);

  // Daily Burn Rate Calculation (Assumes 30 days period)
  const dailyBurnRate = useMemo(() => {
    return Math.round(stats.expense / 30);
  }, [stats.expense]);

  // Liquidity Runway Days Calculation
  const runwayDays = useMemo(() => {
    if (dailyBurnRate <= 0) return 999;
    const netAvailable = Math.max(0, stats.balance + savingsGoal.current);
    return Math.round(netAvailable / dailyBurnRate);
  }, [stats.balance, savingsGoal.current, dailyBurnRate]);

  // Actions
  const handleAddTransaction = (newTx) => {
    const txEntry = {
      ...newTx,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => [txEntry, ...prev]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="command-center">
      {/* Header & Situation Ticker */}
      <FinancialHeader
        stats={stats}
        runwayDays={runwayDays}
        dailyBurnRate={dailyBurnRate}
      />

      {/* Main Command Workspace */}
      <main className="main-content">
        {/* Module 1: Signal & Narrative Intelligence */}
        <FinancialSignalBanner
          stats={stats}
          savingsGoal={savingsGoal}
          runwayDays={runwayDays}
        />

        {/* Module 2: Cash Movement Hydro-Stream (Waterfall Visualizer) */}
        <CashMovementStream
          stats={stats}
          savingsGoal={savingsGoal}
        />

        {/* Module 3: Dual Grid Analytics Workspace */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {/* Outflow Exposure Matrix */}
          <ExposureRiskMatrix
            transactions={transactions}
          />

          {/* Tactical Reserve Allocation */}
          <div className="tactical-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.01em' }}>
                    🛡️ CAPITAL RESERVE POOL
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Tactical Cash Reserve & Target Liquidity Goal
                  </span>
                </div>
                <span className="signal-badge reserve">
                  {Math.round((savingsGoal.current / savingsGoal.target) * 100)}% FUNDED
                </span>
              </div>

              <div style={{ background: 'var(--bg-core)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CURRENT ALLOCATED RESERVES</span>
                  <span className="mono-val" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--amber-reserve)' }}>
                    Rp {savingsGoal.current.toLocaleString('id-ID')}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>TARGET BASELINE: Rp {savingsGoal.target.toLocaleString('id-ID')}</span>
                  <span>GAP: Rp {Math.max(0, savingsGoal.target - savingsGoal.current).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Quick Allocate Action */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn-terminal primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  const amt = prompt("Masukkan nominal tambahan alokasi dana cadangan (Rp):", "500000");
                  if (amt && !isNaN(parseInt(amt, 10))) {
                    setSavingsGoal(prev => ({
                      ...prev,
                      current: Math.min(prev.current + parseInt(amt, 10), prev.target)
                    }));
                  }
                }}
              >
                <span>⚡ Deposit to Reserve</span>
              </button>
            </div>
          </div>
        </div>

        {/* Module 4: High-Density Ledger Terminal */}
        <TacticalLedgerTerminal
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </main>
    </div>
  );
}

export default App;
