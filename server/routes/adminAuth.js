const express = require('express');
const rateLimit = require('express-rate-limit');
const { verifyCredentials, issueToken, cookieOptions, requireAuth, COOKIE_NAME } = require('../lib/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Слишком много попыток входа, попробуйте позже.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Укажите логин и пароль.' });
  }
  if (!verifyCredentials(username, password)) {
    return res.status(401).json({ error: 'Неверный логин или пароль.' });
  }
  const token = issueToken(username);
  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.json({ ok: true, username });
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ username: req.admin.sub });
});

module.exports = router;
