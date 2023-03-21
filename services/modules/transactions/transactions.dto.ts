import { SortDirection } from "common/types";
import Joi from "joi";
import {
  TransactionsSortBy,
  TransactionsStatus,
  TransactionsType,
} from "./transactions.type";

export const getOneTransactionDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    transactionId: Joi.string().uuid().required(),
  },
}).unknown(true);

export const getManyTransactionsDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  queryStringParameters: Joi.object({
    paymentId: Joi.string().uuid().optional(),
    fromGrossAmount: Joi.number().min(0).optional(),
    toGrossAmount: Joi.number().min(0).optional(),
    fromNetAmount: Joi.number().min(0).optional(),
    toNetAmount: Joi.number().min(0).optional(),
    type: Joi.string()
      .valid(...Object.values(TransactionsType))
      .optional(),
    status: Joi.string()
      .valid(...Object.values(TransactionsStatus))
      .optional(),
    sender: Joi.string().uuid().optional(),
    receiver: Joi.string().uuid().optional(),
    createdBy: Joi.string().uuid().optional(),

    sortBy: Joi.string()
      .valid(...Object.values(TransactionsSortBy))
      .optional(),
    sortDirection: Joi.string()
      .valid(...Object.values(SortDirection))
      .optional(),
    limit: Joi.number().integer().min(1).optional(),
    offset: Joi.number().integer().min(1).optional(),
  }).custom((value) => {
    if (
      value.fromGrossAmount &&
      value.toGrossAmount &&
      value.fromGrossAmount >= value.toGrossAmount
    ) {
      throw new Error("fromGrossAmount must be less than toGrossAmount");
    }

    if (
      value.fromNetAmount &&
      value.toNetAmount &&
      value.fromNetAmount >= value.toNetAmount
    ) {
      throw new Error("fromNetAmount must be less than toNetAmount");
    }

    return value;
  }, "validate queryStringParameters"),
}).unknown(true);
