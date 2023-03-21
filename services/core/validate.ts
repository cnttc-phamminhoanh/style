import * as Joi from 'joi'

export function validate(data, schema: Joi.Schema) {
  const validationResult = schema.validate(data, { abortEarly: false })

  if (validationResult.error) {
    throw {
      code: 400,
      name: 'ValidationError',
      message: validationResult.error,
    }
  }

  return validationResult.value
}