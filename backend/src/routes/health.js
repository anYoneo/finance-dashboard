const express = require('express');
const pool = require('../database/connection');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', timestamp: new Date().toISOString(), database: 'disconnected' });
  }
});

module.exports = router;