import joi from 'joi';

const getTransactionByIdSchema = joi.object({
  id: joi.number().integer().min(0).required(),
});

const transactionSchema = joi.object({
  accountMask: joi.number().integer().min(0).max(9999).required(),
  postedDate: joi.date().required(),
  description: joi.string().allow('').optional(),
  details: joi.string().allow('').optional(),
  amount: joi.number().required(),
  balance: joi.number().required(),
  referenceNumber: joi.number().integer().min(0).required(),
  currency: joi.string().required(),
  type: joi.string().required(),
});

export { getTransactionByIdSchema, transactionSchema };
