require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./connection');

async function seed() {
  console.log('Seeding database...');
  const hash = await bcrypt.hash('password', 12);
  await pool.execute(
    'INSERT IGNORE INTO users (email, password, name) VALUES (?, ?, ?)',
    ['demo@financely.test', hash, 'Demo User']
  );

  const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', ['demo@financely.test']);
  const userId = users[0].id;

  const transactions = [
    ['Gaji Bulanan', 18500000, 'income', 'Gaji', '2026-08-01'],
    ['Belanja Bulanan', 1200000, 'expense', 'Belanja', '2026-08-02'],
    ['Makan Malam', 450000, 'expense', 'Makanan', '2026-08-03'],
    ['Netflix', 186000, 'expense', 'Hiburan', '2026-08-04'],
    ['Freelance', 3500000, 'income', 'Gaji', '2026-08-05'],
  ];

  for (const [name, amount, type, category, date] of transactions) {
    await pool.execute(
      'INSERT INTO transactions (user_id, name, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, amount, type, category, date]
    );
  }

  await pool.execute(
    'INSERT IGNORE INTO savings_goals (user_id, target, current) VALUES (?, ?, ?)',
    [userId, 20000000, 7500000]
  );

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });