const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { randomUUID } = require('crypto');
const db = require('../db');
const { requireAuth } = require('../lib/auth');

const router = express.Router();
router.use(requireAuth);

const ALLOWED_SECTIONS = ['weddings_gallery', 'corporate_gallery_row1', 'corporate_gallery_row2'];
const ALLOWED_MIME = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${randomUUID()}${ALLOWED_MIME[file.mimetype] || ''}`),
});

const MAX_PHOTO_SIZE = 20 * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: MAX_PHOTO_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME[file.mimetype]) {
      return cb(new Error('Разрешены только JPG, PNG и WEBP.'));
    }
    cb(null, true);
  },
});

router.post('/', (req, res) => {
  upload.single('photo')(req, res, (err) => {
    if (err?.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: `Файл слишком большой (максимум ${MAX_PHOTO_SIZE / 1024 / 1024} МБ).` });
    }
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Файл не получен.' });

    const { section } = req.body;
    if (!ALLOWED_SECTIONS.includes(section)) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: 'Неизвестный раздел галереи.' });
    }

    const wide = req.body.wide === 'true' || req.body.wide === '1' ? 1 : 0;
    const filePath = `/uploads/${req.file.filename}`;
    const { max } = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS max FROM photos WHERE section = ?').get(section);

    const info = db.prepare(
      'INSERT INTO photos (section, file_path, wide, sort_order) VALUES (?, ?, ?, ?)'
    ).run(section, filePath, wide, max + 1);

    const photo = db.prepare('SELECT id, section, file_path, wide, sort_order FROM photos WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ ...photo, wide: !!photo.wide });
  });
});

// Сохраняет порядок целиком (drag & drop в админке): { sections: { section: [id, ...] } }.
// Фото может переехать между разделами (верхний/нижний ряд корпоративов) — section обновляется.
// Переданные id должны в точности совпадать со всеми фото этих разделов, иначе 409:
// значит админка показывает устаревший список и должна его перезагрузить.
router.put('/order', (req, res) => {
  const sections = req.body?.sections;
  if (!sections || typeof sections !== 'object' || Array.isArray(sections)) {
    return res.status(400).json({ error: 'Некорректный порядок.' });
  }
  const names = Object.keys(sections);
  if (!names.length || !names.every((s) => ALLOWED_SECTIONS.includes(s) && Array.isArray(sections[s]))) {
    return res.status(400).json({ error: 'Неизвестный раздел галереи.' });
  }

  const sent = names.flatMap((s) => sections[s]).map(Number);
  const existing = db.prepare(
    `SELECT id FROM photos WHERE section IN (${names.map(() => '?').join(',')})`
  ).all(...names).map((r) => r.id);
  const sentSet = new Set(sent);
  if (sentSet.size !== sent.length || sent.length !== existing.length || !existing.every((id) => sentSet.has(id))) {
    return res.status(409).json({ error: 'Список фото изменился, обновите страницу.' });
  }

  // Между разделами можно переносить только ряды корпоративов (свадебная галерея — отдельно).
  const group = (s) => (s.startsWith('corporate_gallery') ? 'corporate' : s);
  const current = new Map(db.prepare(
    `SELECT id, section FROM photos WHERE section IN (${names.map(() => '?').join(',')})`
  ).all(...names).map((r) => [r.id, r.section]));
  if (names.some((s) => sections[s].some((id) => group(current.get(Number(id))) !== group(s)))) {
    return res.status(400).json({ error: 'Это фото нельзя перенести в другую галерею.' });
  }

  const update = db.prepare('UPDATE photos SET section = ?, sort_order = ? WHERE id = ?');
  db.transaction(() => {
    for (const s of names) {
      sections[s].forEach((id, i) => update.run(s, i, Number(id)));
    }
  })();

  res.json({ ok: true });
});

router.patch('/:id', (req, res) => {
  const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(req.params.id);
  if (!photo) return res.status(404).json({ error: 'Фото не найдено.' });

  if ('wide' in req.body) {
    db.prepare('UPDATE photos SET wide = ? WHERE id = ?').run(req.body.wide ? 1 : 0, photo.id);
  }

  const updated = db.prepare('SELECT id, section, file_path, wide, sort_order FROM photos WHERE id = ?').get(photo.id);
  res.json({ ...updated, wide: !!updated.wide });
});

router.delete('/:id', (req, res) => {
  const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(req.params.id);
  if (!photo) return res.status(404).json({ error: 'Фото не найдено.' });

  db.prepare('DELETE FROM photos WHERE id = ?').run(photo.id);

  const absPath = path.join(uploadsDir, path.basename(photo.file_path));
  fs.unlink(absPath, () => {});

  res.json({ ok: true });
});

module.exports = router;
