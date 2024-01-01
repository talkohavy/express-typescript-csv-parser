import { parse as parseCsvFile } from 'csv-parse';
import formidable from 'formidable';
import type { ITransactionRepository, TransactionDB } from '@root-client/postgres';
import { MyStream } from '../utils/MyStream.js';
import { validateSchema } from '../utils/validateSchema.js';
import { getTransactionByIdSchema, transactionSchema } from './helpers/schemaValidators.js';
import { transformTransaction } from './helpers/transformTransaction.js';
import { validateFileType } from './helpers/validateFileType.js';
import type { ITransactionService, ParseCsvResponse } from '../../@types/index.js';
import type { Request } from 'express';

class TransactionService implements ITransactionService {
  repository: ITransactionRepository = null;

  constructor({ usersRepository }) {
    this.repository = usersRepository;
  }

  async postNewTransaction(req: Partial<Request>) {
    const { body } = req;

    const createdAt = new Date().toUTCString();
    const updatedAt = createdAt;
    const updatedTransactionParams = { ...body, createdAt, updatedAt };

    const result = await this.repository.postNewTransaction(updatedTransactionParams);

    return result;
  }

  async getTransactions(req: Request) {
    const { query: queryParams } = req ?? {};

    const data = await this.repository.getTransactions(queryParams);

    return data;
  }

  async getTransactionById(req: Request) {
    const values = validateSchema({ schema: getTransactionByIdSchema, payload: req.params });

    const { id: transactionId } = values;

    const data = await this.repository.getTransactionById(transactionId);

    return data as TransactionDB;
  }

  async parseCsvTransactionsFile(req: Request) {
    try {
      const parseCsvTask = new Promise((resolve) => {
        const failedTransactions = [];
        let totalCount = 0;

        const csvFileParser = parseCsvFile({ from: 2, cast: true }); // <--- {from: 2} means to skip first line of Table Headers
        const csvRecordUploader = new MyStream({
          onData: async (chunk) => {
            try {
              const chunkAsObject = transformTransaction(chunk);

              const body = validateSchema({ schema: transactionSchema, payload: chunkAsObject });

              const data = await this.postNewTransaction({ body });

              console.log('transaction was successfully added to DB:', data);
            } catch (error) {
              console.warn(error);
              failedTransactions.push({ rowParams: chunk, reason: error.message });
            } finally {
              totalCount++;
            }
          },
          onEnd: () =>
            resolve({
              totalCount,
              successCount: totalCount - failedTransactions.length,
              failCount: failedTransactions.length,
              failedTransactions,
            }),
        });

        csvFileParser.pipe(csvRecordUploader);

        formidable({
          maxFiles: 1,
          allowEmptyFiles: false,
          maxFileSize: 8388608, // file size limit of 8MB. The result of: 8 * 1024 * 1024.
          keepExtensions: true,
          fileWriteStreamHandler: (file) => {
            const fileType = file.mimetype.split('/').pop();
            validateFileType({ fileType, validFileTypes: ['csv'] });

            return csvFileParser;
          },
        }).parse(req);
      });

      const result = (await parseCsvTask) as ParseCsvResponse;

      return result;
    } finally {
      await this.repository?.disconnect();
    }
  }
}

export { TransactionService };
