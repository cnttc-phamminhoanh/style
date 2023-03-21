import Joi from "joi";
import { ZeroDecimalCurrencies, Currency } from "./paymentIntent.type";

export const createPaymentIntentDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object({
    amount: Joi.number().precision(2).min(0).optional(),
    tip: Joi.number().precision(2).min(0).optional(),
    currency: Joi.string().valid(
      ...Object.values(Currency),
      ...Object.values(ZeroDecimalCurrencies),
    ).required(),
    appointmentId: Joi.string().optional(),
    discount: Joi.number().precision(2).min(0).optional(),
    description: Joi.string().optional(),
    sender: Joi.string().uuid().optional(),
    receiver: Joi.string().uuid().optional(),
    paymentMethodId: Joi.string().uuid().required(),
  }).custom((value) => {
    if ((!value.amount || !value.sender || !value.receiver) && !value.appointmentId) {
      throw new Error('amount, sender and receiver properties are required if appointmentId is not provided')
    }

    if (value.discount && value.amount && value.discount > value.amount) {
      throw new Error('invalid discount')
    }

    return value
  })
}).unknown(true);
