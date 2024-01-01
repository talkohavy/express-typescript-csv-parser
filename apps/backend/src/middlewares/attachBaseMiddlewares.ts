import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import { attachHelmetMiddleware } from './attachHelmetMiddleware.js';

function attachBaseMiddlewares({ app, bodySizeLimit = '10mb' }: { app: Express; bodySizeLimit?: string }) {
  app.disable('x-powered-by');
  app.set('etag', false);

  attachHelmetMiddleware({ app });

  app.use(express.json({ limit: bodySizeLimit }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(compression());

  app.use(
    cors({
      origin: process.env.FRONTENDS?.split(','),
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    }),
  );
}

export { attachBaseMiddlewares };
