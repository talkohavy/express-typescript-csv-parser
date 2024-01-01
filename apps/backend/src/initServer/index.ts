import express, { Express } from 'express';

const PORT = 8000;

async function startServer() {
  const app: Express = express();

  app.listen(PORT, () => console.log(`server started on port ${PORT}`));
}

export { startServer };
