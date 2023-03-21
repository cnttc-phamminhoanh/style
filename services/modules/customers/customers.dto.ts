import { ConnectAccountCountry } from "constant/constant";
import Joi from "joi";

export const customerSingUpDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  body: Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().optional(),
    avatar: Joi.string().trim().optional(),
    location: Joi.object({
      address: Joi.string().trim().required(),
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).optional(),
    maximumDistance: Joi.number().min(0).required(), // Km
    hairType: Joi.string().trim().required(),
    preferredStyle: Joi.string().trim().required(),
    paymentMethod: Joi.object({
      cardNumber: Joi.string().required(),
      cardExpMonth: Joi.number().integer().min(1).max(12).required(),
      cardExpYear: Joi.number().integer().min(2022).required(),
      cardCVC: Joi.number().integer().min(100).max(9999).required(),
      zipCode: Joi.string().optional(),
      cardName: Joi.string().optional(),
      country: Joi.string().valid(...Object.values(ConnectAccountCountry)).optional()
    }).required()
  }).custom((value) => {
    const nowDay = new Date()
    const shelfLife = 50 // years
    const dateExp = new Date(value.paymentMethod.cardExpYear, value.paymentMethod.cardExpMonth - 1, 0)

    if (value.paymentMethod.cardExpMonth && value.paymentMethod.cardExpYear && dateExp.getTime() < nowDay.getTime()) {
      throw new Error(`cardExpMonth/cardExpYear must be more than ${nowDay.getMonth()}/${nowDay.getFullYear()}`)
    }
    if (value.paymentMethod.cardExpYear > (nowDay.getFullYear() + shelfLife)) {
      throw new Error(`cardExpYear must be less than or equal to ${nowDay.getFullYear() + shelfLife}`)
    }

    return value
  }, 'validate cardExpMonth, cardExpYear')
}).unknown(true)