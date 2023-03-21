import { OrderBy } from 'common/types'
import * as Joi from 'joi'

const usersPricingSortBy = [
  'userId',
  'flexibility',
  'hairCut',
  'trim',
  'extensions',
  'keratine',
  'color',
  'perm',
  'curling',
  'highlights',
  'scalpMessage',
  'conditioning',
  'createdAt',
  'updatedAt',
]

const usersPricingOrderBy = [
  OrderBy.ASC,
  OrderBy.DESC,
]

export const createUsersPricingDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  body: {
    hairCut: Joi.boolean().optional(),
    trim: Joi.boolean().optional(),
    color: Joi.boolean().optional(),
    perm: Joi.boolean().optional(),
    curling: Joi.boolean().optional(),
    flexibility: Joi.number().min(0).optional(),
    extensions: Joi.boolean().optional(),
    keratine: Joi.boolean().optional(),
    highlights: Joi.boolean().optional(),
    conditioning: Joi.boolean().optional(),
    scalpMessage: Joi.boolean().optional(),
  }
}).unknown(true)

export const updateUsersPricingDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  body: {
    hairCut: Joi.boolean().optional(),
    trim: Joi.boolean().optional(),
    color: Joi.boolean().optional(),
    perm: Joi.boolean().optional(),
    curling: Joi.boolean().optional(),
    flexibility: Joi.number().min(0).optional(),
    extensions: Joi.boolean().optional(),
    keratine: Joi.boolean().optional(),
    highlights: Joi.boolean().optional(),
    conditioning: Joi.boolean().optional(),
    scalpMessage: Joi.boolean().optional(),
  }
}).unknown(true)

export const getOneUserPricingDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  pathParameters: {
    userId: Joi.string().required(),
  }
}).unknown(true)

export const getAllUserPricingDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  queryStringParameters: {
    hairCut: Joi.boolean().optional(),
    trim: Joi.boolean().optional(),
    color: Joi.boolean().optional(),
    perm: Joi.boolean().optional(),
    curling: Joi.boolean().optional(),
    extensions: Joi.boolean().optional(),
    keratine: Joi.boolean().optional(),
    highlights: Joi.boolean().optional(),
    conditioning: Joi.boolean().optional(),
    scalpMessage: Joi.boolean().optional(),
    flexibility: Joi.number().min(0).optional(),
    sortBy: Joi.string().valid(...usersPricingSortBy).optional(),
    orderBy: Joi.string().valid(...usersPricingOrderBy).optional(),
    limit: Joi.number().integer().min(1).optional(),
    offset: Joi.number().integer().min(1).optional(),
  }
}).unknown(true)