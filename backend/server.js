import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;
const adminUser = process.env.ADMIN_USER || 'admin';
const adminPass = process.env.ADMIN_PASS || 'admin';
const adminSecret = process.env.ADMIN_SECRET || 'dev-secret-change';

app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: [
      'http://localhost:4200',
      'http://127.0.0.1:4200',
    ],
  })
);

const dbPath = path.join(__dirname, 'data', 'leads.db');
const db = new sqlite3.Database(dbPath);

const initSql = `
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    lang TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`;

db.serialize(() => {
  db.run(initSql);
});

if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS || !process.env.ADMIN_SECRET) {
  console.warn(
    'ADMIN_* env vars are not fully set. Using default credentials. Set backend/.env for production.'
  );
}

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

const toBase64Url = (input) => Buffer.from(input).toString('base64url');
const sign = (data) =>
  crypto.createHmac('sha256', adminSecret).update(data).digest('base64url');

const createToken = (payload) => {
  const body = toBase64Url(JSON.stringify(payload));
  const signature = sign(body);
  return `${body}.${signature}`;
};

const verifyToken = (token) => {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = sign(body);
  if (expected !== signature) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (!payload?.exp || Date.now() > payload.exp) return null;
  return payload;
};

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials.' });
  }
  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  const token = createToken({
    sub: adminUser,
    exp: Date.now() + TOKEN_TTL_MS,
  });
  return res.json({ token });
});

app.post('/api/leads', (req, res) => {
  const { name, email, company, lang } = req.body ?? {};

  if (!name || !email || !company || !lang) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const stmt = `
    INSERT INTO leads (name, email, company, lang, created_at)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(stmt, [name, email, company, lang, new Date().toISOString()], function onInsert(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }
    return res.status(201).json({ id: this.lastID });
  });
});

app.get('/api/leads', requireAuth, (req, res) => {
  const sql = `
    SELECT id, name, email, company, lang, created_at
    FROM leads
    ORDER BY datetime(created_at) DESC
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }
    return res.json({ items: rows });
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});
