import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Local `npm run dev` par /api/* chalane ke liye (Vercel par ye apne aap hota hai)
const localApi = {
  name: 'local-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url.startsWith('/api/')) return next();
      const name = req.url.split('?')[0].replace('/api/', '');
      const send = (c, o) => { res.statusCode = c; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); };
      try {
        const mod = await server.ssrLoadModule('/api/' + name + '.js');
        let body = ''; for await (const c of req) body += c;
        req.body = body ? JSON.parse(body) : {};
        res.status = (c) => { res.statusCode = c; return res; };
        res.json = (o) => send(res.statusCode || 200, o);
        await mod.default(req, res);
      } catch (e) { send(500, { error: String(e.message || e) }); }
    });
  },
};

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return { plugins: [react(), localApi] };
});
