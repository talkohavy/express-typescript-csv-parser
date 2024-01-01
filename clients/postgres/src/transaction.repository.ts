import pg, { Client } from 'pg';
import { TransactionDB, TransactionParams } from '../@types/Transaction.js';
import { QUERIES } from './queries.js';
import { ITransactionRepository } from './index.js';

class TransactionRepository implements ITransactionRepository {
  client: Client;

  constructor(connectionString: string) {
    this.client = new pg.Client(connectionString);

    this.connect();
  }

  connect() {
    this.client.connect((err) => {
      if (err) return console.error('Error connecting to PostgreSQL:', err);

      console.log('Successfully Connected to Postgres!');
    });
  }

  async postNewTransaction(params: TransactionParams) {
    try {
      const {
        referenceNumber,
        accountMask,
        postedDate,
        description,
        details,
        amount,
        balance,
        currency,
        type,
        createdAt,
        updatedAt,
      } = params;

      const result = await this.client.query(QUERIES.transactions.UPSERT_ONE, [
        // The order of the fields here matters! It must match the corresponding SQL Table column order.
        referenceNumber,
        accountMask,
        postedDate,
        description,
        details,
        amount,
        balance,
        currency,
        type,
        createdAt,
        updatedAt,
      ]);

      return result.rows[0] as TransactionDB;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  // eslint-disable-next-line
  async getTransactions(queryParams) {
    try {
      // TODO: transform queryParams from an object to an ordered array
      const paramsTransformed = [];

      const result = await this.client.query(QUERIES.transactions.SELECT_ALL, paramsTransformed);

      return result.rows as Array<TransactionDB>;
    } catch (error) {
      console.error('InternalServerError::executing getTransactions query failed...', error);
      throw error;
    }
  }

  // eslint-disable-next-line
  async getTransactionById(transactionId) {
    try {
      const result = await this.client.query(QUERIES.transactions.SELECT_BY_ID, transactionId);

      return result.rows as TransactionDB;
    } catch (error) {
      console.error('InternalServerError::executing getTransactions query failed...', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log('Disconnected from PostgreSQL');
    } catch (error) {
      console.error('Error disconnecting from PostgreSQL:', error);
    }
  }

  // Should not exist! This is for testing purposes only!
  async query(sql, params = undefined) {
    try {
      const result = await this.client.query(sql, params);

      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}

export { TransactionRepository };
