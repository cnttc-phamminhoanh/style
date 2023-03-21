import { SortDirection } from "common/types";
import Joi from "joi";
import { CustomerRequestSortBy, CustomerRequestsStatus } from "./customerRequests.type";

export const createCustomerRequestDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  body: Joi.object({
    currentPictures: Joi.array().items(Joi.string()).unique().min(1).required(),
    samplePictures: Joi.array().items(Joi.string()).unique().min(1).required(),
    price: Joi.number().min(0).required(),
    time: Joi.date().greater('now').required(),
  })
}).unknown(true)

export const getCustomerRequestDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  pathParameters: {
    customerRequestId: Joi.string().uuid().required(),
  }
}).unknown(true)

export const getAllCustomerRequestDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  queryStringParameters: Joi.object({
    customerId: Joi.string().uuid().optional(),
    fromDate: Joi.date().optional(),
    toDate: Joi.date().optional(),
    fromPrice: Joi.number().min(0).optional(),
    toPrice: Joi.number().min(0).optional(),
    status: Joi.string().valid(...Object.values(CustomerRequestsStatus)).optional(),
    sortBy: Joi.string().valid(...Object.values(CustomerRequestSortBy)).optional(),
    sortDirection: Joi.string().valid(...Object.values(SortDirection)).optional(),
    limit: Joi.number().integer().min(0).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).custom((value) => {
    if (value.fromDate && value.toDate && value.fromDate.getTime() >= value.toDate.getTime()) {
      throw new Error('toDate must be after fromDate')
    }

    if (value.fromPrice && value.toPrice && value.fromPrice >= value.toPrice) {
      throw new Error('fromPrice must be less than toPrice')
    }

    return value
  }, 'validate queryStringParameters')
}).unknown(true)

export const deleteCustomerRequestDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  pathParameters: {
    customerRequestId: Joi.string().uuid().required(),
  }
}).unknown(true)

export const updateCustomerRequestDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  body: Joi.object({
    currentPictures: Joi.array().items(Joi.string()).unique().min(1).required(),
    samplePictures: Joi.array().items(Joi.string()).unique().min(1).required(),
    status: Joi.string().valid(CustomerRequestsStatus.OPENING, CustomerRequestsStatus.CLOSED).optional(),
    price: Joi.number().min(0).optional(),
    time: Joi.date().greater('now').optional(),
  }),
  pathParameters: {
    customerRequestId: Joi.string().uuid().required()
  }
}).unknown(true)
