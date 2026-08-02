const express = require('express');
const { z } = require('zod');
const pool = require('../database/connection');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();
router.use(authenticate);

const createSchema = z.object({
  name: z.string().min(1).max(255),
  amount: z.number().positive().max(999999999999),
  type: z.enum(['income', 'expense']),
  category: z.string().max(50).default('Lainnya'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

router.get('/', async (req, res, next) => {
  try {
    const { type, category, limit = 50, offset = 0 } = req.query;
    let sql = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [req.user.id];

    if (type) { sql += ' AND type = ?'; params.push(type); }
    if (category) { sql += ' AND category = ?'; params.push(category); }

    sql += ' ORDER BY date DESC, id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.execute(sql, params);
    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM transactions WHERE user_id = ?', [req.user.id]);

    res.json({ transactions: rows, total, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (err) { next(err); }
});

router.post('/', validate(createSchema), async (req, res, next) => {
  try {
    const { name, amount, type, category, date } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO transactions (user_id, name, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, name, amount, type, category, date || new Date().toISOString().split('T')[0]]
    );
    const [[row]] = await pool.execute('SELECT * FROM transactions WHERE id = ?', [result.insertId]);
    res.status(201).json({ transaction: row });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) { next(err); }
});

router.get('/summary', async (req, res, next) => {
  try {
    const [[summary]] = await pool.execute(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
        COUNT(*) as total_transactions
      FROM transactions WHERE user_id = ?`,
      [req.user.id]
    );
    summary.balance = parseFloat(summary.total_income) - parseFloat(summary.total_expense);
    res.json({ summary });
  } catch (err) { next(err); }
});

module.exports = router;