const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const COOKIE_NAME = 'admin_token';
const JWT_EXPIRES_IN = '7d';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set in server/.env');
  return secret;
}

// Создаёт единственного админа из ADMIN_USERNAME/ADMIN_PASSWORD, если таблица ещё пустая.
function ensureAdminSeeded() {
  const { c } = db.prepare('SELECT COUNT(*) AS c FROM admin_users').get();
  if (c > 0) return;

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    console.warn('ADMIN_USERNAME / ADMIN_PASSWORD не заданы в server/.env — админка недоступна, пока их не добавите и не перезапустите сервер.');
    return;
  }

  const hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(username, hash);
  console.log(`Создан админ-аккаунт "${username}".`);
}

function verifyCredentials(username, password) {
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!user) return false;
  return bcrypt.compareSync(password, user.password_hash);
}

function issueToken(username) {
  return jwt.sign({ sub: username }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'Не авторизован.' });
  try {
    req.admin = jwt.verify(token, getJwtSecret());
    next();
  } catch {
    res.status(401).json({ error: 'Сессия истекла, войдите заново.' });
  }
}

module.exports = {
  COOKIE_NAME,
  ensureAdminSeeded,
  verifyCredentials,
  issueToken,
  cookieOptions,
  requireAuth,
};
