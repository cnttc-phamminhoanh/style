import { SortDirection } from "common/types";
import * as Joi from "joi";
import { Services, ServicesSortBy, ServiceStatus } from "./services.type";

export const createServiceDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: {
    flexibility: Joi.number().min(0).max(100).required(),
    services: Joi.array()
    .items({
      serviceName: Joi.string().valid(...Object.values(Services)).required(),
      price: Joi.number().min(0).required(),
      status: Joi.string().valid(...Object.values(ServiceStatus)).required(),
    }).min(1).unique('serviceName').required(),
  },
}).unknown(true);

export const getOneServiceDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  pathParameters: {
    serviceId: Joi.string().uuid().required(),
  }
}).unknown(true);

export const getManyServicesDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  queryStringParameters: {
    serviceId: Joi.string().uuid().optional(),
    stylistId: Joi.string().uuid().optional(),
    serviceName: Joi.string().valid(...Object.values(Services)).optional(),
    price: Joi.number().min(0).optional(),
    status: Joi.string().valid(...Object.values(ServiceStatus)).optional(),
    sortBy: Joi.string().valid(...Object.values(ServicesSortBy)).optional(),
    sortDirection: Joi.string().valid(...Object.values(SortDirection)).optional(),
    limit: Joi.number().integer().min(1).optional(),
    offset: Joi.number().integer().min(1).optional(),
  }
}).unknown(true);

export const updateOneServiceDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    serviceId: Joi.string().uuid().required(),
  },
  body: {
    price: Joi.number().min(0).optional(),
    status: Joi.string().valid(...Object.values(ServiceStatus)).optional(),
  },
}).unknown(true);

export const deleteServiceDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    serviceId: Joi.string().uuid().required(),
  }
}).unknown(true);