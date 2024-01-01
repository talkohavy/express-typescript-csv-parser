declare type ParseCsvResponse = {
  totalCount: number;
  successCount: number;
  failCount: number;
  failedTransactions: Array<{
    reason: string;
    rowParams: Array<string>;
  }>;
};

export type { ParseCsvResponse };
