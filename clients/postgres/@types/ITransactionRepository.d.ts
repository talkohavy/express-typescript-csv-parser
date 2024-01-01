import type { TransactionDB, TransactionParams } from './Transaction.js';
import type { Client } from 'pg';

declare interface ITransactionRepository {
  client: Client;

  connect: () => void;
  postNewTransaction: (props: TransactionParams) => Promise<TransactionDB>;
  getTransactions: (props: any) => Promise<Array<TransactionDB>>;
  getTransactionById: (transactionId: number) => Promise<TransactionDB>;
  disconnect: () => Promise<void>;
  query: (sql: string, params: Array<any>) => Promise<any>;
}

export type { ITransactionRepository };
