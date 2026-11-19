import { MongoClient } from 'mongodb';
import crypto from 'crypto';
let client;
export async function col() {
  if (!client) client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return client.db('portfolio').collection('site');
}
const sign = (p) => crypto.createHmac('sha256', process.env.AUTH_SECRET).update(p).digest('hex');
export function makeToken() {
  const p = 'admin.' + (Date.now() + 7 * 864e5);
  return p + '.' + sign(p);
}
export function okToken(req) {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  const [a, exp, sig] = t.split('.');
  if (!sig || Number(exp) < Date.now()) return false;
  const good = sign(a + '.' + exp);
  return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good));
}
