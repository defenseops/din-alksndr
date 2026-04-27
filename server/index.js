const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security headers ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
}));

// ── CORS — только свой домен ──────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10kb' })); // защита от огромных тел запроса

// ── Rate limiting — не более 20 заявок в час с одного IP ──────
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Слишком много запросов, попробуйте позже.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Валидация входных данных ──────────────────────────────────
function sanitize(str, maxLen = 200) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/[<>]/g, '');
}

// ── Отправка в Telegram ───────────────────────────────────────
async function sendToTelegram(text) {
  const url = `https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.TG_CHAT_ID,
      text,
      parse_mode: 'HTML',
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API error: ${body}`);
  }
}

// ── Routes ────────────────────────────────────────────────────
app.get('/api/sections', (req, res) => {
  res.json([
    { id: 'weddings',   label: 'Свадьбы',      href: '/weddings'   },
    { id: 'corporate',  label: 'Корпоративы',   href: '/corporate'  },
  ]);
});

app.post('/api/lead', formLimiter, async (req, res) => {
  const { date, city, guests, name, phone, contact, source } = req.body;

  // Валидация — телефон обязателен
  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    return res.status(400).json({ error: 'Некорректный номер телефона.' });
  }

  const safeDate    = sanitize(date, 20);
  const safeCity    = sanitize(city);
  const safeGuests  = sanitize(guests, 20);
  const safeName    = sanitize(name);
  const safePhone   = sanitize(phone, 20);
  const safeContact = sanitize(contact, 50);
  const safeSource  = sanitize(source, 30) || 'Сайт';

  const formattedDate = safeDate
    ? new Date(safeDate).toLocaleDateString('ru-RU')
    : 'не указана';

  const text = [
    `📋 <b>Новая заявка с сайта (${safeSource})</b>`,
    ``,
    `📅 Дата: ${formattedDate}`,
    `📍 Город: ${safeCity || 'не указан'}`,
    `👥 Кол-во гостей: ${safeGuests || 'не указано'}`,
    `👤 Имя: ${safeName || 'не указано'}`,
    `📞 Телефон: +7${safePhone}`,
    `💬 Как связаться: ${safeContact || 'не указано'}`,
  ].join('\n');

  try {
    await sendToTelegram(text);
    res.json({ ok: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка отправки. Попробуйте позже.' });
  }
});

// ── Статика клиента (в продакшене) ───────────────────────────
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ── Глобальный обработчик ошибок (не светим стек треком) ──────
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
