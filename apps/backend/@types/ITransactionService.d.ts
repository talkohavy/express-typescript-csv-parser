import type { ITransactionRepository, TransactionDB } from '@root-client/postgres';
import type { ParseCsvResponse } from './ParseCsvResponse.js';
import type { Request, Response } from 'express';

declare interface ITransactionService {
  repository: ITransactionRepository;

  postNewTransaction: (req: Request) => Promise<TransactionDB>;
  getTransactions: (req: Request) => Promise<Array<TransactionDB>>;
  getTransactionById: (req: Request) => Promise<TransactionDB>;
  parseCsvTransactionsFile: (req: Request, res: Response) => Promise<ParseCsvResponse>;
}

export type { ITransactionService };
