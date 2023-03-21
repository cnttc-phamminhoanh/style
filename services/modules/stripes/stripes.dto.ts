import Joi from "joi";

export const getAccountLinkDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: {
    refreshUrl: Joi.string().uri().required(),
    returnUrl: Joi.string().uri().required(),
  },
}).unknown(true);