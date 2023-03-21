import { UserType } from 'common/types'
import * as Joi from 'joi'
import { Gender } from './users.type'

export const loginDto = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().required()
  })
}).unknown(true)

export const verifyOTPDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  body: {
    code: Joi.string().required()
  }
}).unknown(true)

export const singUpDto = Joi.object({
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().optional(),
    bio: Joi.string().optional(),
    gender: Joi.string().valid(...[Gender.MALE, Gender.FEMALE, Gender.OTHER]).required(),
    avatar: Joi.string().optional(),
    location: Joi.object({
      address: Joi.string().required(),
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).optional(),
    userType: Joi.string().valid(UserType.STYLIST, UserType.CUSTOMER).optional()
  })
}).unknown(true)

export const updateProfileDto = Joi.object({
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().optional(),
    bio: Joi.string().optional(),
    gender: Joi.string().valid(...[Gender.MALE, Gender.FEMALE, Gender.OTHER]).required(),
    avatar: Joi.string().optional(),
    location: Joi.object({
      address: Joi.string().required(),
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).optional()
  })
}).unknown(true)

export const updatePhoneNumberDto = Joi.object({
  body: Joi.object({
    newPhoneNumber: Joi.string().required()
  })
}).unknown(true)

// StyleNow v2

export const loginWithPhoneNumberDto = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).required()
  })
}).unknown(true)

export const verifyOTPV2Dto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  body: {
    code: Joi.string().required()
  }
}).unknown(true)

export const loginWithFirebaseDto = Joi.object({
  body: Joi.object({
    idToken: Joi.string().required()
  })
}).unknown(true)

export const updateEmailDto = Joi.object({
  body: Joi.object({
    newEmail: Joi.string().email().required()
  })
}).unknown(true)