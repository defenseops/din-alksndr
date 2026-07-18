const express = require('express');
const db = require('../db');
const { requireAuth } = require('../lib/auth');

const router = express.Router();
router.use(requireAuth);

function parseValue(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value, group_name FROM content ORDER BY group_name, key').all();
  res.json(rows.map((r) => ({ key: r.key, group: r.group_name, value: parseValue(r.value) })));
});

router.put('/:key', (req, res) => {
  const { key } = req.params;
  const { value, group } = req.body || {};
  if (value === undefined) return res.status(400).json({ error: 'Поле value обязательно.' });

  const groupName = typeof group === 'string' && group.trim()
    ? group.trim()
    : (db.prepare('SELECT group_name FROM content WHERE key = ?').get(key)?.group_name || key.split('.')[0]);

  const serialized = JSON.stringify(value);

  db.prepare(`
    INSERT INTO content (key, value, group_name) VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, group_name = excluded.group_name
  `).run(key, serialized, groupName);

  res.json({ key, group: groupName, value });
});

module.exports = router;
