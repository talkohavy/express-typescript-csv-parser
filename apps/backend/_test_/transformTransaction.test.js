import assert from 'assert/strict';
import { describe, it } from 'node:test';
import { transformTransaction } from '../dist/services/helpers/transformTransaction.js';

describe('transformTransaction', () => {
  it('should transform array data to an object data', () => {
    const transactionArr = ['9823', '2022-12-30', 'trn0', 'Salary', '400', '2400', '1334890', 'ILS', 'income'];

    const actual = transformTransaction(transactionArr);

    const expected = {
      accountMask: transactionArr[0],
      postedDate: transactionArr[1],
      description: transactionArr[2],
      details: transactionArr[3],
      amount: transactionArr[4],
      balance: transactionArr[5],
      referenceNumber: transactionArr[6],
      currency: transactionArr[7],
      type: transactionArr[8],
    };

    assert.deepStrictEqual(actual, expected);
  });
});
