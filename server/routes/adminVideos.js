const express = require('express');
const db = require('../db');
const { requireAuth } = require('../lib/auth');
const { parseVideoUrl } = require('../lib/parseVideoUrl');

const router = express.Router();
router.use(requireAuth);

// Hero-видео на Weddings — это просто первый (по sort_order) элемент секции weddings_reel,
// отдельной секции под hero не заводим, чтобы админ правил видео в одном месте.
const ALLOWED_SECTIONS = ['weddings_reel', 'weddings_reviews', 'corporate_reel'];

function sanitizeTitle(title) {
  if (typeof title !== 'string') return null;
  const trimmed = title.trim().slice(0, 200);
  return trimmed || null;
}

router.post('/', (req, res) => {
  const { url, section, title } = req.body || {};
  if (!ALLOWED_SECTIONS.includes(section)) {
    return res.status(400).json({ error: 'Неизвестный раздел видео.' });
  }
  const parsed = parseVideoUrl(url);
  if (!parsed) {
    return res.status(400).json({ error: 'Не удалось распознать ссылку. Поддерживаются YouTube, Yandex.Disk, Google Drive.' });
  }

  const { max } = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS max FROM videos WHERE section = ?').get(section);
  const info = db.prepare(
    'INSERT INTO videos (section, provider, external_id, title, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).run(section, parsed.provider, parsed.external_id, sanitizeTitle(title), max + 1);

  const video = db.prepare('SELECT id, section, provider, external_id, title, sort_order FROM videos WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(video);
});

// Сохраняет порядок раздела целиком (drag & drop в админке): { section, ids: [id, ...] }.
// ids должны в точности совпадать с видео раздела, иначе 409 — список в админке устарел.
router.put('/order', (req, res) => {
  const { section, ids } = req.body || {};
  if (!ALLOWED_SECTIONS.includes(section) || !Array.isArray(ids)) {
    return res.status(400).json({ error: 'Некорректный порядок.' });
  }

  const sent = ids.map(Number);
  const existing = db.prepare('SELECT id FROM videos WHERE section = ?').all(section).map((r) => r.id);
  const sentSet = new Set(sent);
  if (sentSet.size !== sent.length || sent.length !== existing.length || !existing.every((id) => sentSet.has(id))) {
    return res.status(409).json({ error: 'Список видео изменился, обновите страницу.' });
  }

  const update = db.prepare('UPDATE videos SET sort_order = ? WHERE id = ?');
  db.transaction(() => {
    sent.forEach((id, i) => update.run(i, id));
  })();

  res.json({ ok: true });
});

router.patch('/:id', (req, res) => {
  const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(req.params.id);
  if (!video) return res.status(404).json({ error: 'Видео не найдено.' });

  if ('title' in req.body) {
    db.prepare('UPDATE videos SET title = ? WHERE id = ?').run(sanitizeTitle(req.body.title), video.id);
  }

  const updated = db.prepare('SELECT id, section, provider, external_id, title, sort_order FROM videos WHERE id = ?').get(video.id);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM videos WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Видео не найдено.' });
  res.json({ ok: true });
});

module.exports = router;
