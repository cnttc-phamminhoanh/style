import { SortDirection } from "common/types";
import Joi from "joi";
import { PaymentsSortBy, PaymentStatus } from "./payments.type";

export const getOnePaymentDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    paymentId: Joi.string().uuid().required(),
  },
}).unknown(true);

export const getManyPaymentsDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  queryStringParameters: Joi.object({
    appointmentId: Joi.string().uuid().optional(),
    fromGrossAmount: Joi.number().min(0).optional(),
    toGrossAmount: Joi.number().min(0).optional(),
    fromNetAmount: Joi.number().min(0).optional(),
    toNetAmount: Joi.number().min(0).optional(),
    status: Joi.string().valid(...Object.values(PaymentStatus)).optional(),
    sender: Joi.string().uuid().optional(),
    receiver: Joi.string().uuid().optional(),

    sortBy: Joi.string().valid(...Object.values(PaymentsSortBy)).optional(),
    sortDirection: Joi.string().valid(...Object.values(SortDirection)).optional(),
    limit: Joi.number().integer().min(1).optional(),
    offset: Joi.number().integer().min(1).optional(),
  }).custom((value) => {
    if ( value.fromGrossAmount && value.toGrossAmount && value.fromGrossAmount >= value.toGrossAmount ) {
      throw new Error("fromGrossAmount must be less than toGrossAmount");
    }

    if ( value.fromNetAmount && value.toNetAmount && value.fromNetAmount >= value.toNetAmount ) {
      throw new Error("fromNetAmount must be less than toNetAmount");
    }

    return value;
  }, "validate queryStringParameters"),
}).unknown(true);