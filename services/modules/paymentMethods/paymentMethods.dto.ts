import { SortDirection } from "common/types";
import { ConnectAccountCountry } from "constant/constant";
import Joi from "joi";
import { PaymentMethodsSortBy, PaymentMethodsType } from "./paymentMethods.type";

export const createPaymentMethodDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object({
    cardNumber: Joi.string().required(),
    cardExpMonth: Joi.number().integer().min(1).max(12).required(),
    cardExpYear: Joi.number().integer().min(2022).required(),
    cardCVC: Joi.number().integer().min(100).max(9999).required(),
    cardName: Joi.string().optional(),
    country: Joi.string().valid(...Object.values(ConnectAccountCountry)).optional(),
    zipCode: Joi.string().optional(),
  }).custom((value) => {
    const nowDay = new Date()
    const shelfLife = 50 // years
    const dateExp = new Date(value.cardExpYear, value.cardExpMonth - 1, 0)

    if (value.cardExpMonth && value.cardExpYear && dateExp.getTime() < nowDay.getTime()) {
      throw new Error(`cardExpMonth/cardExpYear must be more than ${nowDay.getMonth()}/${nowDay.getFullYear()}`)
    }

    if (value.cardExpYear > (nowDay.getFullYear() + shelfLife)) {
      throw new Error(`cardExpYear must be less than or equal to ${nowDay.getFullYear() + shelfLife}`)
    }

    return value
  }, 'validate cardExpMonth, cardExpYear')
}).unknown(true);

export const getOnePaymentMethodDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    paymentMethodId: Joi.string().uuid().required(),
  }
}).unknown(true);

export const getManyPaymentMethodsDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  queryStringParameters: {
    customerId: Joi.string().uuid().optional(),
    type: Joi.string().valid(...Object.values(PaymentMethodsType)).optional(),
    sortBy: Joi.string().valid(...Object.values(PaymentMethodsSortBy)).optional(),
    sortDirection: Joi.string().valid(...Object.values(SortDirection)).optional(),
    limit: Joi.number().integer().min(1).optional(),
    offset: Joi.number().integer().min(1).optional(),
  }
}).unknown(true);