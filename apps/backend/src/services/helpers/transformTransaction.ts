function transformTransaction(transactionArr: Array<string>): {
  referenceNumber: string;
  accountMask: string;
  postedDate: string;
  description: string;
  details: string;
  amount: string;
  balance: string;
  currency: string;
  type: string;
} {
  const [accountMask, postedDate, description, details, amount, balance, referenceNumber, currency, type] =
    transactionArr;

  return {
    referenceNumber,
    accountMask,
    postedDate,
    description,
    details,
    amount,
    balance,
    currency,
    type,
  };
}

export { transformTransaction };
