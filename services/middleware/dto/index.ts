import * as Joi from "joi"


export const validateDto = (schema: Joi.ObjectSchema, data: any) => {
  if (schema) {
    schema.unknown(true)
  }

  const validationResult = schema.validate(data, { abortEarly: false })
  if (validationResult.error) {

    throw {
      status: 400,
      name: 'Validation error',
      message:  validationResult.error,
    }
  }

 return validationResult.value
}