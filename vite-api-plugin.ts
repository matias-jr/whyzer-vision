import type { Plugin, ViteDevServer } from 'vite';

/**
 * Dev-only: run the Vercel serverless handlers in `api/` behind `npm run dev`.
 *
 * In production Vercel serves `api/*.js` as functions; the Vite dev server
 * knows nothing about them, so /admin/attribution would 404 locally. This
 * plugin mounts each handler on its matching /api/<name> path with a minimal
 * req/res shim, which is enough for the JSON GET/POST endpoints here.
 *
 * Not used in the production build.
 */
export function apiPlugin(): Plugin {
  return {
    name: 'local-api-handlers',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        if (!url.startsWith('/api/')) return next();

        const parsed = new URL(url, 'http://localhost');
        // /api/attribution-revenue?x=1 -> attribution-revenue
        const name = parsed.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
        if (!name || name.startsWith('_')) return next();

        try {
          const mod = await server.ssrLoadModule(`/api/${name}.js`);
          const handler = mod.default;
          if (typeof handler !== 'function') return next();

          // Collect a JSON body for POST/PUT.
          let body: unknown = {};
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk as Buffer);
            const raw = Buffer.concat(chunks).toString('utf8');
            if (raw) {
              try {
                body = JSON.parse(raw);
              } catch {
                body = {};
              }
            }
          }

          const query = Object.fromEntries(parsed.searchParams.entries());

          // Minimal Vercel-style res shim.
          const shim = {
            statusCode: 200,
            status(code: number) {
              this.statusCode = code;
              return this;
            },
            setHeader(key: string, value: string) {
              res.setHeader(key, value);
              return this;
            },
            json(payload: unknown) {
              res.statusCode = this.statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(payload));
              return this;
            },
            send(payload: unknown) {
              res.statusCode = this.statusCode;
              res.end(typeof payload === 'string' ? payload : JSON.stringify(payload));
              return this;
            },
          };

          await handler({ ...req, method: req.method, query, body, headers: req.headers }, shim);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(`[local-api] ${name} failed:`, err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: String((err as Error)?.message ?? err) }));
        }
      });
    },
  };
}
