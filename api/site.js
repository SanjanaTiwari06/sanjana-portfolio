import { col, okToken } from './_db.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const c = await col();
    if (req.method === 'GET') {
      const d = await c.findOne({ _id: 'main' });
      return res.status(200).json({ data: d ? d.data : null });
    }
    if (req.method === 'PUT') {
      if (!okToken(req)) return res.status(401).json({ error: 'Login expired, dobara login karo' });
      await c.updateOne({ _id: 'main' }, { $set: { data: req.body.data } }, { upsert: true });
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (e) {
    let hint = '';
    if (!process.env.VERCEL) {
      const m = (process.env.MONGODB_URI || '').match(/^mongodb\+srv:\/\/([^:]*):(.*)@/);
      hint = m ? ' [server ko mila: user=' + m[1] + ', password ke ' + decodeURIComponent(m[2]).length + ' akshar]' : ' [MONGODB_URI nahi mili ya format galat]';
    }
    res.status(500).json({ error: String(e.message || e) + hint });
  }
}