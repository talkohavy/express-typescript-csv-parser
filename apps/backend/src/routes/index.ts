import { QUERIES, TransactionRepository } from '@root-client/postgres';
import { checkIsAuthAdminMiddleware } from '../middlewares/checkIsAuthAdminMiddlewares.js';
import { TransactionService } from '../services/transaction.service.js';
import { STATUS_CODES } from '../utils/appConstants.js';
import type { Express, NextFunction, Request, Response } from 'express';

export function attachHttpRoutes(app: Express) {
  app.post('/upload-csv-file', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = new TransactionService({
        usersRepository: new TransactionRepository(process.env.POSTGRES_CONNECTION_STRING),
      });

      const data = await service.parseCsvTransactionsFile(req);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get('/transactions', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = new TransactionService({
        usersRepository: new TransactionRepository(process.env.POSTGRES_CONNECTION_STRING),
      });

      const data = await service.getTransactions(req);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get('/transactions/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = new TransactionService({
        usersRepository: new TransactionRepository(process.env.POSTGRES_CONNECTION_STRING),
      });

      const data = await service.getTransactionById(req);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error) {
      next(error);
    }
  });

  // Route for development ONLY!!!
  app.get('/clear-table', checkIsAuthAdminMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
      var db = new TransactionRepository(process.env.POSTGRES_CONNECTION_STRING);

      const data = await db.query(QUERIES.transactions.TRUNCATE_TABLE);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error) {
      next(error);
    } finally {
      await db?.disconnect();
    }
  });

  // Route for development ONLY!!!
  app.get('/create-table', checkIsAuthAdminMiddleware, async (req, res, next) => {
    try {
      var db = new TransactionRepository(process.env.POSTGRES_CONNECTION_STRING);

      const data = await db.query(QUERIES.transactions.CREATE_TABLE);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error) {
      next(error);
    } finally {
      await db?.disconnect();
    }
  });

  // Route for development ONLY!!!
  app.get('/drop-table', checkIsAuthAdminMiddleware, async (req, res, next) => {
    try {
      var db = new TransactionRepository(process.env.POSTGRES_CONNECTION_STRING);

      const data = await db.query(QUERIES.transactions.DROP_TABLE);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error) {
      next(error);
    } finally {
      await db?.disconnect();
    }
  });
}
