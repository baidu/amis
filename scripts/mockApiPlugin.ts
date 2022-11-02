import type {Plugin} from 'vite';
// @ts-ignore
import handler from '../mock/index';
import express, {query} from 'express';
import setPrototypeOf from 'setprototypeof';
import path from 'path';
const app = express();

function initExpress(req: any, res: any, next: any, callback: () => void) {
  if (app.enabled('x-powered-by')) res.setHeader('X-Powered-By', 'Express');
  (req as any).res = res;
  res.req = req;
  (req as any).next = next;

  setPrototypeOf(req, app.request);
  setPrototypeOf(res, app.response);

  res.locals = res.locals || Object.create(null);

  query({})(req as any, res, callback);
}

export default function mockApiPlugin(options: {} = {}): Plugin {
  return {
    name: 'mock-api',
    enforce: 'pre' as 'pre',
    apply: 'serve' as 'serve',
    configureServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        initExpress(req, res, next, () => {
          handler(req, res);
        });
      });

      server.middlewares.use('/schema.json', (req, res, next) => {
        initExpress(req, res, next, () => {
          res.sendFile(path.resolve(__dirname, '../packages/amis/schema.json'));
        });
      });
    }
  };
}
