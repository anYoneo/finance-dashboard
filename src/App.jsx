import React, { useState, useMemo, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function App() {
  // 1. Theme State
  const [theme, setTheme] = useState('slate');

  // Sync theme class to document.body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalAmount, setModalAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Layout State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Advanced Ledger State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // 2. Savings Goal State
  const [savingsGoal, setSavingsGoal] = useState({
    target: 20000000,
    current: 7500000
  });

  // 3. Transactions State
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Gaji Bulanan', amount: 18500000, type: 'income', category: 'Gaji', date: '2026-08-01' },
    { id: 2, name: 'Belanja Bulanan', amount: 1200000, type: 'expense', category: 'Belanja', date: '2026-08-02' },
    { id: 3, name: 'Makan Malam Restaurant', amount: 450000, type: 'expense', category: 'Makanan', date: '2026-08-03' },
    { id: 4, name: 'Langganan Netflix', amount: 186000, type: 'expense', category: 'Hiburan', date: '2026-08-04' },
    { id: 5, name: 'Freelance Project', amount: 3500000, type: 'income', category: 'Gaji', date: '2026-08-05' }
  ]);

  // 4. Form inputs state (Custom Selects)
  const [form, setForm] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: 'Belanja'
  });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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

  const dashOffset = useMemo(() => {
    const radius = 55;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (savingsPercent / 100) * circumference;
    return offset;
  }, [savingsPercent]);

  // 7. Actions
  const handleAddSavingsClick = () => {
    setShowModal(true);
    setModalAmount('');
  };

  const submitSavings = (e) => {
    e.preventDefault();
    const amount = parseInt(modalAmount, 10);
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
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowModal(false);
    }, 1500);
  };

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
      category: form.type === 'income' ? 'Gaji' : form.category,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions(prev => [newTx, ...prev]);
    setForm({
      name: '',
      amount: '',
      type: 'expense',
      category: 'Belanja'
    });
  };

  // 9. Charts
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const analyticsChartRef = useRef(null);
  const analyticsChartInstance = useRef(null);

  const rootStyle = getComputedStyle(document.body);
  const accentGlow = rootStyle.getPropertyValue('--accent-glow').trim() || '#38bdf8';
  const accentPrimary = rootStyle.getPropertyValue('--accent-primary').trim() || '#10b981';
  const accentSecondary = rootStyle.getPropertyValue('--accent-secondary').trim() || '#f43f5e';
  const textMuted = rootStyle.getPropertyValue('--text-muted').trim() || '#94a3b8';

  useEffect(() => {
    if (activeTab === 'dashboard') {
      if (!chartRef.current) return;
      const categories = ['Belanja', 'Makanan', 'Hiburan', 'Lainnya'];
      const categorySums = { Belanja: 0, Makanan: 0, Hiburan: 0, Lainnya: 0 };
      
      transactions.forEach(t => {
        if (t.type === 'expense') {
          const cat = categories.includes(t.category) ? t.category : 'Lainnya';
          categorySums[cat] += t.amount;
        }
      });

      const dataValues = categories.map(cat => categorySums[cat]);

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categories,
          datasets: [{
            data: dataValues,
            backgroundColor: [
              'rgba(56, 189, 248, 0.65)',
              'rgba(16, 185, 129, 0.65)',
              'rgba(192, 132, 252, 0.65)',
              'rgba(244, 63, 94, 0.65)'
            ],
            borderColor: [
              accentGlow,
              accentPrimary,
              '#c084fc',
              accentSecondary
            ],
            borderWidth: 2,
            hoverOffset: 8
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
                usePointStyle: true,
                padding: 20,
                font: { family: 'Plus Jakarta Sans', weight: '600', size: 12 }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleFont: { family: 'Space Grotesk', size: 14, weight: '700' },
              bodyFont: { family: 'Plus Jakarta Sans', size: 13 },
              padding: 12,
              borderColor: accentGlow,
              borderWidth: 1,
              displayColors: true,
              boxPadding: 6,
              cornerRadius: 12
            }
          },
          cutout: '75%',
          animation: { animateScale: true, animateRotate: true }
        }
      });
    } else if (activeTab === 'analytics') {
      if (!analyticsChartRef.current) return;

      if (analyticsChartInstance.current) {
        analyticsChartInstance.current.destroy();
      }

      const ctx = analyticsChartRef.current.getContext('2d');
      const gradientIncome = ctx.createLinearGradient(0, 0, 0, 400);
      gradientIncome.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
      gradientIncome.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

      const gradientExpense = ctx.createLinearGradient(0, 0, 0, 400);
      gradientExpense.addColorStop(0, 'rgba(244, 63, 94, 0.5)');
      gradientExpense.addColorStop(1, 'rgba(244, 63, 94, 0.0)');

      analyticsChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Pemasukan',
              data: [15000000, 15500000, 16000000, 18000000, 17500000, 18500000],
              borderColor: accentPrimary,
              backgroundColor: gradientIncome,
              borderWidth: 3,
              fill: true,
              tension: 0.4
            },
            {
              label: 'Pengeluaran',
              data: [8000000, 7500000, 9000000, 8500000, 9500000, 9000000],
              borderColor: accentSecondary,
              backgroundColor: gradientExpense,
              borderWidth: 3,
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: textMuted,
                usePointStyle: true,
                font: { family: 'Plus Jakarta Sans', weight: '600' }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleFont: { family: 'Space Grotesk', size: 14, weight: '700' },
              bodyFont: { family: 'Plus Jakarta Sans', size: 13 },
              padding: 12,
              borderColor: accentGlow,
              borderWidth: 1,
              cornerRadius: 12
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: textMuted }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: textMuted }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
      if (analyticsChartInstance.current) analyticsChartInstance.current.destroy();
    };
  }, [transactions, theme, activeTab]);

  // Formatter helper
  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getCategoryColorClass = (category) => {
    const colors = {
      'Gaji': 'pill-income',
      'Belanja': 'pill-expense-1',
      'Makanan': 'pill-expense-2',
      'Hiburan': 'pill-expense-3',
      'Lainnya': 'pill-expense-4'
    };
    return colors[category] || 'pill-expense-4';
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

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'All' || t.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [transactions, searchQuery, categoryFilter]);

  return (
    <div className={`theme-${theme}`}>
      <div className="bg-orbs">
        <div className="orb-1"></div>
        <div className="orb-2"></div>
      </div>

      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="logo-container">
              <div className="logo-icon">
                <i className="bi bi-wallet2"></i>
              </div>
              <div className="logo-text">Financely</div>
            </div>

            <nav className="sidebar-nav">
              <button 
                className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <i className="bi bi-grid-1x2-fill"></i> Dashboard
              </button>
              <button 
                className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="bi bi-graph-up-arrow"></i> Analytics
              </button>
            </nav>
          </div>

          <div className="sidebar-bottom">
            <div className="active-session">
              <img src="https://ui-avatars.com/api/?name=Riszky+Wibowo&background=38bdf8&color=fff" alt="User Avatar" className="avatar" />
              <div className="user-info">
                <div className="user-name">M. Riszky Wibowo</div>
                <div className="user-role">Premium Member</div>
              </div>
            </div>

            <div className="theme-selector-vertical">
              <div className="theme-label">Theme</div>
              <div className="theme-options">
                <button 
                  className={`theme-btn ${theme === 'slate' ? 'active' : ''}`} 
                  onClick={() => setTheme('slate')}
                  title="Slate Dark"
                ><i className="bi bi-circle-fill" style={{ color: '#38bdf8' }}></i></button>
                <button 
                  className={`theme-btn ${theme === 'cyberpunk' ? 'active' : ''}`} 
                  onClick={() => setTheme('cyberpunk')}
                  title="Cyberpunk"
                ><i className="bi bi-circle-fill" style={{ color: '#ec4899' }}></i></button>
                <button 
                  className={`theme-btn ${theme === 'emerald' ? 'active' : ''}`} 
                  onClick={() => setTheme('emerald')}
                  title="Emerald"
                ><i className="bi bi-circle-fill" style={{ color: '#34d399' }}></i></button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="main-header">
            <h2>{activeTab === 'dashboard' ? 'Dashboard Overview' : 'Analytics & Insights'}</h2>
            <div className="date-display">
              <i className="bi bi-calendar3"></i> {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </header>

          {activeTab === 'dashboard' ? (
            <div className="dashboard-grid">
              
              {/* Virtual Card */}
              <div className="glass-card virtual-card-container">
                <div className="virtual-card">
                  <div className="card-shimmer"></div>
                  <div className="card-top">
                    <div className="chip">
                      <div className="chip-line"></div>
                      <div className="chip-line"></div>
                      <div className="chip-line"></div>
                      <div className="chip-line"></div>
                    </div>
                    <div className="card-logo">
                      <i className="bi bi-globe"></i> FINANCELy
                    </div>
                  </div>
                  <div className="card-number">
                    <span>••••</span> <span>••••</span> <span>••••</span> <span>4452</span>
                  </div>
                  <div className="card-bottom">
                    <div className="cardholder">
                      <div className="label">Cardholder Name</div>
                      <div className="value">M. RISZKY WIBOWO</div>
                    </div>
                    <div className="expires">
                      <div className="label">Valid Thru</div>
                      <div className="value">08/29</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance & Flow */}
              <div className="glass-card balance-card">
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

              {/* Savings Goal */}
              <div className="glass-card savings-goal-card">
                <div className="goal-header">
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}><i className="bi bi-piggy-bank me-2"></i>Savings Goal</span>
                  <button onClick={handleAddSavingsClick} className="btn-tabung-premium" title="Tambahkan dana ke tabungan">
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

              {/* Spending Distribution Chart */}
              <div className="glass-card chart-card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}><i className="bi bi-pie-chart me-2"></i>Alokasi Pengeluaran</h3>
                <div className="chart-container-inner">
                  <canvas ref={chartRef}></canvas>
                </div>
              </div>

              {/* Quick Transaction Form with Custom Select */}
              <div className="glass-card form-card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}><i className="bi bi-plus-circle me-2"></i>Tambah Transaksi</h3>
                <form onSubmit={handleFormSubmit} className="input-form">
                  <div className="form-group">
                    <label>Nama Transaksi</label>
                    <input 
                      type="text" name="name" className="form-input" 
                      placeholder="Contoh: Kopi Kulo, Gaji Part-time"
                      value={form.name} onChange={handleFormChange} required 
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Nominal (Rp)</label>
                      <input 
                        type="number" name="amount" className="form-input" 
                        placeholder="15000" value={form.amount} onChange={handleFormChange} required 
                      />
                    </div>
                    <div className="form-group custom-select-container">
                      <label>Tipe</label>
                      <div className="custom-select" onClick={() => setShowTypeDropdown(!showTypeDropdown)}>
                        {form.type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
                        <i className={`bi bi-chevron-down ${showTypeDropdown ? 'rotated' : ''}`}></i>
                      </div>
                      {showTypeDropdown && (
                        <div className="custom-options">
                          <div className="custom-option" onClick={() => { setForm({...form, type: 'expense'}); setShowTypeDropdown(false); }}>Pengeluaran</div>
                          <div className="custom-option" onClick={() => { setForm({...form, type: 'income'}); setShowTypeDropdown(false); }}>Pemasukan</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {form.type === 'expense' && (
                    <div className="form-group custom-select-container">
                      <label>Kategori</label>
                      <div className="custom-select" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
                        {form.category}
                        <i className={`bi bi-chevron-down ${showCategoryDropdown ? 'rotated' : ''}`}></i>
                      </div>
                      {showCategoryDropdown && (
                        <div className="custom-options">
                          {['Belanja', 'Makanan', 'Hiburan', 'Lainnya'].map(cat => (
                            <div key={cat} className="custom-option" onClick={() => { setForm({...form, category: cat}); setShowCategoryDropdown(false); }}>
                              {cat}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <button type="submit" className="btn-submit">
                    <i className="bi bi-check-lg"></i> Simpan
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="analytics-view">
              <div className="glass-card w-full">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}><i className="bi bi-bar-chart me-2"></i>Monthly Cash Flow</h3>
                <div className="analytics-chart-container">
                  <canvas ref={analyticsChartRef}></canvas>
                </div>
              </div>
            </div>
          )}

          {/* Ledger / Transactions List */}
          <div className="glass-card ledger-card">
            <div className="ledger-header">
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}><i className="bi bi-clock-history me-2"></i>Riwayat Transaksi</h3>
              
              <div className="ledger-controls">
                <div className="search-box">
                  <i className="bi bi-search"></i>
                  <input 
                    type="text" 
                    placeholder="Cari transaksi..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="category-filters">
              {['All', 'Belanja', 'Makanan', 'Hiburan', 'Gaji'].map(cat => (
                <button 
                  key={cat}
                  className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="transaction-list-container">
              {filteredTransactions.map(t => (
                <div key={t.id} className="transaction-item">
                  <div className="t-info">
                    <div className="t-category-icon">
                      <i className={`bi ${getCategoryIcon(t.category)}`}></i>
                    </div>
                    <div>
                      <div className="t-name">{t.name}</div>
                      <div className="t-category">
                        <span className={`category-pill ${getCategoryColorClass(t.category)}`}>
                          <span className="pill-dot"></span> {t.category}
                        </span>
                        <span className="t-date">{t.date || 'Today'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="t-right">
                    <span className={`t-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
                    </span>
                    <button onClick={() => handleDeleteTransaction(t.id)} className="btn-delete" title="Hapus transaksi">
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              ))}
              {filteredTransactions.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  <i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                  Tidak ada transaksi
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Custom Premium Modal for Savings */}
      {showModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${showSuccess ? 'success-state' : ''}`}>
            {!showSuccess ? (
              <>
                <div className="modal-header">
                  <h3><i className="bi bi-piggy-bank"></i> Tambah Tabungan</h3>
                  <button className="btn-close-modal" onClick={() => setShowModal(false)}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <form onSubmit={submitSavings} className="modal-body">
                  <p className="modal-desc">Alokasikan sisa saldo Anda ke target tabungan untuk masa depan.</p>
                  <div className="form-group">
                    <label>Jumlah Dana (Rp)</label>
                    <input 
                      type="number" 
                      className="form-input modal-input" 
                      placeholder="Contoh: 500000" 
                      value={modalAmount}
                      onChange={(e) => setModalAmount(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
                    <button type="submit" className="btn-submit modal-submit">Simpan</button>
                  </div>
                </form>
              </>
            ) : (
              <div className="success-animation">
                <div className="success-icon"><i className="bi bi-check-lg"></i></div>
                <h3>Berhasil!</h3>
                <p>Dana tabungan berhasil ditambahkan.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
