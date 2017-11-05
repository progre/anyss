const fastify = require('fastify');
import * as Next from 'next';

export async function serve(port: number, dev: boolean) {
  const app = Next({ dev, dir: 'lib/remote' });
  const handle = app.getRequestHandler();
  await app.prepare();
  const server = fastify();
  server.get('/api/', async (req: any, res: any) => {
    await app.render(req.req, res.res, '/a', req.query);
  });
  server.get('/*', async (req: any, res: any) => {
    await handle(req.req, res.res);
  });
  server.listen(port, (err: Error) => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
}
