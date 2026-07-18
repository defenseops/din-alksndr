const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/content', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM content').all();
  const content = {};
  for (const { key, value } of rows) {
    try {
      content[key] = JSON.parse(value);
    } catch {
      content[key] = value;
    }
  }
  res.json(content);
});

router.get('/videos', (req, res) => {
  const rows = db.prepare('SELECT id, section, provider, external_id, title FROM videos ORDER BY section, sort_order, id').all();
  const bySection = {};
  for (const row of rows) {
    (bySection[row.section] ||= []).push(row);
  }
  res.json(bySection);
});

router.get('/photos', (req, res) => {
  const rows = db.prepare('SELECT id, section, file_path, wide, sort_order FROM photos ORDER BY section, sort_order, id').all();
  const bySection = {};
  for (const row of rows) {
    (bySection[row.section] ||= []).push({ ...row, wide: !!row.wide });
  }
  res.json(bySection);
});

module.exports = router;
