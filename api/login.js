import crypto from 'crypto';
import { makeToken } from './_db.js';
const eq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
export default async function handler(req, res) {
  const { email = '', password = '' } = req.body || {};
  if (eq(email.trim().toLowerCase(), (process.env.ADMIN_EMAIL || '').toLowerCase()) && eq(password, process.env.ADMIN_PASSWORD || '')) {
    return res.status(200).json({ token: makeToken() });
  }
  await new Promise((r) => setTimeout(r, 1000));
  res.status(401).json({ error: 'Email ya password galat hai' });
}
