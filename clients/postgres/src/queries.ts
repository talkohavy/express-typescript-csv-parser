const QUERIES = {
  transactions: {
    UPSERT_ONE: `INSERT INTO transactions (
      reference_number,
      account_mask,
      posted_date,
      description,
      details,
      amount,
      balance,
      currency,
      transaction_type,
      created_time,
      updated_time
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (reference_number) DO UPDATE SET
      account_mask = EXCLUDED.account_mask,
      posted_date = EXCLUDED.posted_date,
      description = EXCLUDED.description,
      details = EXCLUDED.details,
      amount = EXCLUDED.amount,
      balance = EXCLUDED.balance,
      currency = EXCLUDED.currency,
      transaction_type = EXCLUDED.transaction_type,
      updated_time = EXCLUDED.updated_time
      RETURNING *
    ;`,
    SELECT_ALL: 'SELECT * FROM transactions',
    SELECT_BY_ID: 'SELECT * FROM transactions WHERE id = $1',
    // ################################################################################################
    // The commands below should NEVER exist in a project like this! This is solely for the assignment.
    // ################################################################################################
    CREATE_TABLE: `CREATE TABLE transactions (
      reference_number VARCHAR(255) PRIMARY KEY,
      account_mask VARCHAR(255),
      posted_date TIMESTAMPTZ,
      description VARCHAR(255),
      details VARCHAR(255),
      amount NUMERIC(10, 2),
      balance NUMERIC(10, 2),
      currency VARCHAR(3),
      transaction_type VARCHAR(255),
      created_time TIMESTAMPTZ,
      updated_time TIMESTAMPTZ
    );`,
    TRUNCATE_TABLE: 'TRUNCATE transactions;',
    DROP_TABLE: 'DROP TABLE transactions;',
  },
};

export { QUERIES };
