import express, { Express } from 'express';
import { attachBaseMiddlewares } from '../middlewares/attachBaseMiddlewares.js';
import { attachErrorMiddlewares } from '../middlewares/attachErrorMiddlewares.js';
import { attachHttpRoutes } from '../routes/index.js';
import './loadEnvVariables.js';

const PORT = 8000;

async function startServer() {
  const app: Express = express();

  attachBaseMiddlewares({ app });

  attachHttpRoutes(app);

  attachErrorMiddlewares({ app });

  app.listen(PORT, () => console.log(`server started on port ${PORT}`));
}

export { startServer };
