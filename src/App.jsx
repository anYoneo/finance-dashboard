import React, { useState, useMemo, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function App() {
  // 1. Theme State
  const [theme, setTheme] = useState('slate');

  // 2. Savings Goal State
  const [savingsGoal, setSavingsGoal] = useState({
    target: 20000000, // Rp 20.000.000
    current: 7500000  // Rp 7.500.000
  });

  // 3. Transactions State
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Gaji Bulanan', amount: 18500000, type: 'income', category: 'Gaji' },
    { id: 2, name: 'Belanja Bulanan', amount: 1200000, type: 'expense', category: 'Belanja' },
    { id: 3, name: 'Makan Malam Restaurant', amount: 450000, type: 'expense', category: 'Makanan' },
    { id: 4, name: 'Langganan Netflix', amount: 186000, type: 'expense', category: 'Hiburan' },
    { id: 5, name: 'Freelance Project', amount: 3500000, type: 'income', category: 'Gaji' }
  ]);

  // 4. Form inputs state
  const [form, setForm] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: 'Belanja'
  });

  // 5. Calculations
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

  // 6. Savings Progress Calculation
  const savingsPercent = useMemo(() => {
    const percent = Math.round((savingsGoal.current / savingsGoal.target) * 100);
    return Math.min(percent, 100);
  }, [savingsGoal]);

  // SVG circular progress dash-offset calculation
  const dashOffset = useMemo(() => {
    const radius = 55;
    const circumference = 2 * Math.PI * radius; // ~345.57
    const offset = circumference - (savingsPercent / 100) * circumference;
    return offset;
  }, [savingsPercent]);

  // 7. Interactive Savings Goal actions
  const handleAddSavings = () => {
    const amountStr = prompt("Masukkan jumlah dana untuk dimasukkan ke target tabungan:");
    if (!amountStr) return;
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      alert("Masukkan jumlah angka yang valid!");
      return;
    }
    if (amount > stats.balance + savingsGoal.current) {
      alert("Saldo tidak mencukupi untuk dialokasikan ke tabungan!");
      return;
    }
    setSavingsGoal(prev => ({
      ...prev,
      current: Math.min(prev.current + amount, prev.target)
    }));
  };

  // 8. Transaction CRUD actions
  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) {
      alert("Harap isi nama transaksi dan nominal!");
      return;
    }
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Harap masukkan nominal angka yang valid!");
      return;
    }

    const newTx = {
      id: Date.now(),
      name: form.name,
      amount: amt,
      type: form.type,
      category: form.type === 'income' ? 'Gaji' : form.category
    };

    setTransactions(prev => [newTx, ...prev]);
    setForm({
      name: '',
      amount: '',
      type: 'expense',
      category: 'Belanja'
    });
  };

  // 9. Spending Chart Integration (Chart.js)
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Aggregate expenses by category
    const categories = ['Belanja', 'Makanan', 'Hiburan', 'Lainnya'];
    const categorySums = { Belanja: 0, Makanan: 0, Hiburan: 0, Lainnya: 0 };
    
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const cat = categories.includes(t.category) ? t.category : 'Lainnya';
        categorySums[cat] += t.amount;
      }
    });

    const dataValues = categories.map(cat => categorySums[cat]);

    // Cleanup previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Chart styles matching current theme accents
    const rootStyle = getComputedStyle(document.body);
    const accentGlow = rootStyle.getPropertyValue('--accent-glow').trim() || '#38bdf8';
    const accentPrimary = rootStyle.getPropertyValue('--accent-primary').trim() || '#10b981';
    const accentSecondary = rootStyle.getPropertyValue('--accent-secondary').trim() || '#f43f5e';
    const textMuted = rootStyle.getPropertyValue('--text-muted').trim() || '#94a3b8';

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: dataValues,
          backgroundColor: [
            'rgba(56, 189, 248, 0.65)',  // Blue
            'rgba(16, 185, 129, 0.65)',  // Green
            'rgba(192, 132, 252, 0.65)', // Purple
            'rgba(244, 63, 94, 0.65)'    // Rose
          ],
          borderColor: [
            accentGlow,
            accentPrimary,
            '#c084fc',
            accentSecondary
          ],
          borderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: textMuted,
              font: {
                family: 'Plus Jakarta Sans',
                weight: '600',
                size: 11
              }
            }
          }
        },
        cutout: '70%'
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions, theme]);

  // Formatter helper
  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Gaji': 'bi-cash-coin',
      'Belanja': 'bi-cart-fill',
      'Makanan': 'bi-egg-fried',
      'Hiburan': 'bi-controller',
      'Lainnya': 'bi-tags-fill'
    };
    return icons[category] || 'bi-credit-card-fill';
  };

  return (
    <div className={`theme-${theme}`}>
      <div className="bg-orbs">
        <div className="orb-1"></div>
        <div className="orb-2"></div>
      </div>

      <div className="app-wrapper">
        {/* Navigation / Header */}
        <header>
          <div className="logo-container">
            <div className="logo-icon">
              <i className="bi bi-wallet2"></i>
            </div>
            <div className="logo-text">Financely</div>
          </div>

          <div className="theme-selector">
            <button 
              className={`theme-btn ${theme === 'slate' ? 'active' : ''}`} 
              onClick={() => setTheme('slate')}
              title="Slate Dark theme"
            >
              <i className="bi bi-circle-fill" style={{ color: '#38bdf8' }}></i>
            </button>
            <button 
              className={`theme-btn ${theme === 'cyberpunk' ? 'active' : ''}`} 
              onClick={() => setTheme('cyberpunk')}
              title="Cyberpunk theme"
            >
              <i className="bi bi-circle-fill" style={{ color: '#ec4899' }}></i>
            </button>
            <button 
              className={`theme-btn ${theme === 'emerald' ? 'active' : ''}`} 
              onClick={() => setTheme('emerald')}
              title="Emerald Theme"
            >
              <i className="bi bi-circle-fill" style={{ color: '#34d399' }}></i>
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          
          {/* Card 1: Balance & Flow */}
          <div className="glass-card grid-span-2 balance-card">
            <div className="balance-title">Saldo Tersedia</div>
            <div className="balance-amount">{formatIDR(stats.balance)}</div>
            
            <div className="flow-indicators">
              <div className="flow-item">
                <div className="flow-icon income">
                  <i className="bi bi-arrow-up-right"></i>
                </div>
                <div>
                  <div className="flow-label">Total Pemasukan</div>
                  <div className="flow-amount">{formatIDR(stats.income)}</div>
                </div>
              </div>
              
              <div className="flow-item">
                <div className="flow-icon expense">
                  <i className="bi bi-arrow-down-left"></i>
                </div>
                <div>
                  <div className="flow-label">Total Pengeluaran</div>
                  <div className="flow-amount">{formatIDR(stats.expense)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Savings Goal (SVG progress ring) */}
          <div className="glass-card savings-goal-card">
            <div className="goal-header">
              <span style={{ fontWeight: 600 }}><i className="bi bi-piggy-bank me-2"></i>Savings Goal</span>
              <button 
                onClick={handleAddSavings} 
                className="btn-delete" 
                style={{ padding: '2px 8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }}
                title="Tambahkan dana ke tabungan"
              >
                + Tabung
              </button>
            </div>
            
            <div className="progress-ring-container">
              <svg width="130" height="130">
                <circle className="progress-ring-bg" cx="65" cy="65" r="55"></circle>
                <circle 
                  className="progress-ring-bar" 
                  cx="65" 
                  cy="65" 
                  r="55" 
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

          {/* Card 3: Spending Distribution Chart */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}><i className="bi bi-pie-chart me-2"></i>Alokasi Pengeluaran</h3>
            <div className="chart-container-inner">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          {/* Card 4: Quick Transaction Form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}><i className="bi bi-plus-circle me-2"></i>Tambah Transaksi</h3>
            <form onSubmit={handleFormSubmit} className="input-form">
              <div className="form-group">
                <label>Nama Transaksi</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-input" 
                  placeholder="Contoh: Kopi Kulo, Gaji Part-time"
                  value={form.name} 
                  onChange={handleFormChange}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nominal (Rp)</label>
                  <input 
                    type="number" 
                    name="amount" 
                    className="form-input" 
                    placeholder="15000"
                    value={form.amount} 
                    onChange={handleFormChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Tipe</label>
                  <select 
                    name="type" 
                    className="form-select" 
                    value={form.type} 
                    onChange={handleFormChange}
                  >
                    <option value="expense">Pengeluaran</option>
                    <option value="income">Pemasukan</option>
                  </select>
                </div>
              </div>

              {form.type === 'expense' && (
                <div className="form-group">
                  <label>Kategori</label>
                  <select 
                    name="category" 
                    className="form-select" 
                    value={form.category} 
                    onChange={handleFormChange}
                  >
                    <option value="Belanja">Belanja</option>
                    <option value="Makanan">Makanan/Kuliner</option>
                    <option value="Hiburan">Hiburan/Hobi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              )}

              <button type="submit" className="btn-submit">
                <i className="bi bi-check-lg"></i> Simpan
              </button>
            </form>
          </div>

          {/* Card 5: Transactions History List */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}><i className="bi bi-clock-history me-2"></i>Riwayat Transaksi</h3>
            <div className="transaction-list-container">
              {transactions.map(t => (
                <div key={t.id} className="transaction-item">
                  <div className="t-info">
                    <div className="t-category-icon">
                      <i className={`bi ${getCategoryIcon(t.category)}`}></i>
                    </div>
                    <div>
                      <div className="t-name">{t.name}</div>
                      <div className="t-category">{t.category}</div>
                    </div>
                  </div>
                  <div className="t-right">
                    <span className={`t-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
                    </span>
                    <button 
                      onClick={() => handleDeleteTransaction(t.id)} 
                      className="btn-delete" 
                      title="Hapus transaksi"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  <i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                  Belum ada transaksi
                </div>
              )}
            </div>
          </div>

        </div>

        <footer style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          &copy; 2026 Financely. Built with React + Vite + Chart.js.
        </footer>
      </div>
    </div>
  );
}

export default App;
