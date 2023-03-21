import * as Joi from "joi";

export const s3Dto = Joi.object({
  body: Joi.object({
    fileName: Joi.string().required(),
    fileExtension: Joi.string().required(),
  }),
}).unknown(true);
