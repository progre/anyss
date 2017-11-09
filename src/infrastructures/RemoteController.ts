const fastify = require('fastify');
const fastifyStatic = require('fastify-static');
import * as path from 'path';

export default class RemoteController {
  private server: any;

  constructor(
    private delegate: {
      getSounds(): ReadonlyArray<{
        readonly fileName: string;
        readonly tags: ReadonlyArray<string>;
      }>,
      setSrc(fileName: string): void;
    },
  ) {
    this.server = fastify();
    this.server.register(fastifyStatic, {
      root: path.join(__dirname, 'remote'),
    });

    this.server.get('/api/getSounds', async (req: any, res: any) => {
      return { sounds: this.delegate.getSounds() };
    });

    this.server.post('/api/setSrc', async (req: any, res: any) => {
      this.delegate.setSrc(req.body.src);
      return {};
    });

    this.server.listen(80, (err: Error) => {
      if (err != null) {
        throw err;
      }
      console.log('> Ready on http://localhost');
    });
  }
}
