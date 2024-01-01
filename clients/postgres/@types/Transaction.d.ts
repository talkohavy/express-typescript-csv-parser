declare type TransactionParams = {
  referenceNumber: number;
  accountMask: number;
  postedDate: Date;
  description: string;
  details: string;
  amount: number;
  balance: number;
  currency: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

declare type TransactionDB = {
  reference_number: number;
  account_mask: number;
  posted_date: Date;
  description: string;
  details: string;
  amount: number;
  balance: number;
  currency: string;
  transaction_type: string;
  created_time: Date;
  updated_time: Date;
};

export type { TransactionDB, TransactionParams };
